import { safeFetch } from './safe-fetch'
import { parseRss, type RssItem } from './rss'

/**
 * Shared Yahoo Finance top-stories feed loader with a process-level TTL cache.
 *
 * Both `/api/briefing/news` and `/api/finance-news` consume the same upstream
 * feed; sharing this module means a single upstream fetch serves both routes
 * and the parsing/caching logic exists in exactly one place (DRY).
 *
 * CACHE CAVEAT: the cache is module-scoped, so it is per-process. In a
 * multi-instance serverless deployment each cold instance maintains its own
 * cache — acceptable here because the TTL is short and the upstream is cheap.
 */

const FEED_URL = 'https://finance.yahoo.com/rss/topstories'
const CACHE_TTL_MS = 5 * 60 * 1_000

interface CacheEntry { items: RssItem[]; fetchedAt: number }
let cache: CacheEntry | null = null

/** In-flight request dedupe: collapse concurrent misses into one fetch. */
let inFlight: Promise<RssItem[]> | null = null

async function fetchAndParse(): Promise<RssItem[]> {
  const res = await safeFetch(FEED_URL, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; portfolio-briefing/1.0)' },
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Feed responded ${res.status}`)
  const xml = await res.text()
  // Parse the maximum any caller needs once; callers slice to their own limit.
  return parseRss(xml, 10)
}

/**
 * Return up to `limit` cached feed items, refreshing the cache when stale.
 * Concurrent callers during a cache miss await a single shared fetch.
 */
export async function getTopStories(limit: number): Promise<RssItem[]> {
  const now = Date.now()

  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.items.slice(0, limit)
  }

  // Dedupe concurrent refreshes.
  if (!inFlight) {
    inFlight = fetchAndParse()
      .then(items => {
        cache = { items, fetchedAt: Date.now() }
        return items
      })
      .finally(() => { inFlight = null })
  }

  const items = await inFlight
  return items.slice(0, limit)
}
