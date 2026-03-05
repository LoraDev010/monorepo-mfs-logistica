import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import UserSearch from '@/features/users/components/UserSearch'
import { useUsersStore } from '@/features/users/store/usersStore'

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

describe('UserSearch', () => {
  beforeEach(() => {
    resetStore()
    jest.useFakeTimers()
  })
  afterEach(() => jest.useRealTimers())

  it('renders the search input', () => {
    render(<UserSearch />)
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('updates the input value while typing', () => {
    render(<UserSearch />)
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'John' } })
    expect((input as HTMLInputElement).value).toBe('John')
  })

  it('debounces and calls setSearch after 300 ms', () => {
    render(<UserSearch />)
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'Ana' } })
    // Not yet propagated
    expect(useUsersStore.getState().search).toBe('')
    act(() => jest.advanceTimersByTime(300))
    expect(useUsersStore.getState().search).toBe('Ana')
  })

  it('does NOT update store before debounce delay', () => {
    render(<UserSearch />)
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'X' } })
    act(() => jest.advanceTimersByTime(100))
    expect(useUsersStore.getState().search).toBe('')
  })
})
