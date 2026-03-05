import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Country } from '../types'

interface CountriesState {
  search: string
  page: number
  pageSize: number
  localCountries: Country[]
  hiddenCodes: string[]
  setSearch: (search: string) => void
  setPage: (page: number) => void
  addCountry: (country: Country) => void
  updateCountry: (code: string, patch: Partial<Country>, isLocalCountry: boolean) => void
  deleteCountry: (code: string, isLocalCountry: boolean) => void
}

export const useCountriesStore = create<CountriesState>()(
  persist(
    (set) => ({
      search: '',
      page: 1,
      pageSize: 20,
      localCountries: [],
      hiddenCodes: [],

      setSearch: (search) => set({ search, page: 1 }),
      setPage: (page) => set({ page }),

      addCountry: (country) =>
        set((state) => ({
          localCountries: [country, ...state.localCountries],
        })),

      updateCountry: (code, patch, isLocalCountry) =>
        set((state) => {
          if (isLocalCountry) {
            return {
              localCountries: state.localCountries.map((c) =>
                c.code === code ? { ...c, ...patch } : c
              ),
            }
          }
          // API country: promote to local with patch, hide original
          const apiCountriesSnapshot = state.localCountries.find((c) => c.code === code)
          if (apiCountriesSnapshot) return {} // already promoted

          return {
            hiddenCodes: [...state.hiddenCodes, code],
          }
        }),

      deleteCountry: (code, isLocalCountry) =>
        set((state) => {
          if (isLocalCountry) {
            return {
              localCountries: state.localCountries.filter((c) => c.code !== code),
            }
          }
          return {
            hiddenCodes: [...state.hiddenCodes, code],
          }
        }),
    }),
    {
      name: 'countries-store',
      partialize: (state) => ({
        localCountries: state.localCountries,
        hiddenCodes: state.hiddenCodes,
      }),
    }
  )
)
