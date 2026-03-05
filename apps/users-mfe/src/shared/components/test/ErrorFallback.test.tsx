import React from 'react'
import { render, screen } from '@testing-library/react'
import ErrorFallback from '@/shared/components/ErrorFallback'

describe('ErrorFallback', () => {
  it('renders the static "Algo salió mal" text', () => {
    render(<ErrorFallback error={new Error('boom')} />)
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument()
  })

  it('renders the error message', () => {
    render(<ErrorFallback error={new Error('Something broke')} />)
    expect(screen.getByText('Something broke')).toBeInTheDocument()
  })
})
