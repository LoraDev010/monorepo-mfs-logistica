import { useCountriesStore } from '@/features/countries/store/countriesStore'
import type { Country } from '@/features/countries/types'

jest.mock('zustand/middleware', () => ({
  persist: (fn: unknown) => fn,
}))

const makeCountry = (code: string): Country => ({
  code,
  name: `Country ${code}`,
  capital: `Capital ${code}`,
  currency: `${code} Currency`,
  emoji: '🏳️',
  phone: `+${code}`,
  continent: { name: 'Test Continent' },
  languages: [{ name: 'Test Language' }],
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

describe('countriesStore', () => {
  beforeEach(resetStore)

  describe('setSearch', () => {
    it('updates search and resets page to 1', () => {
      useCountriesStore.getState().setPage(3)
      useCountriesStore.getState().setSearch('colombia')
      const { search, page } = useCountriesStore.getState()
      expect(search).toBe('colombia')
      expect(page).toBe(1)
    })
  })

  describe('setPage', () => {
    it('sets the page', () => {
      useCountriesStore.getState().setPage(5)
      expect(useCountriesStore.getState().page).toBe(5)
    })
  })

  describe('addCountry', () => {
    it('prepends country to localCountries', () => {
      const country = makeCountry('LC')
      useCountriesStore.getState().addCountry(country)
      const { localCountries } = useCountriesStore.getState()
      expect(localCountries[0].code).toBe('LC')
    })
  })

  describe('updateCountry', () => {
    it('updates a local country in-place', () => {
      const country = makeCountry('LC1')
      useCountriesStore.getState().addCountry(country)
      useCountriesStore.getState().updateCountry('LC1', { name: 'Updated Name' }, true)
      const { localCountries } = useCountriesStore.getState()
      expect(localCountries.find((c) => c.code === 'LC1')?.name).toBe('Updated Name')
    })

    it('hides an API country when editing', () => {
      useCountriesStore.getState().updateCountry('API1', { name: 'Edited' }, false)
      const { hiddenCodes } = useCountriesStore.getState()
      expect(hiddenCodes).toContain('API1')
    })

    it('does not re-hide if API country is already promoted', () => {
      const country = makeCountry('API2')
      useCountriesStore.getState().addCountry(country)
      useCountriesStore.getState().updateCountry('API2', { name: 'Test' }, false)
      const { hiddenCodes } = useCountriesStore.getState()
      expect(hiddenCodes).not.toContain('API2')
    })
  })

  describe('deleteCountry', () => {
    it('removes a local country from localCountries', () => {
      const country = makeCountry('DEL1')
      useCountriesStore.getState().addCountry(country)
      useCountriesStore.getState().deleteCountry('DEL1', true)
      expect(useCountriesStore.getState().localCountries.find((c) => c.code === 'DEL1')).toBeUndefined()
    })

    it('hides an API country by adding code to hiddenCodes', () => {
      useCountriesStore.getState().deleteCountry('API-DEL', false)
      expect(useCountriesStore.getState().hiddenCodes).toContain('API-DEL')
    })
  })
})
