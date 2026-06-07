export default function Loading() {
  return (
    <div className="animate-fade-up space-y-3 max-w-[440px]">
      <div className="h-2 w-16 rounded bg-neutral-200 dark:bg-neutral-800" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-3 rounded bg-neutral-100 dark:bg-neutral-900 animate-pulse" style={{ width: `${75 + (i % 3) * 10}%` }} />
      ))}
    </div>
  )
}
