import type { Condition } from '../types/weather'
import { WeatherIcon } from './WeatherIcon'
import './CurrentConditions.css'

interface CurrentConditionsProps {
  location: string
  condition: Condition
  conditionLabel: string
  temperature: number | null
}

export function CurrentConditions({ location, condition, conditionLabel, temperature }: CurrentConditionsProps) {
  const formattedTemperature = typeof temperature === 'number' ? temperature : '--'

  return (
    <section className="current" aria-live="polite">
      <div className="current__heading">
        <h1>{location}</h1>
        <p>{conditionLabel}</p>
      </div>
      <div className="current__visual">
        <WeatherIcon condition={condition} />
        <p className="current__temp">{formattedTemperature}°C</p>
      </div>
    </section>
  )
}