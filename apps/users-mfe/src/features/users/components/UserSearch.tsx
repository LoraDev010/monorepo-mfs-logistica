import { useEffect, useState } from 'react'
import { useUsersStore } from '../store/usersStore'
import { useDebounce } from '@/shared/hooks/useDebounce'
import styles from './UserSearch.module.scss'

export default function UserSearch() {
  const setSearch = useUsersStore((s) => s.setSearch)
  const [value, setValue] = useState('')
  const debounced = useDebounce(value, 300)

  useEffect(() => {
    setSearch(debounced)
  }, [debounced, setSearch])

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.icon}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.2}
          d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar por nombre, correo o país…"
        className={styles.input}
        aria-label="Buscar personas"
      />
    </div>
  )
}
