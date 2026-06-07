interface Window {
  count: number
  resetAt: number
}

/** Module-level store survives across requests in the same Node process. */
const store = new Map<string, Window>()

/**
 * Fixed-window rate limiter.
 *
 * Returns `true` if the request is allowed, `false` if the caller should
 * respond with 429.  Automatically evicts expired windows to bound memory.
 *
 * @param key      - Partition key (e.g. IP + route).
 * @param limit    - Maximum requests allowed per window.
 * @param windowMs - Window duration in milliseconds.
 */
export function allow(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) return false
  entry.count++
  return true
}

/**
 * Remove all expired entries.  Call from a long-running route that handles
 * high traffic to prevent unbounded Map growth.
 */
export function evictExpired(): void {
  const now = Date.now()
  for (const [k, v] of store) {
    if (now >= v.resetAt) store.delete(k)
  }
}
