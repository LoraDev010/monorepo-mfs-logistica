import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface UsersState {
  search: string
  page: number
  pageSize: number
  localUsers: User[]
  hiddenUuids: string[]
  setSearch: (search: string) => void
  setPage: (page: number) => void
  addUser: (user: User) => void
  updateUser: (user: User) => void
  deleteUser: (uuid: string) => void
}

export const useUsersStore = create<UsersState>()(
  persist(
    (set, get) => ({
      search: '',
      page: 1,
      pageSize: 12,
      localUsers: [],
      hiddenUuids: [],
      setSearch: (search) => set({ search, page: 1 }),
      setPage: (page) => set({ page }),
      addUser: (user) =>
        set((s) => ({ localUsers: [user, ...s.localUsers], page: 1 })),
      updateUser: (user) => {
        const isLocal = get().localUsers.some((u) => u.login.uuid === user.login.uuid)
        if (isLocal) {
          set((s) => ({
            localUsers: s.localUsers.map((u) =>
              u.login.uuid === user.login.uuid ? user : u,
            ),
          }))
        } else {
          // API user being edited: promote to local and hide the original API entry
          set((s) => ({
            localUsers: [user, ...s.localUsers],
            hiddenUuids: [...s.hiddenUuids, user.login.uuid],
          }))
        }
      },
      deleteUser: (uuid) => {
        const isLocal = get().localUsers.some((u) => u.login.uuid === uuid)
        if (isLocal) {
          set((s) => ({ localUsers: s.localUsers.filter((u) => u.login.uuid !== uuid) }))
        } else {
          set((s) => ({ hiddenUuids: [...s.hiddenUuids, uuid] }))
        }
      },
    }),
    {
      name: 'users-store',
      partialize: (s) => ({ localUsers: s.localUsers, hiddenUuids: s.hiddenUuids }),
    },
  ),
)

