import { httpGet } from '@/shared/lib/httpClient'
import type { RandomUserResponse, User } from '../types'

interface FetchUsersOptions {
  seed?: string
  results?: number
}

export async function fetchUsers(options: FetchUsersOptions = {}): Promise<User[]> {
  const { seed = 'Portal Andres Lora S.A.S', results = 100 } = options
  const data = await httpGet<RandomUserResponse>({ seed, results })
  return data.results
}
