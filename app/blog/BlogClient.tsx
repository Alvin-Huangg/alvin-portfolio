'use client'

import { useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import ReadingContent from '@/components/ReadingContent'

const TravelMap = dynamic(() => import('@/components/TravelMap'), { ssr: false })

export type Post = {
  _id: string
  title: string
  slug: string
  category: string
  publishedAt: string
  excerpt?: string
  body?: any[]
  htmlBody?: string
}

const folders = [
  { id: 'all',     label: 'all notes', icon: '📝' },
  { id: 'thoughts',label: 'thoughts',  icon: '💭' },
  { id: 'reading', label: 'reading',   icon: '📖' },
  { id: 'travel',  label: 'travel',    icon: '🗺️' },
  { id: 'music',   label: 'music',     icon: '🎵' },
  { id: 'news',    label: 'top news',  icon: '📰' },
]

// folders that skip the note list and render a full-pane view
const SPECIAL_FOLDERS = new Set(['music', 'travel', 'reading', 'news'])

const catClass: Record<string, string> = {
  travel:   'bg-accent/10 text-accent',
  thoughts: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300',
  music:    'bg-green-50 text-[#1db954] dark:bg-green-950',
  reading:  'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300',
}

type MobilePanel = 'folders' | 'list' | 'content'

export default function BlogClient({ posts: initialPosts }: { posts: Post[] }) {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [folder, setFolder] = useState('all')
  const [selected, setSelected] = useState<Post | null>(null)
  const [musicLoaded, setMusicLoaded] = useState(false)
  const [musicData, setMusicData] = useState<any>(null)
  const [newsLoaded, setNewsLoaded] = useState(false)
  const [newsData, setNewsData] = useState<{ title: string; url: string; publishedAt: string | null; source: string }[] | null>(null)
  const [newsError, setNewsError] = useState<string | null>(null)
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('folders')
  const [expanded, setExpanded] = useState(false)

  // Admin + composer state
  const [isAdmin, setIsAdmin] = useState(false)
  const [composing, setComposing] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminPw, setAdminPw] = useState('')
  const [adminPwError, setAdminPwError] = useState(false)
  const [adminPwStored, setAdminPwStored] = useState('')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setExpanded(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const loadMusic = async () => {
    if (musicLoaded) return
    try {
      const [a, r, t] = await Promise.all([
        fetch('/api/spotify-music?type=top-artists-short').then(r => r.json()),
        fetch('/api/spotify-music?type=recent').then(r => r.json()),
        fetch('/api/spotify-music?type=top-tracks').then(r => r.json()),
      ])
      setMusicData({ artists: a.artists, recent: r.tracks, topTracks: t.tracks })
      setMusicLoaded(true)
    } catch {}
  }

  const loadNews = async () => {
    if (newsLoaded) return
    try {
      const res = await fetch('/api/finance-news')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setNewsData(data.articles)
    } catch (e: any) {
      setNewsError(e.message || 'could not load news')
    } finally {
      setNewsLoaded(true)
    }
  }

  const filtered = folder === 'all' ? posts : posts.filter(p => p.category === folder)
  const counts = {
    all:      posts.length,
    thoughts: posts.filter(p => p.category === 'thoughts').length,
  }

  const handleFolderSelect = (id: string) => {
    setFolder(id)
    setSelected(null)
    setExpanded(false)
    if (id === 'music') loadMusic()
    if (id === 'news') loadNews()
    setMobilePanel(SPECIAL_FOLDERS.has(id) ? 'content' : 'list')
  }

  const handleNoteSelect = (post: Post) => {
    setSelected(post)
    setComposing(false)
    setExpanded(false)
    setMobilePanel('content')
  }

  const handleNewNote = () => {
    if (isAdmin) {
      setComposing(true)
      setSelected(null)
      setMobilePanel('content')
    } else {
      setShowAdminLogin(true)
    }
  }

  const handleAdminLogin = async () => {
    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPw }),
      })
      if (res.ok) {
        setIsAdmin(true)
        setAdminPwStored(adminPw)
        setShowAdminLogin(false)
        setAdminPw('')
        setComposing(true)
        setSelected(null)
        setMobilePanel('content')
      } else {
        setAdminPwError(true)
        setAdminPw('')
      }
    } catch {
      setAdminPwError(true)
    }
  }

  const handlePublish = async (draft: { title: string; category: string; excerpt: string; body: string }, imageAssetIds: string[]) => {
    const res = await fetch('/api/create-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: adminPwStored, ...draft, imageAssetIds }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Failed to publish')
    }
    const { id, slug } = await res.json()
    const newPost: Post = {
      _id: id,
      title: draft.title,
      slug,
      category: draft.category,
      publishedAt: new Date().toISOString(),
      excerpt: draft.excerpt,
    }
    setPosts(prev => [newPost, ...prev])
    setComposing(false)
    setSelected(newPost)
    router.refresh()
  }

  return (
    <div className="animate-fade-up flex flex-col">
      <h1 className="text-[12px] uppercase tracking-widest text-accent font-medium mb-4 md:mb-6">blog</h1>

      <div
        className="flex border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden"
        style={{ height: 'calc((100vh - 200px) / 1.08)', minHeight: '420px' }}
      >
        {/* ── FOLDERS ── */}
        <div className={`
          flex-shrink-0 border-r border-neutral-200 dark:border-neutral-800
          bg-neutral-50 dark:bg-neutral-950 py-3 overflow-y-auto
          ${mobilePanel === 'folders' ? 'flex flex-col' : 'hidden'}
          md:flex md:flex-col
          w-full md:w-[155px]
        `}>
          <p className="text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-600 font-medium px-3 pb-2">notes</p>
          {folders.map(f => (
            <button
              key={f.id}
              onClick={() => handleFolderSelect(f.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 md:py-1.5 mx-1 rounded-md text-[14px] md:text-[13px] transition-colors text-left ${folder === f.id ? 'bg-accent text-white' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800'}`}
              style={{ width: 'calc(100% - 8px)' }}
            >
              <span className="flex items-center gap-2">{f.icon} {f.label}</span>
              {!SPECIAL_FOLDERS.has(f.id) && (
                <span className={`text-[12px] ${folder === f.id ? 'text-white/65' : 'text-neutral-400 dark:text-neutral-600'}`}>
                  {counts[f.id as keyof typeof counts] ?? ''}
                </span>
              )}
            </button>
          ))}

        </div>

        {/* ── NOTE LIST ── */}
        <div className={`
          flex-shrink-0 border-r border-neutral-200 dark:border-neutral-800
          overflow-y-auto bg-white dark:bg-neutral-950
          ${mobilePanel === 'list' ? 'flex flex-col' : 'hidden'}
          ${SPECIAL_FOLDERS.has(folder) ? 'md:hidden' : 'md:flex md:flex-col'}
          w-full md:w-[175px]
        `}>
          <div className="sticky top-0 bg-white dark:bg-neutral-950 px-3 py-2.5 border-b border-neutral-100 dark:border-neutral-900 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobilePanel('folders')}
                className="md:hidden text-neutral-400 hover:text-accent transition-colors p-1 -ml-1"
                aria-label="Back to folders"
              >←</button>
              <span className="text-[15px] font-medium">{folder === 'all' ? 'all notes' : folder}</span>
            </div>
            {/* New note button */}
            {folder !== 'music' && folder !== 'news' && (
              <button
                onClick={handleNewNote}
                className="flex items-center gap-1 text-[12px] text-neutral-400 hover:text-accent transition-colors px-1.5 py-0.5 rounded hover:bg-accent/5"
                title={isAdmin ? 'write a new note' : 'sign in to write'}
              >
                <span className="text-[15px] leading-none">+</span>
              </button>
            )}
          </div>

          {folder === 'music' || folder === 'news' ? (
            <p className="text-[13px] text-neutral-400 p-3 text-center">{folder} is in the main view</p>
          ) : filtered.length === 0 && !composing ? (
            <p className="text-[13px] text-neutral-400 p-3 text-center">no notes yet</p>
          ) : (
            filtered.map(p => {
              const d = new Date(p.publishedAt)
              const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              return (
                <div
                  key={p._id}
                  onClick={() => handleNoteSelect(p)}
                  className={`px-3 py-3 border-b border-neutral-100 dark:border-neutral-900 cursor-pointer transition-colors ${selected?._id === p._id && !composing ? 'bg-accent/10' : 'hover:bg-neutral-50 dark:hover:bg-neutral-900'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${catClass[p.category] || ''}`}>{p.category}</span>
                    <span className="text-[11px] text-neutral-400">{dateStr}</span>
                  </div>
                  <p className="text-[14px] font-medium truncate">{p.title}</p>
                  {p.excerpt && <p className="text-[13px] text-neutral-400 truncate">{p.excerpt}</p>}
                </div>
              )
            })
          )}
        </div>

        {/* ── CONTENT ── */}
        <div className={`
          flex-1 overflow-y-auto bg-white dark:bg-neutral-950 min-w-0
          ${mobilePanel === 'content' ? 'flex flex-col' : 'hidden'}
          md:flex md:flex-col
        `}>
          {composing ? (
            <NoteComposer
              onPublish={handlePublish}
              onCancel={() => setComposing(false)}
              adminPassword={adminPwStored}
            />
          ) : folder === 'travel' ? (
            <TravelMap />
          ) : folder === 'reading' ? (
            <ReadingContent />
          ) : folder === 'music' ? (
            <div className="p-5 md:p-6 flex-1 overflow-y-auto">
              <MusicContent data={musicData} />
            </div>
          ) : folder === 'news' ? (
            <div className="p-5 md:p-6">
              <FinanceNewsContent articles={newsData} loading={!newsLoaded} error={newsError} />
            </div>
          ) : selected ? (
            <div className="p-5 md:p-6 relative">
              {/* Mobile back button — top left */}
              <button
                onClick={() => setMobilePanel('list')}
                className="md:hidden flex items-center gap-1 text-[13px] text-neutral-400 hover:text-accent transition-colors mb-4"
              >
                ← back to notes
              </button>

              {/* Expand button — top right */}
              <button
                onClick={() => setExpanded(true)}
                title="expand note"
                className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-md text-neutral-300 dark:text-neutral-600 hover:text-accent dark:hover:text-accent hover:bg-accent/8 transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="8,1 12,1 12,5" />
                  <polyline points="5,12 1,12 1,8" />
                  <line x1="12" y1="1" x2="7.5" y2="5.5" />
                  <line x1="1" y1="12" x2="5.5" y2="7.5" />
                </svg>
              </button>

              <p className="text-[13px] text-neutral-400 mb-2">
                {new Date(selected.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <h2 className="text-[20px] font-medium mb-1.5 leading-tight">{selected.title}</h2>
              <div className="flex items-center gap-3 mb-5">
                <span className={`text-[13px] px-2 py-0.5 rounded-full ${catClass[selected.category] || ''}`}>{selected.category}</span>
                {selected.slug && (
                  <Link href={`/blog/${selected.slug}`} className="text-[13px] text-neutral-400 hover:text-accent transition-colors">
                    permalink →
                  </Link>
                )}
              </div>
              <div className="text-[15px] text-neutral-500 dark:text-neutral-400 leading-[1.9]">
                {selected.htmlBody ? (
                  <div className="blog-prose" dangerouslySetInnerHTML={{ __html: selected.htmlBody }} />
                ) : selected.body ? (
                  <div className="prose prose-sm max-w-none"><PortableText value={selected.body} /></div>
                ) : (
                  <p>{selected.excerpt}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <p className="text-[15px] text-neutral-500 dark:text-neutral-400 mb-1">pick a note to read</p>
              <p className="text-[13px] text-neutral-400 dark:text-neutral-600">select from the list on the left</p>
            </div>
          )}
        </div>
      </div>

      {/* Expanded note modal */}
      {expanded && selected && (
        <div
          className="fixed inset-0 bg-black/55 dark:bg-black/75 z-50 flex items-center justify-center p-6 md:p-16"
          onClick={(e) => { if (e.target === e.currentTarget) setExpanded(false) }}
        >
          <div className="animate-expand-up bg-white dark:bg-neutral-950 rounded-xl w-full max-w-2xl max-h-[88vh] overflow-hidden shadow-2xl flex flex-col border border-neutral-200 dark:border-neutral-800">
            {/* Modal header */}
            <div className="flex items-start justify-between px-7 py-5 border-b border-neutral-100 dark:border-neutral-900 flex-shrink-0">
              <div>
                <p className="text-[12px] text-neutral-400 mb-1">
                  {new Date(selected.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  {' · '}
                  <span className={`px-1.5 py-0.5 rounded-full text-[11px] ${catClass[selected.category] || ''}`}>{selected.category}</span>
                </p>
                <h2 className="text-[19px] font-medium leading-snug">{selected.title}</h2>
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="ml-4 mt-0.5 w-7 h-7 flex items-center justify-center rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex-shrink-0"
                aria-label="Close"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
                </svg>
              </button>
            </div>

            {/* Modal body — scrollable */}
            <div className="flex-1 overflow-y-auto px-7 py-6 text-[16px] text-neutral-500 dark:text-neutral-400 leading-[1.9]">
              {selected.htmlBody ? (
                <div className="blog-prose" dangerouslySetInnerHTML={{ __html: selected.htmlBody }} />
              ) : selected.body ? (
                <div className="prose prose-sm max-w-none"><PortableText value={selected.body} /></div>
              ) : (
                <p>{selected.excerpt}</p>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex-shrink-0 flex items-center justify-between px-7 py-3 border-t border-neutral-100 dark:border-neutral-900">
              {selected.slug ? (
                <Link href={`/blog/${selected.slug}`} className="text-[13px] text-neutral-400 hover:text-accent transition-colors">
                  permalink →
                </Link>
              ) : <span />}
              <button
                onClick={() => setExpanded(false)}
                className="text-[13px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
              >
                esc to close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin login modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-7 w-full max-w-sm">
            <p className="text-[16px] font-medium mb-1">writer access</p>
            <p className="text-[14px] text-neutral-400 dark:text-neutral-600 mb-5 leading-relaxed">enter your password to write and publish notes.</p>
            <input
              type="password"
              value={adminPw}
              onChange={e => { setAdminPw(e.target.value); setAdminPwError(false) }}
              onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
              placeholder="password"
              autoFocus
              className="w-full text-[15px] px-3 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-transparent text-neutral-900 dark:text-neutral-100 outline-none focus:border-accent mb-3"
            />
            {adminPwError && <p className="text-[13px] text-red-500 mb-3">incorrect password</p>}
            <button
              onClick={handleAdminLogin}
              className="w-full py-2 bg-accent text-white text-[14px] rounded-lg hover:opacity-90 transition-opacity mb-2"
            >
              continue →
            </button>
            <button
              onClick={() => { setShowAdminLogin(false); setAdminPw(''); setAdminPwError(false) }}
              className="w-full text-[13px] text-neutral-400 text-center hover:text-neutral-600 transition-colors"
            >
              cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── NOTE COMPOSER ──────────────────────────────────────────────────────────

type ImageSlot = {
  id: string
  preview: string
  assetId?: string
  uploading: boolean
  error?: string
}

function NoteComposer({
  onPublish,
  onCancel,
  adminPassword,
}: {
  onPublish: (draft: { title: string; category: string; excerpt: string; body: string }, imageAssetIds: string[]) => Promise<void>
  onCancel: () => void
  adminPassword: string
}) {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('thoughts')
  const [excerpt, setExcerpt] = useState('')
  const [body, setBody] = useState('')
  const [images, setImages] = useState<ImageSlot[]>([])
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState('')
  const [published, setPublished] = useState(false)
  const bodyRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.style.height = 'auto'
      bodyRef.current.style.height = bodyRef.current.scrollHeight + 'px'
    }
  }, [body])

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => images.forEach(img => URL.revokeObjectURL(img.preview))
  }, [])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    if (images.length >= 3) return

    const id = Math.random().toString(36).slice(2)
    const preview = URL.createObjectURL(file)
    setImages(prev => [...prev, { id, preview, uploading: true }])

    try {
      const formData = new FormData()
      formData.append('password', adminPassword)
      formData.append('image', file)
      const res = await fetch('/api/upload-image', { method: 'POST', body: formData })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'upload failed')
      }
      const { assetId } = await res.json()
      setImages(prev => prev.map(img => img.id === id ? { ...img, uploading: false, assetId } : img))
    } catch (e: any) {
      setImages(prev => prev.map(img => img.id === id ? { ...img, uploading: false, error: e.message } : img))
    }
  }

  const handleRemoveImage = (id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id)
      if (img) URL.revokeObjectURL(img.preview)
      return prev.filter(i => i.id !== id)
    })
  }

  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0
  const canPublish = title.trim().length > 0 && body.trim().length > 0 && !images.some(i => i.uploading)

  const handlePublish = async () => {
    if (!canPublish || publishing) return
    setPublishing(true)
    setError('')
    try {
      const assetIds = images.filter(i => i.assetId).map(i => i.assetId!)
      await onPublish({ title, category, excerpt, body }, assetIds)
      setPublished(true)
    } catch (e: any) {
      setError(e.message || 'something went wrong')
      setPublishing(false)
    }
  }

  if (published) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8">
        <div className="text-[32px] mb-3">✓</div>
        <p className="text-[16px] font-medium text-neutral-900 dark:text-neutral-100 mb-1">published</p>
        <p className="text-[14px] text-neutral-400">your note is live on Sanity.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100 dark:border-neutral-900 flex-shrink-0">
        <div className="flex items-center gap-2">
          {['thoughts', 'travel', 'music'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-[12px] px-2.5 py-0.5 rounded-full border transition-all ${
                category === cat
                  ? 'bg-accent text-white border-accent'
                  : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-neutral-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          onClick={onCancel}
          className="text-[13px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
        >
          discard
        </button>
      </div>

      {/* Writing area */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="title"
          className="w-full text-[24px] font-medium bg-transparent outline-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-300 dark:placeholder:text-neutral-700 mb-3"
        />
        <input
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          placeholder="one-line summary (optional)"
          className="w-full text-[14px] bg-transparent outline-none text-neutral-500 dark:text-neutral-400 placeholder:text-neutral-300 dark:placeholder:text-neutral-700 mb-5 border-b border-neutral-100 dark:border-neutral-800 pb-5"
        />
        <textarea
          ref={bodyRef}
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="write something..."
          rows={8}
          className="w-full text-[15px] leading-[1.9] bg-transparent outline-none resize-none text-neutral-700 dark:text-neutral-300 placeholder:text-neutral-300 dark:placeholder:text-neutral-700 mb-6"
        />

        {/* Image slots */}
        <div className="border-t border-neutral-100 dark:border-neutral-800 pt-5">
          <p className="text-[11px] uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-3">
            photos <span className="normal-case tracking-normal ml-1">({images.length}/3)</span>
          </p>
          <div className="flex gap-3 flex-wrap">
            {images.map(img => (
              <div key={img.id} className="relative w-20 h-20 rounded-lg overflow-hidden group flex-shrink-0">
                <img src={img.preview} alt="" className="w-full h-full object-cover" />
                {/* Upload overlay */}
                {img.uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  </div>
                )}
                {/* Error overlay */}
                {img.error && (
                  <div className="absolute inset-0 bg-red-500/70 flex items-center justify-center">
                    <span className="text-white text-[10px] text-center px-1">{img.error}</span>
                  </div>
                )}
                {/* Remove button */}
                {!img.uploading && (
                  <button
                    onClick={() => handleRemoveImage(img.id)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white text-[9px] transition-colors"
                    aria-label="Remove image"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            {/* Add image slot */}
            {images.length < 3 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-lg flex flex-col items-center justify-center gap-1 text-neutral-400 hover:border-accent hover:text-accent transition-colors flex-shrink-0"
              >
                <span className="text-[20px] leading-none">+</span>
                <span className="text-[10px]">photo</span>
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-t border-neutral-100 dark:border-neutral-900">
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-neutral-400">{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
          {images.some(i => i.uploading) && (
            <span className="text-[12px] text-neutral-400 flex items-center gap-1">
              <span className="w-2.5 h-2.5 border border-neutral-400 border-t-transparent rounded-full animate-spin" />
              uploading...
            </span>
          )}
          {error && <span className="text-[12px] text-red-500">{error}</span>}
        </div>
        <button
          onClick={handlePublish}
          disabled={!canPublish || publishing}
          className="px-4 py-1.5 bg-accent text-white text-[13px] rounded-full disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center gap-1.5"
        >
          {publishing ? (
            <>
              <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              publishing
            </>
          ) : 'publish →'}
        </button>
      </div>
    </div>
  )
}

// ── FINANCE NEWS CONTENT ───────────────────────────────────────────────────

type NewsArticle = { title: string; url: string; publishedAt: string | null; source: string }

function decodeEntities(str: string) {
  return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
}

function FinanceNewsContent({
  articles,
  loading,
  error,
}: {
  articles: NewsArticle[] | null
  loading: boolean
  error: string | null
}) {
  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const h = Math.floor(diff / 3600000)
    const m = Math.floor(diff / 60000)
    if (h >= 24) return `${Math.floor(h / 24)}d ago`
    if (h >= 1) return `${h}h ago`
    if (m >= 1) return `${m}m ago`
    return 'just now'
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <p className="text-[12px] uppercase tracking-widest text-accent font-medium mb-4">top finance news</p>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-1.5 py-3 border-b border-neutral-200 dark:border-neutral-800 animate-pulse">
            <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="h-3 w-28 bg-neutral-200 dark:bg-neutral-800 rounded mt-1" />
          </div>
        ))}
      </div>
    )
  }

  if (error || !articles?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center">
        <p className="text-[14px] text-neutral-400">{error || 'no headlines right now'}</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-[12px] uppercase tracking-widest text-accent font-medium mb-4">top finance news</p>
      <ul>
        {articles.map((a, i) => (
          <li key={a.url}>
            <a
              href={a.url}
              target="_blank"
              rel="noopener"
              className={`group block py-3 no-underline ${i > 0 ? 'border-t border-neutral-100 dark:border-neutral-900' : ''}`}
            >
              <p className="text-[14px] leading-snug text-neutral-800 dark:text-neutral-200 group-hover:text-accent transition-colors">
                {decodeEntities(a.title)}
              </p>
              <p className="text-[12px] text-neutral-400 dark:text-neutral-600 mt-1">
                {a.source}
                {a.publishedAt && ` · ${timeAgo(a.publishedAt)}`}
              </p>
            </a>
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-neutral-300 dark:text-neutral-700 mt-4">via Yahoo Finance · updates every 5 min</p>
    </div>
  )
}

// ── MUSIC CONTENT ──────────────────────────────────────────────────────────

function MusicContent({ data }: { data: any }) {
  const [artistRange, setArtistRange] = useState<'short' | 'long'>('short')

  const playlists = [
    { name: 'music to my ears', count: '30 songs', url: 'https://open.spotify.com/playlist/7drzqVqag8f4JlLqYlWFh9', img: 'https://i.scdn.co/image/ab67706c0000da8428039ec79db5ab6564a363b1' },
    { name: 'Vienna', count: '261 songs', url: 'https://open.spotify.com/playlist/0PmBaTIcFS4gu0hc0eGyjM', img: 'https://i.scdn.co/image/ab67706c0000da84c257cc4f202ac7ef4e057329' },
    { name: '2025 music', count: '49 songs', url: 'https://open.spotify.com/playlist/4dtXsyqtpoIdZhs7wyjIgg', img: 'https://i.scdn.co/image/ab67706c0000da84032f326854fe55a592f482a5' },
    { name: 'me perdí en tu mirada', count: '25 songs', url: 'https://open.spotify.com/playlist/3nqX0sPvShmiYJWAv4beNk', img: 'https://i.scdn.co/image/ab67706c0000da84769f0c0e3fe737d5698086c3' },
  ]

  if (!data) return (
    <div className="space-y-8 animate-pulse">
      {[1,2,3,4].map(i => <div key={i} className="space-y-2">
        <div className="h-3 w-24 bg-neutral-100 dark:bg-neutral-800 rounded" />
        {[1,2,3].map(j => <div key={j} className="h-10 bg-neutral-100 dark:bg-neutral-800 rounded" />)}
      </div>)}
    </div>
  )

  const topArtist = data.artists?.[0]

  return (
    <div className="space-y-8">
      {topArtist && (
        <div>
          <p className="text-[12px] uppercase tracking-widest text-accent font-medium mb-3">top artist this month</p>
          <a
            href={topArtist.url}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-3 py-2 border-t border-b border-neutral-100 dark:border-neutral-900 hover:bg-accent/5 rounded-sm transition-colors no-underline group"
          >
            <img src={topArtist.image} alt={topArtist.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-medium text-neutral-900 dark:text-neutral-100 truncate group-hover:text-accent transition-colors">{topArtist.name}</p>
              {topArtist.genres?.[0] && <p className="text-[13px] text-neutral-400 capitalize truncate">{topArtist.genres[0]}</p>}
            </div>
            <span className="text-[13px] text-neutral-400 flex-shrink-0">→</span>
          </a>
        </div>
      )}

      <div>
        <p className="text-[12px] uppercase tracking-widest text-accent font-medium mb-3">playlists</p>
        <div>
          {playlists.map((p, i) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener"
              className={`flex items-center gap-3 py-2.5 border-b border-neutral-100 dark:border-neutral-900 hover:bg-accent/5 rounded-sm transition-colors no-underline group ${i === 0 ? 'border-t border-neutral-100 dark:border-neutral-900' : ''}`}
            >
              <img src={p.img} alt={p.name} className="w-8 h-8 rounded-md object-cover flex-shrink-0" />
              <span className="flex-1 text-[15px] text-neutral-900 dark:text-neutral-100 truncate group-hover:text-accent transition-colors">{p.name}</span>
              <span className="text-[13px] text-neutral-400 flex-shrink-0">{p.count} →</span>
            </a>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[12px] uppercase tracking-widest text-accent font-medium">top artists</p>
          <div className="flex gap-1">
            {(['short', 'long'] as const).map(r => (
              <button
                key={r}
                onClick={() => setArtistRange(r)}
                className={`text-[12px] px-2.5 py-0.5 rounded-full border transition-all ${
                  artistRange === r
                    ? 'bg-accent text-white border-accent'
                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-neutral-400'
                }`}
              >
                {r === 'short' ? 'this month' : 'all time'}
              </button>
            ))}
          </div>
        </div>
        <div>
          {(data.artists || []).slice(0, 8).map((a: any, i: number) => (
            <a
              key={a.name}
              href={a.url}
              target="_blank"
              rel="noopener"
              className={`flex items-center gap-3 py-2.5 border-b border-neutral-100 dark:border-neutral-900 hover:bg-accent/5 rounded-sm transition-colors no-underline group ${i === 0 ? 'border-t border-neutral-100 dark:border-neutral-900' : ''}`}
            >
              <span className="text-[13px] text-neutral-400 dark:text-neutral-600 font-mono w-4 flex-shrink-0 text-right">{i + 1}</span>
              <img src={a.image} alt={a.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-neutral-900 dark:text-neutral-100 truncate group-hover:text-accent transition-colors">{a.name}</p>
                {a.genres?.[0] && <p className="text-[12px] text-neutral-400 capitalize truncate">{a.genres[0]}</p>}
              </div>
            </a>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[12px] uppercase tracking-widest text-accent font-medium mb-3">recently played</p>
        <div>
          {(data.recent || []).slice(0, 6).map((t: any, i: number) => (
            <a
              key={i}
              href={t.url}
              target="_blank"
              rel="noopener"
              className={`flex items-center gap-3 py-2.5 border-b border-neutral-100 dark:border-neutral-900 hover:bg-accent/5 rounded-sm transition-colors no-underline group ${i === 0 ? 'border-t border-neutral-100 dark:border-neutral-900' : ''}`}
            >
              <span className="text-[13px] text-neutral-400 dark:text-neutral-600 font-mono w-4 flex-shrink-0 text-right">{i + 1}</span>
              <img src={t.albumArt} alt={t.title} className="w-8 h-8 rounded-md flex-shrink-0 object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-medium text-neutral-900 dark:text-neutral-100 truncate group-hover:text-accent transition-colors">{t.title}</p>
                <p className="text-[12px] text-neutral-400 truncate">{t.artist}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
