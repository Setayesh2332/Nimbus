import type { Condition } from '../types/weather'
import { WeatherIcon } from './WeatherIcon'
import './CurrentConditions.css'

interface CurrentConditionsProps {
  location: string
  condition: Condition
  conditionLabel: string
  temperature: number | null
  dateLabel?: string
  dateTime?: string
}

export function CurrentConditions({ location, condition, conditionLabel, temperature, dateLabel, dateTime }: CurrentConditionsProps) {
  const formattedTemperature = typeof temperature === 'number' ? temperature : '--'
  const hasDate = typeof dateLabel === 'string' && dateLabel.length > 0

  return (
    <section className="current" aria-live="polite">
      <div className="current__heading">
        <h1>{location}</h1>
        <p>{conditionLabel}</p>
        {hasDate ? (
          <time className="current__date" dateTime={dateTime}>{dateLabel}</time>
        ) : null}
      </div>
      <div className="current__visual">
        <WeatherIcon condition={condition} />
        <p className="current__temp">{formattedTemperature}°C</p>
      </div>
    </section>
  )
}