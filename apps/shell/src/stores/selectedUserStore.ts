import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { User } from '@/types'

interface SelectedUserState {
  user: User | null
  setUser: (user: User | null) => void
}

export const useSelectedUserStore = create<SelectedUserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'selected-user',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)
