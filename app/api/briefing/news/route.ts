import { NextResponse } from 'next/server'
import { getTopStories } from '@/lib/news-feed'
import { enforceRateLimit, errorResponse } from '@/lib/http'

export const dynamic = 'force-dynamic'

const MAX_ITEMS = 5

export async function GET(req: Request): Promise<NextResponse> {
  const limited = enforceRateLimit(req, 'briefing-news', 30, 60_000)
  if (limited) return limited

  try {
    const articles = await getTopStories(MAX_ITEMS)
    return NextResponse.json({ articles })
  } catch (err) {
    return errorResponse(502, 'Could not load news right now.', err)
  }
}
