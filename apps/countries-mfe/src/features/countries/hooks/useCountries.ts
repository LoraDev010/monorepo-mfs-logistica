import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchCountries } from '../services/countries.service'
import { useCountriesStore } from '../store/countriesStore'
import { useDebounce } from '../../../shared/hooks/useDebounce'
import type { Country } from '../types'

export function useCountries() {
  const { search, page, pageSize, localCountries, hiddenCodes } = useCountriesStore()
  const debouncedSearch = useDebounce(search, 300)

  const { data: apiCountries = [], isLoading, isFetching, error } = useQuery<Country[]>({
    queryKey: ['countries'],
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 5,
  })

  const countries = useMemo(() => {
    const hiddenSet = new Set(hiddenCodes)

    // Merge: local first, then API filtered by hiddenCodes
    const merged: Country[] = [
      ...localCountries,
      ...apiCountries.filter((c) => !hiddenSet.has(c.code)),
    ]

    // Client-side search
    if (!debouncedSearch.trim()) return merged

    const q = debouncedSearch.toLowerCase()
    return merged.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.capital ?? '').toLowerCase().includes(q) ||
        c.continent.name.toLowerCase().includes(q) ||
        (c.currency ?? '').toLowerCase().includes(q) ||
        c.languages.some((l) => l.name.toLowerCase().includes(q))
    )
  }, [apiCountries, localCountries, hiddenCodes, debouncedSearch])

  const total = countries.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return countries.slice(start, start + pageSize)
  }, [countries, page, pageSize])

  return { countries: paginated, totalPages, total, isLoading, isFetching, error }
}
