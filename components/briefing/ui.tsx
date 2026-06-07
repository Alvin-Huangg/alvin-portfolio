// Small shared building blocks so every briefing card looks consistent
// and matches the rest of the portfolio (accent green, soft borders, Geist).

export function Card({
  label,
  children,
  className = '',
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={`bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 md:p-6 ${className}`}
    >
      <p className="text-[12px] uppercase tracking-widest text-accent font-medium mb-4">{label}</p>
      {children}
    </section>
  )
}

// Tailwind's animate-pulse on a neutral block — the project's standard skeleton.
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-neutral-100 dark:bg-neutral-800 rounded animate-pulse ${className}`} />
}

export function ErrorNote({ message }: { message: string }) {
  return <p className="text-[13px] text-neutral-400 dark:text-neutral-600 leading-relaxed">{message}</p>
}

// "2h ago" style relative time for news + releases.
export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const mins = Math.round((Date.now() - then) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  return `${days}d ago`
}
