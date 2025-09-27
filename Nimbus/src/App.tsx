import { type ChangeEvent, type FormEvent, useState } from 'react'
import './App.css'
import { CurrentConditions } from './components/CurrentConditions'
import { ForecastList } from './components/ForecastList'
import { SearchForm } from './components/SearchForm'
import { conditionLabels, forecastData } from './types/weather'

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

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
  }

  return (
    <div className="app-shell">
      <div className="app-shell__wave" aria-hidden="true" />
      <main className="weather-card">
        <SearchForm value={searchValue} onChange={handleSearchChange} onSubmit={handleSubmit} />
        <CurrentConditions
          location={location}
          condition={activeCondition}
          conditionLabel={conditionLabels[activeCondition]}
          temperature={activeForecast.temperature}
        />
        <ForecastList entries={forecastData} activeIndex={selectedIndex} onSelect={setSelectedIndex} />
      </main>
    </div>
  )
}

export default App