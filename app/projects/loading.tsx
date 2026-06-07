export default function Loading() {
  return (
    <div className="animate-fade-up space-y-4">
      <div className="h-2 w-16 rounded bg-neutral-200 dark:bg-neutral-800" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-24 rounded-xl bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
      ))}
    </div>
  )
}
