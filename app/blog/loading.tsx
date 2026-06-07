export default function Loading() {
  return (
    <div className="animate-fade-up">
      <div className="h-2 w-8 rounded bg-neutral-200 dark:bg-neutral-800 mb-5" />
      <div className="flex border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden" style={{ height: 'calc(100vh - 160px)', minHeight: '500px' }}>
        <div className="w-[155px] flex-shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950" />
        <div className="w-[200px] flex-shrink-0 border-r border-neutral-200 dark:border-neutral-800 p-3 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 rounded bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
          ))}
        </div>
        <div className="flex-1 p-6">
          <div className="h-3 w-24 rounded bg-neutral-100 dark:bg-neutral-900 animate-pulse mb-8 mx-auto mt-4" />
        </div>
      </div>
    </div>
  )
}
