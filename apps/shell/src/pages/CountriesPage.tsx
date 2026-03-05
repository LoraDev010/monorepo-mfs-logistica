import { Suspense, lazy } from 'react'
import LoadingScreen from '../shared/components/LoadingScreen'

const CountriesFeature = lazy(() => import('countriesMfe/CountriesFeature'))

export default function CountriesPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <CountriesFeature />
    </Suspense>
  )
}
