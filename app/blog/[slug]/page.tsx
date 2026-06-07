import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { client } from '@/lib/sanity'

const catClass: Record<string, string> = {
  travel: 'bg-accent/10 text-accent',
  thoughts: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300',
  music: 'bg-green-50 text-accent dark:bg-green-950',
}

async function getPost(slug: string) {
  try {
    return await client.fetch(
      `*[_type == "post" && slug.current == $slug][0] {
        _id, title, "slug": slug.current, category, publishedAt, excerpt, body
      }`,
      { slug },
      { next: { revalidate: 60 } }
    )
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  if (!post) return {}
  return { title: `${post.title} — Alvin Huang`, description: post.excerpt }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  if (!post) notFound()

  return (
    <div className="animate-fade-up max-w-[580px]">
      <Link href="/blog" className="text-[11px] text-neutral-400 hover:text-accent transition-colors mb-6 inline-block">
        ← back to blog
      </Link>
      <p className="text-[10px] text-neutral-400 mb-2">
        {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </p>
      <h1 className="text-[22px] font-medium mb-2 leading-tight">{post.title}</h1>
      <div className="mb-7">
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${catClass[post.category] || ''}`}>
          {post.category}
        </span>
      </div>
      <div className="text-[13px] text-neutral-500 dark:text-neutral-400 leading-[1.9] prose prose-sm max-w-none">
        {post.body ? <PortableText value={post.body} /> : <p>{post.excerpt}</p>}
      </div>
    </div>
  )
}
