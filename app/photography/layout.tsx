import type { Metadata } from 'next'

// photography/page.tsx is a client component, so its title is set here
// in a server-side segment layout instead.
export const metadata: Metadata = { title: 'Photography' }

export default function PhotographyLayout({ children }: { children: React.ReactNode }) {
  return children
}
