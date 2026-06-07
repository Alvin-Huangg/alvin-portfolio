import { describe, it, expect } from 'vitest'
import { parseCoord, parseLat, parseLon, buildLocationQuery, LAT_RANGE, LON_RANGE } from './geo'

describe('parseCoord', () => {
  it('parses valid in-range values', () => {
    expect(parseCoord('45.5', -90, 90)).toBe(45.5)
    expect(parseCoord('-89.9', -90, 90)).toBe(-89.9)
    expect(parseCoord('0', -90, 90)).toBe(0)
  })

  it('accepts the exact range boundaries', () => {
    expect(parseLat('90')).toBe(90)
    expect(parseLat('-90')).toBe(-90)
    expect(parseLon('180')).toBe(180)
    expect(parseLon('-180')).toBe(-180)
  })

  it('rejects out-of-range values', () => {
    expect(parseLat('90.0001')).toBeNull()
    expect(parseLat('-91')).toBeNull()
    expect(parseLon('181')).toBeNull()
  })

  it('rejects null, empty, and whitespace', () => {
    expect(parseCoord(null, -90, 90)).toBeNull()
    expect(parseCoord('', -90, 90)).toBeNull()
    expect(parseCoord('   ', -90, 90)).toBeNull()
  })

  it('rejects NaN, Infinity, and injection-y strings', () => {
    expect(parseCoord('abc', -90, 90)).toBeNull()
    expect(parseCoord('Infinity', -90, 90)).toBeNull()
    expect(parseCoord('1; DROP TABLE', -90, 90)).toBeNull()
    expect(parseCoord('1&appid=evil', -180, 180)).toBeNull()
  })

  it('exposes canonical ranges', () => {
    expect(LAT_RANGE).toEqual({ min: -90, max: 90 })
    expect(LON_RANGE).toEqual({ min: -180, max: 180 })
  })
})

describe('buildLocationQuery', () => {
  it('uses coordinates when both are valid', () => {
    const q = buildLocationQuery('40.7', '-74.0', 'New York')
    expect(q.get('lat')).toBe('40.7')
    expect(q.get('lon')).toBe('-74')
    expect(q.get('q')).toBeNull()
  })

  it('falls back to city when either coordinate is invalid', () => {
    expect(buildLocationQuery('40.7', null, 'Phoenix').get('q')).toBe('Phoenix')
    expect(buildLocationQuery('999', '0', 'Phoenix').get('q')).toBe('Phoenix')
  })

  it('percent-encodes the fallback city (no query injection)', () => {
    const q = buildLocationQuery(null, null, 'New York&appid=evil')
    // URLSearchParams encodes the ampersand so it cannot inject a param.
    expect(q.get('q')).toBe('New York&appid=evil')
    expect(q.toString()).toContain('appid%3Devil')
  })
})
