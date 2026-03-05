import { motion } from 'motion/react'
import { useCountriesStore } from '../store/countriesStore'
import type { Country } from '../types'
import styles from './CountryCard.module.scss'

interface Props {
  country: Country
  index: number
  isLocal: boolean
  onView: (country: Country) => void
  onEdit: (country: Country) => void
}

function InfoRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className={styles.infoRow}>
      {icon}
      <span title={text}>{text}</span>
    </div>
  )
}

export default function CountryCard({ country, index, isLocal, onView, onEdit }: Props) {
  const deleteCountry = useCountriesStore((s) => s.deleteCountry)

  const handleDelete = () => {
    if (confirm(`¿Eliminar ${country.name}?`)) {
      deleteCountry(country.code, isLocal)
    }
  }

  return (
    <motion.article
      className={`${styles.card} ${isLocal ? styles.local : ''}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035, duration: 0.25 }}
      whileHover={{ y: -3 }}
    >
      {isLocal && <span className={styles.localBadge}>Local</span>}

      <div className={styles.body}>
        <div className={styles.header}>
          <div className={styles.avatar} role="img" aria-label={`Bandera de ${country.name}`}>
            {country.emoji}
          </div>
          <div style={{ minWidth: 0 }}>
            <div className={styles.name}>{country.name}</div>
            <span className={styles.code}>{country.code}</span>
          </div>
        </div>

        <div className={styles.info}>
          <InfoRow
            icon={
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            }
            text={country.capital ?? 'Sin capital'}
          />
          <InfoRow
            icon={
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            }
            text={country.continent.name}
          />
          <InfoRow
            icon={
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            }
            text={country.currency ?? 'Sin moneda'}
          />
        </div>

        {country.languages.length > 0 && (
          <div className={styles.divider} />
        )}

        {country.languages.length > 0 && (
          <div className={styles.languagesRow}>
            {country.languages.slice(0, 3).map((l) => (
              <span key={l.name} className={styles.langBadge}>{l.name}</span>
            ))}
            {country.languages.length > 3 && (
              <span className={styles.langBadge}>+{country.languages.length - 3}</span>
            )}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button className={styles.btnView} onClick={() => onView(country)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Ver
        </button>
        <button className={styles.btnEdit} onClick={() => onEdit(country)}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          Editar
        </button>
        <button className={styles.btnDelete} onClick={handleDelete}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </motion.article>
  )
}
