import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import { ThemeProvider } from 'next-themes'
import LayoutShell from '@/components/LayoutShell'

export const metadata: Metadata = {
  // `template` lets each page set a short title that appends the brand.
  title: {
    default: 'Alvin Huang — Operations Strategy & Supply Chain',
    template: '%s · Alvin Huang',
  },
  description: 'Operations Associate II at Amazon. Building AKRO Cafe and Nori Japan. Open to full-time ops strategy roles.',
  openGraph: {
    title: 'Alvin Huang — Operations Strategy & Supply Chain',
    description: 'Operations Associate II at Amazon. Building AKRO Cafe and Nori Japan.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Plausible Analytics — activate by setting NEXT_PUBLIC_PLAUSIBLE_DOMAIN in .env */}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/plausible.js"
          />
        )}
      </head>
      <body className="bg-transparent dark:bg-neutral-950">
        {/* Skip link — first focusable element, lets keyboard users bypass nav (WCAG 2.4.1) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:px-4 focus:py-2 focus:rounded-md focus:bg-accent focus:text-white focus:text-[14px] focus:shadow-lg"
        >
          Skip to content
        </a>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <LayoutShell>{children}</LayoutShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
