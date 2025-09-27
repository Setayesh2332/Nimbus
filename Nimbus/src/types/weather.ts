export type Condition = 'sunny' | 'partly-cloudy' | 'rainy' | 'snowy' | 'windy'

export interface ForecastEntry {
  id: string
  dayLabel: string
  condition: Condition
  temperature: number
}

export const conditionLabels: Record<Condition, string> = {
  sunny: 'Sunny',
  'partly-cloudy': 'Mostly cloudy',
  rainy: 'Rainy',
  snowy: 'Snowy',
  windy: 'Windy',
}

export const forecastData: ForecastEntry[] = [
  { id: 'today', dayLabel: 'Mon', condition: 'sunny', temperature: 35 },
  { id: 'tue', dayLabel: 'Tue', condition: 'partly-cloudy', temperature: 32 },
  { id: 'wed', dayLabel: 'Wed', condition: 'rainy', temperature: 18 },
  { id: 'thu', dayLabel: 'Thu', condition: 'snowy', temperature: -3 },
  { id: 'fri', dayLabel: 'Fri', condition: 'windy', temperature: 9 },
]