export default function Loading() {
  return (
    <div className="animate-fade-up max-w-[580px] space-y-4">
      <div className="h-2 w-20 rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-2 w-28 rounded bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
      <div className="h-6 w-64 rounded bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
      <div className="h-4 w-16 rounded-full bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
      <div className="space-y-2 pt-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-3 rounded bg-neutral-100 dark:bg-neutral-900 animate-pulse" style={{ width: `${65 + (i % 4) * 8}%` }} />
        ))}
      </div>
    </div>
  )
}
