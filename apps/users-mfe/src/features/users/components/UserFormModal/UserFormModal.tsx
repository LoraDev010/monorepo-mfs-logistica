import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useUsersStore } from '../../store/usersStore'
import type { User } from '../../types'
import styles from './UserFormModal.module.scss'

interface Props {
  open: boolean
  editUser?: User | null
  onClose: () => void
}

interface FormValues {
  firstName: string
  lastName: string
  email: string
  phone: string
  dob: string
  gender: 'male' | 'female'
}

const empty: FormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dob: '',
  gender: 'male',
}

function calcAge(dateStr: string): number {
  const dob = new Date(dateStr)
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
  return age
}

export default function UserFormModal({ open, editUser, onClose }: Props) {
  const addUser = useUsersStore((s) => s.addUser)
  const updateUser = useUsersStore((s) => s.updateUser)

  const [form, setForm] = useState<FormValues>(empty)
  const [errors, setErrors] = useState<Partial<FormValues>>({})

  useEffect(() => {
    if (editUser) {
      setForm({
        firstName: editUser.name.first,
        lastName: editUser.name.last,
        email: editUser.email,
        phone: editUser.phone,
        dob: editUser.dob?.date ? editUser.dob.date.split('T')[0] : '',
        gender: (editUser.gender as 'male' | 'female') || 'male',
      })
    } else {
      setForm(empty)
    }
    setErrors({})
  }, [editUser, open])

  function validate(): boolean {
    const e: Partial<FormValues> = {}
    if (!form.firstName.trim()) e.firstName = 'Requerido'
    if (!form.lastName.trim()) e.lastName = 'Requerido'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido'
    if (!form.phone.trim()) e.phone = 'Requerido'
    if (!form.dob) e.dob = 'Requerido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validate()) return

    const fullName = `${form.firstName} ${form.lastName}`
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=1400CC&color=fff&size=128`

    const user: User = editUser
      ? {
          ...editUser,
          name: { ...editUser.name, first: form.firstName, last: form.lastName },
          email: form.email,
          phone: form.phone,
          gender: form.gender,
          dob: { date: form.dob, age: calcAge(form.dob) },
        }
      : {
          login: { uuid: crypto.randomUUID(), username: form.email },
          name: { title: form.gender === 'male' ? 'Mr' : 'Ms', first: form.firstName, last: form.lastName },
          email: form.email,
          phone: form.phone,
          gender: form.gender,
          dob: { date: form.dob, age: calcAge(form.dob) },
          location: { city: '', state: '', country: '' },
          picture: { large: avatarUrl, medium: avatarUrl, thumbnail: avatarUrl },
          nat: 'CO',
        }

    if (editUser) {
      updateUser(user)
    } else {
      addUser(user)
    }
    onClose()
  }

  function set(field: keyof FormValues) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label={editUser ? 'Editar usuario' : 'Nuevo usuario'}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.backdrop}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.22 }}
            className={styles.panel}
          >
            {/* Header */}
            <div className={styles.panelHeader}>
              <div className={styles.panelHeaderLeft}>
                <div className={styles.panelIconWrap}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFD400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <h2 className={styles.panelTitle}>
                  {editUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                </h2>
              </div>
              <button onClick={onClose} className={styles.closeBtn}>✕</button>
            </div>

            {/* Accent bar */}
            <div className={styles.accentBar} />

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className={styles.form}>
              <div className={styles.twoCol}>
                <Field label="Nombre" error={errors.firstName}>
                  <input
                    className={errors.firstName ? styles.inputError : styles.input}
                    placeholder="Carlos"
                    value={form.firstName}
                    onChange={set('firstName')}
                  />
                </Field>
                <Field label="Apellido" error={errors.lastName}>
                  <input
                    className={errors.lastName ? styles.inputError : styles.input}
                    placeholder="García"
                    value={form.lastName}
                    onChange={set('lastName')}
                  />
                </Field>
              </div>

              <Field label="Correo electrónico" error={errors.email}>
                <input
                  type="email"
                  className={errors.email ? styles.inputError : styles.input}
                  placeholder="carlos@example.com"
                  value={form.email}
                  onChange={set('email')}
                />
              </Field>

              <div className={styles.twoCol}>
                <Field label="Teléfono" error={errors.phone}>
                  <input
                    className={errors.phone ? styles.inputError : styles.input}
                    placeholder="+57 310 987 6543"
                    value={form.phone}
                    onChange={set('phone')}
                  />
                </Field>
                <Field label="Fecha de nacimiento" error={errors.dob}>
                  <input
                    type="date"
                    className={errors.dob ? styles.inputError : styles.input}
                    value={form.dob}
                    onChange={set('dob')}
                  />
                </Field>
              </div>

              <Field label="Género">
                <select className={styles.input} value={form.gender} onChange={set('gender')}>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                </select>
              </Field>

              {/* Actions */}
              <div className={styles.actions}>
                <button type="button" onClick={onClose} className={styles.btnCancel}>
                  Cancelar
                </button>
                <button type="submit" className={styles.btnSubmit}>
                  {editUser ? 'Guardar cambios' : 'Crear usuario'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
      {error && <p className={styles.errorMsg}>{error}</p>}
    </div>
  )
}
