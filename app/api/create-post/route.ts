import { NextResponse } from 'next/server'
import { verifyPassword } from '@/lib/auth'
import { getWriteClient } from '@/lib/sanity-write'
import { validatePost, buildPostDocument } from '@/lib/post'
import { enforceRateLimit, requireJson, parseJsonBody, errorResponse } from '@/lib/http'

export async function POST(req: Request): Promise<NextResponse> {
  const limited = enforceRateLimit(req, 'create-post', 5, 60_000)
  if (limited) return limited

  const ct = requireJson(req)
  if (ct) return ct

  // 64 KB ceiling: comfortably fits a long post, rejects abuse.
  const parsed = await parseJsonBody<Record<string, unknown>>(req, 64 * 1024)
  if (!parsed.ok) return parsed.response
  const body = parsed.value

  // Auth — constant-time comparison.
  if (!verifyPassword(body.password)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.SANITY_WRITE_TOKEN) {
    return errorResponse(500, 'Publishing is not configured.')
  }

  const validation = validatePost(body)
  if (!validation.ok) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  try {
    const doc = buildPostDocument(validation.value)
    const created = await getWriteClient().create(doc)
    return NextResponse.json({ ok: true, id: created._id, slug: doc.slug.current })
  } catch (err) {
    return errorResponse(500, 'Could not publish the post.', err)
  }
}
