'use client'

import { Button } from '@mui/material'

interface QuizOptionProps {
  word: string
  onClick: (word: string) => void
  disabled?: boolean
  selected?: boolean
  isCorrect?: boolean | null
}

/**
 * QuizOption Component
 * A button representing a word option in the quiz.
 */
export function QuizOption({
  word,
  onClick,
  disabled = false,
  selected = false,
  isCorrect = null,
}: QuizOptionProps) {
  const getColor = () => {
    if (isCorrect === true) return 'success'
    if (isCorrect === false) return 'error'
    if (selected) return 'primary'
    return 'inherit'
  }

  const getVariant = () => {
    if (selected || isCorrect !== null) return 'contained'
    return 'outlined'
  }

  return (
    <Button
      fullWidth
      variant={getVariant()}
      color={getColor()}
      onClick={() => onClick(word)}
      disabled={disabled}
      sx={{
        py: 2,
        fontSize: '1.1rem',
        fontWeight: 600,
        textTransform: 'none',
        justifyContent: 'flex-start',
        px: 3,
      }}
      data-testid={`quiz-option-${word}`}
    >
      {word}
    </Button>
  )
}
