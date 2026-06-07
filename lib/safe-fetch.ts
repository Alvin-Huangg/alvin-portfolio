/** Domains this app is allowed to make outbound requests to. */
const ALLOWLIST = new Set([
  'api.openweathermap.org',
  'finance.yahoo.com',
  'generativelanguage.googleapis.com',
  'accounts.spotify.com',
  'api.spotify.com',
  'openweathermap.org',
  'lrclib.net',
])

const DEFAULT_TIMEOUT_MS = 8_000

type SafeFetchOptions = RequestInit & { timeoutMs?: number }

/**
 * Fetch wrapper that enforces:
 *   1. SSRF guard — only whitelisted hostnames are reachable.
 *   2. Hard timeout via AbortController — no route hangs forever.
 *
 * Throws on network error, timeout, or SSRF violation.
 * Returns the raw Response on HTTP errors (caller decides how to handle status).
 */
export async function safeFetch(
  url: string,
  { timeoutMs = DEFAULT_TIMEOUT_MS, ...opts }: SafeFetchOptions = {},
): Promise<Response> {
  let hostname: string
  try {
    hostname = new URL(url).hostname
  } catch {
    throw new TypeError(`safeFetch: malformed URL — "${url}"`)
  }

  if (!ALLOWLIST.has(hostname)) {
    throw new Error(`safeFetch: SSRF guard rejected hostname "${hostname}"`)
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, { ...opts, signal: controller.signal })
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      throw new Error(`safeFetch: request to "${hostname}" timed out after ${timeoutMs}ms`)
    }
    throw err
  } finally {
    clearTimeout(timer)
  }
}
