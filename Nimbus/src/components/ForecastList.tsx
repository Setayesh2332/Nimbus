import type { ForecastEntry } from '../types/weather'
import { WeatherIcon } from './WeatherIcon'
import './ForecastList.css'

interface ForecastListProps {
  entries: ForecastEntry[]
  activeIndex: number
  onSelect: (index: number) => void
}

interface ForecastCardProps {
  entry: ForecastEntry
  isActive: boolean
  onSelect: () => void
}

function ForecastCard({ entry, isActive, onSelect }: ForecastCardProps) {
  return (
    <li>
      <button
        type="button"
        className={`forecast-card${isActive ? ' forecast-card--active' : ''}`}
        onClick={onSelect}
        aria-pressed={isActive}
      >
        <span className="forecast-card__day">{entry.dayLabel}</span>
        <span className="forecast-card__date">{entry.dateLabel}</span>
        <WeatherIcon condition={entry.condition} size="small" />
        <span className="forecast-card__temp">{entry.temperature}°C</span>
      </button>
    </li>
  )
}

export function ForecastList({ entries, activeIndex, onSelect }: ForecastListProps) {
  return (
    <section className="forecast" aria-label="Five day forecast">
      <ul>
        {entries.map((entry, index) => (
          <ForecastCard key={entry.id} entry={entry} isActive={index === activeIndex} onSelect={() => onSelect(index)} />
        ))}
      </ul>
    </section>
  )
}