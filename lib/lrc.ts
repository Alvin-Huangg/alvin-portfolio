export interface LyricLine {
  /** Timestamp in seconds from track start. */
  readonly time: number
  readonly text: string
}

/** Matches an LRC timestamp tag, e.g. `[01:23.45]` or `[01:23]`. */
const TAG_RE = /\[(\d{1,2}):(\d{1,2}(?:\.\d{1,3})?)\]/g

/**
 * Parse an LRC (synced lyrics) string into time-ordered lines.
 *
 * A single source line may carry multiple timestamps (repeated lyrics); each
 * produces its own entry. Empty-text lines are preserved — they represent
 * instrumental gaps and let the UI clear the active line during them.
 *
 * Time complexity: O(n) in the input length. Output is sorted once at the end.
 */
export function parseLrc(lrc: string): LyricLine[] {
  const lines: LyricLine[] = []

  for (const raw of lrc.split('\n')) {
    TAG_RE.lastIndex = 0
    const tags = [...raw.matchAll(TAG_RE)]
    if (tags.length === 0) continue

    const text = raw.replace(TAG_RE, '').trim()
    for (const tag of tags) {
      const minutes = Number(tag[1])
      const seconds = Number(tag[2])
      if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) continue
      lines.push({ time: minutes * 60 + seconds, text })
    }
  }

  return lines.sort((a, b) => a.time - b.time)
}

/**
 * Binary-search the index of the active lyric line for a given playback
 * position: the last line whose timestamp is <= `positionSec`.
 *
 * O(log n) per lookup — important because this runs on every animation tick.
 * Returns -1 when playback is before the first timed line.
 */
export function activeLineIndex(lines: readonly LyricLine[], positionSec: number): number {
  let lo = 0
  let hi = lines.length - 1
  let result = -1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (lines[mid].time <= positionSec) {
      result = mid
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  return result
}
