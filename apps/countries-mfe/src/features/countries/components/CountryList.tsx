import { ErrorBoundary } from 'react-error-boundary'
import type { Country } from '../types'
import CountryCard from './CountryCard'
import { useCountriesStore } from '../store/countriesStore'
import styles from './CountryList.module.scss'

interface Props {
  countries: Country[]
  total: number
  isLoading: boolean
  onView: (country: Country) => void
  onEdit: (country: Country) => void
  onNewCountry: () => void
}

function SkeletonCard() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonBar} />
      <div className={styles.skeletonBody}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className={styles.skeletonCircle} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div className={`${styles.skeletonLine} ${styles.lg}`} />
            <div className={`${styles.skeletonLine} ${styles.md}`} />
          </div>
        </div>
        <div className={`${styles.skeletonLine} ${styles.full}`} />
        <div className={`${styles.skeletonLine} ${styles.full}`} />
        <div className={`${styles.skeletonLine} ${styles.sm}`} />
      </div>
    </div>
  )
}

function ListHeader({ total, onNewCountry, loading }: { total: number; onNewCountry: () => void; loading?: boolean }) {
  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <div className={styles.headerIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1400CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>
        <div>
          <h2 className={styles.headerTitle}>Listado de Países</h2>
          {!loading && (
            <p className={styles.headerCount}>{total} países registrados</p>
          )}
        </div>
      </div>
      <button className={styles.btnNew} onClick={onNewCountry}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Nuevo País
      </button>
    </div>
  )
}

export default function CountryList({ countries, total, isLoading, onView, onEdit, onNewCountry }: Props) {
  const { localCountries } = useCountriesStore()
  const localCodes = new Set(localCountries.map((c) => c.code))

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <ListHeader total={0} onNewCountry={onNewCountry} loading />
        <div className={styles.grid}>
          {Array.from({ length: 20 }, (_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <ListHeader total={total} onNewCountry={onNewCountry} />
      <ErrorBoundary fallback={<p style={{ color: '#ef4444' }}>Error al renderizar países.</p>}>
        <div className={styles.grid}>
          {countries.length === 0 ? (
            <div className={styles.empty}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <h3>Sin resultados</h3>
              <p>No se encontraron países con esa búsqueda.</p>
            </div>
          ) : (
            countries.map((country, i) => (
              <CountryCard
                key={country.code}
                country={country}
                index={i}
                isLocal={localCodes.has(country.code)}
                onView={onView}
                onEdit={onEdit}
              />
            ))
          )}
        </div>
      </ErrorBoundary>
    </div>
  )
}
