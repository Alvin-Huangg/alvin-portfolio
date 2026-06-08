'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  {
    group: 'intro',
    items: [
      { href: '/', label: 'about me', sub: "hi, I'm Alvin" },
      { href: '/skills', label: 'skills', sub: 'what I work with' },
    ],
  },
  {
    group: 'work',
    items: [
      { href: '/akro', label: 'akro cafe 🏗️', sub: 'current project' },
      { href: '/projects', label: 'other projects', sub: 'amazon, nori & more' },
    ],
  },
  {
    group: 'creative',
    items: [
      { href: '/photography', label: 'photography', sub: 'through the lens' },
      { href: '/blog', label: 'blog', sub: 'notes & thoughts' },
      { href: '/briefing', label: 'briefing', sub: 'daily snapshot' },
    ],
  },
  {
    group: 'contact',
    items: [
      { href: '/contact', label: 'get in touch', sub: 'open to opportunities' },
    ],
  },
]

export default function Sidebar({ hidden, onClose }: { hidden?: boolean; onClose?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className={`
      flex flex-col flex-shrink-0
      border-r border-neutral-200 dark:border-neutral-800
      transition-all duration-300
      fixed md:sticky
      top-0 md:top-11
      left-0
      h-screen md:h-[calc(100vh-44px)]
      z-50 md:z-auto
      bg-[#f7f4f0] dark:bg-neutral-950 md:bg-transparent
      ${hidden
        ? 'w-[80vw] max-w-[300px] md:max-w-none -translate-x-full md:translate-x-0 md:w-0 md:border-r-0 md:overflow-hidden md:opacity-0'
        : 'w-[80vw] max-w-[300px] md:max-w-none translate-x-0 md:w-[190px] xl:w-[220px] 2xl:w-[260px] 3xl:w-[300px]'
      }
    `}>

      {/* Mobile header with close button */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 md:hidden flex-shrink-0">
        <span className="text-[15px] font-medium text-accent">Alvin Huang</span>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-8 md:py-12 px-5 md:px-0 md:pr-7 2xl:pr-10">
        {/* Desktop name/title — hidden on mobile (shown in header above) */}
        <p className="text-[16px] font-medium text-accent mb-0.5 hidden md:block">Alvin Huang</p>
        <p className="text-[14px] text-neutral-400 dark:text-neutral-600 leading-relaxed mb-8 md:mb-10 hidden md:block">
          operations strategy &<br />supply chain
        </p>

        {nav.map((group) => (
          <div key={group.group} className="mb-7">
            <p className="text-[12px] uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-2">
              {group.group}
            </p>
            {group.items.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => { if (window.innerWidth < 768) onClose?.() }}
                  className={`block py-1.5 px-2.5 -mx-2.5 rounded-md group transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
                    isActive
                      ? 'bg-accent/10 dark:bg-accent/15'
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                  }`}
                >
                  <span className={`text-[15px] block transition-colors duration-150 ${
                    isActive
                      ? 'font-medium text-accent'
                      : 'text-neutral-800 dark:text-neutral-200 group-hover:text-accent'
                  }`}>
                    {item.label}
                  </span>
                  <span className="text-[13px] text-neutral-400 dark:text-neutral-600 block">
                    {item.sub}
                  </span>
                </Link>
              )
            })}
          </div>
        ))}

        {/* Persistent CTA — always visible, no hunting for contact */}
        <div className="mt-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-accent mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot flex-shrink-0" />
            open to full-time roles
          </div>
          <Link
            href="/contact"
            onClick={() => { if (window.innerWidth < 768) onClose?.() }}
            className="block text-[13px] text-neutral-500 dark:text-neutral-400 hover:text-accent transition-colors mb-1"
          >
            get in touch →
          </Link>
          <a
            href="/resume.pdf"
            download
            className="block text-[13px] text-neutral-500 dark:text-neutral-400 hover:text-accent transition-colors"
          >
            download resume →
          </a>
        </div>
      </div>
    </nav>
  )
}
