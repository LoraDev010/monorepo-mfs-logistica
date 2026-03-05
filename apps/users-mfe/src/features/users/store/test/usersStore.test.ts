import { useUsersStore } from '@/features/users/store/usersStore'
import type { User } from '@/features/users/types'

// Mock zustand's persist middleware so localStorage isn't needed in tests
jest.mock('zustand/middleware', () => ({
  persist: (fn: unknown) => fn,
}))

const makeUser = (uuid: string, local = false): User => ({
  login: { uuid, username: `user_${uuid}` },
  name: { title: 'Mr', first: 'Test', last: 'User' },
  email: `${uuid}@test.com`,
  phone: '123',
  gender: 'male',
  dob: { date: '1990-01-01', age: 34 },
  location: { city: 'Bogotá', state: 'DC', country: 'Colombia' },
  picture: { large: '', medium: '', thumbnail: '' },
  nat: 'CO',
  // local flag is managed externally via store state, not on User object
  // Adding this so it compiles — the actual isLocal check is done in UserList
  ...(local ? {} : {}),
})

function resetStore() {
  useUsersStore.setState({
    search: '',
    page: 1,
    pageSize: 12,
    localUsers: [],
    hiddenUuids: [],
  })
}

describe('usersStore', () => {
  beforeEach(resetStore)

  describe('setSearch', () => {
    it('updates search and resets page to 1', () => {
      useUsersStore.getState().setPage(3)
      useUsersStore.getState().setSearch('colombia')
      const { search, page } = useUsersStore.getState()
      expect(search).toBe('colombia')
      expect(page).toBe(1)
    })
  })

  describe('setPage', () => {
    it('sets the page', () => {
      useUsersStore.getState().setPage(5)
      expect(useUsersStore.getState().page).toBe(5)
    })
  })

  describe('addUser', () => {
    it('prepends user to localUsers and resets page to 1', () => {
      const u = makeUser('add-1')
      useUsersStore.getState().setPage(4)
      useUsersStore.getState().addUser(u)
      const { localUsers, page } = useUsersStore.getState()
      expect(localUsers[0].login.uuid).toBe('add-1')
      expect(page).toBe(1)
    })
  })

  describe('updateUser', () => {
    it('updates a local user in-place', () => {
      const u = makeUser('local-1')
      useUsersStore.getState().addUser(u)
      const updated = { ...u, email: 'new@test.com' }
      useUsersStore.getState().updateUser(updated)
      const { localUsers } = useUsersStore.getState()
      expect(localUsers.find((x) => x.login.uuid === 'local-1')?.email).toBe('new@test.com')
      // hiddenUuids should not contain it since it was already local
      expect(useUsersStore.getState().hiddenUuids).not.toContain('local-1')
    })

    it('promotes an API user: adds to localUsers and hides original', () => {
      const apiUser = makeUser('api-1')
      // Do NOT add to localUsers — simulating an API user
      const updated = { ...apiUser, email: 'edited@test.com' }
      useUsersStore.getState().updateUser(updated)
      const { localUsers, hiddenUuids } = useUsersStore.getState()
      expect(localUsers.some((u) => u.login.uuid === 'api-1')).toBe(true)
      expect(hiddenUuids).toContain('api-1')
    })
  })

  describe('deleteUser', () => {
    it('removes a local user from localUsers', () => {
      const u = makeUser('del-local')
      useUsersStore.getState().addUser(u)
      useUsersStore.getState().deleteUser('del-local')
      expect(useUsersStore.getState().localUsers.find((x) => x.login.uuid === 'del-local')).toBeUndefined()
    })

    it('hides an API user by adding uuid to hiddenUuids', () => {
      useUsersStore.getState().deleteUser('api-uuid-99')
      expect(useUsersStore.getState().hiddenUuids).toContain('api-uuid-99')
    })
  })
})
