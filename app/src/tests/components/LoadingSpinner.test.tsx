import { render, screen } from '@testing-library/react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

// Mock MUI components
jest.mock('@mui/material', () => ({
  Box: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div data-testid={props['data-testid']}>{children}</div>
  ),
  CircularProgress: () => <div data-testid="circular-progress" />,
  Typography: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
}))

describe('LoadingSpinner', () => {
  it('should render with default message', () => {
    render(<LoadingSpinner />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('should render with custom message', () => {
    render(<LoadingSpinner message="Generating vocabulary..." />)

    expect(screen.getByText('Generating vocabulary...')).toBeInTheDocument()
  })

  it('should have loading-spinner data-testid', () => {
    render(<LoadingSpinner />)

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('should render circular progress indicator', () => {
    render(<LoadingSpinner />)

    expect(screen.getByTestId('circular-progress')).toBeInTheDocument()
  })
})
