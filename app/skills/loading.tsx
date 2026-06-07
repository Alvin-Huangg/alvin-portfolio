export default function Loading() {
  return (
    <div className="animate-fade-up space-y-3 max-w-[440px]">
      <div className="h-2 w-12 rounded bg-neutral-200 dark:bg-neutral-800" />
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-8 rounded-lg bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
      ))}
    </div>
  )
}
