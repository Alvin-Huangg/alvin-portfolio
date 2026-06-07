import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { verifyPassword } from './auth'

describe('verifyPassword', () => {
  const ORIGINAL = process.env.PROJECTS_PASSWORD

  beforeEach(() => { process.env.PROJECTS_PASSWORD = 'correct horse battery staple' })
  afterEach(() => { process.env.PROJECTS_PASSWORD = ORIGINAL })

  it('accepts the exact password', () => {
    expect(verifyPassword('correct horse battery staple')).toBe(true)
  })

  it('rejects a wrong password', () => {
    expect(verifyPassword('wrong')).toBe(false)
  })

  it('rejects a password that is a prefix of the secret', () => {
    expect(verifyPassword('correct horse battery stapl')).toBe(false)
  })

  it('rejects non-string inputs without throwing', () => {
    expect(verifyPassword(undefined)).toBe(false)
    expect(verifyPassword(null)).toBe(false)
    expect(verifyPassword(123)).toBe(false)
    expect(verifyPassword({})).toBe(false)
  })

  it('rejects the empty string', () => {
    expect(verifyPassword('')).toBe(false)
  })

  it('returns false when no secret is configured', () => {
    delete process.env.PROJECTS_PASSWORD
    expect(verifyPassword('anything')).toBe(false)
  })
})
