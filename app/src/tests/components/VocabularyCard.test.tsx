import { render, screen } from '@testing-library/react'
import { VocabularyCard } from '@/components/domain/VocabularyCard'
import { VocabularyItem } from '@/core/domain/VocabularyItem'

// Mock MUI components
jest.mock('@mui/material', () => ({
  Card: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <div data-testid={props['data-testid']}>{children}</div>
  ),
  CardContent: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  Typography: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <span data-testid={props['data-testid']}>{children}</span>
  ),
  Box: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
  Chip: ({ label }: { label: string }) => <span>{label}</span>,
}))

const mockItem: VocabularyItem = {
  word: 'hello',
  description: 'uma saudação informal',
  useCase: 'Eu digo hello para meus amigos',
}

describe('VocabularyCard', () => {
  it('should render vocabulary card with correct data-testid', () => {
    render(<VocabularyCard item={mockItem} index={0} />)

    expect(screen.getByTestId('vocabulary-card-0')).toBeInTheDocument()
  })

  it('should display the English word', () => {
    render(<VocabularyCard item={mockItem} index={0} />)

    expect(screen.getByTestId('word-0')).toHaveTextContent('hello')
  })

  it('should display the Portuguese description', () => {
    render(<VocabularyCard item={mockItem} index={0} />)

    expect(screen.getByTestId('description-0')).toHaveTextContent(
      'uma saudação informal'
    )
  })

  it('should display the use case example', () => {
    render(<VocabularyCard item={mockItem} index={0} />)

    expect(screen.getByTestId('usecase-0')).toHaveTextContent(
      'Eu digo hello para meus amigos'
    )
  })

  it('should display the correct card number', () => {
    render(<VocabularyCard item={mockItem} index={2} />)

    expect(screen.getByText('#3')).toBeInTheDocument()
  })

  it('should render multiple cards with different indices', () => {
    const { rerender } = render(<VocabularyCard item={mockItem} index={0} />)
    expect(screen.getByTestId('vocabulary-card-0')).toBeInTheDocument()

    rerender(<VocabularyCard item={mockItem} index={4} />)
    expect(screen.getByTestId('vocabulary-card-4')).toBeInTheDocument()
  })
})
