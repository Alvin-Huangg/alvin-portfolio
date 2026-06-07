'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

type Photo = { src: string; alt: string; w: number; h: number }

// Landscape film scans are 2000×1326; the newer 35mm frames are 1024×1452.
// Storing real dimensions lets next/image reserve correct space (no layout
// shift) and keeps every aspect ratio honest in the masonry.
const photos: Photo[] = [
  { src: '/photography/times-square-knicks.jpeg',  alt: 'Knicks fan draped in a flag, Times Square at night — 35mm', w: 1024, h: 1452 },
  { src: '/photography/000084010009.jpg',          alt: 'Pedestrians on a New York City sidewalk — 35mm film',      w: 2000, h: 1326 },
  { src: '/photography/botanical-brothers.jpeg',   alt: 'Botanical Brothers flower cart on Irving Place — 35mm',    w: 1024, h: 1452 },
  { src: '/photography/000084010017.jpg',          alt: 'Street corner in NYC, afternoon light — 35mm film',        w: 2000, h: 1326 },
  { src: '/photography/chinatown-fruit-stand.jpeg',alt: 'Late-night fruit stand in Chinatown — 35mm',               w: 1024, h: 1452 },
  { src: '/photography/nypd-cruiser.jpeg',         alt: 'NYPD cruiser on a tree-lined street — 35mm',               w: 1024, h: 1452 },
  { src: '/photography/000084010019.jpg',          alt: 'Urban scene, New York City — 35mm film',                   w: 2000, h: 1326 },
  { src: '/photography/pull-ahead-garage.jpeg',    alt: '“Pull Ahead” neon in a parking garage — 35mm',             w: 1024, h: 1452 },
  { src: '/photography/000084010029.jpg',          alt: 'City life captured on film, NYC — 35mm',                   w: 2000, h: 1326 },
  { src: '/photography/noodle-bar-portrait.jpeg',  alt: 'A friend at a noodle bar with a Sapporo — 35mm',           w: 1024, h: 1452 },
  { src: '/photography/uncle-lou-sign.jpeg',       alt: 'Uncle Lou neon sign, Chinatown at night — 35mm',           w: 1024, h: 1452 },
  { src: '/photography/000084010031.jpg',          alt: 'Documentary street moment, New York City — 35mm film',     w: 2000, h: 1326 },
  { src: '/photography/000084010036.jpg',          alt: 'Black and white street photograph, NYC — 35mm film',       w: 2000, h: 1326 },
]

export default function PhotographyPage() {
  const [lightbox, setLightbox] = useState<Photo | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Lock body scroll while the lightbox is open.
  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  return (
    <div className="animate-fade-up">
      <h1 className="text-[12px] uppercase tracking-widest text-accent font-medium mb-7">photography</h1>
      <p className="text-[16px] text-neutral-500 dark:text-neutral-400 leading-[1.9] max-w-[440px] xl:max-w-[580px] mb-7">
        I shoot on film. these are from around New York City — color and black &amp; white,
        35mm. day and night, mostly just wandering with a camera.
      </p>

      <div className="columns-2 xl:columns-3 gap-3 max-w-[620px] xl:max-w-[900px] 2xl:max-w-[1040px] mb-8">
        {photos.map((photo) => (
          <button
            key={photo.src}
            className="block w-full break-inside-avoid mb-3 overflow-hidden rounded-sm cursor-zoom-in group p-0 border-0 bg-transparent"
            onClick={() => setLightbox(photo)}
            aria-label={`View larger: ${photo.alt}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.w}
              height={photo.h}
              sizes="(max-width: 1280px) 50vw, 33vw"
              style={{ width: '100%', height: 'auto' }}
              quality={82}
              className="transition-opacity duration-200 group-hover:opacity-80"
            />
          </button>
        ))}
      </div>

      <div className="max-w-[440px] xl:max-w-[580px]">
        {[
          ['genre', 'street, documentary'],
          ['medium', '35mm film, color & b&w'],
          ['location', 'New York City'],
          ['frames', `${photos.length}`],
        ].map(([k, v], i) => (
          <div key={k} className={`flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-900 text-[15px] gap-4 ${i === 0 ? 'border-t border-neutral-100 dark:border-neutral-900' : ''}`}>
            <span className="text-neutral-400 dark:text-neutral-600">{k}</span>
            <span className="text-neutral-500 dark:text-neutral-400">{v}</span>
          </div>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 bg-black/92 z-50 flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
        >
          <Image
            src={lightbox.src}
            alt={lightbox.alt}
            width={lightbox.w}
            height={lightbox.h}
            sizes="100vw"
            style={{ maxWidth: '100%', maxHeight: '88vh', width: 'auto', height: 'auto' }}
            quality={90}
            className="rounded-sm"
          />
          <p className="absolute bottom-5 left-0 right-0 text-center text-white/40 text-[13px] tracking-wider px-4">
            {lightbox.alt} · click anywhere to close
          </p>
        </div>
      )}
    </div>
  )
}
