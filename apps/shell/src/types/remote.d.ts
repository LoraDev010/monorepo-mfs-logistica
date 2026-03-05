declare module 'usersMfe/UsersFeature' {
  import type { ComponentType } from 'react'

  // Canonical User type — mirrors users-mfe/src/features/users/types.ts
  export interface User {
    login: { uuid: string; username: string }
    name: { title: string; first: string; last: string }
    email: string
    phone: string
    location: { city: string; state: string; country: string }
    picture: { large: string; medium: string; thumbnail: string }
    nat: string
    gender: string
    dob: { age: number; date: string }
  }

  export interface UsersFeatureProps {
    onUserSelect?: (user: User) => void
  }

  export interface UserDetailProps {
    user: User
    onBack?: () => void
  }

  const UsersFeature: ComponentType<UsersFeatureProps>
  export const UserDetail: ComponentType<UserDetailProps>
  export default UsersFeature
}

declare module 'countriesMfe/CountriesFeature' {
  import type { ComponentType } from 'react'

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

  export interface CountriesFeatureProps {
    onCountrySelect?: (country: Country) => void
  }

  const CountriesFeature: ComponentType<CountriesFeatureProps>
  export default CountriesFeature
}
