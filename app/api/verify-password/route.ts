import { NextResponse } from 'next/server'
import { verifyPassword } from '@/lib/auth'
import { enforceRateLimit, requireJson, parseJsonBody } from '@/lib/http'

/** Auth attempts per IP per minute — low ceiling to slow credential stuffing. */
const RATE_LIMIT = 10
const RATE_WINDOW_MS = 60_000

export async function POST(req: Request): Promise<NextResponse> {
  const limited = enforceRateLimit(req, 'verify', RATE_LIMIT, RATE_WINDOW_MS)
  if (limited) return limited

  const ct = requireJson(req)
  if (ct) return ct

  const body = await parseJsonBody<{ password?: unknown }>(req, 1_024)
  if (!body.ok) return body.response

  // Constant-time comparison (SHA-256 + timingSafeEqual) inside verifyPassword.
  if (!verifyPassword(body.value.password)) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  return NextResponse.json({ ok: true })
}
