import { type ChangeEvent, type FormEvent, useCallback, useEffect, useState } from 'react'
import './App.css'
import { CurrentConditions } from './components/CurrentConditions'
import { ForecastList } from './components/ForecastList'
import { Navbar } from './components/Navbar'
import { SearchForm } from './components/SearchForm'
import { conditionLabels, type Condition, type ForecastEntry } from './types/weather'

interface GeocodeResult {
  name: string
  country?: string
  admin1?: string
  latitude: number
  longitude: number
  timezone?: string
}

interface GeocodeResponse {
  results?: GeocodeResult[]
}

interface ForecastResponse {
  timezone: string
  current_weather?: {
    temperature: number
    weathercode: number
  }
  daily: {
    time: string[]
    weathercode: number[]
    temperature_2m_max: number[]
  }
}

const DEFAULT_LOCATION = 'Montreal'

const mapWeatherCodeToCondition = (code: number): Condition => {
  if (code === 0) return 'sunny'
  if ([1, 2, 3, 45, 48].includes(code)) return 'partly-cloudy'
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rainy'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snowy'
  if ([95, 96, 99].includes(code)) return 'rainy'
  return 'partly-cloudy'
}

const roundTemperature = (value: number): number => Math.round(value * 10) / 10

const parseISODate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

const buildForecastEntries = (forecast: ForecastResponse, timezone: string): ForecastEntry[] => {
  const dailyLength = forecast.daily.time.length
  if (dailyLength === 0) return []

  const timezoneToUse = timezone || 'UTC'
  const dayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: timezoneToUse })
  const cardDateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: timezoneToUse })
  const fullDateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: timezoneToUse,
  })

  return forecast.daily.time.slice(0, 5).map((date, index) => {
    const isFirstEntry = index === 0
    const temperatureSource = isFirstEntry && forecast.current_weather ? forecast.current_weather.temperature : forecast.daily.temperature_2m_max[index]
    const weatherCodeSource = isFirstEntry && forecast.current_weather ? forecast.current_weather.weathercode : forecast.daily.weathercode[index]
    const utcDate = parseISODate(date)

    return {
      id: date,
      dayLabel: dayFormatter.format(utcDate),
      dateLabel: cardDateFormatter.format(utcDate),
      fullDateLabel: fullDateFormatter.format(utcDate),
      condition: mapWeatherCodeToCondition(weatherCodeSource),
      temperature: roundTemperature(temperatureSource),
    }
  })
}

function App() {
  const [location, setLocation] = useState('Loading forecast…')
  const [searchValue, setSearchValue] = useState(DEFAULT_LOCATION)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [forecastEntries, setForecastEntries] = useState<ForecastEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchForecast = useCallback(async (query: string) => {
    if (query.length === 0) return

    setIsLoading(true)
    setError(null)

    try {
      const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
      const geocodeResponse = await fetch(geocodeUrl)

      if (!geocodeResponse.ok) {
        throw new Error('Unable to look up that location right now.')
      }

      const geocodeData: GeocodeResponse = await geocodeResponse.json()
      const firstResult = geocodeData.results?.[0]

      if (!firstResult) {
        throw new Error('No matching location found. Try a different search term.')
      }

      const { latitude, longitude, timezone } = firstResult
      const locationParts = [firstResult.name]

      if (firstResult.admin1 && firstResult.admin1 !== firstResult.name) {
        locationParts.push(firstResult.admin1)
      }

      if (firstResult.country) {
        locationParts.push(firstResult.country)
      }

      const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max&forecast_days=5&temperature_unit=celsius&timezone=auto`
      const forecastResponse = await fetch(forecastUrl)

      if (!forecastResponse.ok) {
        throw new Error('Unable to load the forecast for that location.')
      }

      const forecastData: ForecastResponse = await forecastResponse.json()
      const timezoneToUse = forecastData.timezone || timezone || 'UTC'
      const entries = buildForecastEntries(forecastData, timezoneToUse)

      if (entries.length === 0) {
        throw new Error('No forecast data available for that location.')
      }

      setForecastEntries(entries)
      setSelectedIndex(0)
      setLocation(locationParts.join(', '))
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Something went wrong while loading the weather data.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchForecast(DEFAULT_LOCATION)
  }, [fetchForecast])

  useEffect(() => {
    if (selectedIndex >= forecastEntries.length && forecastEntries.length > 0) {
      setSelectedIndex(0)
    }
  }, [forecastEntries.length, selectedIndex])

  const activeForecast = forecastEntries[selectedIndex] ?? forecastEntries[0] ?? null
  const activeCondition = activeForecast?.condition ?? 'sunny'
  const activeTemperature = activeForecast?.temperature ?? null

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = searchValue.trim()
    if (trimmed.length === 0) return
    setLocation(trimmed)
    setSelectedIndex(0)
    void fetchForecast(trimmed)
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
  }

  return (
    <div className="app-shell">
      <div className="app-shell__wave" aria-hidden="true" />
      <Navbar />
      <div className="app-shell__content">
        <main id="about" className="weather-card">
          <SearchForm value={searchValue} onChange={handleSearchChange} onSubmit={handleSubmit} />
          {error ? (
            <p className="status-message status-message--error" role="alert">
              {error}
            </p>
          ) : null}
          {isLoading ? (
            <p className="status-message" role="status">
              Loading forecast…
            </p>
          ) : null}
          <CurrentConditions
            location={location}
            condition={activeCondition}
            conditionLabel={conditionLabels[activeCondition]}
            temperature={activeTemperature}
            dateLabel={activeForecast?.fullDateLabel}
            dateTime={activeForecast?.id}
          />
          <ForecastList entries={forecastEntries} activeIndex={selectedIndex} onSelect={setSelectedIndex} />
        </main>
      </div>
    </div>
  )
}

export default App