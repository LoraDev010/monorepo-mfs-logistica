import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../../shared/lib/queryClient'
import CountriesPage from './pages/CountriesPage'
import type { Country } from './types'

export interface CountriesFeatureProps {
  onCountrySelect?: (country: Country) => void
}

const CountriesFeature: React.FC<CountriesFeatureProps> = ({ onCountrySelect }) => (
  <QueryClientProvider client={queryClient}>
    <CountriesPage onCountrySelect={onCountrySelect} />
  </QueryClientProvider>
)

export type { Country }
export default CountriesFeature
