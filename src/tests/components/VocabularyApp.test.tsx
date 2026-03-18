import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { VocabularyApp } from '@/components/domain/VocabularyApp'
import { VocabularyItem } from '@/core/domain/VocabularyItem'
import { useQuiz } from '@/hooks/useQuiz'

jest.mock('@/hooks/useQuiz')

jest.mock('@/components/domain/MemorizationPhase', () => ({
  MemorizationPhase: ({ onStartQuiz }: { onStartQuiz: () => void }) => (
    <div data-testid="memorization-phase">
      <button data-testid="start-quiz" onClick={onStartQuiz}>
        Start Quiz
      </button>
    </div>
  ),
}))

jest.mock('@/components/domain/QuizPhase', () => ({
  QuizPhase: () => <div data-testid="quiz-phase" />,
}))

jest.mock('@/components/domain/ResultsPhase', () => ({
  ResultsPhase: ({
    onTryAgain,
  }: {
    onTryAgain: () => void
    isLoading?: boolean
  }) => (
    <div data-testid="results-phase">
      <button data-testid="try-again" onClick={onTryAgain}>
        Try Again
      </button>
    </div>
  ),
}))

jest.mock('@/components/ui', () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner" />,
  ErrorMessage: ({
    message,
    onRetry,
  }: {
    message: string
    onRetry?: () => void
  }) => (
    <div data-testid="error-message">
      <span>{message}</span>
      {onRetry && (
        <button data-testid="retry-button" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  ),
}))

const mockVocabulary: VocabularyItem[] = [
  { word: 'hello', description: 'olá', useCase: 'ex1' },
  { word: 'world', description: 'mundo', useCase: 'ex2' },
  { word: 'cat', description: 'gato', useCase: 'ex3' },
  { word: 'dog', description: 'cachorro', useCase: 'ex4' },
  { word: 'sun', description: 'sol', useCase: 'ex5' },
]

const mockUseQuiz = useQuiz as jest.Mock

describe('VocabularyApp', () => {
  const mockStartQuiz = jest.fn()
  const mockSubmitAnswer = jest.fn()
  const mockResetQuiz = jest.fn()

  const baseQuizReturn = {
    phase: 'memorization' as const,
    session: null,
    currentQuestion: null,
    shuffledOptions: [],
    isComplete: false,
    resultMessage: '',
    startQuiz: mockStartQuiz,
    submitAnswer: mockSubmitAnswer,
    resetQuiz: mockResetQuiz,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseQuiz.mockReturnValue(baseQuizReturn)
  })

  it('should render memorization phase by default', () => {
    render(<VocabularyApp initialVocabulary={mockVocabulary} />)

    expect(screen.getByTestId('memorization-phase')).toBeInTheDocument()
  })

  it('should render quiz phase when phase is quiz', () => {
    mockUseQuiz.mockReturnValue({
      ...baseQuizReturn,
      phase: 'quiz',
      session: {
        vocabularyItems: mockVocabulary,
        currentStep: 0,
        score: 0,
        answers: [null, null, null, null, null],
      },
      currentQuestion: mockVocabulary[0],
      shuffledOptions: ['hello', 'world', 'cat', 'dog', 'sun'],
    })

    render(<VocabularyApp initialVocabulary={mockVocabulary} />)

    expect(screen.getByTestId('quiz-phase')).toBeInTheDocument()
  })

  it('should render results phase when phase is results', () => {
    mockUseQuiz.mockReturnValue({
      ...baseQuizReturn,
      phase: 'results',
      session: {
        vocabularyItems: mockVocabulary,
        currentStep: 5,
        score: 5,
        answers: [true, true, true, true, true],
      },
      isComplete: true,
      resultMessage: 'Excellent! Perfect score!',
    })

    render(<VocabularyApp initialVocabulary={mockVocabulary} />)

    expect(screen.getByTestId('results-phase')).toBeInTheDocument()
  })

  it('should show error message when fetch fails after try again', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'API error' }),
    })

    mockUseQuiz.mockReturnValue({
      ...baseQuizReturn,
      phase: 'results',
      session: {
        vocabularyItems: mockVocabulary,
        currentStep: 5,
        score: 5,
        answers: [true, true, true, true, true],
      },
      isComplete: true,
      resultMessage: 'Excellent!',
    })

    render(<VocabularyApp initialVocabulary={mockVocabulary} />)

    fireEvent.click(screen.getByTestId('try-again'))

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
    })
    expect(screen.getByText('API error')).toBeInTheDocument()
  })

  it('should reset quiz and load new vocabulary on successful try again', async () => {
    const newVocabulary: VocabularyItem[] = [
      { word: 'run', description: 'correr', useCase: 'ex1' },
      { word: 'jump', description: 'pular', useCase: 'ex2' },
      { word: 'swim', description: 'nadar', useCase: 'ex3' },
      { word: 'fly', description: 'voar', useCase: 'ex4' },
      { word: 'eat', description: 'comer', useCase: 'ex5' },
    ]

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: newVocabulary }),
    })

    mockUseQuiz.mockReturnValue({
      ...baseQuizReturn,
      phase: 'results',
      session: {
        vocabularyItems: mockVocabulary,
        currentStep: 5,
        score: 5,
        answers: [true, true, true, true, true],
      },
      isComplete: true,
      resultMessage: 'Excellent!',
    })

    render(<VocabularyApp initialVocabulary={mockVocabulary} />)

    fireEvent.click(screen.getByTestId('try-again'))

    await waitFor(() => {
      expect(mockResetQuiz).toHaveBeenCalled()
    })
  })

  it('should show error for non-Error exceptions during fetch', async () => {
    global.fetch = jest.fn().mockRejectedValue('network failure')

    mockUseQuiz.mockReturnValue({
      ...baseQuizReturn,
      phase: 'results',
      session: {
        vocabularyItems: mockVocabulary,
        currentStep: 5,
        score: 5,
        answers: [true, true, true, true, true],
      },
      isComplete: true,
      resultMessage: 'Excellent!',
    })

    render(<VocabularyApp initialVocabulary={mockVocabulary} />)

    fireEvent.click(screen.getByTestId('try-again'))

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
    })
    expect(screen.getByText('An error occurred')).toBeInTheDocument()
  })

  it('should allow retry from error state', async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            data: mockVocabulary,
          }),
      })

    mockUseQuiz.mockReturnValue({
      ...baseQuizReturn,
      phase: 'results',
      session: {
        vocabularyItems: mockVocabulary,
        currentStep: 5,
        score: 5,
        answers: [true, true, true, true, true],
      },
      isComplete: true,
      resultMessage: 'Excellent!',
    })

    render(<VocabularyApp initialVocabulary={mockVocabulary} />)

    fireEvent.click(screen.getByTestId('try-again'))

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId('retry-button'))

    await waitFor(() => {
      expect(mockResetQuiz).toHaveBeenCalled()
    })
  })

  it('should use fallback message when response has no error field', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({}),
    })

    mockUseQuiz.mockReturnValue({
      ...baseQuizReturn,
      phase: 'results',
      session: {
        vocabularyItems: mockVocabulary,
        currentStep: 5,
        score: 5,
        answers: [true, true, true, true, true],
      },
      isComplete: true,
      resultMessage: 'Excellent!',
    })

    render(<VocabularyApp initialVocabulary={mockVocabulary} />)

    fireEvent.click(screen.getByTestId('try-again'))

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch vocabulary')).toBeInTheDocument()
    })
  })
})
