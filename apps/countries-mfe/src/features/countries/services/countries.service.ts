import { gqlRequest } from '../../../shared/lib/graphqlClient'
import type { Country, CountriesResponse } from '../types'

const GET_COUNTRIES = /* GraphQL */ `
  query GetCountries {
    countries {
      code
      name
      capital
      currency
      emoji
      phone
      continent {
        name
      }
      languages {
        name
      }
    }
  }
`

export async function fetchCountries(): Promise<Country[]> {
  const data = await gqlRequest<CountriesResponse>(GET_COUNTRIES)
  return data.countries
}
