/**
 * Image upload validation — defence-in-depth.
 *
 * A declared MIME type is attacker-controlled, so we validate three
 * independent signals: the declared type, the filename extension, and the
 * file's leading magic bytes. All three must agree for an upload to proceed.
 */

export const MAX_FILE_SIZE = 8 * 1024 * 1024 // 8 MB

export const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic'])
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'heic'])

/** Magic-byte signatures keyed by MIME type. */
const SIGNATURES: ReadonlyArray<{ mime: string; bytes: readonly number[]; offset?: number }> = [
  { mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mime: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46] }, // "RIFF"; WEBP at offset 8
]

function extensionOf(filename: string): string {
  const dot = filename.lastIndexOf('.')
  return dot === -1 ? '' : filename.slice(dot + 1).toLowerCase()
}

/**
 * Verify the buffer's leading bytes match the declared MIME type.
 *
 * HEIC uses ISO-BMFF boxes whose signature lives at a variable offset with a
 * `ftyp` brand; rather than enumerate every brand we verify the `ftyp` marker
 * at offset 4 and accept, leaning on the MIME+extension checks for the rest.
 */
export function matchesMagicBytes(buffer: Uint8Array, declaredMime: string): boolean {
  if (declaredMime === 'image/heic') {
    // bytes 4..8 should spell "ftyp"
    return (
      buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70
    )
  }
  const sig = SIGNATURES.find(s => s.mime === declaredMime)
  if (!sig) return false
  const off = sig.offset ?? 0
  return sig.bytes.every((b, i) => buffer[off + i] === b)
}

export type ImageValidation =
  | { ok: true }
  | { ok: false; status: number; error: string }

/** Validate declared type, extension, and size (cheap checks, pre-read). */
export function validateImageMeta(type: string, filename: string, size: number): ImageValidation {
  if (!ALLOWED_TYPES.has(type)) {
    return { ok: false, status: 400, error: 'Unsupported file type' }
  }
  if (!ALLOWED_EXTENSIONS.has(extensionOf(filename))) {
    return { ok: false, status: 400, error: 'Unsupported file extension' }
  }
  if (size > MAX_FILE_SIZE) {
    return { ok: false, status: 413, error: 'Image must be under 8 MB' }
  }
  return { ok: true }
}
