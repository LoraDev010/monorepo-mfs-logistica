import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useCountries } from '@/features/countries/hooks/useCountries'
import { useCountriesStore } from '@/features/countries/store/countriesStore'
import type { Country } from '@/features/countries/types'

jest.mock('@/features/countries/services/countries.service')
import { fetchCountries } from '@/features/countries/services/countries.service'
const mockFetchCountries = fetchCountries as jest.MockedFunction<typeof fetchCountries>

function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  Wrapper.displayName = 'TestWrapper'
  return Wrapper
}

const buildCountry = (i: number): Country => ({
  code: `C${i}`,
  name: `Country${i}`,
  capital: `Capital${i}`,
  currency: `CUR${i}`,
  emoji: '🏳️',
  phone: `+${i}`,
  continent: { name: 'Continent' },
  languages: [{ name: `Lang${i}` }],
})

function resetStore() {
  useCountriesStore.setState({
    search: '',
    page: 1,
    pageSize: 20,
    localCountries: [],
    hiddenCodes: [],
  })
}

describe('useCountries', () => {
  beforeEach(() => {
    resetStore()
    jest.clearAllMocks()
  })

  it('returns isLoading while fetching', () => {
    mockFetchCountries.mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useCountries(), { wrapper: makeWrapper() })
    expect(result.current.isLoading).toBe(true)
  })

  it('returns paginated countries on success', async () => {
    const allCountries = Array.from({ length: 25 }, (_, i) => buildCountry(i))
    mockFetchCountries.mockResolvedValue(allCountries)

    const { result } = renderHook(() => useCountries(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.total).toBe(25)
    expect(result.current.countries).toHaveLength(20)
    expect(result.current.totalPages).toBe(2)
  })

  it('filters countries by search term', async () => {
    const allCountries = [buildCountry(0), buildCountry(1)]
    mockFetchCountries.mockResolvedValue(allCountries)
    useCountriesStore.getState().setSearch('Country0')

    const { result } = renderHook(() => useCountries(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.countries).toHaveLength(1)
    expect(result.current.countries[0].code).toBe('C0')
  })

  it('hides API countries that are in hiddenCodes', async () => {
    const allCountries = [buildCountry(0), buildCountry(1)]
    mockFetchCountries.mockResolvedValue(allCountries)
    useCountriesStore.setState({ hiddenCodes: ['C0'] })

    const { result } = renderHook(() => useCountries(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.countries).toHaveLength(1)
    expect(result.current.countries[0].code).toBe('C1')
  })

  it('prepends localCountries in front of API countries', async () => {
    const apiCountries = [buildCountry(0)]
    mockFetchCountries.mockResolvedValue(apiCountries)
    const localCountry = buildCountry(99)
    useCountriesStore.setState({ localCountries: [localCountry] })

    const { result } = renderHook(() => useCountries(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.countries).toHaveLength(2)
    expect(result.current.countries[0].code).toBe('C99')
  })

  it('filters by capital when searching', async () => {
    const allCountries = [buildCountry(0), buildCountry(1)]
    mockFetchCountries.mockResolvedValue(allCountries)
    useCountriesStore.getState().setSearch('Capital0')

    const { result } = renderHook(() => useCountries(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.countries).toHaveLength(1)
    expect(result.current.countries[0].capital).toBe('Capital0')
  })

  it('filters by continent when searching', async () => {
    const c1 = { ...buildCountry(0), continent: { name: 'Europe' } }
    const c2 = { ...buildCountry(1), continent: { name: 'Asia' } }
    mockFetchCountries.mockResolvedValue([c1, c2])
    useCountriesStore.getState().setSearch('Europe')

    const { result } = renderHook(() => useCountries(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.countries).toHaveLength(1)
    expect(result.current.countries[0].continent.name).toBe('Europe')
  })
})
