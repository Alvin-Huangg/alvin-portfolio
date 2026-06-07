export interface RssItem {
  readonly title: string
  readonly url: string
  readonly publishedAt: string | null
  readonly source: string
}

const HTML_ENTITIES: Readonly<Record<string, string>> = {
  '&amp;':  '&',
  '&lt;':   '<',
  '&gt;':   '>',
  '&quot;': '"',
  '&#39;':  "'",
  '&apos;': "'",
}

const ENTITY_RE = /&(?:amp|lt|gt|quot|#39|apos);/g

function decodeEntities(s: string): string {
  return s.replace(ENTITY_RE, m => HTML_ENTITIES[m] ?? m)
}

/**
 * Extracts the text content of the first matching tag in `block`.
 * Handles both CDATA-wrapped and plain-text tag values.
 * Compiled RegExps are kept outside the call site to avoid per-call
 * recompilation — callers pass pre-compiled patterns.
 */
function extractTag(cdataRe: RegExp, plainRe: RegExp, block: string): string {
  const c = cdataRe.exec(block)
  if (c) return decodeEntities(c[1].trim())
  const p = plainRe.exec(block)
  return p ? decodeEntities(p[1].trim()) : ''
}

// Pre-compiled patterns for the tags we care about.
const TITLE_CDATA = /<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/
const TITLE_PLAIN = /<title>([\s\S]*?)<\/title>/
const LINK_RE     = /<link>([\s\S]*?)<\/link>/
const PUBDATE_RE  = /<pubDate>([\s\S]*?)<\/pubDate>/
const SOURCE_RE   = /<source[^>]*>([\s\S]*?)<\/source>/
const ITEM_RE     = /<item>([\s\S]*?)<\/item>/g

/**
 * Single-pass RSS 2.0 parser — O(n) in the XML length.
 * Stops early once `maxItems` are collected to avoid scanning the entire feed
 * when only a handful of items are needed.
 *
 * @param xml      - Raw XML string from an RSS endpoint.
 * @param maxItems - Upper bound on returned items (default 10).
 * @param fallbackSource - Source label when `<source>` tag is absent.
 */
export function parseRss(
  xml: string,
  maxItems = 10,
  fallbackSource = 'Yahoo Finance',
): RssItem[] {
  const items: RssItem[] = []
  // Reset lastIndex because the pattern is module-level (stateful).
  ITEM_RE.lastIndex = 0

  let match: RegExpExecArray | null
  while (items.length < maxItems && (match = ITEM_RE.exec(xml)) !== null) {
    const block = match[1]
    const title = extractTag(TITLE_CDATA, TITLE_PLAIN, block)
    const link  = LINK_RE.exec(block)
    if (!title || !link) continue

    const pubDate = PUBDATE_RE.exec(block)
    const source  = SOURCE_RE.exec(block)

    items.push({
      title,
      url:         link[1].trim(),
      publishedAt: pubDate ? pubDate[1].trim() : null,
      source:      source  ? decodeEntities(source[1].trim()) : fallbackSource,
    })
  }

  return items
}
