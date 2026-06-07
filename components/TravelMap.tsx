'use client'

// ─────────────────────────────────────────────────────────────────────────────
// TRAVEL MAP — temporarily under construction.
// Waiting on Apple Developer approval to wire up MapKit JS (Apple Maps tiles).
// All place data below is preserved and ready to feed into the MapKit build.
// ─────────────────────────────────────────────────────────────────────────────

interface Place {
  name: string
  lat: number
  lng: number
  country: string
  home?: boolean
}

const PLACES: Place[] = [
  // USA
  { name: 'Phoenix, AZ',       lat: 33.448,  lng: -112.074, country: 'USA', home: true },
  { name: 'Tucson, AZ',        lat: 32.223,  lng: -110.975, country: 'USA' },
  { name: 'Flagstaff, AZ',     lat: 35.198,  lng: -111.651, country: 'USA' },
  { name: 'Los Angeles, CA',   lat: 34.052,  lng: -118.244, country: 'USA' },
  { name: 'San Diego, CA',     lat: 32.716,  lng: -117.161, country: 'USA' },
  { name: 'San Francisco, CA', lat: 37.775,  lng: -122.419, country: 'USA' },
  { name: 'San Jose, CA',      lat: 37.338,  lng: -121.886, country: 'USA' },
  { name: 'Sacramento, CA',    lat: 38.582,  lng: -121.494, country: 'USA' },
  { name: 'Las Vegas, NV',     lat: 36.170,  lng: -115.140, country: 'USA' },
  { name: 'Albuquerque, NM',   lat: 35.084,  lng: -106.650, country: 'USA' },
  { name: 'El Paso, TX',       lat: 31.762,  lng: -106.485, country: 'USA' },
  { name: 'Dallas, TX',        lat: 32.777,  lng: -96.797,  country: 'USA' },
  { name: 'Washington DC',     lat: 38.907,  lng: -77.037,  country: 'USA' },
  { name: 'New York, NY',      lat: 40.713,  lng: -74.006,  country: 'USA' },
  { name: 'Seattle, WA',       lat: 47.606,  lng: -122.332, country: 'USA' },
  { name: 'Honolulu, HI',      lat: 21.307,  lng: -157.858, country: 'USA' },
  // Mexico
  { name: 'Torreón',           lat: 25.543,  lng: -103.407, country: 'Mexico' },
  { name: 'Durango',           lat: 24.028,  lng: -104.653, country: 'Mexico' },
  { name: 'Mexico City',       lat: 19.433,  lng: -99.133,  country: 'Mexico' },
  { name: 'Monterrey',         lat: 25.687,  lng: -100.316, country: 'Mexico' },
  { name: 'Saltillo',          lat: 25.423,  lng: -100.974, country: 'Mexico' },
  { name: 'Hermosillo',        lat: 29.073,  lng: -110.956, country: 'Mexico' },
  { name: 'Tijuana',           lat: 32.515,  lng: -117.038, country: 'Mexico' },
  { name: 'Ensenada',          lat: 31.867,  lng: -116.596, country: 'Mexico' },
  { name: 'Guadalajara',       lat: 20.660,  lng: -103.349, country: 'Mexico' },
  // Canada
  { name: 'Vancouver, BC',     lat: 49.283,  lng: -123.121, country: 'Canada' },
  { name: 'Calgary, AB',       lat: 51.045,  lng: -114.072, country: 'Canada' },
  { name: 'Edmonton, AB',      lat: 53.546,  lng: -113.491, country: 'Canada' },
  { name: 'Grande Prairie, AB',lat: 55.171,  lng: -118.798, country: 'Canada' },
  { name: 'Peace River, AB',   lat: 56.236,  lng: -117.289, country: 'Canada' },
  { name: 'Grimshaw, AB',      lat: 56.187,  lng: -117.610, country: 'Canada' },
  { name: 'Yellowknife, NT',   lat: 62.454,  lng: -114.372, country: 'Canada' },
  // Japan
  { name: 'Tokyo',             lat: 35.690,  lng: 139.692,  country: 'Japan' },
  // China
  { name: 'Guangzhou',         lat: 23.129,  lng: 113.264,  country: 'China' },
  { name: 'Hong Kong',         lat: 22.319,  lng: 114.169,  country: 'China' },
  { name: 'Changsha',          lat: 28.228,  lng: 112.939,  country: 'China' },
  { name: 'Chongqing',         lat: 29.563,  lng: 106.552,  country: 'China' },
  { name: 'Nanning',           lat: 22.817,  lng: 108.320,  country: 'China' },
  // Scandinavia
  { name: 'Helsinki',          lat: 60.170,  lng: 24.938,   country: 'Finland' },
  { name: 'Stockholm',         lat: 59.329,  lng: 18.069,   country: 'Sweden' },
  { name: 'Copenhagen',        lat: 55.676,  lng: 12.568,   country: 'Denmark' },
  { name: 'Oslo',              lat: 59.914,  lng: 10.752,   country: 'Norway' },
  { name: 'Tromsø',            lat: 69.650,  lng: 18.955,   country: 'Norway' },
  // UK
  { name: 'London',            lat: 51.507,  lng: -0.128,   country: 'UK' },
  { name: 'Oxford',            lat: 51.752,  lng: -1.258,   country: 'UK' },
]

const COUNTRY_COUNT = 10

export default function TravelMap() {
  return (
    <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-6 py-12 text-center">
      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-5">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3a7d44" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      </div>

      <p className="text-[11px] uppercase tracking-widest text-accent font-medium mb-2">under construction</p>
      <h2 className="text-[19px] font-medium text-neutral-900 dark:text-neutral-100 mb-2 leading-snug max-w-[320px]">
        An interactive travel map is on the way
      </h2>
      <p className="text-[14px] text-neutral-400 dark:text-neutral-600 leading-relaxed max-w-[340px] mb-7">
        Rebuilding this with Apple Maps for a cleaner look. Live once my Apple Developer access comes through.
      </p>

      {/* Teaser stats */}
      <div className="flex items-center gap-6 mb-2">
        <div>
          <span className="text-[26px] font-medium text-neutral-900 dark:text-neutral-100 leading-none">{COUNTRY_COUNT}</span>
          <span className="text-[12px] text-neutral-400 ml-1.5">countries</span>
        </div>
        <div className="w-px h-7 bg-neutral-200 dark:bg-neutral-800" />
        <div>
          <span className="text-[26px] font-medium text-neutral-900 dark:text-neutral-100 leading-none">{PLACES.length}</span>
          <span className="text-[12px] text-neutral-400 ml-1.5">cities visited</span>
        </div>
      </div>
      <p className="text-[12px] text-neutral-300 dark:text-neutral-700 italic mt-3">
        check back soon ✦
      </p>
    </div>
  )
}
