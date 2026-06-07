import { NextRequest, NextResponse } from 'next/server'
import { safeFetch } from '@/lib/safe-fetch'
import { buildLocationQuery } from '@/lib/geo'
import { enforceRateLimit, errorResponse } from '@/lib/http'
import type { Weather } from '@/components/briefing/types'

export const dynamic = 'force-dynamic'

const BASE = 'https://api.openweathermap.org/data/2.5'
const DEFAULT_CITY = process.env.BRIEFING_CITY || 'New York'
const FORECAST_SLOTS = 8 // 8 × 3h = 24h lookahead

// ── Upstream (OpenWeatherMap) response shapes ───────────────────
interface OWMWeatherItem { main: string; description: string; icon: string }
interface OWMMain { temp: number; feels_like: number; temp_min: number; temp_max: number; humidity: number }
interface OWMCurrent { name: string; main: OWMMain; weather: OWMWeatherItem[]; wind: { speed: number } }
interface OWMForecastSlot { main: Pick<OWMMain, 'temp_min' | 'temp_max'>; pop: number }
interface OWMForecast { list: OWMForecastSlot[] }

/**
 * Reduce the next 24h of 3-hour forecast slots into a daily high/low and the
 * peak precipitation probability.
 *
 * Uses `reduce` rather than `Math.max(...array)` deliberately: the spread form
 * passes every element as a function argument and can overflow the call stack
 * on large inputs. `reduce` is O(n) time, O(1) stack.
 */
function summarizeForecast(slots: OWMForecastSlot[]): { high: number; low: number; pop: number } {
  return slots.reduce(
    (acc, s) => ({
      high: Math.max(acc.high, s.main.temp_max),
      low:  Math.min(acc.low,  s.main.temp_min),
      pop:  Math.max(acc.pop,  s.pop ?? 0),
    }),
    { high: -Infinity, low: Infinity, pop: 0 },
  )
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const apiKey = process.env.OPENWEATHER_API_KEY
  if (!apiKey) return errorResponse(500, 'Weather service is not configured.')

  const limited = enforceRateLimit(req, 'weather', 20, 60_000)
  if (limited) return limited

  try {
    const location = buildLocationQuery(
      req.nextUrl.searchParams.get('lat'),
      req.nextUrl.searchParams.get('lon'),
      DEFAULT_CITY,
    )

    const buildUrl = (endpoint: string): string => {
      const p = new URLSearchParams(location)
      p.set('units', 'imperial')
      p.set('appid', apiKey)
      return `${BASE}/${endpoint}?${p}`
    }

    const [currentRes, forecastRes] = await Promise.all([
      safeFetch(buildUrl('weather'), { cache: 'no-store' }),
      safeFetch(buildUrl('forecast'), { cache: 'no-store' }),
    ])

    if (!currentRes.ok) {
      // Surface the upstream status but not its (potentially sensitive) body.
      return errorResponse(currentRes.status === 404 ? 404 : 502, 'Weather lookup failed.')
    }

    const current = (await currentRes.json()) as OWMCurrent
    const forecast = forecastRes.ok ? ((await forecastRes.json()) as OWMForecast) : null

    let high = Math.round(current.main.temp_max)
    let low = Math.round(current.main.temp_min)
    let pop = 0

    if (forecast?.list?.length) {
      const s = summarizeForecast(forecast.list.slice(0, FORECAST_SLOTS))
      high = Math.round(s.high)
      low = Math.round(s.low)
      pop = s.pop
    }

    const weather: Weather = {
      city:        current.name,
      temp:        Math.round(current.main.temp),
      feelsLike:   Math.round(current.main.feels_like),
      condition:   current.weather[0]?.main ?? '—',
      description: current.weather[0]?.description ?? '',
      icon:        current.weather[0]?.icon ?? '01d',
      high,
      low,
      rainChance:  Math.round(pop * 100),
      humidity:    current.main.humidity,
      windSpeed:   Math.round(current.wind?.speed ?? 0),
    }

    return NextResponse.json(weather)
  } catch (err) {
    return errorResponse(502, 'Weather lookup failed.', err)
  }
}
