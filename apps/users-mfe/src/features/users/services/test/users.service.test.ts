import { fetchUsers } from '@/features/users/services/users.service'
import * as httpClient from '@/shared/lib/httpClient'
import type { RandomUserResponse } from '@/features/users/types'

jest.mock('@/shared/lib/httpClient')

const mockHttpGet = httpClient.httpGet as jest.MockedFunction<typeof httpClient.httpGet>

const fakeUser = {
  login: { uuid: 'u1', username: 'jdoe' },
  name: { title: 'Mr', first: 'John', last: 'Doe' },
  email: 'john@test.com',
  phone: '123',
  gender: 'male',
  dob: { date: '1990-01-01', age: 34 },
  location: { city: 'NYC', state: 'NY', country: 'US' },
  picture: { large: '', medium: '', thumbnail: '' },
  nat: 'US',
}

describe('fetchUsers', () => {
  afterEach(() => jest.clearAllMocks())

  it('returns the results array on success', async () => {
    const response: RandomUserResponse = {
      results: [fakeUser],
      info: { seed: 'test', results: 1, page: 1, version: '1.4' },
    }
    mockHttpGet.mockResolvedValue(response)

    const users = await fetchUsers({ seed: 'test', results: 1 })
    expect(users).toHaveLength(1)
    expect(users[0].login.uuid).toBe('u1')
    expect(mockHttpGet).toHaveBeenCalledWith({ seed: 'test', results: 1 })
  })

  it('uses default seed and results when options are omitted', async () => {
    mockHttpGet.mockResolvedValue({ results: [], info: {} } as unknown as RandomUserResponse)
    await fetchUsers()
    expect(mockHttpGet).toHaveBeenCalledWith({ seed: 'Portal Andres Lora S.A.S', results: 100 })
  })

  it('propagates httpGet errors', async () => {
    mockHttpGet.mockRejectedValue(new Error('HTTP 500'))
    await expect(fetchUsers()).rejects.toThrow('HTTP 500')
  })
})
