/**
 * Geographic coordinate validation.
 *
 * Kept as a standalone pure module so the validation logic — the security
 * boundary that prevents arbitrary query injection into the upstream weather
 * URL — can be unit-tested in isolation.
 */

export const LAT_RANGE = { min: -90, max: 90 } as const
export const LON_RANGE = { min: -180, max: 180 } as const

/**
 * Parse and bounds-check a single coordinate value from untrusted input.
 *
 * @returns the parsed number when valid and within `[min, max]`, else `null`.
 *          Rejects `NaN`, `Infinity`, empty strings, and out-of-range values.
 */
export function parseCoord(raw: string | null, min: number, max: number): number | null {
  if (raw === null || raw.trim() === '') return null
  const n = Number(raw)
  if (!Number.isFinite(n)) return null
  if (n < min || n > max) return null
  return n
}

/** Convenience wrappers binding the canonical latitude/longitude ranges. */
export const parseLat = (raw: string | null) => parseCoord(raw, LAT_RANGE.min, LAT_RANGE.max)
export const parseLon = (raw: string | null) => parseCoord(raw, LON_RANGE.min, LON_RANGE.max)

/**
 * Build the validated location portion of a weather query.
 * Returns coordinate params when BOTH lat and lon are valid, otherwise falls
 * back to a percent-encoded city query (which cannot inject into the URL).
 */
export function buildLocationQuery(
  latRaw: string | null,
  lonRaw: string | null,
  fallbackCity: string,
): URLSearchParams {
  const lat = parseLat(latRaw)
  const lon = parseLon(lonRaw)
  if (lat !== null && lon !== null) {
    return new URLSearchParams({ lat: String(lat), lon: String(lon) })
  }
  return new URLSearchParams({ q: fallbackCity })
}
