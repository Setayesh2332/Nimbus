import type { ChangeEventHandler, FormEventHandler } from 'react'

interface SearchFormProps {
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  onSubmit: FormEventHandler<HTMLFormElement>
}

export function SearchForm({ value, onChange, onSubmit }: SearchFormProps) {
  return (
    <form className="search" onSubmit={onSubmit}>
      <label className="visually-hidden" htmlFor="location-search">
        Search for location
      </label>
      <input
        id="location-search"
        className="search__input"
        type="search"
        placeholder="Search for location"
        value={value}
        onChange={onChange}
      />
    </form>
  )
}