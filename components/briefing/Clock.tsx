'use client'

import { useEffect, useState } from 'react'

// Live clock for the top of the dashboard. Renders nothing until mounted
// to avoid a server/client hydration mismatch on the time string.
export default function Clock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const greeting = (() => {
    const h = now?.getHours() ?? 8
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  })()

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[12px] uppercase tracking-widest text-accent font-medium mb-1.5">{greeting}</p>
        <h1 className="text-[26px] md:text-[32px] font-medium leading-tight text-neutral-900 dark:text-neutral-100">
          {now
            ? now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
            : ' '}
        </h1>
      </div>
      <p className="font-mono text-[22px] md:text-[26px] tabular-nums text-neutral-500 dark:text-neutral-400">
        {now
          ? now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' })
          : ' '}
      </p>
    </div>
  )
}
