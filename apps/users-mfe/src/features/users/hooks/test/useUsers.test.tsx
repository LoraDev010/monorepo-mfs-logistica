import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { useUsers } from '@/features/users/hooks/useUsers'
import { useUsersStore } from '@/features/users/store/usersStore'
import type { User } from '@/features/users/types'

// Mock the service
jest.mock('@/features/users/services/users.service')
import { fetchUsers } from '@/features/users/services/users.service'
const mockFetchUsers = fetchUsers as jest.MockedFunction<typeof fetchUsers>

// Mock per-test QueryClient wrapper
function makeWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  Wrapper.displayName = 'TestWrapper'
  return Wrapper
}

const buildUser = (i: number): User => ({
  login: { uuid: `uuid-${i}`, username: `user${i}` },
  name: { title: 'Mr', first: `First${i}`, last: `Last${i}` },
  email: `user${i}@test.com`,
  phone: '123',
  gender: 'male',
  dob: { date: '1990-01-01', age: 34 },
  location: { city: 'Bogotá', state: 'DC', country: 'Colombia' },
  picture: { large: '', medium: '', thumbnail: '' },
  nat: 'CO',
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

describe('useUsers', () => {
  beforeEach(() => {
    resetStore()
    jest.clearAllMocks()
  })

  it('returns isLoading while fetching', () => {
    mockFetchUsers.mockReturnValue(new Promise(() => {})) // never resolves
    const { result } = renderHook(() => useUsers(), { wrapper: makeWrapper() })
    expect(result.current.isLoading).toBe(true)
  })

  it('returns paginated users on success', async () => {
    const allUsers = Array.from({ length: 15 }, (_, i) => buildUser(i))
    mockFetchUsers.mockResolvedValue(allUsers)

    const { result } = renderHook(() => useUsers(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.total).toBe(15)
    expect(result.current.users).toHaveLength(12) // pageSize = 12
    expect(result.current.totalPages).toBe(2)
  })

  it('filters users by search term', async () => {
    const allUsers = [buildUser(0), buildUser(1)]
    // Make user0 match "First0" and user1 not
    mockFetchUsers.mockResolvedValue(allUsers)
    useUsersStore.getState().setSearch('First0')

    const { result } = renderHook(() => useUsers(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.users).toHaveLength(1)
    expect(result.current.users[0].login.uuid).toBe('uuid-0')
  })

  it('hides API users that are in hiddenUuids', async () => {
    const allUsers = [buildUser(0), buildUser(1)]
    mockFetchUsers.mockResolvedValue(allUsers)
    useUsersStore.setState({ hiddenUuids: ['uuid-0'] })

    const { result } = renderHook(() => useUsers(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.users).toHaveLength(1)
    expect(result.current.users[0].login.uuid).toBe('uuid-1')
  })

  it('prepends localUsers in front of API users', async () => {
    const apiUsers = [buildUser(0)]
    mockFetchUsers.mockResolvedValue(apiUsers)
    const localUser = buildUser(99)
    useUsersStore.setState({ localUsers: [localUser] })

    const { result } = renderHook(() => useUsers(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.users[0].login.uuid).toBe('uuid-99')
  })

  it('returns error when the query fails', async () => {
    mockFetchUsers.mockRejectedValue(new Error('Network error'))
    const { result } = renderHook(() => useUsers(), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.error).toBeTruthy())
    expect((result.current.error as Error).message).toBe('Network error')
  })
})
