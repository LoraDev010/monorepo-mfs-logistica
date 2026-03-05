import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { useSelectedUserStore } from '@/stores/selectedUserStore'
import UserDetailPage from '../UserDetailPage'

const mockUser = {
  login: { uuid: 'abc-123', username: 'jdoe' },
  name: { title: 'Mr', first: 'John', last: 'Doe' },
  email: 'john@example.com',
  phone: '123-456',
  location: { city: 'Bogotá', state: 'Cundinamarca', country: 'Colombia' },
  picture: {
    large: 'https://example.com/large.jpg',
    medium: 'https://example.com/medium.jpg',
    thumbnail: 'https://example.com/thumb.jpg',
  },
  nat: 'CO',
  gender: 'male',
  dob: { age: 30, date: '1994-01-01T00:00:00.000Z' },
}

function renderWithRouter(uuid: string) {
  return render(
    <MemoryRouter initialEntries={[`/users/${uuid}`]}>
      <Routes>
        <Route path="/users/:uuid" element={<UserDetailPage />} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  sessionStorage.clear()
  useSelectedUserStore.setState({ user: null })
})

describe('UserDetailPage', () => {
  it('shows "Usuario no encontrado" when store is empty', () => {
    renderWithRouter('abc-123')
    expect(screen.getByText('Usuario no encontrado.')).toBeInTheDocument()
  })

  it('shows "Usuario no encontrado" when uuid does not match', () => {
    useSelectedUserStore.setState({ user: mockUser })
    renderWithRouter('different-uuid')
    expect(screen.getByText('Usuario no encontrado.')).toBeInTheDocument()
  })

  it('renders user full name when uuid matches', () => {
    useSelectedUserStore.setState({ user: mockUser })
    renderWithRouter('abc-123')
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('renders user email', () => {
    useSelectedUserStore.setState({ user: mockUser })
    renderWithRouter('abc-123')
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })
})
