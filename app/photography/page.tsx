'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

const photos = [
  { src: '/photography/000084010009.jpg', alt: 'Pedestrians on a New York City sidewalk — 35mm film' },
  { src: '/photography/000084010017.jpg', alt: 'Street corner in NYC, afternoon light — 35mm film' },
  { src: '/photography/000084010019.jpg', alt: 'Urban scene, New York City — 35mm film' },
  { src: '/photography/000084010029.jpg', alt: 'City life captured on film, NYC — 35mm' },
  { src: '/photography/000084010031.jpg', alt: 'Documentary street moment, New York City — 35mm film' },
  { src: '/photography/000084010036.jpg', alt: 'Black and white street photograph, NYC — 35mm film' },
]

export default function PhotographyPage() {
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="animate-fade-up">
      <h1 className="text-[12px] uppercase tracking-widest text-accent font-medium mb-7">photography</h1>
      <p className="text-[16px] text-neutral-500 dark:text-neutral-400 leading-[1.9] max-w-[440px] xl:max-w-[580px] mb-7">
        I shoot on film. these are from a recent trip to NYC — black and white, 35mm.
      </p>

      <div className="columns-1 sm:columns-2 gap-3 max-w-[620px] xl:max-w-[820px] 2xl:max-w-[960px] mb-8">
        {photos.map((photo, i) => (
          <div
            key={i}
            className="break-inside-avoid mb-3 overflow-hidden rounded-sm cursor-pointer group"
            onClick={() => setLightbox(photo.src)}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={6774}
              height={4492}
              style={{ width: '100%', height: 'auto' }}
              quality={85}
              className="transition-opacity duration-200 group-hover:opacity-75"
            />
          </div>
        ))}
      </div>

      <div className="max-w-[440px] xl:max-w-[580px]">
        {[
          ['genre', 'street, documentary'],
          ['medium', '35mm film, black & white'],
          ['location', 'New York City'],
        ].map(([k, v], i) => (
          <div key={k} className={`flex justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-900 text-[15px] gap-4 ${i === 0 ? 'border-t border-neutral-100 dark:border-neutral-900' : ''}`}>
            <span className="text-neutral-400 dark:text-neutral-600">{k}</span>
            <span className="text-neutral-500 dark:text-neutral-400">{v}</span>
          </div>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 bg-black/92 z-50 flex items-center justify-center p-8 cursor-pointer"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Photo lightbox"
        >
          <Image
            src={lightbox}
            alt="NYC — 35mm"
            width={6774}
            height={4492}
            style={{ maxWidth: '100%', maxHeight: '90vh', width: 'auto', height: 'auto' }}
            quality={90}
            className="rounded-sm"
          />
          <p className="absolute bottom-5 text-white/40 text-[13px] tracking-wider">click anywhere to close</p>
        </div>
      )}
    </div>
  )
}
