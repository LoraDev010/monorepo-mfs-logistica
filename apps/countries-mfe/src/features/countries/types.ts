export interface Continent {
  name: string
}

export interface Language {
  name: string
}

export interface Country {
  code: string
  name: string
  capital: string | null
  currency: string | null
  emoji: string
  phone: string
  continent: Continent
  languages: Language[]
}

export interface CountriesResponse {
  countries: Country[]
}
