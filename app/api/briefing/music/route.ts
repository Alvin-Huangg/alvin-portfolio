import { NextResponse } from 'next/server'
import { safeFetch } from '@/lib/safe-fetch'
import { enforceRateLimit, errorResponse } from '@/lib/http'
import type { Release } from '@/components/briefing/types'

export const dynamic = 'force-dynamic'

// ── Upstream (Spotify) response shapes ──────────────────────────
interface SpotifyTokenResponse { access_token?: string }
interface SpotifyArtist { name: string }
interface SpotifyImage { url: string }
interface SpotifyAlbum {
  name: string
  album_type: string
  release_date: string
  total_tracks: number
  artists: SpotifyArtist[]
  images: SpotifyImage[]
  external_urls: { spotify: string }
}
interface SpotifyNewReleases {
  albums?: { items: SpotifyAlbum[] }
  error?: { message: string; status: number }
}

async function fetchAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Spotify credentials not configured')
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const res = await safeFetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Spotify token endpoint responded ${res.status}`)
  const data = (await res.json()) as SpotifyTokenResponse
  if (!data.access_token) throw new Error('No access token in Spotify response')
  return data.access_token
}

export async function GET(req: Request): Promise<NextResponse> {
  const limited = enforceRateLimit(req, 'music', 20, 60_000)
  if (limited) return limited

  try {
    const accessToken = await fetchAccessToken()
    const res = await safeFetch('https://api.spotify.com/v1/browse/new-releases?limit=8', {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    })

    const data = (await res.json()) as SpotifyNewReleases
    if (!res.ok || data.error) {
      return errorResponse(502, 'Could not load new releases.', data.error?.message ?? `status ${res.status}`)
    }

    const releases: Release[] = (data.albums?.items ?? []).map(a => ({
      title: a.name,
      artist: a.artists.map(x => x.name).join(', '),
      type: a.album_type,
      image: a.images[0]?.url ?? null,
      url: a.external_urls.spotify,
      releaseDate: a.release_date,
      totalTracks: a.total_tracks,
    }))

    return NextResponse.json({ releases })
  } catch (err) {
    return errorResponse(502, 'Could not load new releases.', err)
  }
}
