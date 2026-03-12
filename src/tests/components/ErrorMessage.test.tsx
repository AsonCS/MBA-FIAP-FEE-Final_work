import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

// Mock MUI components
jest.mock('@mui/material', () => ({
  Box: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div data-testid={props['data-testid']}>{children}</div>
  ),
  Typography: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
  Button: ({
    children,
    onClick,
    ...props
  }: React.PropsWithChildren<{ onClick?: () => void }>) => (
    <button onClick={onClick} data-testid={props['data-testid' as keyof typeof props]}>
      {children}
    </button>
  ),
  Paper: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}))

describe('ErrorMessage', () => {
  it('should render error message', () => {
    render(<ErrorMessage message="Something went wrong" />)

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('should render error title', () => {
    render(<ErrorMessage message="Test error" />)

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument()
  })

  it('should have error-message data-testid', () => {
    render(<ErrorMessage message="Test error" />)

    expect(screen.getByTestId('error-message')).toBeInTheDocument()
  })

  it('should render retry button when onRetry is provided', () => {
    const mockRetry = jest.fn()
    render(<ErrorMessage message="Test error" onRetry={mockRetry} />)

    expect(screen.getByTestId('retry-button')).toBeInTheDocument()
  })

  it('should not render retry button when onRetry is not provided', () => {
    render(<ErrorMessage message="Test error" />)

    expect(screen.queryByTestId('retry-button')).not.toBeInTheDocument()
  })

  it('should call onRetry when retry button is clicked', () => {
    const mockRetry = jest.fn()
    render(<ErrorMessage message="Test error" onRetry={mockRetry} />)

    fireEvent.click(screen.getByTestId('retry-button'))

    expect(mockRetry).toHaveBeenCalledTimes(1)
  })
})
