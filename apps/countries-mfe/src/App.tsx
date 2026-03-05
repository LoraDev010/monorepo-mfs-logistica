import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './shared/lib/queryClient'
import CountriesFeature from './features/countries/index'
import styles from './App.module.scss'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={styles.wrap}>
        {/* Andres Lora S.A.S-style top bar */}
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <span className={styles.logoMark}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8.5L6.5 12L13 4" stroke="#FFD400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className={styles.logoText}>
              Andres Lora S.A.S<span className={styles.logoPeople}>People</span>
            </span>
          </div>
        </header>

        {/* Countries feature (includes its own hero) */}
        <CountriesFeature />
      </div>
    </QueryClientProvider>
  )
}
