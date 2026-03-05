import { AnimatePresence, motion } from 'motion/react'
import type { Country } from '../../types'
import styles from './CountryDetailView.module.scss'

interface Props {
  country: Country | null
  onClose: () => void
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className={styles.infoLabel}>{label}</div>
      <div className={styles.infoValue}>{value}</div>
    </div>
  )
}

export default function CountryDetailView({ country, onClose }: Props) {
  return (
    <AnimatePresence>
      {country && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className={styles.panel}
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            role="dialog"
            aria-modal="true"
            aria-label={`Detalle de ${country.name}`}
          >
            <button className={styles.btnX} onClick={onClose} aria-label="Cerrar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Hero */}
            <div className={styles.hero}>
              <div className={styles.flag} role="img" aria-label={`Bandera de ${country.name}`}>
                {country.emoji}
              </div>
              <h2 className={styles.countryName}>{country.name}</h2>
              <span className={styles.codeBadge}>{country.code}</span>
            </div>

            {/* Content */}
            <div className={styles.content}>
              <div className={styles.grid}>
                {/* Geografía */}
                <div className={styles.infoCard}>
                  <div className={styles.infoCardTitle}>Geografía</div>
                  <InfoItem label="Capital" value={country.capital ?? 'Sin capital'} />
                  <InfoItem label="Continente" value={country.continent.name} />
                  <InfoItem label="Código ISO" value={country.code} />
                  <InfoItem label="Teléfono" value={`+${country.phone}`} />
                </div>

                {/* Economía & Idiomas */}
                <div className={styles.infoCard}>
                  <div className={styles.infoCardTitle}>Economía e Idiomas</div>
                  <InfoItem label="Moneda" value={country.currency ?? 'Sin moneda'} />
                  <div>
                    <div className={styles.infoLabel}>
                      Idiomas ({country.languages.length})
                    </div>
                    {country.languages.length > 0 ? (
                      <div className={styles.badges}>
                        {country.languages.map((l) => (
                          <span key={l.name} className={styles.langBadge}>{l.name}</span>
                        ))}
                      </div>
                    ) : (
                      <div className={styles.infoValue}>Sin registro</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.footer}>
              <button className={styles.btnClose} onClick={onClose}>
                Cerrar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
