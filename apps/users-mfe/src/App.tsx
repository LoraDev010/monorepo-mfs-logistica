import { useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/shared/lib/queryClient'
import UsersPage from '@/features/users/pages/UsersPage'
import UserDetailPage from '@/features/users/pages/UserDetailPage'
import type { User } from '@/features/users/types'
import styles from './App.module.scss'

export default function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  function handleUserSelect(user: User) {
    setSelectedUser(user)
    window.dispatchEvent(new CustomEvent('user:selected', { detail: user }))
  }

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

        {selectedUser ? (
          <UserDetailPage user={selectedUser} onBack={() => setSelectedUser(null)} />
        ) : (
          <>
            {/* Hero */}
            <div className={styles.hero}>
              <div className={styles.heroPattern} />
              <div className={styles.heroContent}>
                <p className={styles.heroLabel}>Directorio de Personas</p>
                <h1 className={styles.heroTitle}>Explora el equipo</h1>
                <p className={styles.heroSub}>
                  100 contactos globales. Busca y filtra por nombre, correo o país.
                </p>
              </div>
              <div className={styles.heroWave}>
                <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                  <path d="M0 64H1440V32C1200 64 960 64 720 32C480 0 240 0 0 32V64Z" fill="white" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <main className={styles.main}>
              <UsersPage onUserSelect={handleUserSelect} />
            </main>
          </>
        )}
      </div>
    </QueryClientProvider>
  )
}
