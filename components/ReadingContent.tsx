'use client'

// ─── UPDATE THIS LIST with your actual reads ───────────────────────────────
// Each entry: title, source, url, category, optional note
// Categories: 'business' | 'mindset' | 'culture' | 'tech' | 'ops'
// ──────────────────────────────────────────────────────────────────────────

interface Article {
  title: string
  source: string
  url: string
  category: 'business' | 'mindset' | 'culture' | 'tech' | 'ops'
  note?: string
}

const articles: Article[] = [
  // ─── add your reads below ───
  {
    title: 'Add your first article here',
    source: 'Substack',
    url: '#',
    category: 'business',
    note: 'replace this with something you actually read and loved',
  },
]

const catStyle: Record<string, string> = {
  business: 'bg-accent/10 text-accent',
  mindset:  'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300',
  culture:  'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300',
  tech:     'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300',
  ops:      'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
}

export default function ReadingContent() {
  return (
    <div className="p-5 md:p-6 flex-1 overflow-y-auto">
      <p className="text-[12px] uppercase tracking-widest text-accent font-medium mb-1">reading</p>
      <p className="text-[14px] text-neutral-400 dark:text-neutral-600 mb-6 leading-relaxed">
        articles, newsletters, and things worth bookmarking — mostly from Substack.
      </p>

      <div className="space-y-0">
        {articles.map((a, i) => (
          <div
            key={i}
            className={`py-4 border-b border-neutral-100 dark:border-neutral-900 group ${
              i === 0 ? 'border-t border-neutral-100 dark:border-neutral-900' : ''
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${catStyle[a.category]}`}>
                {a.category}
              </span>
              <span className="text-[12px] text-neutral-400 dark:text-neutral-600">{a.source}</span>
            </div>
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[15px] font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-accent transition-colors mb-1 leading-snug"
            >
              {a.title} →
            </a>
            {a.note && (
              <p className="text-[13px] text-neutral-400 dark:text-neutral-600 italic leading-relaxed">
                "{a.note}"
              </p>
            )}
          </div>
        ))}
      </div>

      {articles.length <= 1 && (
        <p className="text-[13px] text-neutral-300 dark:text-neutral-700 mt-6 italic">
          more coming soon — updating this as I read.
        </p>
      )}
    </div>
  )
}
