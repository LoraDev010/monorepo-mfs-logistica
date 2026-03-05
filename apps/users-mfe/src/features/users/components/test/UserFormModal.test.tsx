import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UserFormModal from '@/features/users/components/UserFormModal'
import { useUsersStore } from '@/features/users/store/usersStore'
import type { User } from '@/features/users/types'

jest.mock('zustand/middleware', () => ({
  persist: (fn: unknown) => fn,
}))

const existingUser: User = {
  login: { uuid: 'u-edit', username: 'jane' },
  name: { title: 'Ms', first: 'Jane', last: 'Smith' },
  email: 'jane@test.com',
  phone: '+57 310 000',
  gender: 'female',
  dob: { date: '1992-03-20T00:00:00.000Z', age: 32 },
  location: { city: '', state: '', country: '' },
  picture: { large: '', medium: '', thumbnail: '' },
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

describe('UserFormModal', () => {
  beforeEach(resetStore)

  it('does not render when open is false', () => {
    render(<UserFormModal open={false} onClose={jest.fn()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the "Nuevo usuario" dialog when open and no editUser', () => {
    render(<UserFormModal open onClose={jest.fn()} />)
    expect(screen.getByRole('dialog', { name: 'Nuevo usuario' })).toBeInTheDocument()
    expect(screen.getByText('Nuevo Usuario')).toBeInTheDocument()
  })

  it('renders "Editar usuario" dialog when editUser is provided', () => {
    render(<UserFormModal open editUser={existingUser} onClose={jest.fn()} />)
    expect(screen.getByRole('dialog', { name: 'Editar usuario' })).toBeInTheDocument()
    expect(screen.getByText('Editar Usuario')).toBeInTheDocument()
  })

  it('pre-fills form fields when editing a user', () => {
    render(<UserFormModal open editUser={existingUser} onClose={jest.fn()} />)
    expect((screen.getByPlaceholderText('Carlos') as HTMLInputElement).value).toBe('Jane')
    expect((screen.getByPlaceholderText('García') as HTMLInputElement).value).toBe('Smith')
    expect((screen.getByPlaceholderText('carlos@example.com') as HTMLInputElement).value).toBe('jane@test.com')
  })

  it('shows validation errors when submitting empty form', async () => {
    render(<UserFormModal open onClose={jest.fn()} />)
    fireEvent.click(screen.getByText('Crear usuario'))
    await waitFor(() => {
      const errors = screen.getAllByText('Requerido')
      expect(errors.length).toBeGreaterThanOrEqual(3)
    })
  })

  it('shows email validation error for invalid email', async () => {
    render(<UserFormModal open onClose={jest.fn()} />)
    fireEvent.change(screen.getByPlaceholderText('Carlos'), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByPlaceholderText('García'), { target: { value: 'Lopez' } })
    fireEvent.change(screen.getByPlaceholderText('carlos@example.com'), { target: { value: 'notanemail' } })
    fireEvent.click(screen.getByText('Crear usuario'))
    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument()
    })
  })

  it('calls addUser and onClose when valid new user is submitted', async () => {
    const onClose = jest.fn()
    render(<UserFormModal open onClose={onClose} />)

    fireEvent.change(screen.getByPlaceholderText('Carlos'), { target: { value: 'Maria' } })
    fireEvent.change(screen.getByPlaceholderText('García'), { target: { value: 'Torres' } })
    fireEvent.change(screen.getByPlaceholderText('carlos@example.com'), { target: { value: 'maria@test.com' } })
    fireEvent.change(screen.getByPlaceholderText('+57 310 987 6543'), { target: { value: '+57 300 000' } })
    fireEvent.change(screen.getByDisplayValue(''), { target: { value: '1995-05-10' } })

    fireEvent.click(screen.getByText('Crear usuario'))
    await waitFor(() => expect(onClose).toHaveBeenCalled())

    const { localUsers } = useUsersStore.getState()
    expect(localUsers.some((u) => u.email === 'maria@test.com')).toBe(true)
  })

  it('calls updateUser and onClose when editing a user', async () => {
    const onClose = jest.fn()
    render(<UserFormModal open editUser={existingUser} onClose={onClose} />)

    fireEvent.change(screen.getByPlaceholderText('Carlos'), { target: { value: 'Janet' } })
    fireEvent.click(screen.getByText('Guardar cambios'))
    await waitFor(() => expect(onClose).toHaveBeenCalled())
  })

  it('calls onClose when Cancelar is clicked', () => {
    const onClose = jest.fn()
    render(<UserFormModal open onClose={onClose} />)
    fireEvent.click(screen.getByText('Cancelar'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when the ✕ button is clicked', () => {
    const onClose = jest.fn()
    render(<UserFormModal open onClose={onClose} />)
    fireEvent.click(screen.getByText('✕'))
    expect(onClose).toHaveBeenCalled()
  })
})
