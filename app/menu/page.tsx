import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Menu',
  description: 'AKRO Cafe pop-up menu — specialty coffee, matcha, and signature drinks.',
}

// The menu preserves the exact print design from the AKRO PDF. Each page is
// rendered to a high-resolution image (via pdftoppm) and displayed full-width
// so customers scanning the QR code see the original layout, lettering, and
// illustrations pixel-for-pixel. Re-export from the PDF with:
//   pdftoppm -png -r 220 public/akro/akro-menu.pdf public/akro/menu-page

const PAGE_W = 1518
const PAGE_H = 2156
const CREAM = '#f3f1ea' // matches the PDF page background so images blend in

const pages = [
  { src: '/akro/menu-page-1.png', alt: 'AKRO Cafe pop-up menu — specialties, classic espresso and matcha programs, house coffee and tea' },
  { src: '/akro/menu-page-2.png', alt: 'AKRO logo' },
]

export default function MenuPage() {
  return (
    <main
      style={{ backgroundColor: CREAM }}
      className="flex min-h-screen w-full flex-col items-center"
    >
      <div className="w-full max-w-[820px]">
        {pages.map((p) => (
          <Image
            key={p.src}
            src={p.src}
            alt={p.alt}
            width={PAGE_W}
            height={PAGE_H}
            priority={p.src.endsWith('menu-page-1.png')}
            quality={95}
            sizes="(max-width: 820px) 100vw, 820px"
            className="h-auto w-full"
          />
        ))}
      </div>
    </main>
  )
}
