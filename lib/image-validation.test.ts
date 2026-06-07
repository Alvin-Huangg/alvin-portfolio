import { describe, it, expect } from 'vitest'
import { validateImageMeta, matchesMagicBytes, MAX_FILE_SIZE } from './image-validation'

describe('validateImageMeta', () => {
  it('accepts a valid jpeg', () => {
    expect(validateImageMeta('image/jpeg', 'photo.jpg', 1024)).toEqual({ ok: true })
  })
  it('rejects an unsupported MIME type', () => {
    expect(validateImageMeta('application/pdf', 'doc.pdf', 1024)).toMatchObject({ ok: false, status: 400 })
  })
  it('rejects a mismatched / unsupported extension', () => {
    expect(validateImageMeta('image/png', 'evil.exe', 1024)).toMatchObject({ ok: false, status: 400 })
  })
  it('rejects oversized files with 413', () => {
    expect(validateImageMeta('image/png', 'big.png', MAX_FILE_SIZE + 1)).toMatchObject({ ok: false, status: 413 })
  })
})

describe('matchesMagicBytes', () => {
  it('accepts a real JPEG signature', () => {
    expect(matchesMagicBytes(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]), 'image/jpeg')).toBe(true)
  })
  it('accepts a real PNG signature', () => {
    expect(matchesMagicBytes(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), 'image/png')).toBe(true)
  })
  it('accepts a RIFF/WEBP header', () => {
    expect(matchesMagicBytes(new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0]), 'image/webp')).toBe(true)
  })
  it('rejects a spoofed type (PNG bytes declared as JPEG)', () => {
    expect(matchesMagicBytes(new Uint8Array([0x89, 0x50, 0x4e, 0x47]), 'image/jpeg')).toBe(false)
  })
  it('rejects a polyglot/garbage payload', () => {
    expect(matchesMagicBytes(new Uint8Array([0x00, 0x01, 0x02, 0x03]), 'image/png')).toBe(false)
  })
  it('accepts HEIC with an ftyp box marker', () => {
    const heic = new Uint8Array([0, 0, 0, 0x18, 0x66, 0x74, 0x79, 0x70]) // ...ftyp
    expect(matchesMagicBytes(heic, 'image/heic')).toBe(true)
  })
})
