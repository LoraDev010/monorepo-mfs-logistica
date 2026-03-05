import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useCountriesStore } from '../../store/countriesStore'
import type { Country } from '../../types'
import styles from './CountryFormModal.module.scss'

interface Props {
  open: boolean
  editCountry: Country | null
  onClose: () => void
}

type FormErrors = Partial<Record<
  'code' | 'name' | 'capital' | 'currency' | 'emoji' | 'phone' | 'continent',
  string
>>

const CONTINENTS = [
  'Africa', 'Antarctica', 'Asia', 'Europe',
  'North America', 'Oceania', 'South America',
]

function getInitialForm(country?: Country | null) {
  return {
    code: country?.code ?? '',
    name: country?.name ?? '',
    capital: country?.capital ?? '',
    currency: country?.currency ?? '',
    emoji: country?.emoji ?? '',
    phone: country?.phone ?? '',
    continent: country?.continent.name ?? '',
  }
}

export default function CountryFormModal({ open, editCountry, onClose }: Props) {
  const { addCountry, updateCountry, localCountries } = useCountriesStore()
  const [form, setForm] = useState(() => getInitialForm(editCountry))
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (open) {
      setForm(getInitialForm(editCountry))
      setErrors({})
    }
  }, [open, editCountry])

  const set = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = (): boolean => {
    const errs: FormErrors = {}
    if (!form.code.trim()) errs.code = 'Requerido'
    else if (!/^[A-Z]{2,3}$/.test(form.code.toUpperCase())) errs.code = 'Código ISO: 2-3 letras (ej: MX)'
    if (!form.name.trim()) errs.name = 'Requerido'
    if (!form.emoji.trim()) errs.emoji = 'Requerido'
    if (!form.continent.trim()) errs.continent = 'Requerido'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const code = form.code.toUpperCase()
    const country: Country = {
      code,
      name: form.name.trim(),
      capital: form.capital.trim() || null,
      currency: form.currency.trim() || null,
      emoji: form.emoji.trim(),
      phone: form.phone.trim(),
      continent: { name: form.continent },
      languages: editCountry?.languages ?? [],
    }

    if (editCountry) {
      const isLocal = localCountries.some((c) => c.code === editCountry.code)
      updateCountry(editCountry.code, country, isLocal)
    } else {
      addCountry(country)
    }

    onClose()
  }

  const cls = (f: keyof FormErrors) =>
    `${styles.input} ${errors[f] ? styles.error : ''}`.trim()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className={styles.panel}
            initial={{ scale: 0.95, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            role="dialog"
            aria-modal="true"
            aria-label={editCountry ? 'Editar país' : 'Nuevo país'}
          >
            {/* Gradient header */}
            <div className={styles.panelHeader}>
              <div className={styles.panelHeaderLeft}>
                <div className={styles.panelIconWrap}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFD400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <h2 className={styles.panelTitle}>
                  {editCountry ? `Editar: ${editCountry.name}` : 'Nuevo País'}
                </h2>
              </div>
              <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">✕</button>
            </div>

            {/* Accent bar */}
            <div className={styles.accentBar} />

            <form onSubmit={handleSubmit}>
              <div className={styles.form}>

                {/* Code + Emoji */}
                <div className={styles.grid2}>
                  <div className={styles.field}>
                    <label className={styles.label}>Código ISO *</label>
                    <input className={cls('code')} placeholder="MX" value={form.code} onChange={set('code')} maxLength={3} />
                    {errors.code && <span className={styles.errMsg}>{errors.code}</span>}
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Emoji bandera *</label>
                    <input className={cls('emoji')} placeholder="🇲🇽" value={form.emoji} onChange={set('emoji')} />
                    {errors.emoji && <span className={styles.errMsg}>{errors.emoji}</span>}
                  </div>
                </div>

                {/* Name */}
                <div className={styles.field}>
                  <label className={styles.label}>Nombre del país *</label>
                  <input className={cls('name')} placeholder="México" value={form.name} onChange={set('name')} />
                  {errors.name && <span className={styles.errMsg}>{errors.name}</span>}
                </div>

                {/* Capital + Continent */}
                <div className={styles.grid2}>
                  <div className={styles.field}>
                    <label className={styles.label}>Capital</label>
                    <input className={styles.input} placeholder="Ciudad de México" value={form.capital} onChange={set('capital')} />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Continente *</label>
                    <select
                      className={`${styles.select} ${errors.continent ? styles.error : ''}`}
                      value={form.continent}
                      onChange={set('continent')}
                    >
                      <option value="">Seleccionar…</option>
                      {CONTINENTS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {errors.continent && <span className={styles.errMsg}>{errors.continent}</span>}
                  </div>
                </div>

                {/* Currency + Phone */}
                <div className={styles.grid2}>
                  <div className={styles.field}>
                    <label className={styles.label}>Moneda</label>
                    <input className={styles.input} placeholder="MXN" value={form.currency} onChange={set('currency')} />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Código de teléfono</label>
                    <input className={styles.input} placeholder="52" value={form.phone} onChange={set('phone')} />
                  </div>
                </div>

              </div>

              <div className={styles.footer}>
                <button type="button" className={styles.btnCancel} onClick={onClose}>
                  Cancelar
                </button>
                <button type="submit" className={styles.btnSave}>
                  {editCountry ? 'Guardar cambios' : 'Crear país'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
