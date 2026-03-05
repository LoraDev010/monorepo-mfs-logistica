import { motion } from 'motion/react'
import type { User } from '../types'

interface Props {
  user: User
  onBack?: () => void
}

export default function UserDetailPage({ user, onBack }: Props) {
  const fullName = `${user.name.first} ${user.name.last}`
  const dob = user.dob?.date
    ? new Date(user.dob.date).toLocaleDateString('es-CO', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—'

  return (
    <div className="bg-bg min-h-screen">
      {/* Blue gradient header */}
      <div
        className="pt-8 pb-16 px-6 relative"
        style={{ background: 'linear-gradient(135deg, #1400CC 0%, #2a1de8 100%)' }}
      >
        {/* Accent bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent" />
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFD400" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h1 className="font-display font-bold text-white text-xl">Detalle de Usuario</h1>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-brand text-sm font-semibold font-body hover:bg-white/90 transition-colors shadow-md"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Volver
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 -mt-16 pb-16">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 bg-surface rounded-2xl border border-border shadow-md p-6 mb-6 flex items-center gap-5"
        >
          <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-brand/20 shadow-md shrink-0">
            <img
              src={user.picture.large}
              alt={fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl text-text-primary leading-none">{fullName}</h2>
            <p className="text-text-secondary text-sm font-body mt-1.5">
              {user.dob?.age} años
            </p>
          </div>
        </motion.div>

        {/* 3-column info grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <InfoCard
            index={0}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1400CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72c.127.96.36 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0 1 21.73 17.5z" />
              </svg>
            }
            title="Información de Contacto"
            items={[
              { label: 'EMAIL', value: user.email, accent: true },
              { label: 'TELÉFONO', value: user.phone, accent: true },
              { label: 'FECHA DE NACIMIENTO', value: dob },
            ]}
          />
          <InfoCard
            index={1}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1400CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><line x1="12" y1="12" x2="12" y2="16" /><line x1="10" y1="14" x2="14" y2="14" />
              </svg>
            }
            title="Información Personal"
            items={[
              { label: 'NOMBRE', value: user.name.first },
              { label: 'APELLIDO', value: user.name.last },
              { label: 'GÉNERO', value: user.gender === 'male' ? 'Masculino' : 'Femenino' },
            ]}
          />
          <InfoCard
            index={2}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1400CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            }
            title="Información del Sistema"
            items={[
              { label: 'ID DEL USUARIO', value: user.login.uuid, mono: true },
              { label: 'ALMACENAMIENTO', value: 'Los datos se guardan en localStorage del navegador' },
              { label: 'PRIVACIDAD', value: 'Todos los datos permanecen en tu navegador' },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

interface InfoItem {
  label: string
  value: string
  accent?: boolean
  mono?: boolean
}

function InfoCard({
  title,
  icon,
  items,
  index,
}: {
  title: string
  icon: React.ReactNode
  items: InfoItem[]
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden"
    >
      {/* Card top accent bar — brand blue */}
      <div className="h-1 bg-brand" />

      <div className="p-5">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <h3 className="font-display font-bold text-sm text-text-primary">{title}</h3>
        </div>
        <ul className="space-y-3">
          {items.map(({ label, value, accent, mono }) => (
            <li key={label} className="bg-white rounded-xl border border-border px-4 py-3">
              <p className="text-[10px] font-semibold text-text-secondary font-body uppercase tracking-wide mb-1">{label}</p>
              <p
                className={`text-sm font-body break-all ${
                  accent ? 'text-brand font-semibold' : mono ? 'text-text-secondary font-mono text-[11px]' : 'text-text-primary'
                }`}
              >
                {value}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
