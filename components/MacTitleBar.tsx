'use client'

import { useEffect, useState } from 'react'
import ThemeToggle from './ThemeToggle'

interface Props {
  sidebarHidden: boolean
  onToggleSidebar: () => void
}

export default function MacTitleBar({ sidebarHidden, onToggleSidebar }: Props) {
  const [time, setTime] = useState('')
  const [shortTime, setShortTime] = useState('')

  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      const months = ['January','February','March','April','May','June','July','August','September','October','November','December']
      const shortMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      let h = now.getHours()
      const m = now.getMinutes().toString().padStart(2, '0')
      const ap = h >= 12 ? 'PM' : 'AM'
      h = h % 12 || 12
      setTime(`${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()} at ${h}:${m} ${ap}`)
      setShortTime(`${shortMonths[now.getMonth()]} ${now.getDate()} · ${h}:${m} ${ap}`)
    }
    updateClock()
    const interval = setInterval(updateClock, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="h-11 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-50 backdrop-blur-md bg-white/85 dark:bg-neutral-950/85 transition-colors">
      <div className="max-w-[920px] xl:max-w-[1200px] 2xl:max-w-[1500px] 3xl:max-w-[1900px] 4xl:max-w-[2200px] mx-auto w-full px-4 md:px-8 h-full flex items-center relative">
        {/* Mac dots — left. before:-inset expands the click target past the 11px visual (Fitts's law). */}
        <div className="flex items-center gap-[6px]">
          <button
            onClick={() => window.open('https://www.linkedin.com/in/alvinhuangxi/', '_blank')}
            className="w-[11px] h-[11px] rounded-full bg-[#ff5f57] border border-[#e0443e] group relative flex items-center justify-center cursor-pointer before:content-[''] before:absolute before:-inset-[6px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
            title="Open LinkedIn"
            aria-label="Open LinkedIn profile in a new tab"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[6px] font-bold text-black/60 transition-opacity">✕</span>
          </button>
          <button
            onClick={onToggleSidebar}
            className="w-[11px] h-[11px] rounded-full bg-[#febc2e] border border-[#d4a017] group relative flex items-center justify-center cursor-pointer before:content-[''] before:absolute before:-inset-[6px] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
            title="Toggle sidebar"
            aria-label="Toggle navigation sidebar"
          >
            <span className="opacity-0 group-hover:opacity-100 text-[9px] font-bold text-black/60 transition-opacity leading-none">−</span>
          </button>
          <div className="w-[11px] h-[11px] rounded-full bg-[#28c840] border border-[#1aab29]" aria-hidden="true" />
        </div>

        {/* Date — absolute center, short on mobile */}
        <span className="absolute left-1/2 -translate-x-1/2 text-[12px] md:text-[14px] font-medium text-neutral-400 dark:text-neutral-600 select-none whitespace-nowrap pointer-events-none">
          <span className="hidden md:inline">{time}</span>
          <span className="md:hidden">{shortTime}</span>
        </span>

        {/* Toggle — right side */}
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
