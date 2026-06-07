import { createHash, timingSafeEqual } from 'crypto'

/**
 * Constant-time password verification.
 *
 * Hashing both sides to SHA-256 normalises length before the comparison,
 * preventing the early-exit length-mismatch timing leak that a plain
 * `timingSafeEqual` on variable-length buffers would otherwise expose.
 */
export function verifyPassword(provided: unknown): boolean {
  if (typeof provided !== 'string' || !provided) return false

  const secret = process.env.PROJECTS_PASSWORD
  if (!secret) return false

  const a = createHash('sha256').update(provided).digest()
  const b = createHash('sha256').update(secret).digest()
  return timingSafeEqual(a, b)
}
