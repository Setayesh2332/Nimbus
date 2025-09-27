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
