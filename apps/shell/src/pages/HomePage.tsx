import React, { Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingScreen from '@/shared/components/LoadingScreen'
import { useSelectedUserStore } from '@/stores/selectedUserStore'
import type { User } from '@/types'

const UsersFeature = React.lazy(() => import('usersMfe/UsersFeature'))

export default function HomePage() {
  const navigate = useNavigate()
  const setUser = useSelectedUserStore((s) => s.setUser)

  function handleUserSelect(user: User) {
    setUser(user)
    navigate(`/users/${user.login.uuid}`)
  }

  return (
    <div className="bg-bg min-h-screen">
      {/* ── Hero banner ── */}
      <div className="relative bg-brand overflow-hidden">
        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, #ffffff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 pt-10 pb-20">
          <p className="text-accent font-display font-semibold text-xs uppercase tracking-widest mb-2">
            Directorio de Personas
          </p>
          <h1 className="font-display text-4xl font-extrabold text-white">Explora el equipo</h1>
          <p className="text-blue-200 font-body mt-2 text-base max-w-lg">
            100 contactos globales. Busca y filtra por nombre, correo o país.
          </p>
        </div>
        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-12">
            <path d="M0 64H1440V32C1200 64 960 64 720 32C480 0 240 0 0 32V64Z" fill="#f0f2f8" />
          </svg>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-7xl px-6 py-10">
        <Suspense fallback={<LoadingScreen />}>
          <UsersFeature onUserSelect={handleUserSelect} />
        </Suspense>
      </div>
    </div>
  )
}
