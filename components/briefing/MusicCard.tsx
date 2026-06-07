'use client'

import { Card, Skeleton, ErrorNote } from './ui'
import type { Release } from './types'

export default function MusicCard({
  data,
  loading,
  error,
}: {
  data: Release[] | null
  loading: boolean
  error: string | null
}) {
  return (
    <Card label="New Music">
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-2.5 w-2/3" />
            </div>
          ))}
        </div>
      ) : error || !data?.length ? (
        <ErrorNote message={error || 'No new releases right now.'} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-4">
          {data.slice(0, 6).map((r) => (
            <a
              key={r.url}
              href={r.url}
              target="_blank"
              rel="noopener"
              className="group no-underline"
            >
              <div className="aspect-square w-full rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-2 relative">
                {r.image ? (
                  <img
                    src={r.image}
                    alt={r.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl text-neutral-300">♫</div>
                )}
              </div>
              <p className="text-[13px] font-medium leading-tight text-neutral-800 dark:text-neutral-200 truncate group-hover:text-accent transition-colors">
                {r.title}
              </p>
              <p className="text-[12px] text-neutral-400 dark:text-neutral-600 truncate">{r.artist}</p>
            </a>
          ))}
        </div>
      )}
    </Card>
  )
}
