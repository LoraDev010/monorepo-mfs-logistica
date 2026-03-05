import { useState } from 'react'
import { useCountries } from '../hooks/useCountries'
import type { Country } from '../types'
import CountrySearch from '../components/CountrySearch'
import CountryList from '../components/CountryList'
import Pagination from '../components/Pagination'
import CountryDetailView from '../components/CountryDetailView'
import CountryFormModal from '../components/CountryFormModal'
import styles from './CountriesPage.module.scss'

interface Props {
  onCountrySelect?: (country: Country) => void
}

export default function CountriesPage({ onCountrySelect }: Props) {
  const { countries, totalPages, total, isLoading, isFetching, error } = useCountries()

  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editCountry, setEditCountry] = useState<Country | null>(null)

  const handleView = (country: Country) => {
    setSelectedCountry(country)
    if (onCountrySelect) onCountrySelect(country)
    window.dispatchEvent(new CustomEvent('country:selected', { detail: country }))
  }

  const handleEdit = (country: Country) => {
    setEditCountry(country)
    setModalOpen(true)
  }

  const handleNewCountry = () => {
    setEditCountry(null)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditCountry(null)
  }

  return (
    <div className={styles.page}>
      {/* Hero header */}
      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroTop}>
            <div>
              <h1 className={styles.heroTitle}>
                Explorer de <span>Países</span>
              </h1>
              <p className={styles.heroSub}>
                Datos en tiempo real vía GraphQL · {total} países disponibles
              </p>
            </div>
          </div>
          <div className={styles.accentBar} />
        </div>
        <div className={styles.heroWave}>
          <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 64H1440V32C1200 64 960 64 720 32C480 0 240 0 0 32V64Z" fill="#f0f2f8" />
          </svg>
        </div>
      </div>

      {/* Body */}
      <div className={styles.body}>
        {/* Error state */}
        {error && (
          <div className={styles.errorBox}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Error al cargar países. Verifica tu conexión.
          </div>
        )}

        {/* Search toolbar */}
        <div className={styles.searchRow}>
          <CountrySearch />
          {isFetching && !isLoading && (
            <span className={styles.syncing}>Sincronizando…</span>
          )}
        </div>

        {/* List */}
        <CountryList
          countries={countries}
          total={total}
          isLoading={isLoading}
          onView={handleView}
          onEdit={handleEdit}
          onNewCountry={handleNewCountry}
        />

        {/* Pagination */}
        <Pagination totalPages={totalPages} total={total} />
      </div>

      {/* Detail modal */}
      <CountryDetailView
        country={selectedCountry}
        onClose={() => setSelectedCountry(null)}
      />

      {/* Form modal */}
      <CountryFormModal
        open={modalOpen}
        editCountry={editCountry}
        onClose={handleCloseModal}
      />
    </div>
  )
}
