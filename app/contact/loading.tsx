export default function Loading() {
  return (
    <div className="animate-fade-up space-y-4 max-w-[440px]">
      <div className="h-2 w-20 rounded bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-4 w-64 rounded bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-10 rounded-lg bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
      ))}
    </div>
  )
}
