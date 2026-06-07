import { NextResponse } from 'next/server'
import { verifyPassword } from '@/lib/auth'
import { getWriteClient } from '@/lib/sanity-write'
import { validateImageMeta, matchesMagicBytes } from '@/lib/image-validation'
import { enforceRateLimit, errorResponse } from '@/lib/http'

export async function POST(req: Request): Promise<NextResponse> {
  const limited = enforceRateLimit(req, 'upload', 10, 60_000)
  if (limited) return limited

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  // Auth — constant-time comparison.
  if (!verifyPassword(formData.get('password'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.SANITY_WRITE_TOKEN) {
    return errorResponse(500, 'Uploads are not configured.')
  }

  const file = formData.get('image')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No image file provided' }, { status: 400 })
  }

  // Cheap metadata checks before reading the body into memory.
  const meta = validateImageMeta(file.type, file.name, file.size)
  if (!meta.ok) {
    return NextResponse.json({ error: meta.error }, { status: meta.status })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  // Defence-in-depth: the bytes must match the declared type.
  if (!matchesMagicBytes(buffer, file.type)) {
    return NextResponse.json({ error: 'File content does not match declared type' }, { status: 400 })
  }

  try {
    const asset = await getWriteClient().assets.upload('image', buffer, {
      filename: file.name,
      contentType: file.type,
    })
    return NextResponse.json({ assetId: asset._id, url: asset.url })
  } catch (err) {
    return errorResponse(500, 'Could not upload the image.', err)
  }
}
