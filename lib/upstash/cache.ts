import { getRedis } from "@/lib/upstash/redis"

/**
 * Get a cached value from Upstash. Returns null on miss or if Redis is not configured.
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = getRedis()
  if (!redis) return null
  try {
    return await redis.get<T>(key)
  } catch {
    return null
  }
}

/**
 * Set a cached value in Upstash with a TTL in seconds.
 * Silently fails if Redis is not configured.
 */
export async function cacheSet(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  const redis = getRedis()
  if (!redis) return
  try {
    await redis.set(key, value, { ex: ttlSeconds })
  } catch {
    // ignore cache write errors
  }
}

/**
 * Delete one or more cache keys. Supports glob patterns via scan+del.
 */
export async function cacheDel(...keys: string[]): Promise<void> {
  const redis = getRedis()
  if (!redis) return
  try {
    await redis.del(...keys)
  } catch {
    // ignore cache delete errors
  }
}

/**
 * Delete all keys matching a glob pattern (e.g. "store:my-store:*").
 * Collects all matching keys first, then deletes in a single batch.
 */
export async function cacheDelPattern(pattern: string): Promise<void> {
  const redis = getRedis()
  if (!redis) return
  try {
    const allKeys: string[] = []
    let cursor = 0
    do {
      const result = await redis.scan(cursor, { match: pattern, count: 100 })
      cursor = Number(result[0])
      const keys = result[1] as string[]
      if (keys.length > 0) allKeys.push(...keys)
    } while (cursor !== 0)
    if (allKeys.length > 0) {
      await redis.del(...allKeys)
    }
  } catch {
    // ignore pattern delete errors
  }
}
