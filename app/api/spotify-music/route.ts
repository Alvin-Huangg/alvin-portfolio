import { NextRequest, NextResponse } from 'next/server'

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN!

async function getAccessToken() {
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: REFRESH_TOKEN }),
  })
  return res.json()
}

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type') || 'all'
  try {
    const { access_token } = await getAccessToken()
    const h = { Authorization: `Bearer ${access_token}` }

    if (type === 'top-artists-short' || type === 'top-artists-long') {
      const range = type === 'top-artists-short' ? 'short_term' : 'long_term'
      const res = await fetch(`https://api.spotify.com/v1/me/top/artists?limit=8&time_range=${range}`, { headers: h })
      const data = await res.json()
      return NextResponse.json({ artists: data.items?.map((a: any) => ({ name: a.name, image: a.images?.[1]?.url, url: a.external_urls.spotify, genres: a.genres?.slice(0, 2) })) || [] })
    }

    if (type === 'recent') {
      const res = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=8', { headers: h })
      const data = await res.json()
      return NextResponse.json({ tracks: data.items?.map((i: any) => ({ title: i.track.name, artist: i.track.artists.map((a: any) => a.name).join(', '), albumArt: i.track.album.images?.[2]?.url, url: i.track.external_urls.spotify })) || [] })
    }

    if (type === 'top-tracks') {
      const res = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=8&time_range=short_term', { headers: h })
      const data = await res.json()
      return NextResponse.json({ tracks: data.items?.map((t: any) => ({ title: t.name, artist: t.artists.map((a: any) => a.name).join(', '), albumArt: t.album.images?.[2]?.url, url: t.external_urls.spotify })) || [] })
    }

    return NextResponse.json({ error: 'unknown type' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
