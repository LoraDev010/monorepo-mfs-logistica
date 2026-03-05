import { useState } from 'react'
import { useUsers } from '../hooks/useUsers'
import UserSearch from '../components/UserSearch'
import UserList from '../components/UserList'
import Pagination from '../components/Pagination'
import UserFormModal from '../components/UserFormModal'
import type { User } from '../types'
import styles from './UsersPage.module.scss'

interface Props {
  onUserSelect?: (user: User) => void
}

export default function UsersPage({ onUserSelect }: Props) {
  const { totalPages, total, isFetching } = useUsers()
  const [modalOpen, setModalOpen] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)

  function handleNewUser() {
    setEditUser(null)
    setModalOpen(true)
  }

  function handleEdit(user: User) {
    setEditUser(user)
    setModalOpen(true)
  }

  function handleClose() {
    setModalOpen(false)
    setEditUser(null)
  }

  return (
    <div className={styles.root}>
      {/* Search bar */}
      <div className={styles.searchRow}>
        <div className={styles.searchWrap}>
          <UserSearch />
        </div>
        {isFetching && (
          <span className={styles.syncing}>Syncing…</span>
        )}
      </div>

      {/* List with header */}
      <UserList
        onUserSelect={onUserSelect}
        onEdit={handleEdit}
        onNewUser={handleNewUser}
        total={total}
      />

      <Pagination totalPages={totalPages} total={total} />

      <UserFormModal open={modalOpen} editUser={editUser} onClose={handleClose} />
    </div>
  )
}

