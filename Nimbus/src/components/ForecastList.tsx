import { useCallback, useEffect, useId, useRef, useState } from 'react'
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
        aria-label={`Show forecast for ${entry.fullDateLabel}`}
        title={`Show forecast for ${entry.fullDateLabel}`}
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
  const scrollRef = useRef<HTMLUListElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const scrollerId = useId()

  const updateScrollState = useCallback(() => {
    const element = scrollRef.current

    if (!element) {
      setCanScrollLeft(false)
      setCanScrollRight(false)
      return
    }

    const { scrollLeft, clientWidth, scrollWidth } = element
    const threshold = 4

    setCanScrollLeft(scrollLeft > threshold)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - threshold)
  }, [])

  useEffect(() => {
    const element = scrollRef.current

    if (!element) {
      return
    }

    updateScrollState()

    const handleScroll = () => updateScrollState()
    element.addEventListener('scroll', handleScroll, { passive: true })

    let resizeObserver: ResizeObserver | undefined

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateScrollState()
      })
      resizeObserver.observe(element)
    }

    return () => {
      element.removeEventListener('scroll', handleScroll)
      resizeObserver?.disconnect()
    }
  }, [updateScrollState])

  useEffect(() => {
    updateScrollState()
  }, [entries, updateScrollState])

  const scrollByCard = (direction: 'left' | 'right') => {
    const element = scrollRef.current

    if (!element) {
      return
    }

    const firstCard = element.querySelector<HTMLElement>('.forecast-card')
    const computedStyles = getComputedStyle(element)
    const gapValue = computedStyles.columnGap !== 'normal' ? computedStyles.columnGap : computedStyles.gap
    const parsedGap = Number.parseFloat(gapValue)
    const gap = Number.isNaN(parsedGap) ? 0 : parsedGap
    const cardWidth = firstCard?.offsetWidth ?? 0
    const fallbackWidth = element.clientWidth * 0.6
    const scrollAmount = (cardWidth || fallbackWidth) + gap

    element.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  return (
    <section className="forecast" aria-label="Five day forecast">
       <div className="forecast__scroller-wrapper">
        <button
          type="button"
          className="forecast__nav forecast__nav--left"
          onClick={() => scrollByCard('left')}
          disabled={!canScrollLeft}
          aria-label="Scroll forecast left"
          aria-controls={scrollerId}
        >
          <span className="forecast__nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
        <ul id={scrollerId} ref={scrollRef} className="forecast__scroller">
          {entries.map((entry, index) => (
            <li key={entry.id} className="forecast__item">
              <ForecastCard entry={entry} isActive={index === activeIndex} onSelect={() => onSelect(index)} />
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="forecast__nav forecast__nav--right"
          onClick={() => scrollByCard('right')}
          disabled={!canScrollRight}
          aria-label="Scroll forecast right"
          aria-controls={scrollerId}
        >
          <span className="forecast__nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M9.5 5.5 16 12l-6.5 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </div>
    </section>
  )
}