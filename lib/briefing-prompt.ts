/**
 * Pure prompt-assembly helpers for the AI morning briefing.
 *
 * Separated from the route handler so the (deterministic) prompt construction
 * can be unit-tested without invoking the language model.
 */

export const SYSTEM_PROMPT =
  "You write a personal morning briefing. In 2-3 natural sentences, synthesize the day's " +
  'weather, news, and context into a calm, smart, warm summary — like a well-informed friend ' +
  'catching someone up over coffee. Weave the most interesting threads together; do not list ' +
  'everything. No greeting, no preamble, no markdown, no emoji. Just the briefing.'

const MAX_HEADLINES = 5

export function buildWeatherLine(weather: unknown): string {
  if (!weather || typeof weather !== 'object') return 'Weather: unavailable.'
  const w = weather as Record<string, unknown>
  if (w.city == null || w.temp == null) return 'Weather: unavailable.'
  return (
    `Weather in ${w.city}: ${w.temp}°F, ${w.description ?? ''}. ` +
    `High ${w.high}° / low ${w.low}°, ${w.rainChance}% chance of rain.`
  )
}

export function buildNewsLines(news: unknown): string {
  if (!news || typeof news !== 'object') return 'No headlines available.'
  const articles = (news as Record<string, unknown>).articles
  if (!Array.isArray(articles) || articles.length === 0) return 'No headlines available.'
  return articles
    .slice(0, MAX_HEADLINES)
    .map((a, i) => {
      const article = (a ?? {}) as Record<string, unknown>
      return `${i + 1}. ${article.title ?? 'Untitled'} (${article.source ?? 'Unknown'})`
    })
    .join('\n')
}

/**
 * Assemble the full user-facing prompt. `today` is injected for determinism
 * in tests; production callers omit it and the current date is used.
 */
export function buildBriefingPrompt(weather: unknown, news: unknown, today: Date = new Date()): string {
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  return `${SYSTEM_PROMPT}\n\nToday is ${dateStr}.\n\n${buildWeatherLine(weather)}\n\nTop headlines:\n${buildNewsLines(news)}`
}
