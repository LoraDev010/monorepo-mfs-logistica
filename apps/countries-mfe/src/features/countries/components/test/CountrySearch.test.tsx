import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CountrySearch from '@/features/countries/components/CountrySearch'
import { useCountriesStore } from '@/features/countries/store/countriesStore'

jest.mock('zustand/middleware', () => ({
  persist: (fn) => fn,
}))

function resetStore() {
  useCountriesStore.setState({
    search: '',
    page: 1,
    pageSize: 20,
    localCountries: [],
    hiddenCodes: [],
  })
}

describe('CountrySearch', () => {
  beforeEach(() => {
    resetStore()
  })

  it('renders the search input', () => {
    render(<CountrySearch />)
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('updates the input value and calls setSearch', () => {
    render(<CountrySearch />)
    const input = screen.getByRole('searchbox') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Colombia' } })
    expect(input.value).toBe('Colombia')
    expect(useCountriesStore.getState().search).toBe('Colombia')
  })

  it('displays the current search value from store', () => {
    useCountriesStore.setState({ search: 'Europe' })
    render(<CountrySearch />)
    const input = screen.getByRole('searchbox') as HTMLInputElement
    expect(input.value).toBe('Europe')
  })

  it('has correct placeholder text', () => {
    render(<CountrySearch />)
    expect(screen.getByPlaceholderText(/Buscar por país, capital, continente/i)).toBeInTheDocument()
  })
})
