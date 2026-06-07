export default function Loading() {
  return (
    <div className="animate-fade-up">
      <div className="h-2 w-20 rounded bg-neutral-200 dark:bg-neutral-800 mb-6" />
      <div className="grid grid-cols-2 gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-square rounded-lg bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
        ))}
      </div>
    </div>
  )
}
