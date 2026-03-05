import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from '@/shared/components/ErrorFallback'
import { useUsers } from '../hooks/useUsers'
import { useUsersStore } from '../store/usersStore'
import UserCard from './UserCard'
import type { User } from '../types'
import styles from './UserList.module.scss'

interface Props {
  onUserSelect?: (user: User) => void
  onEdit?: (user: User) => void
  onNewUser?: () => void
  total: number
}

export default function UserList({ onUserSelect, onEdit, onNewUser, total }: Props) {
  const { users, isLoading } = useUsers()
  const localUsers = useUsersStore((s) => s.localUsers)
  const localUuids = new Set(localUsers.map((u) => u.login.uuid))

  if (isLoading) {
    return (
      <>
        <ListHeader total={0} onNewUser={onNewUser} loading />
        <div className={styles.grid} aria-busy="true" aria-label="Cargando personas">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={styles.skeleton}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={styles.skeletonBar} />
            </div>
          ))}
        </div>
      </>
    )
  }

  if (!users.length) {
    return (
      <>
        <ListHeader total={total} onNewUser={onNewUser} />
        <div className={styles.empty}>
          <p className={styles.emptyText}>No se encontraron personas con esa búsqueda.</p>
          <p className={styles.emptyHint}>Intenta con otro nombre, correo o país.</p>
        </div>
      </>
    )
  }

  return (
    <ErrorBoundary FallbackComponent={({ error }) => <ErrorFallback error={error} />}>
      <ListHeader total={total} onNewUser={onNewUser} />
      <div className={styles.grid}>
        {users.map((user, i) => (
          <UserCard
            key={user.login.uuid}
            user={user}
            index={i}
            onSelect={onUserSelect}
            onEdit={onEdit}
            isLocal={localUuids.has(user.login.uuid)}
          />
        ))}
      </div>
    </ErrorBoundary>
  )
}

function ListHeader({
  total,
  onNewUser,
  loading,
}: {
  total: number
  onNewUser?: () => void
  loading?: boolean
}) {
  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <div className={styles.headerIcon}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1400CC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div>
          <h2 className={styles.headerTitle}>Listado de Usuarios</h2>
          {!loading && (
            <p className={styles.headerCount}>{total} usuarios registrados</p>
          )}
        </div>
      </div>
      <button onClick={onNewUser} className={styles.btnNew}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Nuevo Usuario
      </button>
    </div>
  )
}

