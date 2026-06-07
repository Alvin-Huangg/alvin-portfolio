'use client'

import { Card, Skeleton, ErrorNote, timeAgo } from './ui'
import type { Article } from './types'

export default function NewsCard({
  data,
  loading,
  error,
}: {
  data: Article[] | null
  loading: boolean
  error: string | null
}) {
  return (
    <Card label="Top News">
      {loading ? (
        <div className="space-y-3.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-28" />
            </div>
          ))}
        </div>
      ) : error || !data?.length ? (
        <ErrorNote message={error || 'No headlines right now.'} />
      ) : (
        <ul>
          {data.map((a, i) => (
            <li key={a.url}>
              <a
                href={a.url}
                target="_blank"
                rel="noopener"
                className={`group block py-2.5 no-underline border-neutral-100 dark:border-neutral-900 ${
                  i > 0 ? 'border-t' : ''
                }`}
              >
                <p className="text-[14px] leading-snug text-neutral-800 dark:text-neutral-200 group-hover:text-accent transition-colors">
                  {a.title}
                </p>
                <p className="text-[12px] text-neutral-400 dark:text-neutral-600 mt-1">
                  {a.source}
                  {a.publishedAt && ` · ${timeAgo(a.publishedAt)}`}
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
