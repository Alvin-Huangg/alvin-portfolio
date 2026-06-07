import { describe, it, expect } from 'vitest'
import { parseLrc, activeLineIndex } from './lrc'

describe('parseLrc', () => {
  it('parses timestamped lines in order', () => {
    const lrc = '[00:12.50]First line\n[00:15.00]Second line\n[01:05.25]Third'
    const out = parseLrc(lrc)
    expect(out).toEqual([
      { time: 12.5, text: 'First line' },
      { time: 15, text: 'Second line' },
      { time: 65.25, text: 'Third' },
    ])
  })

  it('sorts out-of-order timestamps', () => {
    const out = parseLrc('[00:20.00]B\n[00:05.00]A')
    expect(out.map(l => l.text)).toEqual(['A', 'B'])
  })

  it('expands a line with multiple timestamps', () => {
    const out = parseLrc('[00:10.00][00:40.00]Repeated chorus')
    expect(out).toHaveLength(2)
    expect(out[0]).toEqual({ time: 10, text: 'Repeated chorus' })
    expect(out[1]).toEqual({ time: 40, text: 'Repeated chorus' })
  })

  it('preserves empty (instrumental) lines', () => {
    const out = parseLrc('[00:00.00]\n[00:03.00]Words')
    expect(out[0]).toEqual({ time: 0, text: '' })
  })

  it('ignores non-timestamped metadata lines', () => {
    const out = parseLrc('[ar:Eric Chou]\n[00:01.00]Hi')
    // [ar:...] is not a valid mm:ss tag, so the whole line is skipped.
    expect(out).toHaveLength(1)
    expect(out[0].text).toBe('Hi')
  })

  it('returns [] for empty input', () => {
    expect(parseLrc('')).toEqual([])
  })
})

describe('activeLineIndex', () => {
  const lines = parseLrc('[00:00.00]A\n[00:10.00]B\n[00:20.00]C\n[00:30.00]D')

  it('returns -1 before the first line', () => {
    expect(activeLineIndex(lines, -1)).toBe(-1)
  })

  it('finds the active line at an exact boundary', () => {
    expect(activeLineIndex(lines, 10)).toBe(1)
    expect(activeLineIndex(lines, 20)).toBe(2)
  })

  it('finds the last line whose time precedes the position', () => {
    expect(activeLineIndex(lines, 15)).toBe(1)
    expect(activeLineIndex(lines, 29.9)).toBe(2)
  })

  it('clamps to the final line past the end', () => {
    expect(activeLineIndex(lines, 9999)).toBe(3)
  })

  it('handles an empty lyric set', () => {
    expect(activeLineIndex([], 42)).toBe(-1)
  })
})
