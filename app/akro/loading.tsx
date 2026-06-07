export default function Loading() {
  return (
    <div className="animate-fade-up space-y-4 max-w-[440px]">
      <div className="h-2 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-5 w-48 rounded bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-3 rounded bg-neutral-100 dark:bg-neutral-900 animate-pulse" style={{ width: `${70 + (i % 3) * 10}%` }} />
      ))}
    </div>
  )
}
