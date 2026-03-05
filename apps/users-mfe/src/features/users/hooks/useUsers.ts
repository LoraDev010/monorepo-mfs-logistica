import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useUsersStore } from '../store/usersStore'
import { fetchUsers } from '../services/users.service'
import type { User } from '../types'

const SEED = 'peoplexplorer'

export function useUsers() {
  const { search, page, pageSize, localUsers, hiddenUuids } = useUsersStore()

  const { data: apiUsers = [], isLoading, isFetching, error } = useQuery({
    queryKey: ['users', SEED],
    queryFn: () => fetchUsers({ seed: SEED, results: 100 }),
  })

  const allUsers = useMemo<User[]>(() => {
    const hidden = new Set(hiddenUuids)
    const visibleApi = apiUsers.filter((u) => !hidden.has(u.login.uuid))
    return [...localUsers, ...visibleApi]
  }, [localUsers, apiUsers, hiddenUuids])

  const filtered = useMemo<User[]>(() => {
    if (!search.trim()) return allUsers
    const q = search.toLowerCase()
    return allUsers.filter(
      (u) =>
        `${u.name.first} ${u.name.last}`.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.location.country.toLowerCase().includes(q),
    )
  }, [allUsers, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safeIndex = Math.min(page - 1, totalPages - 1)
  const paginated = filtered.slice(safeIndex * pageSize, (safeIndex + 1) * pageSize)

  return {
    users: paginated,
    totalPages,
    total: filtered.length,
    isLoading,
    isFetching,
    error,
  }
}

