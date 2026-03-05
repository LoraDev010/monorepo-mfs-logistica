import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import UserList from '@/features/users/components/UserList'
import { useUsersStore } from '@/features/users/store/usersStore'
import type { User } from '@/features/users/types'

// Mock the useUsers hook
jest.mock('@/features/users/hooks/useUsers')
import { useUsers } from '@/features/users/hooks/useUsers'
const mockUseUsers = useUsers as jest.MockedFunction<typeof useUsers>

jest.mock('zustand/middleware', () => ({
  persist: (fn: unknown) => fn,
}))

const fakeUser: User = {
  login: { uuid: 'list-u1', username: 'testuser' },
  name: { title: 'Mr', first: 'Alice', last: 'Wonder' },
  email: 'alice@test.com',
  phone: '123',
  gender: 'female',
  dob: { date: '1995-01-01T00:00:00.000Z', age: 29 },
  location: { city: 'CL', state: 'CL', country: 'CL' },
  picture: { large: '', medium: '', thumbnail: '' },
  nat: 'CL',
}

function resetStore() {
  useUsersStore.setState({
    search: '',
    page: 1,
    pageSize: 12,
    localUsers: [],
    hiddenUuids: [],
  })
}

describe('UserList', () => {
  beforeEach(() => {
    resetStore()
    jest.clearAllMocks()
  })

  it('renders loading skeletons while isLoading is true', () => {
    mockUseUsers.mockReturnValue({
      users: [], totalPages: 1, total: 0, isLoading: true, isFetching: true, error: null,
    })
    render(<UserList total={0} />)
    // The container should have the aria label for skeletons
    expect(screen.getByLabelText('Cargando personas')).toBeInTheDocument()
  })

  it('renders empty-state message when users is empty', () => {
    mockUseUsers.mockReturnValue({
      users: [], totalPages: 1, total: 0, isLoading: false, isFetching: false, error: null,
    })
    render(<UserList total={0} />)
    expect(screen.getByText(/No se encontraron personas/)).toBeInTheDocument()
  })

  it('renders a user card for each user', () => {
    mockUseUsers.mockReturnValue({
      users: [fakeUser], totalPages: 1, total: 1, isLoading: false, isFetching: false, error: null,
    })
    render(<UserList total={1} />)
    expect(screen.getByText('Alice Wonder')).toBeInTheDocument()
  })

  it('calls onNewUser when "+ Nuevo Usuario" button is clicked', () => {
    mockUseUsers.mockReturnValue({
      users: [], totalPages: 1, total: 0, isLoading: false, isFetching: false, error: null,
    })
    const onNewUser = jest.fn()
    render(<UserList total={0} onNewUser={onNewUser} />)
    fireEvent.click(screen.getByText('Nuevo Usuario'))
    expect(onNewUser).toHaveBeenCalled()
  })

  it('shows total count in the header', () => {
    mockUseUsers.mockReturnValue({
      users: [fakeUser], totalPages: 1, total: 5, isLoading: false, isFetching: false, error: null,
    })
    render(<UserList total={5} />)
    expect(screen.getByText('5 usuarios registrados')).toBeInTheDocument()
  })
})
