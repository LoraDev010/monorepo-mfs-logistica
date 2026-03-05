import { useSelectedUserStore } from '../selectedUserStore'

const mockUser = {
  login: { uuid: 'abc-123', username: 'jdoe' },
  name: { title: 'Mr', first: 'John', last: 'Doe' },
  email: 'john@example.com',
  phone: '123-456',
  location: { city: 'Bogotá', state: 'Cundinamarca', country: 'Colombia' },
  picture: { large: '', medium: '', thumbnail: '' },
  nat: 'CO',
  gender: 'male',
  dob: { age: 30, date: '1994-01-01T00:00:00.000Z' },
}

beforeEach(() => {
  sessionStorage.clear()
  useSelectedUserStore.setState({ user: null })
})

describe('selectedUserStore', () => {
  it('starts with user null', () => {
    expect(useSelectedUserStore.getState().user).toBeNull()
  })

  it('setUser stores the user', () => {
    useSelectedUserStore.getState().setUser(mockUser)
    expect(useSelectedUserStore.getState().user).toEqual(mockUser)
  })

  it('setUser(null) clears the user', () => {
    useSelectedUserStore.getState().setUser(mockUser)
    useSelectedUserStore.getState().setUser(null)
    expect(useSelectedUserStore.getState().user).toBeNull()
  })

  it('persists user to sessionStorage', () => {
    useSelectedUserStore.getState().setUser(mockUser)
    const stored = sessionStorage.getItem('selected-user')
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed.state.user.login.uuid).toBe('abc-123')
  })
})
