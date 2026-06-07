import { client } from '@/lib/sanity'
import BlogClient, { type Post } from './BlogClient'

const NORI_JAPAN_BODY = `
<p>When people ask me how I opened a fast food franchise at 24 with no prior business experience, I think they expect a story about connections, or capital, or some kind of inherited knowledge. The real answer is less glamorous and, I think, more useful: I just refused to let not knowing something be a reason to stop moving. I learned as I went. And then I went.</p>
<p>There's a version of entrepreneurship that gets talked about a lot — the one where someone spots a gap, executes on a vision, and scales fast. What gets talked about less is the version where you're sitting at your kitchen table after a full shift as an Amazon area manager, watching YouTube videos about LLC formation because you genuinely don't know what an operating agreement is. That was my version. And it turned into Nori Japan, a fast food franchise now open in Tucson, Arizona.</p>
<h2>Starting from zero looks like a lot of research</h2>
<p>I want to be specific about what "no prior experience" actually means in practice, because I think people say it without conveying the texture of it. It means you're learning what permits you need and simultaneously learning that you don't fully understand what a permit is. It means forming an LLC and realizing partway through that you need to understand what an LLC actually protects you from. It means the learning curve isn't a straight line — it's a web, where pulling on one thread reveals four more you didn't know existed.</p>
<p>My uncle and I decided early to franchise Nori Japan — an established fast food chain with a proven model — which helped. A franchise gives you a playbook. But the playbook doesn't tell you how to read a market. It doesn't tell you whether Tucson is the right city, or which neighborhood within it gives you the best shot, or who your actual customer is and how they move through their day. That part, nobody hands you.</p>
<blockquote>The playbook tells you how to run the business. It doesn't tell you where to plant it.</blockquote>
<h2>The thing I didn't expect to be the hardest</h2>
<p>I expected the legal side to be the steepest part of the learning curve. The LLC, the permits, the franchise agreement — all of that felt like a foreign language at first, but it's a language with rules. You can study it. You can hire people who speak it. What surprised me most was how much harder it was to learn how to read a market.</p>
<p>Market research sounds clinical. In practice it felt more like trying to understand a city — its rhythms, its gaps, the things people wanted that nobody was giving them yet, the locations that looked good on paper but felt wrong when you stood in them at noon on a Wednesday. You can't Google your way to that knowledge. I found that out quickly.</p>
<p>So I did the thing that turned out to matter most: I talked to people who already knew. People in the industry, operators who had been through the site-selection process, franchisees who had made location decisions they later regretted and ones they got right. I asked a lot of questions. I listened more than I spoke. And slowly, a kind of pattern recognition started to develop — not because I was born with business instincts, but because I deliberately borrowed the instincts of people who had already earned them.</p>
<blockquote>You can't Google your way to understanding a market. At some point you have to just talk to people who already know.</blockquote>
<h2>What the learning curve actually teaches you</h2>
<p>There's something that happens when you commit to learning something from zero. The early stages are uncomfortable in a specific way — you're aware of everything you don't know, and that awareness can feel like a reason to pause and prepare more before acting. But at some point you realize that preparation has diminishing returns, and that the remaining knowledge only comes from doing the thing.</p>
<p>That shift — from researching to executing — is where I think most people stall. Not because they're not capable, but because the doing feels riskier than the planning. Planning is safe. Planning keeps the dream intact. The moment you start executing, the dream becomes a real thing that can have real problems. That's scarier. It's also the only path forward.</p>
<p>Having my uncle in this with me helped bridge that gap. When you're accountable to someone else, the threshold for "I'm ready" gets recalibrated. You can't wait until you know everything, because someone else is waiting on you to move. That shared momentum turned out to be its own form of education.</p>
<h2>What I'd tell someone starting from scratch</h2>
<p>Not knowing something is not the obstacle. It just feels like one. The information exists. The people who have done what you want to do exist, and most of them are willing to share what they know if you approach them with genuine curiosity and respect for their time. The gap between where you are and where you need to be is almost always a learning gap — and learning gaps close. They close faster than you think, and they close fastest when you treat the people ahead of you as a resource rather than a benchmark.</p>
<p>I went from not knowing what an LLC was to standing inside a Nori Japan location in Tucson watching the doors open. That journey took research, and conversations, and late nights after long shifts, and a willingness to be the least informed person in the room — repeatedly, and without embarrassment. That last part matters more than people say. Ego is expensive when you're learning from zero.</p>
<blockquote>Ego is expensive when you're learning from zero. Being the least informed person in the room is a position worth getting comfortable with.</blockquote>
<p>You can learn anything if you're willing to start before you feel ready. The learning doesn't happen before the doing — it happens because of it. That's what 24 taught me. And Nori Japan is the proof.</p>
<p class="end-mark">✦ ✦ ✦</p>
`

const FALLBACK_POSTS: Post[] = [
  {
    _id: 'nori-japan-essay',
    title: 'I had no idea what I was doing — and I opened a business anyway',
    slug: 'nori-japan-essay',
    category: 'thoughts',
    publishedAt: '2026-06-01',
    excerpt: 'on learning everything from scratch and doing it anyway',
    htmlBody: NORI_JAPAN_BODY,
  },
  { _id: '1', title: "Hawai'i", slug: 'hawaii', category: 'travel', publishedAt: '2026-04-19', excerpt: 'first time on the big island...' },
  { _id: '2', title: 'Joshua Tree debrief', slug: 'joshua-tree-debrief', category: 'thoughts', publishedAt: '2026-04-05', excerpt: 'what did we learn from day 1?' },
  { _id: '3', title: '5:55', slug: '5-55', category: 'thoughts', publishedAt: '2026-03-18', excerpt: '9:30am. somewhere between terminals...' },
]

const NORI_POST = FALLBACK_POSTS[0]

async function getPosts(): Promise<Post[]> {
  try {
    const sanityPosts = await client.fetch(
      `*[_type == "post"] | order(publishedAt desc) {
        _id, title, "slug": slug.current, category, publishedAt, excerpt, body
      }`,
      {},
      { next: { revalidate: 60 } }
    )
    const base = sanityPosts.length > 0 ? sanityPosts : FALLBACK_POSTS.slice(1)
    return [NORI_POST, ...base]
  } catch {
    return FALLBACK_POSTS
  }
}

export default async function BlogPage() {
  const posts = await getPosts()
  return <BlogClient posts={posts} />
}
