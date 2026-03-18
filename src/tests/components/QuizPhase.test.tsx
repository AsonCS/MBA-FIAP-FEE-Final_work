import { render, screen, fireEvent, act } from '@testing-library/react'
import { QuizPhase } from '@/components/domain/QuizPhase'
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
  LinearProgress: () => <div role="progressbar" />,
  Stack: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  Chip: ({ label }: { label: string }) => <span>{label}</span>,
}))

jest.mock('@/components/domain/QuizOption', () => ({
  QuizOption: ({
    word,
    onClick,
    disabled,
  }: {
    word: string
    onClick: (word: string) => void
    disabled?: boolean
  }) => (
    <button
      data-testid={`quiz-option-${word}`}
      onClick={() => onClick(word)}
      disabled={disabled}
    >
      {word}
    </button>
  )
}))

const mockVocabulary: VocabularyItem[] = [
  { word: 'hello', description: 'a greeting', useCase: 'ex1' },
  { word: 'world', description: 'the earth', useCase: 'ex2' },
  { word: 'cat', description: 'a feline', useCase: 'ex3' },
  { word: 'dog', description: 'a canine', useCase: 'ex4' },
  { word: 'sun', description: 'a star', useCase: 'ex5' },
]

const mockSession: QuizSession = {
  vocabularyItems: mockVocabulary,
  currentStep: 0,
  score: 0,
  answers: [null, null, null, null, null],
}

const shuffledOptions = ['hello', 'world', 'cat', 'dog', 'sun']

describe('QuizPhase', () => {
  const mockOnAnswer = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should render the current question description', () => {
    render(
      <QuizPhase
        session={mockSession}
        currentQuestion={mockVocabulary[0]}
        shuffledOptions={shuffledOptions}
        onAnswer={mockOnAnswer}
      />
    )

    expect(screen.getByTestId('quiz-description')).toHaveTextContent(
      'a greeting'
    )
  })

  it('should render all answer options', () => {
    render(
      <QuizPhase
        session={mockSession}
        currentQuestion={mockVocabulary[0]}
        shuffledOptions={shuffledOptions}
        onAnswer={mockOnAnswer}
      />
    )

    shuffledOptions.forEach((word) => {
      expect(screen.getByTestId(`quiz-option-${word}`)).toBeInTheDocument()
    })
  })

  it('should render a progress bar', () => {
    render(
      <QuizPhase
        session={mockSession}
        currentQuestion={mockVocabulary[0]}
        shuffledOptions={shuffledOptions}
        onAnswer={mockOnAnswer}
      />
    )

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('should call onAnswer with the clicked word', () => {
    mockOnAnswer.mockReturnValue(true)

    render(
      <QuizPhase
        session={mockSession}
        currentQuestion={mockVocabulary[0]}
        shuffledOptions={shuffledOptions}
        onAnswer={mockOnAnswer}
      />
    )

    fireEvent.click(screen.getByTestId('quiz-option-hello'))

    expect(mockOnAnswer).toHaveBeenCalledWith('hello')
  })

  it('should disable options while animating after a click', () => {
    mockOnAnswer.mockReturnValue(true)

    render(
      <QuizPhase
        session={mockSession}
        currentQuestion={mockVocabulary[0]}
        shuffledOptions={shuffledOptions}
        onAnswer={mockOnAnswer}
      />
    )

    fireEvent.click(screen.getByTestId('quiz-option-hello'))

    expect(screen.getByTestId('quiz-option-hello')).toBeDisabled()
    expect(screen.getByTestId('quiz-option-world')).toBeDisabled()
  })

  it('should re-enable options after the animation completes', () => {
    mockOnAnswer.mockReturnValue(true)

    render(
      <QuizPhase
        session={mockSession}
        currentQuestion={mockVocabulary[0]}
        shuffledOptions={shuffledOptions}
        onAnswer={mockOnAnswer}
      />
    )

    fireEvent.click(screen.getByTestId('quiz-option-hello'))

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(screen.getByTestId('quiz-option-hello')).not.toBeDisabled()
  })

  it('should not call onAnswer when clicking during animation', () => {
    mockOnAnswer.mockReturnValue(false)

    render(
      <QuizPhase
        session={mockSession}
        currentQuestion={mockVocabulary[0]}
        shuffledOptions={shuffledOptions}
        onAnswer={mockOnAnswer}
      />
    )

    // First click starts animation
    fireEvent.click(screen.getByTestId('quiz-option-world'))
    // Second click on a disabled button should not call onAnswer again
    fireEvent.click(screen.getByTestId('quiz-option-hello'))

    expect(mockOnAnswer).toHaveBeenCalledTimes(1)
  })

  it('should not call onAnswer again when clicking during animation (isAnimating guard)', () => {
    mockOnAnswer.mockReturnValue(true)

    render(
      <QuizPhase
        session={mockSession}
        currentQuestion={mockVocabulary[0]}
        shuffledOptions={shuffledOptions}
        onAnswer={mockOnAnswer}
      />
    )

    // First click — starts animation (isAnimating = true)
    fireEvent.click(screen.getByTestId('quiz-option-hello'))
    // Second click — hits the `if (isAnimating) return` guard
    fireEvent.click(screen.getByTestId('quiz-option-world'))

    expect(mockOnAnswer).toHaveBeenCalledTimes(1)
  })

  it('should re-enable handlers after animation timer completes', () => {
    mockOnAnswer.mockReturnValue(true)

    render(
      <QuizPhase
        session={mockSession}
        currentQuestion={mockVocabulary[0]}
        shuffledOptions={shuffledOptions}
        onAnswer={mockOnAnswer}
      />
    )

    fireEvent.click(screen.getByTestId('quiz-option-hello'))

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    // After timer, isAnimating is false — clicking should call onAnswer again
    fireEvent.click(screen.getByTestId('quiz-option-world'))
    expect(mockOnAnswer).toHaveBeenCalledTimes(2)
  })
})
