'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import DJDoodle from './DJDoodle'
import { activeLineIndex, type LyricLine } from '@/lib/lrc'

interface NowPlaying {
  isPlaying: boolean
  title: string | null
  artist: string
  album: string
  albumArt: string
  songUrl: string
  songId: string | null
  progressMs: number
  durationMs: number
}

/** Vertical placement of the active lyric line within the column (0–1). */
const ACTIVE_ANCHOR = 0.6
const LYRICS_HEIGHT = 300

interface Lyrics {
  /** Time-synced lines (preferred). */
  synced: LyricLine[]
  /** Plain text lines (fallback when no sync data exists). */
  plain: string[]
}

export default function SpotifyWidget() {
  const [data, setData] = useState<NowPlaying | null>(null)
  const [loading, setLoading] = useState(true)
  const [lyrics, setLyrics] = useState<Lyrics>({ synced: [], plain: [] })
  const [activeIdx, setActiveIdx] = useState(-1)
  const [scrollY, setScrollY] = useState(0)

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // Wall-clock basis for extrapolating playback position between polls.
  const basisRef = useRef<{ progressMs: number; at: number }>({ progressMs: 0, at: Date.now() })
  const activeLineRef = useRef<HTMLParagraphElement>(null)

  // The lines we actually render: synced text when available, else plain.
  const displayLines = lyrics.synced.length > 0
    ? lyrics.synced.map(l => l.text)
    : lyrics.plain
  const showLyrics = !!data?.isPlaying && displayLines.length > 0

  // ── Poll Spotify ──────────────────────────────────────────────
  const fetchNow = async () => {
    try {
      const res = await fetch('/api/spotify', { cache: 'no-store' })
      const d = await res.json()
      if (!d.error) {
        setData(d)
        basisRef.current = { progressMs: d.progressMs ?? 0, at: Date.now() }
      }
    } catch { /* keep last known state */ }
    setLoading(false)
  }

  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current)
    const delay = data?.isPlaying ? 10_000 : 60_000
    pollRef.current = setInterval(fetchNow, delay)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [data?.isPlaying])

  useEffect(() => { fetchNow() }, [])

  // ── Fetch lyrics whenever the playing track changes ───────────
  useEffect(() => {
    if (!data?.isPlaying || !data.title) { setLyrics({ synced: [], plain: [] }); return }
    let cancelled = false
    const params = new URLSearchParams({ artist: data.artist, title: data.title })
    fetch(`/api/lyrics?${params}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        if (cancelled) return
        setLyrics({
          synced: Array.isArray(d.synced) ? d.synced : [],
          plain: Array.isArray(d.plain) ? d.plain : [],
        })
      })
      .catch(() => { if (!cancelled) setLyrics({ synced: [], plain: [] }) })
    return () => { cancelled = true }
  }, [data?.songId, data?.isPlaying])

  // ── Advance the active line from playback position ────────────
  // Synced lyrics → exact timestamp match. Plain lyrics → estimate the
  // position proportionally from how far through the track we are.
  useEffect(() => {
    if (!showLyrics) { setActiveIdx(-1); return }
    const tick = () => {
      const posMs = basisRef.current.progressMs + (Date.now() - basisRef.current.at)
      if (lyrics.synced.length > 0) {
        setActiveIdx(activeLineIndex(lyrics.synced, posMs / 1000))
      } else {
        const duration = data?.durationMs || 1
        const ratio = Math.min(1, Math.max(0, posMs / duration))
        setActiveIdx(Math.min(lyrics.plain.length - 1, Math.floor(ratio * lyrics.plain.length)))
      }
    }
    tick()
    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  }, [showLyrics, lyrics, data?.durationMs])

  // ── Scroll so the active line sits at the anchor position ─────
  useEffect(() => {
    const el = activeLineRef.current
    if (!el) return
    const target = LYRICS_HEIGHT * ACTIVE_ANCHOR
    setScrollY(target - el.offsetTop - el.offsetHeight / 2)
  }, [activeIdx, showLyrics])

  if (loading) {
    return (
      <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2.5 w-full">
        <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        <div className="flex-1 space-y-1.5">
          <div className="h-2 w-16 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          <div className="h-3.5 w-32 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          <div className="h-2.5 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-stretch w-full">
      {/* ── Ambient synced lyrics ── */}
      {showLyrics && (
        <div
          className="relative overflow-hidden pointer-events-none select-none mb-2"
          style={{
            height: LYRICS_HEIGHT,
            maskImage: 'linear-gradient(to bottom, transparent, black 22%, black 78%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 22%, black 78%, transparent)',
          }}
          aria-hidden
        >
          <div
            className="absolute inset-x-0 px-1"
            style={{ transform: `translateY(${scrollY}px)`, transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            {displayLines.map((text, i) => {
              const isActive = i === activeIdx
              const distance = Math.abs(i - activeIdx)
              return (
                <p
                  key={i}
                  ref={isActive ? activeLineRef : null}
                  className="text-[13px] leading-[1.5] py-1 transition-all duration-500"
                  style={{
                    color: isActive ? '#1db954' : 'rgb(115 115 115)',
                    opacity: isActive ? 0.92 : Math.max(0.08, 0.3 - distance * 0.05),
                    fontWeight: isActive ? 500 : 400,
                    transform: isActive ? 'translateX(2px)' : 'none',
                  }}
                >
                  {text || '♪'}
                </p>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Now-playing card ── */}
      <div className="relative overflow-hidden flex items-center gap-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2.5 w-full hover:border-[#1db954] transition-all duration-150">
        <DJDoodle active={!!data?.isPlaying} />

        <a
          href={data?.songUrl || '#'}
          target="_blank"
          rel="noopener"
          aria-label="Open on Spotify"
          className="relative z-10 flex items-center gap-3 flex-1 min-w-0 no-underline"
        >
          <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden">
            {data?.albumArt ? (
              <Image src={data.albumArt} alt="album" width={48} height={48} className="object-cover" />
            ) : (
              <span className="text-lg">♫</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`flex items-center gap-1 text-[11px] uppercase tracking-wider font-medium ${data?.isPlaying ? 'text-[#1db954]' : 'text-neutral-400'}`}>
              <span className={`w-1 h-1 rounded-full flex-shrink-0 ${data?.isPlaying ? 'bg-[#1db954] animate-pulse-dot' : 'bg-neutral-400'}`} />
              {data?.isPlaying ? 'now playing' : 'last played'}
            </div>
            <p className="text-[15px] font-medium text-neutral-900 dark:text-neutral-100 truncate leading-tight mt-0.5">
              {data?.title || '—'}
            </p>
            <p className="text-[13px] text-neutral-400 truncate leading-tight">
              {data?.artist || ''}
            </p>
          </div>
        </a>

        {data?.songId && (
          <a
            href={data.songUrl}
            target="_blank"
            rel="noopener"
            aria-label="Listen along on Spotify"
            className="group/la relative z-10 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-[#1db954] hover:bg-[#1db954]/10 transition-colors"
          >
            <span className="pointer-events-none absolute bottom-full mb-1.5 right-0 whitespace-nowrap text-[11px] font-medium px-2 py-1 rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 opacity-0 group-hover/la:opacity-100 transition-opacity shadow-sm">
              listen along ♫
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
              <path d="M21 16a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2z" />
              <path d="M3 16a2 2 0 0 0 2 2h1v-5H5a2 2 0 0 0-2 2z" />
            </svg>
          </a>
        )}
      </div>
    </div>
  )
}
