import { DEFAULT_LOCAL_CACHE_TTL_MS } from '.'
interface CacheItem<T> {
  value: T
  expiresAt: number
}

export interface CacheMetrics {
  hits: number
  misses: number
  expirations: number
  size: number
}

export class LocalCache {
  private cache = new Map<string, CacheItem<any>>()
  private metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    expirations: 0,
    size: 0
  }

  set<T>(key: string, value: T, ttlMs?: number): void {
    const expiresAt = Date.now() + (ttlMs || DEFAULT_LOCAL_CACHE_TTL_MS)
    const isUpdate = this.cache.has(key)
    this.cache.set(key, { value, expiresAt })

    /// Update size metric (only increment if it's a new key)
    if (!isUpdate) {
      this.metrics.size = this.cache.size
    }
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) {
      this.metrics.misses++
      return null
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key)
      this.metrics.expirations++
      this.metrics.size = this.cache.size
      this.metrics.misses++
      return null
    }

    this.metrics.hits++
    return item.value
  }

  delete(key: string): void {
    if (this.cache.delete(key)) {
      this.metrics.size = this.cache.size
    }
  }

  clear(): void {
    this.cache.clear()
    this.metrics.size = 0
    /// Optionally reset all metrics on clear:
    this.resetMetrics()
  }

  cleanup(): void {
    const now = Date.now()
    let expiredCount = 0

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key)
        expiredCount++
      }
    }

    if (expiredCount > 0) {
      this.metrics.expirations += expiredCount
      this.metrics.size = this.cache.size
    }
  }

  getMetrics(): CacheMetrics {
    return {
      ...this.metrics,
      size: this.cache.size
    }
  }

  resetMetrics(): void {
    this.metrics = {
      hits: 0,
      misses: 0,
      expirations: 0,
      size: this.cache.size
    }
  }

  /// Additional useful metrics
  getHitRate(): number {
    const total = this.metrics.hits + this.metrics.misses
    return total > 0 ? this.metrics.hits / total : 0
  }
}
