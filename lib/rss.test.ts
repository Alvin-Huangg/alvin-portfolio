import { describe, it, expect } from 'vitest'
import { parseRss } from './rss'

const ITEM = (title: string, link = 'https://example.com/a', extra = '') => `
  <item>
    <title>${title}</title>
    <link>${link}</link>
    ${extra}
  </item>`

const feed = (items: string) => `<?xml version="1.0"?><rss><channel>${items}</channel></rss>`

describe('parseRss', () => {
  it('parses a basic item', () => {
    const out = parseRss(feed(ITEM('Hello World')))
    expect(out).toHaveLength(1)
    expect(out[0]).toMatchObject({ title: 'Hello World', url: 'https://example.com/a' })
  })

  it('decodes HTML entities in titles', () => {
    const out = parseRss(feed(ITEM('Tom &amp; Jerry &lt;3 &quot;hi&quot;')))
    expect(out[0].title).toBe('Tom & Jerry <3 "hi"')
  })

  it('extracts CDATA-wrapped titles', () => {
    const xml = feed(`<item><title><![CDATA[Breaking & Entering]]></title><link>https://x.com</link></item>`)
    expect(parseRss(xml)[0].title).toBe('Breaking & Entering')
  })

  it('captures pubDate and source when present', () => {
    const out = parseRss(feed(ITEM('T', 'https://x.com',
      '<pubDate>Wed, 04 Jun 2025 22:00:00 GMT</pubDate><source url="https://r.com">Reuters</source>')))
    expect(out[0].publishedAt).toBe('Wed, 04 Jun 2025 22:00:00 GMT')
    expect(out[0].source).toBe('Reuters')
  })

  it('falls back to the default source label', () => {
    expect(parseRss(feed(ITEM('T')), 10, 'Yahoo Finance')[0].source).toBe('Yahoo Finance')
  })

  it('respects the maxItems bound and stops early', () => {
    const many = Array.from({ length: 50 }, (_, i) => ITEM(`t${i}`)).join('')
    expect(parseRss(feed(many), 5)).toHaveLength(5)
  })

  it('skips items missing a title or link', () => {
    const xml = feed(`<item><link>https://x.com</link></item>` + ITEM('Valid'))
    const out = parseRss(xml)
    expect(out).toHaveLength(1)
    expect(out[0].title).toBe('Valid')
  })

  it('returns an empty array for a feed with no items', () => {
    expect(parseRss(feed(''))).toEqual([])
  })

  it('is not corrupted by the stateful global regex across calls', () => {
    // Two successive calls must each return the full result (lastIndex reset).
    const xml = feed(ITEM('A') + ITEM('B'))
    expect(parseRss(xml)).toHaveLength(2)
    expect(parseRss(xml)).toHaveLength(2)
  })
})
