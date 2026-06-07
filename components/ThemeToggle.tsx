'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-10 h-6" />

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`relative w-10 h-6 rounded-full border-none outline-none cursor-pointer transition-colors duration-250 shadow-inner flex-shrink-0 ${
        isDark ? 'bg-accent' : 'bg-neutral-300'
      }`}
      title="Toggle dark mode"
      aria-label="Toggle dark mode"
    >
      <span
        className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-transform duration-250 ${
          isDark ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
