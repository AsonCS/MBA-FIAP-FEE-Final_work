import { render, screen, fireEvent } from '@testing-library/react'
import { ResultsPhase } from '@/components/domain/ResultsPhase'
import { QuizSession } from '@/core/domain/QuizSession'
import { VocabularyItem } from '@/core/domain/VocabularyItem'

jest.mock('@mui/material', () => ({
  Box: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  Typography: ({
    children,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) => (
    <span data-testid={props['data-testid'] as string}>{children}</span>
  ),
  Container: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  Paper: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  Button: ({
    children,
    onClick,
    disabled,
    ...props
  }: React.PropsWithChildren<{
    onClick?: () => void
    disabled?: boolean
    [key: string]: unknown
  }>) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-testid={props['data-testid'] as string}
    >
      {children}
    </button>
  ),
  CircularProgress: ({ value }: { value: number }) => (
    <div role="progressbar" aria-valuenow={value} />
  ),
  List: ({ children }: React.PropsWithChildren) => <ul>{children}</ul>,
  ListItem: ({ children }: React.PropsWithChildren) => <li>{children}</li>,
  ListItemIcon: ({ children }: React.PropsWithChildren) => (
    <span>{children}</span>
  ),
  ListItemText: ({
    primary,
    secondary,
  }: {
    primary: string
    secondary: string
  }) => (
    <div>
      <span>{primary}</span>
      <span>{secondary}</span>
    </div>
  ),
}))

jest.mock('@mui/icons-material/CheckCircle', () => ({
  __esModule: true,
  default: () => <span data-testid="check-icon" />,
}))

jest.mock('@mui/icons-material/Cancel', () => ({
  __esModule: true,
  default: () => <span data-testid="cancel-icon" />,
}))

const mockVocabulary: VocabularyItem[] = [
  { word: 'hello', description: 'olá', useCase: 'ex1' },
  { word: 'world', description: 'mundo', useCase: 'ex2' },
  { word: 'cat', description: 'gato', useCase: 'ex3' },
  { word: 'dog', description: 'cachorro', useCase: 'ex4' },
  { word: 'sun', description: 'sol', useCase: 'ex5' },
]

const mockSession: QuizSession = {
  vocabularyItems: mockVocabulary,
  currentStep: 5,
  score: 4,
  answers: [true, true, true, true, false],
}

describe('ResultsPhase', () => {
  const mockOnTryAgain = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the result message', () => {
    render(
      <ResultsPhase
        session={mockSession}
        resultMessage="Great job!"
        onTryAgain={mockOnTryAgain}
      />
    )

    expect(screen.getByTestId('result-message')).toHaveTextContent('Great job!')
  })

  it('should display the score text', () => {
    render(
      <ResultsPhase
        session={mockSession}
        resultMessage="Great job!"
        onTryAgain={mockOnTryAgain}
      />
    )

    expect(screen.getByTestId('score-text')).toBeInTheDocument()
  })

  it('should render the try again button', () => {
    render(
      <ResultsPhase
        session={mockSession}
        resultMessage="Great job!"
        onTryAgain={mockOnTryAgain}
      />
    )

    expect(screen.getByTestId('try-again-button')).toBeInTheDocument()
  })

  it('should call onTryAgain when the button is clicked', () => {
    render(
      <ResultsPhase
        session={mockSession}
        resultMessage="Great job!"
        onTryAgain={mockOnTryAgain}
      />
    )

    fireEvent.click(screen.getByTestId('try-again-button'))

    expect(mockOnTryAgain).toHaveBeenCalledTimes(1)
  })

  it('should show loading text and disable button when isLoading is true', () => {
    render(
      <ResultsPhase
        session={mockSession}
        resultMessage="Great job!"
        onTryAgain={mockOnTryAgain}
        isLoading={true}
      />
    )

    expect(screen.getByTestId('try-again-button')).toBeDisabled()
    expect(
      screen.getByText('Carregando novas palavras...')
    ).toBeInTheDocument()
  })

  it('should show check icons for correct answers and cancel icons for wrong', () => {
    render(
      <ResultsPhase
        session={mockSession}
        resultMessage="Great job!"
        onTryAgain={mockOnTryAgain}
      />
    )

    expect(screen.getAllByTestId('check-icon')).toHaveLength(4)
    expect(screen.getAllByTestId('cancel-icon')).toHaveLength(1)
  })

  it('should render vocabulary items in the results list', () => {
    render(
      <ResultsPhase
        session={mockSession}
        resultMessage="Great job!"
        onTryAgain={mockOnTryAgain}
      />
    )

    expect(screen.getByText('hello')).toBeInTheDocument()
    expect(screen.getByText('world')).toBeInTheDocument()
    expect(screen.getByText('sun')).toBeInTheDocument()
  })

  it('should render circular progress indicator', () => {
    render(
      <ResultsPhase
        session={mockSession}
        resultMessage="Great job!"
        onTryAgain={mockOnTryAgain}
      />
    )

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })
})

describe('ResultsPhase - failing score', () => {
  const mockOnTryAgain = jest.fn()

  it('should render with a failing score (isPassing=false)', () => {
    const failingSession: QuizSession = {
      vocabularyItems: mockVocabulary,
      currentStep: 5,
      score: 2,
      answers: [true, true, false, false, false],
    }

    render(
      <ResultsPhase
        session={failingSession}
        resultMessage="Keep studying!"
        onTryAgain={mockOnTryAgain}
      />
    )

    expect(screen.getByTestId('result-message')).toHaveTextContent(
      'Keep studying!'
    )
    expect(screen.getAllByTestId('check-icon')).toHaveLength(2)
    expect(screen.getAllByTestId('cancel-icon')).toHaveLength(3)
  })
})
