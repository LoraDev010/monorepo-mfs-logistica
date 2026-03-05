import { queryClient } from '@/shared/lib/queryClient'

describe('queryClient', () => {
  it('is a QueryClient instance', () => {
    expect(queryClient).toBeDefined()
    expect(typeof queryClient.getQueryCache).toBe('function')
  })

  it('has staleTime configured to 5 minutes', () => {
    const defaults = queryClient.getDefaultOptions()
    expect(defaults.queries?.staleTime).toBe(5 * 60 * 1_000)
  })

  it('has refetchOnWindowFocus disabled', () => {
    const defaults = queryClient.getDefaultOptions()
    expect(defaults.queries?.refetchOnWindowFocus).toBe(false)
  })
})
