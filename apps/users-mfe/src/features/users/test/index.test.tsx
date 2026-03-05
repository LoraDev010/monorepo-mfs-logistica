import React from 'react'
import { render, screen } from '@testing-library/react'
import UsersFeature from '@/features/users/index'
import { useUsersStore } from '@/features/users/store/usersStore'

// Mock useUsers so the component renders immediately without network
jest.mock('@/features/users/hooks/useUsers')
import { useUsers } from '@/features/users/hooks/useUsers'
const mockUseUsers = useUsers as jest.MockedFunction<typeof useUsers>

jest.mock('zustand/middleware', () => ({
  persist: (fn: unknown) => fn,
}))

function resetStore() {
  useUsersStore.setState({
    search: '',
    page: 1,
    pageSize: 12,
    localUsers: [],
    hiddenUuids: [],
  })
}

describe('UsersFeature (public API)', () => {
  beforeEach(() => {
    resetStore()
    mockUseUsers.mockReturnValue({
      users: [],
      totalPages: 1,
      total: 0,
      isLoading: false,
      isFetching: false,
      error: null,
    })
  })

  it('renders without crashing', () => {
    render(<UsersFeature />)
    expect(screen.getByText('Listado de Usuarios')).toBeInTheDocument()
  })

  it('accepts and threads through onUserSelect prop', () => {
    const onUserSelect = jest.fn()
    render(<UsersFeature onUserSelect={onUserSelect} />)
    // The component renders and the prop is wired — we verify no crash here
    expect(screen.getByText('Listado de Usuarios')).toBeInTheDocument()
  })
})
