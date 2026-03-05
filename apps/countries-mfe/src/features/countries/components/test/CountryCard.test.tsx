import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CountryCard from '@/features/countries/components/CountryCard'
import { useCountriesStore } from '@/features/countries/store/countriesStore'
import type { Country } from '@/features/countries/types'

jest.mock('zustand/middleware', () => ({
  persist: (fn) => fn,
}))

const country: Country = {
  code: 'CO',
  name: 'Colombia',
  capital: 'Bogotá',
  currency: 'COP',
  emoji: '🇨🇴',
  phone: '+57',
  continent: { name: 'South America' },
  languages: [{ name: 'Spanish' }, { name: 'English' }],
}

function resetStore() {
  useCountriesStore.setState({
    search: '',
    page: 1,
    pageSize: 20,
    localCountries: [],
    hiddenCodes: [],
  })
}

describe('CountryCard', () => {
  beforeEach(() => {
    resetStore()
    jest.restoreAllMocks()
  })

  it('renders country name, capital, and continent', () => {
    const onView = jest.fn()
    const onEdit = jest.fn()
    render(<CountryCard country={country} index={0} isLocal={false} onView={onView} onEdit={onEdit} />)
    expect(screen.getByText('Colombia')).toBeInTheDocument()
    expect(screen.getByText('Bogotá')).toBeInTheDocument()
    expect(screen.getByText('South America')).toBeInTheDocument()
    expect(screen.getByText('COP')).toBeInTheDocument()
  })

  it('calls onView when "Ver" is clicked', () => {
    const onView = jest.fn()
    const onEdit = jest.fn()
    render(<CountryCard country={country} index={0} isLocal={false} onView={onView} onEdit={onEdit} />)
    fireEvent.click(screen.getByText('Ver'))
    expect(onView).toHaveBeenCalledWith(country)
  })

  it('calls onEdit when "Editar" is clicked', () => {
    const onView = jest.fn()
    const onEdit = jest.fn()
    render(<CountryCard country={country} index={0} isLocal={false} onView={onView} onEdit={onEdit} />)
    fireEvent.click(screen.getByText('Editar'))
    expect(onEdit).toHaveBeenCalledWith(country)
  })

  it('calls deleteCountry when delete button is clicked and confirmed', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true)
    const onView = jest.fn()
    const onEdit = jest.fn()
    render(<CountryCard country={country} index={0} isLocal={false} onView={onView} onEdit={onEdit} />)
    
    const deleteBtn = screen.getByRole('button', { name: '' }).parentElement?.querySelector('button:last-child')
    if (deleteBtn) fireEvent.click(deleteBtn)
    
    expect(useCountriesStore.getState().hiddenCodes).toContain('CO')
  })

  it('does NOT delete when confirm is cancelled', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false)
    const onView = jest.fn()
    const onEdit = jest.fn()
    render(<CountryCard country={country} index={0} isLocal={false} onView={onView} onEdit={onEdit} />)
    
    const deleteBtn = screen.getByRole('button', { name: '' }).parentElement?.querySelector('button:last-child')
    if (deleteBtn) fireEvent.click(deleteBtn)
    
    expect(useCountriesStore.getState().hiddenCodes).not.toContain('CO')
  })

  it('shows local badge when isLocal is true', () => {
    const onView = jest.fn()
    const onEdit = jest.fn()
    render(<CountryCard country={country} index={0} isLocal onView={onView} onEdit={onEdit} />)
    expect(screen.getByText('Local')).toBeInTheDocument()
  })

  it('renders languages', () => {
    const onView = jest.fn()
    const onEdit = jest.fn()
    render(<CountryCard country={country} index={0} isLocal={false} onView={onView} onEdit={onEdit} />)
    expect(screen.getByText('Spanish')).toBeInTheDocument()
    expect(screen.getByText('English')).toBeInTheDocument()
  })

  it('shows +count badge when more than 3 languages', () => {
    const countryManyLangs = {
      ...country,
      languages: [
        { name: 'Lang1' },
        { name: 'Lang2' },
        { name: 'Lang3' },
        { name: 'Lang4' },
        { name: 'Lang5' },
      ],
    }
    const onView = jest.fn()
    const onEdit = jest.fn()
    render(<CountryCard country={countryManyLangs} index={0} isLocal={false} onView={onView} onEdit={onEdit} />)
    expect(screen.getByText('+2')).toBeInTheDocument()
  })
})
