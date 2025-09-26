import { type FormEvent, useState } from 'react'
import './App.css'

type Condition = 'sunny' | 'partly-cloudy' | 'rainy' | 'snowy' | 'windy'

interface ForecastEntry {
  id: string
  dayLabel: string
  condition: Condition
  temperature: number
}

const conditionLabels: Record<Condition, string> = {
  sunny: 'Sunny',
  'partly-cloudy': 'Mostly cloudy',
  rainy: 'Rainy',
  snowy: 'Snowy',
  windy: 'Windy',
}

const forecastData: ForecastEntry[] = [
  { id: 'today', dayLabel: 'Mon', condition: 'sunny', temperature: 35 },
  { id: 'tue', dayLabel: 'Tue', condition: 'partly-cloudy', temperature: 32 },
  { id: 'wed', dayLabel: 'Wed', condition: 'rainy', temperature: 18 },
  { id: 'thu', dayLabel: 'Thu', condition: 'snowy', temperature: -3 },
  { id: 'fri', dayLabel: 'Fri', condition: 'windy', temperature: 9 },
]

function WeatherIcon({ condition, size = 'large' }: { condition: Condition; size?: 'large' | 'small' }) {
  const sizeClass = size === 'large' ? 'weather-icon--large' : 'weather-icon--small'

  switch (condition) {
    case 'sunny':
      return (
        <svg className={`weather-icon ${sizeClass}`} viewBox="0 0 160 160" role="img" aria-label="Sunny skies">
          <circle cx="80" cy="80" r="36" fill="#ffd64f" />
          {[...Array(8)].map((_, index) => {
            const angle = (index * Math.PI) / 4
            const x1 = 80 + Math.cos(angle) * 54
            const y1 = 80 + Math.sin(angle) * 54
            const x2 = 80 + Math.cos(angle) * 70
            const y2 = 80 + Math.sin(angle) * 70
            return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffd64f" strokeWidth="8" strokeLinecap="round" />
          })}
        </svg>
      )
    case 'partly-cloudy':
      return (
        <svg className={`weather-icon ${sizeClass}`} viewBox="0 0 160 160" role="img" aria-label="Mostly cloudy">
          <circle cx="62" cy="62" r="30" fill="#ffd64f" />
          <path
            d="M102 118H52a22 22 0 0 1 0-44 27 27 0 0 1 49.5-12.4A24 24 0 1 1 128 118Z"
            fill="#e7ecf7"
          />
        </svg>
      )
    case 'rainy':
      return (
        <svg className={`weather-icon ${sizeClass}`} viewBox="0 0 160 160" role="img" aria-label="Rain showers">
          <path
            d="M112 104H56a22 22 0 0 1 0-44 27 27 0 0 1 49.5-12.4A24 24 0 1 1 138 104Z"
            fill="#e7ecf7"
          />
          <g fill="none" stroke="#7cc4ff" strokeWidth="8" strokeLinecap="round">
            <line x1="64" y1="116" x2="54" y2="136" />
            <line x1="92" y1="116" x2="82" y2="136" />
            <line x1="120" y1="116" x2="110" y2="136" />
          </g>
        </svg>
      )
    case 'snowy':
      return (
        <svg className={`weather-icon ${sizeClass}`} viewBox="0 0 160 160" role="img" aria-label="Snowy conditions">
          <path
            d="M112 100H56a22 22 0 0 1 0-44 27 27 0 0 1 49.5-12.4A24 24 0 1 1 138 100Z"
            fill="#e7ecf7"
          />
          <g fill="none" stroke="#7cc4ff" strokeWidth="6" strokeLinecap="round">
            <path d="M64 118l-8 8m0-8 8 8" />
            <path d="M92 118l-8 8m0-8 8 8" />
            <path d="M120 118l-8 8m0-8 8 8" />
          </g>
        </svg>
      )
    case 'windy':
      return (
        <svg className={`weather-icon ${sizeClass}`} viewBox="0 0 160 160" role="img" aria-label="Windy conditions">
          <path
            d="M110 104H54a22 22 0 0 1 0-44 27 27 0 0 1 49.5-12.4A24 24 0 1 1 136 104Z"
            fill="#e7ecf7"
          />
          <g fill="none" stroke="#7cc4ff" strokeWidth="8" strokeLinecap="round">
            <path d="M48 120h46a12 12 0 1 0 0-24" />
            <path d="M60 136h56a10 10 0 1 0 0-20" />
          </g>
        </svg>
      )
    default:
      return null
  }
}

function App() {
    const [location, setLocation] = useState('Montreal')
  const [searchValue, setSearchValue] = useState('Montreal')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const activeForecast = forecastData[selectedIndex]
  const activeCondition = activeForecast.condition

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = searchValue.trim()
    if (trimmed.length === 0) return
    setLocation(trimmed)
  }

  return (
     <div className="app-shell">
      <div className="app-shell__wave" aria-hidden="true" />
      <main className="weather-card">
        <form className="search" onSubmit={handleSubmit}>
          <label className="visually-hidden" htmlFor="location-search">
            Search for location
          </label>
          <input
            id="location-search"
            className="search__input"
            type="search"
            placeholder="Search for location"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </form>

        <section className="current" aria-live="polite">
          <div className="current__heading">
            <h1>{location}</h1>
            <p>{conditionLabels[activeCondition]}</p>
          </div>
          <div className="current__visual">
            <WeatherIcon condition={activeCondition} />
            <p className="current__temp">{activeForecast.temperature}°C</p>
          </div>
        </section>

        <section className="forecast" aria-label="Five day forecast">
          <ul>
            {forecastData.map((entry, index) => {
              const isActive = index === selectedIndex
              return (
                <li key={entry.id}>
                  <button
                    type="button"
                    className={`forecast-card${isActive ? ' forecast-card--active' : ''}`}
                    onClick={() => setSelectedIndex(index)}
                    aria-pressed={isActive}
                  >
                    <span className="forecast-card__day">{entry.dayLabel}</span>
                    <WeatherIcon condition={entry.condition} size="small" />
                    <span className="forecast-card__temp">{entry.temperature}°C</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      </main>
    </div>
  )
}

export default App