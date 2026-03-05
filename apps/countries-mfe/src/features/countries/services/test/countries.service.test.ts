import { fetchCountries } from '@/features/countries/services/countries.service'
import * as graphqlClient from '@/shared/lib/graphqlClient'
import type { CountriesResponse } from '@/features/countries/types'

jest.mock('@/shared/lib/graphqlClient')

const mockGqlRequest = graphqlClient.gqlRequest as jest.MockedFunction<typeof graphqlClient.gqlRequest>

const fakeCountry = {
  code: 'CO',
  name: 'Colombia',
  capital: 'Bogotá',
  currency: 'COP',
  emoji: '🇨🇴',
  phone: '+57',
  continent: { name: 'South America' },
  languages: [{ name: 'Spanish' }],
}

describe('fetchCountries', () => {
  afterEach(() => jest.clearAllMocks())

  it('returns the countries array on success', async () => {
    const response: CountriesResponse = {
      countries: [fakeCountry],
    }
    mockGqlRequest.mockResolvedValue(response)

    const countries = await fetchCountries()
    expect(countries).toHaveLength(1)
    expect(countries[0].code).toBe('CO')
    expect(countries[0].name).toBe('Colombia')
    expect(mockGqlRequest).toHaveBeenCalledWith(expect.stringContaining('query GetCountries'))
  })

  it('propagates gqlRequest errors', async () => {
    mockGqlRequest.mockRejectedValue(new Error('GraphQL Error'))
    await expect(fetchCountries()).rejects.toThrow('GraphQL Error')
  })
})
