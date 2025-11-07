import { DEFAULT_REDIS_TTL_SEC, DEFAULT_LOCAL_CACHE_TTL_MS, redis } from '.'
import { LocalCache,CacheMetrics } from './localCache'
import Redis from 'ioredis'

interface CacheStats {
    redis: boolean
    local: CacheMetrics
}

export class CacheManager {
    private localCache = new LocalCache()
    private redisConnected = false
    private cleanupInterval!: ReturnType<typeof setInterval>
    private shutdown = false

    constructor(private redis: Redis) {
        this.setupRedisListeners()
        this.startCleanupJob()
    }

    private setupRedisListeners(): void {
        this.redis.on('connect', () => {
            if (this.shutdown) return
            console.log('Redis connected')
            this.redisConnected = true
        })

        this.redis.on('error', (error: Error) => {
            if (this.shutdown) return
            console.warn('Redis error, falling back to local cache:', error.message)
            this.redisConnected = false
        })

        this.redis.on('close', () => {
            if (this.shutdown) return
            console.warn('Redis connection closed, using local cache')
            this.redisConnected = false
        })

        this.redis.on('reconnecting', () => {
            if (this.shutdown) return
            console.log('Redis reconnecting...')
            this.redisConnected = false
        })
    }

    private startCleanupJob(): void {
        this.cleanupInterval = setInterval(() => {
            if (!this.shutdown) {
                this.localCache.cleanup()
            }
        }, 300_000).unref?.()
    }

    async get<T>(key: string): Promise<T | null> {
        if (this.shutdown) return this.localCache.get<T>(key)

        if (this.redisConnected) {
            try {
                const redisValue = await this.redis.get(key)
                if (redisValue !== null) {
                    try {
                        const parsed = JSON.parse(redisValue) as T
                        this.localCache.set(key, parsed, DEFAULT_LOCAL_CACHE_TTL_MS)
                        return parsed
                    } catch (parseError) {
                        console.warn(`Failed to parse Redis value for key ${key}:`, parseError)
                        await this.redis.del(key).catch(() => { })
                    }
                }
            } catch (error) {
                console.warn(`Redis get failed for key ${key}:`, (error as Error).message)
                this.redisConnected = false
            }
        }

        return this.localCache.get<T>(key)
    }

    async set(key: string, value: any, ttlSeconds = DEFAULT_REDIS_TTL_SEC): Promise<void> {
        const ttlMs = ttlSeconds * 1000
        this.localCache.set(key, value, ttlMs)

        if (this.shutdown || !this.redisConnected) return

        try {
            await this.redis.set(key, JSON.stringify(value), "EX", ttlSeconds)
        } catch (error) {
            console.warn(`Redis set failed for key ${key}:`, (error as Error).message)
            this.redisConnected = false
        }
    }

    async delete(key: string): Promise<void> {
        this.localCache.delete(key)

        if (this.shutdown || !this.redisConnected) return

        try {
            await this.redis.del(key)
        } catch (error) {
            console.warn(`Redis delete failed for key ${key}:`, (error as Error).message)
            this.redisConnected = false
        }
    }

    async clear(): Promise<void> {
        this.localCache.clear()

        if (this.shutdown || !this.redisConnected) return

        try {
            await this.redis.flushdb()
        } catch (error) {
            console.warn('Redis clear failed:', (error as Error).message)
            this.redisConnected = false
        }
    }

    isRedisConnected(): boolean {
        return !this.shutdown && this.redisConnected
    }

    getStats(): CacheStats {
        return {
            redis: this.isRedisConnected(),
            local: this.localCache.getMetrics()
        }
    }

    async destroy(): Promise<void> {
        this.shutdown = true
        clearInterval(this.cleanupInterval)
        this.localCache.clear()

        try {
            await this.redis.quit()
        } catch (error) {
            console.warn('Error while quitting Redis:', (error as Error).message)
        }
    }
}
