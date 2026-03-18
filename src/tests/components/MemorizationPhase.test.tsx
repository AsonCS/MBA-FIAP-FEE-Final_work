import { render, screen, fireEvent } from '@testing-library/react'
import { MemorizationPhase } from '@/components/domain/MemorizationPhase'
import { VocabularyItem } from '@/core/domain/VocabularyItem'

jest.mock('@mui/material', () => ({
  Box: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  Typography: ({ children }: React.PropsWithChildren) => <span>{children}</span>,
  Button: ({
    children,
    onClick,
    ...props
  }: React.PropsWithChildren<{ onClick?: () => void; [key: string]: unknown }>) => (
    <button onClick={onClick} data-testid={props['data-testid'] as string}>
      {children}
    </button>
  ),
  Grid2: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  Container: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  Paper: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}))

jest.mock('@/components/domain/VocabularyCard', () => ({
  VocabularyCard: ({ item, index }: { item: VocabularyItem; index: number }) => (
    <div data-testid={`vocabulary-card-${index}`}>{item.word}</div>
  ),
}))

const mockVocabulary: VocabularyItem[] = [
  { word: 'hello', description: 'olá', useCase: 'ex1' },
  { word: 'world', description: 'mundo', useCase: 'ex2' },
  { word: 'cat', description: 'gato', useCase: 'ex3' },
  { word: 'dog', description: 'cachorro', useCase: 'ex4' },
  { word: 'sun', description: 'sol', useCase: 'ex5' },
]

describe('MemorizationPhase', () => {
  const mockOnStartQuiz = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render all vocabulary cards', () => {
    render(
      <MemorizationPhase
        vocabularyItems={mockVocabulary}
        onStartQuiz={mockOnStartQuiz}
      />
    )

    mockVocabulary.forEach((_, index) => {
      expect(screen.getByTestId(`vocabulary-card-${index}`)).toBeInTheDocument()
    })
  })

  it('should render the start quiz button', () => {
    render(
      <MemorizationPhase
        vocabularyItems={mockVocabulary}
        onStartQuiz={mockOnStartQuiz}
      />
    )

    expect(screen.getByTestId('start-quiz-button')).toBeInTheDocument()
  })

  it('should display vocabulary words via cards', () => {
    render(
      <MemorizationPhase
        vocabularyItems={mockVocabulary}
        onStartQuiz={mockOnStartQuiz}
      />
    )

    expect(screen.getByText('hello')).toBeInTheDocument()
    expect(screen.getByText('world')).toBeInTheDocument()
    expect(screen.getByText('sun')).toBeInTheDocument()
  })

  it('should call onStartQuiz when the button is clicked', () => {
    render(
      <MemorizationPhase
        vocabularyItems={mockVocabulary}
        onStartQuiz={mockOnStartQuiz}
      />
    )

    fireEvent.click(screen.getByTestId('start-quiz-button'))

    expect(mockOnStartQuiz).toHaveBeenCalledTimes(1)
  })
})
