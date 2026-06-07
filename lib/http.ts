import { NextResponse } from 'next/server'
import { allow } from './rate-limit'

/**
 * Shared HTTP utilities for API route handlers.
 *
 * Centralising these concerns keeps individual routes thin and guarantees
 * that every endpoint applies the same security posture (rate limiting,
 * non-leaking error responses) consistently.
 */

/**
 * Extract the originating client IP for rate-limiting purposes.
 *
 * SECURITY NOTE: `x-forwarded-for` is client-controllable unless a trusted
 * reverse proxy overwrites it. On Vercel/Netlify the platform rewrites this
 * header, so the left-most entry is trustworthy in that deployment. In an
 * untrusted environment an attacker can rotate this value to evade the
 * limiter — the limiter is therefore a mitigation, not an absolute guarantee.
 * Returns `'unknown'` when no header is present so all anonymous traffic
 * shares a single (still rate-limited) bucket.
 */
export function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip')?.trim() ?? 'unknown'
}

/**
 * Apply a fixed-window rate limit to a request.
 *
 * @returns A 429 `NextResponse` if the limit is exceeded, otherwise `null`
 *          (meaning the caller should proceed).
 */
export function enforceRateLimit(
  req: Request,
  bucket: string,
  limit: number,
  windowMs: number,
): NextResponse | null {
  const key = `${bucket}:${clientIp(req)}`
  if (allow(key, limit, windowMs)) return null
  return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
}

/**
 * Build an error response that NEVER leaks internal failure details to the
 * client. The internal cause is logged server-side (where operators can see
 * it) while the client receives only a curated, safe message.
 *
 * Use explicit safe messages for expected client errors (validation, auth);
 * use this for the catch-all `catch` block around upstream/IO failures.
 */
export function errorResponse(
  status: number,
  publicMessage: string,
  internalCause?: unknown,
): NextResponse {
  if (internalCause !== undefined) {
    // Server-side only — visible in logs, never sent to the client.
    const detail = internalCause instanceof Error ? internalCause.stack ?? internalCause.message : String(internalCause)
    console.error(`[api:${status}] ${publicMessage} :: ${detail}`)
  }
  return NextResponse.json({ error: publicMessage }, { status })
}

/** Guard: require a JSON Content-Type. Returns a 415 response or `null`. */
export function requireJson(req: Request): NextResponse | null {
  const ct = req.headers.get('content-type')
  if (!ct || !ct.includes('application/json')) {
    return NextResponse.json({ error: 'Content-Type must be application/json' }, { status: 415 })
  }
  return null
}

/**
 * Safely parse a JSON request body, enforcing a maximum byte size declared
 * via the Content-Length header to reject oversized payloads before reading.
 *
 * @returns `{ ok: true, value }` on success, or `{ ok: false, response }`
 *          carrying the error response the caller should return.
 */
export async function parseJsonBody<T = unknown>(
  req: Request,
  maxBytes = 16_384,
): Promise<{ ok: true; value: T } | { ok: false; response: NextResponse }> {
  const declared = Number.parseInt(req.headers.get('content-length') ?? '0', 10)
  if (Number.isFinite(declared) && declared > maxBytes) {
    return { ok: false, response: NextResponse.json({ error: 'Request body too large' }, { status: 413 }) }
  }
  try {
    return { ok: true, value: (await req.json()) as T }
  } catch {
    return { ok: false, response: NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }) }
  }
}
