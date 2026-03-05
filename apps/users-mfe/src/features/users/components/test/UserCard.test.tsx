import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import UserCard from '@/features/users/components/UserCard'
import { useUsersStore } from '@/features/users/store/usersStore'
import type { User } from '@/features/users/types'

jest.mock('zustand/middleware', () => ({
  persist: (fn: unknown) => fn,
}))

const user: User = {
  login: { uuid: 'uuid-card', username: 'jdoe' },
  name: { title: 'Mr', first: 'John', last: 'Doe' },
  email: 'john@test.com',
  phone: '+57 300 000 0000',
  gender: 'male',
  dob: { date: '1990-06-15T00:00:00.000Z', age: 34 },
  location: { city: 'Bogotá', state: 'DC', country: 'Colombia' },
  picture: { large: 'l.jpg', medium: 'm.jpg', thumbnail: 't.jpg' },
  nat: 'CO',
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

describe('UserCard', () => {
  beforeEach(() => {
    resetStore()
    jest.restoreAllMocks()
  })

  it('renders user name, email, and phone', () => {
    render(<UserCard user={user} index={0} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@test.com')).toBeInTheDocument()
    expect(screen.getByText('+57 300 000 0000')).toBeInTheDocument()
  })

  it('calls onSelect when "Ver perfil" is clicked', () => {
    const onSelect = jest.fn()
    render(<UserCard user={user} index={0} onSelect={onSelect} />)
    fireEvent.click(screen.getByTitle('Ver perfil'))
    expect(onSelect).toHaveBeenCalledWith(user)
  })

  it('calls onEdit when "Editar" is clicked', () => {
    const onEdit = jest.fn()
    render(<UserCard user={user} index={0} onEdit={onEdit} />)
    fireEvent.click(screen.getByTitle('Editar'))
    expect(onEdit).toHaveBeenCalledWith(user)
  })

  it('calls deleteUser when "Eliminar" is clicked and confirmed', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true)
    render(<UserCard user={user} index={0} />)
    fireEvent.click(screen.getByTitle('Eliminar'))
    expect(useUsersStore.getState().hiddenUuids).toContain('uuid-card')
  })

  it('does NOT delete when confirm is cancelled', () => {
    jest.spyOn(window, 'confirm').mockReturnValue(false)
    render(<UserCard user={user} index={0} />)
    fireEvent.click(screen.getByTitle('Eliminar'))
    expect(useUsersStore.getState().hiddenUuids).not.toContain('uuid-card')
  })

  it('shows local badge when isLocal is true', () => {
    render(<UserCard user={user} index={0} isLocal />)
    expect(screen.getByTitle('Usuario local')).toBeInTheDocument()
  })

  it('renders fallback avatar URL when picture.medium is empty', () => {
    const userNoAvatar = { ...user, picture: { large: '', medium: '', thumbnail: '' } }
    render(<UserCard user={userNoAvatar} index={0} />)
    const img = screen.getByAltText('John Doe') as HTMLImageElement
    expect(img.src).toContain('ui-avatars.com')
  })
})
