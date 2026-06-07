'use client'

import { Skeleton, ErrorNote } from './ui'

export default function SummaryCard({
  summary,
  loading,
  error,
}: {
  summary: string | null
  loading: boolean
  error: string | null
}) {
  return (
    <section className="bg-accent/[0.06] dark:bg-accent/[0.10] border border-accent/20 rounded-xl p-5 md:p-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 animate-ping" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent" />
        </span>
        <p className="text-[12px] uppercase tracking-widest text-accent font-medium">Your Morning Briefing</p>
      </div>

      {loading ? (
        <div className="space-y-2.5">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ) : error || !summary ? (
        <ErrorNote message={error || 'Summary unavailable.'} />
      ) : (
        <p className="text-[16px] md:text-[17px] leading-[1.7] text-neutral-700 dark:text-neutral-200">
          {summary}
        </p>
      )}
    </section>
  )
}
