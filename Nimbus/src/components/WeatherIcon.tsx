import type { Condition } from '../types/weather'
import './WeatherIcon.css'

export type WeatherIconSize = 'large' | 'small'

interface WeatherIconProps {
  condition: Condition
  size?: WeatherIconSize
}

export function WeatherIcon({ condition, size = 'large' }: WeatherIconProps) {
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