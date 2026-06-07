import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN!

let tokenCache: { token: string; expiresAt: number } | null = null

async function getAccessToken() {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token
  }
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: REFRESH_TOKEN }),
    cache: 'no-store',
  })
  const data = await res.json()
  tokenCache = { token: data.access_token, expiresAt: Date.now() + 50 * 60 * 1000 }
  return data.access_token
}

export async function GET() {
  try {
    const token = await getAccessToken()
    const headers = { Authorization: `Bearer ${token}` }

    const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers,
      cache: 'no-store',
    })

    if (res.status === 200) {
      const data = await res.json()
      if (data.item) {
        return NextResponse.json({
          isPlaying: data.is_playing,
          title: data.item.name,
          artist: data.item.artists.map((a: any) => a.name).join(', '),
          album: data.item.album?.name ?? '',
          albumArt: data.item.album.images[1]?.url,
          songUrl: data.item.external_urls.spotify,
          songId: data.item.id,
          progressMs: data.progress_ms ?? 0,
          durationMs: data.item.duration_ms ?? 0,
        })
      }
    }

    const recent = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
      headers,
      cache: 'no-store',
    })
    const recentData = await recent.json()
    const track = recentData.items?.[0]?.track

    if (track) {
      return NextResponse.json({
        isPlaying: false,
        title: track.name,
        artist: track.artists.map((a: any) => a.name).join(', '),
        album: track.album?.name ?? '',
        albumArt: track.album.images[1]?.url,
        songUrl: track.external_urls.spotify,
        songId: track.id,
        progressMs: 0,
        durationMs: track.duration_ms ?? 0,
      })
    }

    return NextResponse.json({ isPlaying: false, title: null })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
