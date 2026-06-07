'use client'

import { useCallback, useEffect, useReducer, useState, type CSSProperties } from 'react'
import type { Weather, Article } from './types'

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

interface AsyncState<T> {
  data:    T | null
  loading: boolean
  error:   string | null
}

type BriefingAction =
  | { type: 'RESET' }
  | { type: 'WEATHER_OK';  payload: Weather }
  | { type: 'WEATHER_ERR'; payload: string }
  | { type: 'NEWS_OK';     payload: Article[] }
  | { type: 'NEWS_ERR';    payload: string }
  | { type: 'SUMMARY_OK';  payload: string }
  | { type: 'SUMMARY_ERR'; payload: string }

interface BriefingState {
  weather: AsyncState<Weather>
  news:    AsyncState<Article[]>
  summary: AsyncState<string>
}

// ─────────────────────────────────────────────────────────────────
// Reducer — all state transitions in one place (testable, no mutation)
// ─────────────────────────────────────────────────────────────────

const LOADING = <T,>(): AsyncState<T> => ({ data: null, loading: true,  error: null })
const idle    = <T,>(): AsyncState<T> => ({ data: null, loading: false, error: null })

const initialState: BriefingState = {
  weather: LOADING(),
  news:    LOADING(),
  summary: LOADING(),
}

function reducer(state: BriefingState, action: BriefingAction): BriefingState {
  switch (action.type) {
    case 'RESET':
      return initialState

    case 'WEATHER_OK':
      return { ...state, weather: { data: action.payload, loading: false, error: null } }
    case 'WEATHER_ERR':
      return { ...state, weather: { ...idle<Weather>(), error: action.payload } }

    case 'NEWS_OK':
      return { ...state, news: { data: action.payload, loading: false, error: null } }
    case 'NEWS_ERR':
      return { ...state, news: { ...idle<Article[]>(), error: action.payload } }

    case 'SUMMARY_OK':
      return { ...state, summary: { data: action.payload, loading: false, error: null } }
    case 'SUMMARY_ERR':
      return { ...state, summary: { ...idle<string>(), error: action.payload } }
  }
}

// ─────────────────────────────────────────────────────────────────
// R&B track list (curated)
// ─────────────────────────────────────────────────────────────────

interface Track { readonly title: string; readonly artist: string; readonly url: string }

const RNB_TRACKS: readonly Track[] = [
  { title: 'Saturn',                 artist: 'SZA',            url: 'https://open.spotify.com/track/0cMlGmC1JObCbJGDK0G7c5' },
  { title: 'On My Mama',             artist: 'Victoria Monét', url: 'https://open.spotify.com/track/4zzgTGMuRRlYVx5Ol3Eqz5' },
  { title: 'Wasting Time',           artist: 'Brent Faiyaz',   url: 'https://open.spotify.com/track/3TRnMOQ5bHVnmvZ0Y3IZTF' },
  { title: 'Snooze',                 artist: 'SZA',            url: 'https://open.spotify.com/track/1Qrg8KqiBpW07V7PNxwwwL' },
  { title: 'Golden',                 artist: 'Cleo Sol',       url: 'https://open.spotify.com/artist/6sFIWsNpZYqfjUpaCgueju' },
  { title: 'Free Mind',              artist: 'Tems',           url: 'https://open.spotify.com/track/3eekarcy7kvN4yt5ZFzltW' },
  { title: 'Cyanide',                artist: 'Daniel Caesar',  url: 'https://open.spotify.com/track/3dYD57lRAYRF0VEHHfEYoK' },
  { title: 'Heartbreak Anniversary', artist: 'Giveon',         url: 'https://open.spotify.com/track/74OFKjfEPVFsXUuITHIyBP' },
  { title: 'Show Me',                artist: 'Jordan Ward',    url: 'https://open.spotify.com/artist/5MF9NiyBGwKBPOAVANSbbP' },
  { title: 'Over',                   artist: 'Lucky Daye',     url: 'https://open.spotify.com/artist/6qE6oF4FMbFbWCXuFSqmb6' },
  { title: 'No Love',                artist: 'Summer Walker',  url: 'https://open.spotify.com/track/4TnjEaWOeW0eKTKIEvJwnS' },
  { title: 'Come Through',           artist: 'H.E.R.',         url: 'https://open.spotify.com/artist/0SRMHSZfIAsxPnm5xZMwN4' },
] as const

// ─────────────────────────────────────────────────────────────────
// Custom hook — isolates all data-fetching logic from the view
// ─────────────────────────────────────────────────────────────────

interface Coords { lat: number; lon: number }

/** Best-effort geolocation.  Resolves null on denial / timeout. */
function requestCoords(): Promise<Coords | null> {
  return new Promise(resolve => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return resolve(null)
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      ()  => resolve(null),
      { timeout: 4_000, maximumAge: 10 * 60_000 },
    )
  })
}

/** Typed fetch helper — throws on non-2xx or JSON `{ error }` responses. */
async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res  = await fetch(url, { cache: 'no-store', ...init })
  const json = await res.json() as { error?: string } & T
  if (!res.ok || json.error) throw new Error(json.error ?? `HTTP ${res.status}`)
  return json
}

function useBriefing() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const load = useCallback(async () => {
    dispatch({ type: 'RESET' })

    const coords = await requestCoords()
    const weatherUrl = coords
      ? `/api/briefing/weather?lat=${coords.lat}&lon=${coords.lon}`
      : '/api/briefing/weather'

    // Fetch weather and news in parallel; each resolves independently.
    const [weatherResult, newsResult] = await Promise.all([
      apiFetch<Weather>(weatherUrl).then(
        d => { dispatch({ type: 'WEATHER_OK', payload: d }); return d },
        (e: Error) => { dispatch({ type: 'WEATHER_ERR', payload: e.message }); return null },
      ),
      apiFetch<{ articles: Article[] }>('/api/briefing/news').then(
        d => { dispatch({ type: 'NEWS_OK', payload: d.articles }); return d },
        (e: Error) => { dispatch({ type: 'NEWS_ERR', payload: e.message }); return null },
      ),
    ])

    // Generate the AI summary only after we have at least one data source.
    try {
      const { summary } = await apiFetch<{ summary: string }>('/api/briefing/summary', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ weather: weatherResult, news: newsResult }),
      })
      dispatch({ type: 'SUMMARY_OK', payload: summary })
    } catch (e) {
      dispatch({ type: 'SUMMARY_ERR', payload: (e as Error).message })
    }
  }, [])

  useEffect(() => { void load() }, [load])

  const refreshing = state.weather.loading || state.news.loading || state.summary.loading

  return { ...state, refreshing, refresh: load }
}

// ─────────────────────────────────────────────────────────────────
// Illustration components
// ─────────────────────────────────────────────────────────────────

function DeskRunIllustration() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/illustrations/desk-run.png"
      width={200} height={283} alt=""
      style={{ display: 'block', width: 200, height: 283, mixBlendMode: 'multiply' }}
    />
  )
}

function FanManIllustration() {
  const W = 200, H = 241, fx = 44, fy = 164, fr = 14
  return (
    <div className="relative flex-shrink-0" style={{ width: W, height: H }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/illustrations/fan-man.png" width={W} height={H} alt=""
        style={{ display: 'block', mixBlendMode: 'multiply' }} />
      <svg className="absolute inset-0 pointer-events-none" width={W} height={H}>
        <circle cx={fx} cy={fy} r={fr + 2} fill="none" stroke="rgba(80,80,80,0.25)" strokeWidth="1.5" />
        <g transform={`translate(${fx},${fy})`}>
          <g style={{ transformBox: 'fill-box' as CSSProperties['transformBox'], transformOrigin: 'center', animation: 'spin-fan 0.75s linear infinite' }}>
            <ellipse cx={0} cy={-(fr * 0.55)} rx={fr * 0.32} ry={fr * 0.62} fill="rgba(90,90,90,0.5)" />
            <ellipse cx={0} cy={-(fr * 0.55)} rx={fr * 0.32} ry={fr * 0.62} fill="rgba(90,90,90,0.5)" transform="rotate(120)" />
            <ellipse cx={0} cy={-(fr * 0.55)} rx={fr * 0.32} ry={fr * 0.62} fill="rgba(90,90,90,0.5)" transform="rotate(240)" />
            <circle r={fr * 0.2} fill="rgba(50,50,50,0.8)" />
          </g>
        </g>
        <line x1={fx} y1={fy + fr + 2} x2={fx} y2={fy + fr + 16} stroke="rgba(80,80,80,0.35)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function CookingIllustration() {
  const W = 190, H = 253, sx = 139, sy = 94
  return (
    <div className="relative flex-shrink-0" style={{ width: W, height: H }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/illustrations/cooking.png" width={W} height={H} alt=""
        style={{ display: 'block', mixBlendMode: 'multiply' }} />
      <svg className="absolute inset-0 pointer-events-none overflow-visible" width={W} height={H}>
        <g transform={`translate(${sx},${sy})`}>
          <path className="steam-1" d="M-6,0 Q-10,-10 -6,-20 Q-2,-30 -6,-42" stroke="rgba(140,140,140,0.6)" fill="none" strokeWidth="2" strokeLinecap="round" />
          <path className="steam-2" d="M2,0 Q6,-10 2,-20 Q-2,-30 2,-42"       stroke="rgba(140,140,140,0.6)" fill="none" strokeWidth="2" strokeLinecap="round" />
          <path className="steam-3" d="M10,0 Q14,-10 10,-20 Q6,-30 10,-42"    stroke="rgba(140,140,140,0.6)" fill="none" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  )
}

function BucketGuyIllustration() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/illustrations/bucket-guy.png" width={140} height={140} alt=""
      style={{ display: 'block', width: 140, height: 140, transformOrigin: 'bottom center', animation: 'lean 3.5s ease-in-out infinite', mixBlendMode: 'multiply' }} />
  )
}

// ─────────────────────────────────────────────────────────────────
// Small shared UI primitives
// ─────────────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse ${className}`} aria-hidden />
}

function RefreshIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" className={spinning ? 'animate-spin' : ''}>
      <path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8" />
      <path d="M21 3v5h-5M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16M3 21v-5h5" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────
// Section components
// ─────────────────────────────────────────────────────────────────

function LiveClock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1_000)
    return () => clearInterval(id)
  }, [])

  const hour = now?.getHours() ?? 8
  const greeting =
    hour < 12 ? 'good morning' :
    hour < 18 ? 'good afternoon' :
                'good evening'

  return (
    <div>
      <p className="text-[12px] uppercase tracking-widest text-accent font-medium mb-1">{greeting}</p>
      <h1 className="text-[22px] md:text-[26px] font-medium leading-tight text-neutral-900 dark:text-neutral-100 tracking-tight">
        {now ? now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : ' '}
      </h1>
      <p className="font-mono text-[15px] text-neutral-400 dark:text-neutral-600 tabular-nums mt-0.5">
        {now ? now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' }) : ' '}
      </p>
    </div>
  )
}

function SummarySection({ state }: { state: AsyncState<string> }) {
  return (
    <div className="flex-1 p-5 md:p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-ping" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
        </span>
        <p className="text-[12px] uppercase tracking-widest text-accent font-medium">your briefing</p>
      </div>
      {state.loading ? (
        <div className="space-y-2.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : state.error || !state.data ? (
        <p className="text-[14px] text-neutral-400 dark:text-neutral-600 italic leading-relaxed">
          {state.error?.includes('GEMINI')
            ? 'Add a GEMINI_API_KEY to generate your daily briefing.'
            : state.error ?? 'Summary unavailable.'}
        </p>
      ) : (
        <p className="text-[15px] md:text-[16px] leading-[1.8] text-neutral-700 dark:text-neutral-300">
          {state.data}
        </p>
      )}
    </div>
  )
}

function WeatherSection({ state }: { state: AsyncState<Weather> }) {
  return (
    <div className="flex-1 p-5 md:p-6 min-w-0">
      <p className="text-[12px] uppercase tracking-widest text-accent font-medium mb-4">weather</p>
      {state.loading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-32" />
        </div>
      ) : state.error || !state.data ? (
        <p className="text-[14px] text-neutral-400 italic">{state.error ?? 'Unavailable.'}</p>
      ) : (
        <WeatherDisplay data={state.data} />
      )}
    </div>
  )
}

function WeatherDisplay({ data }: { data: Weather }) {
  const stats: [string, string][] = [
    ['High / Low', `${data.high}° / ${data.low}°`],
    ['Rain',       `${data.rainChance}%`],
    ['Wind',       `${data.windSpeed} mph`],
  ]
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[42px] font-medium leading-none text-neutral-900 dark:text-neutral-100 tabular-nums">
          {data.temp}°
        </span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          alt={data.condition} width={40} height={40} className="-mt-1 opacity-80" />
      </div>
      <p className="text-[13px] text-neutral-500 dark:text-neutral-400 capitalize mb-0.5">{data.description}</p>
      <p className="text-[12px] text-neutral-400 dark:text-neutral-600 mb-4">
        {data.city} · feels like {data.feelsLike}°
      </p>
      <div className="grid grid-cols-3 gap-2 border-t border-neutral-100 dark:border-neutral-900 pt-3 text-center">
        {stats.map(([label, value]) => (
          <div key={label}>
            <p className="text-[12px] font-medium text-neutral-800 dark:text-neutral-200 tabular-nums">{value}</p>
            <p className="text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-600 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function NewsSection({ state }: { state: AsyncState<Article[]> }) {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 md:p-6">
      <p className="text-[12px] uppercase tracking-widest text-accent font-medium mb-4">top news</p>
      {state.loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-28" />
            </div>
          ))}
        </div>
      ) : state.error || !state.data?.length ? (
        <p className="text-[14px] text-neutral-400 italic">{state.error ?? 'No headlines.'}</p>
      ) : (
        <ul>
          {state.data.map((article, i) => (
            <li key={article.url} className={i > 0 ? 'border-t border-neutral-100 dark:border-neutral-900' : ''}>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="group block py-2.5 no-underline">
                <p className="text-[13px] leading-snug text-neutral-800 dark:text-neutral-200 group-hover:text-accent transition-colors">
                  {article.title}
                </p>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-600 mt-0.5 uppercase tracking-wide">
                  {article.source}
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function RnbSection() {
  return (
    <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
      <div className="flex items-stretch">
        <div className="flex-1 p-5 md:p-6 min-w-0">
          <p className="text-[12px] uppercase tracking-widest text-accent font-medium mb-4">new in r&b</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
            {RNB_TRACKS.map((track, i) => (
              <a key={track.title} href={track.url} target="_blank" rel="noopener noreferrer"
                className={[
                  'group flex items-center gap-3 py-2.5 no-underline hover:bg-accent/5 rounded px-1 -mx-1 transition-colors',
                  i < RNB_TRACKS.length - 2 ? 'border-b border-neutral-100 dark:border-neutral-900' : '',
                ].join(' ')}
              >
                <span className="text-[11px] text-neutral-300 dark:text-neutral-700 font-mono w-5 text-right flex-shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-neutral-800 dark:text-neutral-200 truncate group-hover:text-accent transition-colors">
                    {track.title}
                  </p>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-600 truncate">{track.artist}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="hidden sm:flex flex-shrink-0 items-end bg-white dark:bg-neutral-950 overflow-hidden">
          <CookingIllustration />
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// Root component — purely presentational, delegates logic to hook
// ─────────────────────────────────────────────────────────────────

export default function BriefingDashboard() {
  const { weather, news, summary, refreshing, refresh } = useBriefing()

  return (
    <div className="animate-fade-up flex flex-col gap-5">
      <h1 className="text-[12px] uppercase tracking-widest text-accent font-medium">briefing</h1>

      {/* Hero: clock + illustration */}
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden flex items-stretch">
        <div className="flex-1 p-5 md:p-6 flex flex-col justify-between">
          <LiveClock />
          <button onClick={refresh} disabled={refreshing}
            className="mt-5 self-start flex items-center gap-1.5 text-[12px] text-neutral-400 hover:text-accent disabled:opacity-40 transition-colors">
            <RefreshIcon spinning={refreshing} />
            <span>{refreshing ? 'loading…' : 'refresh'}</span>
          </button>
        </div>
        <div className="hidden sm:flex flex-shrink-0 items-end overflow-hidden">
          <DeskRunIllustration />
        </div>
      </div>

      {/* AI summary + bucket guy */}
      <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden flex items-stretch">
        <SummarySection state={summary} />
        <div className="hidden sm:flex flex-shrink-0 items-end justify-center overflow-hidden" style={{ width: 140 }}>
          <BucketGuyIllustration />
        </div>
      </div>

      {/* Weather + News */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
          <div className="flex items-stretch">
            <WeatherSection state={weather} />
            <div className="hidden sm:flex flex-shrink-0 items-end bg-white dark:bg-neutral-950 overflow-hidden">
              <FanManIllustration />
            </div>
          </div>
        </div>
        <NewsSection state={news} />
      </div>

      {/* R&B */}
      <RnbSection />
    </div>
  )
}
