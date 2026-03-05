import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UsersPage from '@/features/users/pages/UsersPage'
import { useUsersStore } from '@/features/users/store/usersStore'

// Mock useUsers hook
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

function defaultMock() {
  mockUseUsers.mockReturnValue({
    users: [],
    totalPages: 1,
    total: 0,
    isLoading: false,
    isFetching: false,
    error: null,
  })
}

describe('UsersPage', () => {
  beforeEach(() => {
    resetStore()
    defaultMock()
    jest.clearAllMocks()
  })

  it('renders the search input', () => {
    render(<UsersPage />)
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('renders the user list region', () => {
    render(<UsersPage />)
    expect(screen.getByText('Listado de Usuarios')).toBeInTheDocument()
  })

  it('shows "Syncing…" when isFetching is true', () => {
    mockUseUsers.mockReturnValue({
      users: [],
      totalPages: 1,
      total: 0,
      isLoading: false,
      isFetching: true,
      error: null,
    })
    render(<UsersPage />)
    expect(screen.getByText('Syncing…')).toBeInTheDocument()
  })

  it('does not show "Syncing…" when isFetching is false', () => {
    render(<UsersPage />)
    expect(screen.queryByText('Syncing…')).not.toBeInTheDocument()
  })

  it('opens the new user modal when "+ Nuevo Usuario" is clicked', async () => {
    render(<UsersPage />)
    fireEvent.click(screen.getByText('Nuevo Usuario'))
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Nuevo usuario' })).toBeInTheDocument()
    })
  })

  it("calls onUserSelect prop when a user card's 'Ver perfil' is clicked", async () => {
    const { login, name, email, phone, gender, dob, location, picture, nat } = {
      login: { uuid: 'pg-u1', username: 'test' },
      name: { title: 'Mr', first: 'Bob', last: 'Builder' },
      email: 'bob@test.com',
      phone: '999',
      gender: 'male',
      dob: { date: '1990-01-01T00:00:00.000Z', age: 34 },
      location: { city: '', state: '', country: '' },
      picture: { large: '', medium: '', thumbnail: '' },
      nat: 'CO',
    }
    const user = { login, name, email, phone, gender, dob, location, picture, nat }
    mockUseUsers.mockReturnValue({
      users: [user],
      totalPages: 1,
      total: 1,
      isLoading: false,
      isFetching: false,
      error: null,
    })

    const onUserSelect = jest.fn()
    render(<UsersPage onUserSelect={onUserSelect} />)

    fireEvent.click(screen.getByTitle('Ver perfil'))
    expect(onUserSelect).toHaveBeenCalledWith(user)
  })
})
