'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'

const MAX_ZOOM = 4
const MIN_ZOOM = 1
const ZOOM_STEP = 0.5

type Photo = { src: string; alt: string; caption: string; w: number; h: number }

// Landscape film scans are 2000×1326; the newer 35mm frames are 1024×1452.
// Storing real dimensions lets next/image reserve correct space (no layout
// shift) and keeps every aspect ratio honest in the masonry.
// `caption` is the short, casual line shown on hover.
const photos: Photo[] = [
  { src: '/photography/times-square-knicks.jpeg',  alt: 'Knicks fan draped in a flag, Times Square at night — 35mm', caption: 'times square, midnight',     w: 1024, h: 1452 },
  { src: '/photography/000084010009.jpg',          alt: 'Pedestrians on a New York City sidewalk — 35mm film',      caption: 'sidewalk, nyc',          w: 2000, h: 1326 },
  { src: '/photography/botanical-brothers.jpeg',   alt: 'Botanical Brothers flower cart on Irving Place — 35mm',    caption: 'flower cart, irving pl',  w: 1024, h: 1452 },
  { src: '/photography/000084010017.jpg',          alt: 'Street corner in NYC, afternoon light — 35mm film',        caption: 'corner, afternoon light', w: 2000, h: 1326 },
  { src: '/photography/chinatown-fruit-stand.jpeg',alt: 'Late-night fruit stand in Chinatown — 35mm',               caption: 'chinatown fruit stand',   w: 1024, h: 1452 },
  { src: '/photography/nypd-cruiser.jpeg',         alt: 'NYPD cruiser on a tree-lined street — 35mm',               caption: 'quiet street',            w: 1024, h: 1452 },
  { src: '/photography/000084010019.jpg',          alt: 'Urban scene, New York City — 35mm film',                   caption: 'downtown blocks',         w: 2000, h: 1326 },
  { src: '/photography/pull-ahead-garage.jpeg',    alt: '“Pull Ahead” neon in a parking garage — 35mm',             caption: 'pull ahead',              w: 1024, h: 1452 },
  { src: '/photography/000084010029.jpg',          alt: 'City life captured on film, NYC — 35mm',                   caption: 'city in motion',          w: 2000, h: 1326 },
  { src: '/photography/noodle-bar-portrait.jpeg',  alt: 'A friend at a noodle bar with a Sapporo — 35mm',           caption: 'noodle bar, sapporo',     w: 1024, h: 1452 },
  { src: '/photography/uncle-lou-sign.jpeg',       alt: 'Uncle Lou neon sign, Chinatown at night — 35mm',           caption: 'uncle lou, chinatown',    w: 1024, h: 1452 },
  { src: '/photography/000084010031.jpg',          alt: 'Documentary street moment, New York City — 35mm film',     caption: 'a street moment',         w: 2000, h: 1326 },
  { src: '/photography/000084010036.jpg',          alt: 'Black and white street photograph, NYC — 35mm film',       caption: 'black & white street',    w: 2000, h: 1326 },
]

export default function PhotographyPage() {
  const [index, setIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  // Zoom + pan state for the expanded image.
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null)

  const open = index !== null
  const photo = open ? photos[index] : null

  useEffect(() => setMounted(true), [])

  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }) }
  const close = useCallback(() => setIndex(null), [])
  const next = useCallback(() => setIndex(i => (i === null ? i : (i + 1) % photos.length)), [])
  const prev = useCallback(() => setIndex(i => (i === null ? i : (i - 1 + photos.length) % photos.length)), [])

  const zoomIn = () => setZoom(z => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)))
  const zoomOut = () => setZoom(z => {
    const nz = Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2))
    if (nz === 1) setPan({ x: 0, y: 0 })
    return nz
  })

  // Reset zoom/pan whenever the photo changes or the viewer closes.
  useEffect(() => { resetView() }, [index])

  // Keyboard: Esc closes, arrows navigate, +/- zoom, 0 resets.
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === '+' || e.key === '=') zoomIn()
      else if (e.key === '-' || e.key === '_') zoomOut()
      else if (e.key === '0') resetView()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, close, next, prev])

  // Drag-to-pan handlers (only meaningful when zoomed in).
  const onPointerDown = (e: React.PointerEvent) => {
    if (zoom <= 1) return
    e.stopPropagation()
    setDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y }
    ;(e.currentTarget as Element).setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragStart.current) return
    setPan({
      x: dragStart.current.panX + (e.clientX - dragStart.current.x),
      y: dragStart.current.panY + (e.clientY - dragStart.current.y),
    })
  }
  const onPointerUp = () => { dragStart.current = null; setDragging(false) }

  const onWheel = (e: React.WheelEvent) => {
    setZoom(z => {
      const nz = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, +(z - e.deltaY * 0.002).toFixed(2)))
      if (nz === 1) setPan({ x: 0, y: 0 })
      return nz
    })
  }

  // Lock body scroll while the lightbox is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <div className="animate-fade-up">
      <h1 className="text-[12px] uppercase tracking-widest text-accent font-medium mb-7">photography</h1>
      <p className="text-[16px] text-neutral-500 dark:text-neutral-400 leading-[1.9] max-w-[440px] xl:max-w-[580px] mb-7">
        not a photographer — I just like carrying a film camera around. these are
        from wandering New York City, day and night.
      </p>

      <div className="columns-2 xl:columns-3 gap-3 max-w-[620px] xl:max-w-[900px] 2xl:max-w-[1040px] mb-8">
        {photos.map((p, i) => (
          <button
            key={p.src}
            className="relative block w-full break-inside-avoid mb-3 overflow-hidden rounded-sm cursor-zoom-in group p-0 border-0 bg-transparent"
            onClick={() => setIndex(i)}
            aria-label={`View larger: ${p.alt}`}
          >
            <Image
              src={p.src}
              alt={p.alt}
              width={p.w}
              height={p.h}
              sizes="(max-width: 1280px) 50vw, 33vw"
              style={{ width: '100%', height: 'auto' }}
              quality={82}
              className="transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            />
            {/* Subtle hover caption — centered over the photo */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="text-[13px] text-white tracking-wide lowercase px-4 text-center">{p.caption}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox — portaled to body so it escapes the zoomed <main> wrapper */}
      {mounted && open && photo && createPortal(
        <div
          className="fixed inset-0 z-[100] bg-black/93 backdrop-blur-sm flex items-center justify-center animate-lightbox-fade"
          onClick={close}
          onWheel={onWheel}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          {/* Close */}
          <button
            onClick={(e) => { e.stopPropagation(); close() }}
            aria-label="Close"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors z-10"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="2" y1="2" x2="16" y2="16" /><line x1="16" y1="2" x2="2" y2="16" />
            </svg>
          </button>

          {/* Zoom controls */}
          <div
            className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 flex items-center gap-1 rounded-full bg-white/10 backdrop-blur px-1 py-1"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={zoomOut}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Zoom out"
              className="w-8 h-8 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
            <button
              onClick={resetView}
              aria-label="Reset zoom"
              className="min-w-[44px] text-[12px] tabular-nums text-white/80 hover:text-white transition-colors"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              onClick={zoomIn}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Zoom in"
              className="w-8 h-8 flex items-center justify-center rounded-full text-white/80 hover:text-white hover:bg-white/15 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>
          </div>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            aria-label="Previous photo"
            className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors z-10"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </button>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            aria-label="Next photo"
            className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors z-10"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </button>

          {/* Wrapper carries the entrance animation; image carries zoom/pan so the
              two transforms don't collide. Click doesn't close; drag pans when
              zoomed; double-click toggles zoom. */}
          <div key={photo.src} className="animate-lightbox-zoom" onClick={(e) => e.stopPropagation()}>
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.w}
              height={photo.h}
              sizes="100vw"
              quality={92}
              draggable={false}
              onDoubleClick={() => { zoom > 1 ? resetView() : setZoom(2) }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              style={{
                maxWidth: '92vw',
                maxHeight: '86vh',
                width: 'auto',
                height: 'auto',
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transition: dragging ? 'none' : 'transform 0.22s ease',
                cursor: zoom > 1 ? (dragging ? 'grabbing' : 'grab') : 'default',
              }}
              className="rounded-sm shadow-2xl select-none"
            />
          </div>

          {/* Caption + counter */}
          <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-1 px-4 pointer-events-none">
            <span className="text-[13px] text-white/80 tracking-wide lowercase">{photo.caption}</span>
            <span className="text-[11px] text-white/40 tabular-nums tracking-widest">{index + 1} / {photos.length}</span>
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
