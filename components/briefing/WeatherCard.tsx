'use client'

import { Card, Skeleton, ErrorNote } from './ui'
import type { Weather } from './types'

export default function WeatherCard({
  data,
  loading,
  error,
}: {
  data: Weather | null
  loading: boolean
  error: string | null
}) {
  return (
    <Card label="Weather">
      {loading ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-14 h-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Skeleton className="h-3 w-40" />
        </div>
      ) : error || !data ? (
        <ErrorNote message={error || 'Weather unavailable.'} />
      ) : (
        <div>
          <div className="flex items-center gap-4">
            <img
              src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
              alt={data.condition}
              width={56}
              height={56}
              className="flex-shrink-0 -my-2"
            />
            <div>
              <p className="text-[34px] font-medium leading-none text-neutral-900 dark:text-neutral-100 tabular-nums">
                {data.temp}°
              </p>
              <p className="text-[14px] text-neutral-500 dark:text-neutral-400 capitalize mt-1">
                {data.description}
              </p>
            </div>
          </div>

          <p className="text-[13px] text-neutral-400 dark:text-neutral-500 mt-1 mb-4">
            {data.city} · feels like {data.feelsLike}°
          </p>

          <div className="grid grid-cols-3 gap-2 text-center border-t border-neutral-100 dark:border-neutral-900 pt-4">
            <Stat label="High / Low" value={`${data.high}° / ${data.low}°`} />
            <Stat label="Rain" value={`${data.rainChance}%`} />
            <Stat label="Wind" value={`${data.windSpeed} mph`} />
          </div>
        </div>
      )}
    </Card>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[14px] font-medium text-neutral-900 dark:text-neutral-100 tabular-nums">{value}</p>
      <p className="text-[11px] uppercase tracking-wider text-neutral-400 dark:text-neutral-600 mt-0.5">{label}</p>
    </div>
  )
}
