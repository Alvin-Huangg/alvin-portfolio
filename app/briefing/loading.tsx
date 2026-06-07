export default function Loading() {
  return (
    <div className="animate-fade-up max-w-3xl mx-auto flex flex-col gap-4">
      <div className="space-y-2">
        <div className="h-2.5 w-24 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
        <div className="h-8 w-56 rounded bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
      </div>
      <div className="h-28 rounded-xl bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-48 rounded-xl bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
        <div className="h-48 rounded-xl bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
        <div className="md:col-span-2 h-56 rounded-xl bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
      </div>
    </div>
  )
}
