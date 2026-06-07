import { randomUUID } from 'crypto'

/**
 * Pure helpers for constructing blog-post documents.
 * Free of I/O so they can be unit-tested directly.
 */

export const POST_LIMITS = {
  title: 200,
  body: 50_000,
  excerpt: 500,
  images: 3,
  slug: 100,
} as const

export const ALLOWED_CATEGORIES = new Set(['thoughts', 'travel', 'music', 'reading'] as const)
export type Category = typeof ALLOWED_CATEGORIES extends Set<infer T> ? T : never

/** A Sanity asset reference id, e.g. `image-abc123-1200x800-jpg`. */
const ASSET_ID_RE = /^image-[a-zA-Z0-9]+-\d+x\d+-[a-z]+$/

/**
 * Convert a title into a URL-safe slug.
 * Lowercases, strips non-alphanumerics, collapses whitespace/dashes, and caps
 * length so a pathological title cannot produce an unbounded slug.
 */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, POST_LIMITS.slug)
}

/** Split prose into Portable Text blocks on blank lines. */
export function textToPortableText(text: string) {
  return text
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => ({
      _type: 'block',
      _key: randomUUID(), // collision-resistant key (vs Date.now())
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: randomUUID(), text: p, marks: [] as string[] }],
    }))
}

/** Keep only well-formed Sanity image asset ids, capped at the per-post limit. */
export function sanitizeAssetIds(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((id): id is string => typeof id === 'string' && ASSET_ID_RE.test(id))
    .slice(0, POST_LIMITS.images)
}

export interface ValidatedPost {
  title: string
  body: string
  excerpt: string
  category: Category
  imageAssetIds: string[]
}

export type ValidationResult =
  | { ok: true; value: ValidatedPost }
  | { ok: false; error: string }

/**
 * Validate and normalise an untrusted post payload.
 * Returns a discriminated union so callers handle both branches exhaustively.
 */
export function validatePost(body: Record<string, unknown>): ValidationResult {
  const title = typeof body.title === 'string' ? body.title.trim() : ''
  const text = typeof body.body === 'string' ? body.body.trim() : ''
  const excerpt = typeof body.excerpt === 'string' ? body.excerpt.trim() : ''
  const category = typeof body.category === 'string' ? body.category.trim() : 'thoughts'

  if (!title || title.length > POST_LIMITS.title) {
    return { ok: false, error: `title is required (max ${POST_LIMITS.title} chars)` }
  }
  if (!text || text.length > POST_LIMITS.body) {
    return { ok: false, error: `body is required (max ${POST_LIMITS.body} chars)` }
  }
  if (excerpt.length > POST_LIMITS.excerpt) {
    return { ok: false, error: `excerpt too long (max ${POST_LIMITS.excerpt} chars)` }
  }
  if (!ALLOWED_CATEGORIES.has(category as Category)) {
    return { ok: false, error: `category must be one of: ${[...ALLOWED_CATEGORIES].join(', ')}` }
  }

  return {
    ok: true,
    value: {
      title,
      body: text,
      excerpt,
      category: category as Category,
      imageAssetIds: sanitizeAssetIds(body.imageAssetIds),
    },
  }
}

/** Build the final Sanity document from a validated post. */
export function buildPostDocument(post: ValidatedPost) {
  const imageBlocks = post.imageAssetIds.map(id => ({
    _type: 'image',
    _key: randomUUID(),
    asset: { _type: 'reference', _ref: id },
  }))
  return {
    _type: 'post',
    title: post.title,
    slug: { _type: 'slug', current: slugify(post.title) },
    category: post.category,
    publishedAt: new Date().toISOString(),
    excerpt: post.excerpt,
    body: [...textToPortableText(post.body), ...imageBlocks],
  }
}
