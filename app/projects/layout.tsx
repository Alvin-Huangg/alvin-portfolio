import type { Metadata } from 'next'

// projects/page.tsx is a client component, so its title is set here
// in a server-side segment layout instead.
export const metadata: Metadata = { title: 'Projects' }

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return children
}
