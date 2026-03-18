import { render, screen, fireEvent } from '@testing-library/react'
import { QuizOption } from '@/components/domain/QuizOption'

// Mock MUI components
jest.mock('@mui/material', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    ...props
  }: React.PropsWithChildren<{
    onClick?: () => void
    disabled?: boolean
  }>) => (
    <button onClick={onClick} disabled={disabled} data-testid={props['data-testid' as keyof typeof props]}>
      {children}
    </button>
  ),
}))

describe('QuizOption', () => {
  const mockOnClick = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the word text', () => {
    render(<QuizOption word="hello" onClick={mockOnClick} />)

    expect(screen.getByText('hello')).toBeInTheDocument()
  })

  it('should call onClick with word when clicked', () => {
    render(<QuizOption word="hello" onClick={mockOnClick} />)

    fireEvent.click(screen.getByText('hello'))

    expect(mockOnClick).toHaveBeenCalledWith('hello')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<QuizOption word="hello" onClick={mockOnClick} disabled />)

    expect(screen.getByTestId('quiz-option-hello')).toBeDisabled()
  })

  it('should not call onClick when disabled', () => {
    render(<QuizOption word="hello" onClick={mockOnClick} disabled />)

    fireEvent.click(screen.getByText('hello'))

    expect(mockOnClick).not.toHaveBeenCalled()
  })

  it('should have correct data-testid', () => {
    render(<QuizOption word="world" onClick={mockOnClick} />)

    expect(screen.getByTestId('quiz-option-world')).toBeInTheDocument()
  })

  it('should render when selected is true', () => {
    render(<QuizOption word="hello" onClick={mockOnClick} selected={true} />)

    expect(screen.getByTestId('quiz-option-hello')).toBeInTheDocument()
  })

  it('should render when isCorrect is true', () => {
    render(<QuizOption word="hello" onClick={mockOnClick} isCorrect={true} />)

    expect(screen.getByTestId('quiz-option-hello')).toBeInTheDocument()
  })

  it('should render when isCorrect is false', () => {
    render(<QuizOption word="hello" onClick={mockOnClick} isCorrect={false} />)

    expect(screen.getByTestId('quiz-option-hello')).toBeInTheDocument()
  })
})
