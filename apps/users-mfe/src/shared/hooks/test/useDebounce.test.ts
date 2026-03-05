import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '@/shared/hooks/useDebounce'

describe('useDebounce', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300))
    expect(result.current).toBe('hello')
  })

  it('does not update before the delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } },
    )
    rerender({ value: 'b' })
    expect(result.current).toBe('a')
  })

  it('updates the value after the delay elapses', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } },
    )
    rerender({ value: 'b' })
    act(() => jest.advanceTimersByTime(300))
    expect(result.current).toBe('b')
  })

  it('clears pending timeout on unmount', () => {
    const clearSpy = jest.spyOn(globalThis, 'clearTimeout')
    const { unmount } = renderHook(() => useDebounce('x', 300))
    unmount()
    expect(clearSpy).toHaveBeenCalled()
  })
})
