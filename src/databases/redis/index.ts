import Redis from 'ioredis'
import { CacheManager } from './cacheManager'
import Bull from 'bull'

export const DEFAULT_REDIS_TTL_SEC = 3600
export const DEFAULT_LOCAL_CACHE_TTL_MS = 240_000

const REDIS_HOST = `${Bun.env.REDIS_HOST}` || '127.0.0.1'
const REDIS_PORT = Number(Bun.env.REDIS_PORT) || 6379
const REDIS_DB = Number(Bun.env.REDIS_DB) || 0
const REDIS_PASSWORD = Bun.env.REDIS_PASSWORD || undefined



export const redis = new Redis({
    /// TO-DO
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
    db: REDIS_DB,
    lazyConnect: true,
})

export const redisWithLocalCacheSupport = new CacheManager(redis)


export const emailQueueWithRedis = new Bull('emailQueue', {
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
    db: REDIS_DB,
  },
    settings: {
    /// Better connection settings
    lockDuration: 30000,
    stalledInterval: 30000,
  }
});




