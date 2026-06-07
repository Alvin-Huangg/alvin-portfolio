import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { allow, evictExpired } from './rate-limit'

describe('allow (fixed-window rate limiter)', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('permits requests up to the limit', () => {
    const key = `k-${Math.random()}`
    expect(allow(key, 3, 1000)).toBe(true)
    expect(allow(key, 3, 1000)).toBe(true)
    expect(allow(key, 3, 1000)).toBe(true)
  })

  it('blocks the request that exceeds the limit', () => {
    const key = `k-${Math.random()}`
    allow(key, 2, 1000)
    allow(key, 2, 1000)
    expect(allow(key, 2, 1000)).toBe(false)
  })

  it('resets after the window elapses', () => {
    const key = `k-${Math.random()}`
    allow(key, 1, 1000)
    expect(allow(key, 1, 1000)).toBe(false)
    vi.advanceTimersByTime(1001)
    expect(allow(key, 1, 1000)).toBe(true)
  })

  it('isolates distinct keys', () => {
    const a = `a-${Math.random()}`
    const b = `b-${Math.random()}`
    allow(a, 1, 1000)
    expect(allow(a, 1, 1000)).toBe(false)
    expect(allow(b, 1, 1000)).toBe(true) // b unaffected by a
  })

  it('evicts expired windows', () => {
    const key = `eviction-probe-${Math.random()}`
    allow(key, 5, 1000)
    vi.advanceTimersByTime(1001)
    expect(() => evictExpired()).not.toThrow()
    // After eviction the key starts fresh.
    expect(allow(key, 1, 1000)).toBe(true)
    expect(allow(key, 1, 1000)).toBe(false)
  })
})
