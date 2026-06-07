import { describe, it, expect } from 'vitest'
import { slugify, sanitizeAssetIds, validatePost, buildPostDocument, POST_LIMITS } from './post'

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })
  it('strips punctuation and collapses dashes', () => {
    expect(slugify('Hello,   World!!! -- Again')).toBe('hello-world-again')
  })
  it('trims leading/trailing dashes', () => {
    expect(slugify('  --Hi--  ')).toBe('hi')
  })
  it('caps slug length', () => {
    expect(slugify('a'.repeat(500)).length).toBe(POST_LIMITS.slug)
  })
})

describe('sanitizeAssetIds', () => {
  it('keeps well-formed Sanity asset ids', () => {
    const ids = ['image-abc123-1200x800-jpg', 'image-Def456-64x64-png']
    expect(sanitizeAssetIds(ids)).toEqual(ids)
  })
  it('drops malformed ids', () => {
    expect(sanitizeAssetIds(['nope', 'image-bad', 42, null, 'image-x-1x1-jpg-extra'])).toEqual([])
  })
  it('caps the number of images', () => {
    const many = Array.from({ length: 10 }, (_, i) => `image-a${i}-1x1-jpg`)
    expect(sanitizeAssetIds(many)).toHaveLength(POST_LIMITS.images)
  })
  it('returns [] for non-array input', () => {
    expect(sanitizeAssetIds('image-a-1x1-jpg')).toEqual([])
    expect(sanitizeAssetIds(undefined)).toEqual([])
  })
})

describe('validatePost', () => {
  const valid = { title: 'My Post', body: 'Hello there.', excerpt: 'hi', category: 'thoughts' }

  it('accepts a valid payload', () => {
    const r = validatePost(valid)
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.value.title).toBe('My Post')
  })

  it('rejects an empty title', () => {
    const r = validatePost({ ...valid, title: '   ' })
    expect(r).toMatchObject({ ok: false })
  })

  it('rejects an over-length title', () => {
    expect(validatePost({ ...valid, title: 'a'.repeat(POST_LIMITS.title + 1) }).ok).toBe(false)
  })

  it('rejects an empty body', () => {
    expect(validatePost({ ...valid, body: '' }).ok).toBe(false)
  })

  it('rejects a disallowed category', () => {
    const r = validatePost({ ...valid, category: 'malware' })
    expect(r.ok).toBe(false)
  })

  it('defaults missing category to thoughts', () => {
    const { category, ...rest } = valid
    const r = validatePost(rest)
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.value.category).toBe('thoughts')
  })
})

describe('buildPostDocument', () => {
  it('produces a Sanity post with a slug and unique block keys', () => {
    const r = validatePost({ title: 'Two Paras', body: 'First.\n\nSecond.', category: 'travel' })
    expect(r.ok).toBe(true)
    if (!r.ok) return
    const doc = buildPostDocument(r.value)
    expect(doc._type).toBe('post')
    expect(doc.slug.current).toBe('two-paras')
    expect(doc.category).toBe('travel')
    expect(doc.body).toHaveLength(2)
    const [a, b] = doc.body
    expect(a._key).not.toBe(b._key) // collision-resistant keys
  })

  it('appends image blocks after text blocks', () => {
    const r = validatePost({
      title: 'With Image', body: 'Body.', category: 'thoughts',
      imageAssetIds: ['image-abc-1x1-jpg'],
    })
    if (!r.ok) throw new Error('expected valid')
    const doc = buildPostDocument(r.value)
    expect(doc.body.at(-1)).toMatchObject({ _type: 'image', asset: { _ref: 'image-abc-1x1-jpg' } })
  })
})
