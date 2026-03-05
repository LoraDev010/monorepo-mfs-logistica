import { httpGet } from '@/shared/lib/httpClient'

const BASE = 'https://randomuser.me/api'

describe('httpGet', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('resolves with parsed JSON on a 200 response', async () => {
    const mockData = { results: [], info: {} }
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as unknown as Response)

    const result = await httpGet<typeof mockData>({ seed: 'test', results: 10 })

    expect(global.fetch).toHaveBeenCalledWith(
      `${BASE}?seed=test&results=10`,
    )
    expect(result).toEqual(mockData)
  })

  it('throws an error when the response is not ok', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve({}),
    } as unknown as Response)

    await expect(httpGet({ seed: 'bad' })).rejects.toThrow('HTTP 500')
  })
})
