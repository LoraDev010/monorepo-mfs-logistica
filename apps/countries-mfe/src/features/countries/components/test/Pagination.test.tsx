import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Pagination from '@/features/countries/components/Pagination'
import { useCountriesStore } from '@/features/countries/store/countriesStore'

jest.mock('zustand/middleware', () => ({
  persist: (fn) => fn,
}))

function resetStore(overrides = {}) {
  useCountriesStore.setState({
    search: '',
    page: 1,
    pageSize: 20,
    localCountries: [],
    hiddenCodes: [],
    ...overrides,
  })
}

describe('Pagination', () => {
  beforeEach(() => resetStore())

  it('returns null when totalPages is 1', () => {
    const { container } = render(<Pagination totalPages={1} total={10} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders page numbers when totalPages > 1', () => {
    render(<Pagination totalPages={3} total={60} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('disables the prev button on page 1', () => {
    render(<Pagination totalPages={3} total={60} />)
    const prev = screen.getByLabelText('Página anterior')
    expect(prev).toBeDisabled()
  })

  it('disables the next button on the last page', () => {
    resetStore({ page: 3 })
    render(<Pagination totalPages={3} total={60} />)
    const next = screen.getByLabelText('Página siguiente')
    expect(next).toBeDisabled()
  })

  it('calls setPage when a page number is clicked', () => {
    render(<Pagination totalPages={3} total={60} />)
    fireEvent.click(screen.getByText('2'))
    expect(useCountriesStore.getState().page).toBe(2)
  })

  it('calls setPage(page+1) when next is clicked', () => {
    render(<Pagination totalPages={3} total={60} />)
    fireEvent.click(screen.getByLabelText('Página siguiente'))
    expect(useCountriesStore.getState().page).toBe(2)
  })

  it('shows ellipsis for many pages', () => {
    resetStore({ page: 5 })
    render(<Pagination totalPages={10} total={200} />)
    const ellipses = screen.getAllByText('…')
    expect(ellipses.length).toBeGreaterThanOrEqual(1)
  })

  it('shows count summary text', () => {
    resetStore({ page: 1, pageSize: 20 })
    render(<Pagination totalPages={2} total={40} />)
    expect(screen.getByText(/Mostrando/)).toBeInTheDocument()
  })
})
