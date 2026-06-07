import { describe, it, expect } from 'vitest'
import { buildWeatherLine, buildNewsLines, buildBriefingPrompt, SYSTEM_PROMPT } from './briefing-prompt'

describe('buildWeatherLine', () => {
  it('formats a complete weather object', () => {
    const line = buildWeatherLine({ city: 'Phoenix', temp: 92, description: 'clear sky', high: 104, low: 76, rainChance: 0 })
    expect(line).toContain('Phoenix')
    expect(line).toContain('92°F')
    expect(line).toContain('clear sky')
  })
  it('handles missing weather gracefully', () => {
    expect(buildWeatherLine(null)).toBe('Weather: unavailable.')
    expect(buildWeatherLine({})).toBe('Weather: unavailable.')
    expect(buildWeatherLine('garbage')).toBe('Weather: unavailable.')
  })
})

describe('buildNewsLines', () => {
  it('numbers up to five headlines', () => {
    const articles = Array.from({ length: 8 }, (_, i) => ({ title: `H${i}`, source: 'S' }))
    const out = buildNewsLines({ articles })
    expect(out.split('\n')).toHaveLength(5)
    expect(out).toContain('1. H0 (S)')
  })
  it('handles missing or empty news', () => {
    expect(buildNewsLines(null)).toBe('No headlines available.')
    expect(buildNewsLines({ articles: [] })).toBe('No headlines available.')
    expect(buildNewsLines({})).toBe('No headlines available.')
  })
  it('tolerates malformed article entries', () => {
    expect(buildNewsLines({ articles: [null, {}, { title: 'X' }] })).toContain('Untitled')
  })
})

describe('buildBriefingPrompt', () => {
  it('is deterministic given a fixed date', () => {
    const date = new Date('2026-06-06T12:00:00Z')
    const p1 = buildBriefingPrompt({ city: 'A', temp: 1 }, { articles: [{ title: 'T', source: 'S' }] }, date)
    const p2 = buildBriefingPrompt({ city: 'A', temp: 1 }, { articles: [{ title: 'T', source: 'S' }] }, date)
    expect(p1).toBe(p2)
  })
  it('embeds the system prompt and both sections', () => {
    const out = buildBriefingPrompt({ city: 'A', temp: 1 }, { articles: [] }, new Date('2026-06-06T12:00:00Z'))
    expect(out).toContain(SYSTEM_PROMPT)
    expect(out).toContain('Top headlines:')
  })
})
