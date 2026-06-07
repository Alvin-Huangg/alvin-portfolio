// Shared shapes for the Morning Briefing dashboard.

export type Weather = {
  city: string
  temp: number
  feelsLike: number
  condition: string
  description: string
  icon: string
  high: number
  low: number
  rainChance: number
  humidity: number
  windSpeed: number
}

export type Article = {
  title: string
  source: string
  publishedAt: string
  url: string
  image: string | null
}

export type Release = {
  title: string
  artist: string
  type: string
  image: string | null
  url: string
  releaseDate: string
  totalTracks: number
}
