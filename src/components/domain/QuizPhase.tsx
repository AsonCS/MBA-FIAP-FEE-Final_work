'use client'

import { useState } from 'react'
import {
  Box,
  Typography,
  Container,
  Paper,
  LinearProgress,
  Stack,
  Chip,
} from '@mui/material'
import { VocabularyItem } from '@/core/domain/VocabularyItem'
import { QuizSession } from '@/core/domain/QuizSession'
import { QuizOption } from './QuizOption'

interface QuizPhaseProps {
  session: QuizSession
  currentQuestion: VocabularyItem
  shuffledOptions: string[]
  onAnswer: (word: string) => boolean
}

/**
 * QuizPhase Component
 * Displays the quiz interface with questions and answer options.
 */
export function QuizPhase({
  session,
  currentQuestion,
  shuffledOptions,
  onAnswer,
}: QuizPhaseProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const progress = ((session.currentStep) / session.vocabularyItems.length) * 100

  const handleOptionClick = (word: string) => {
    if (isAnimating) return

    setSelectedAnswer(word)
    const correct = onAnswer(word)
    setIsCorrect(correct)
    setIsAnimating(true)

    // Reset for next question after animation
    setTimeout(() => {
      setSelectedAnswer(null)
      setIsCorrect(null)
      setIsAnimating(false)
    }, 1000)
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
              Quiz Time
            </Typography>
            <Chip
              label={`Questão ${session.currentStep + 1} de ${session.vocabularyItems.length}`}
              color="primary"
              variant="outlined"
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            bgcolor: 'grey.100',
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Qual palavra inglesa corresponde a esta descrição?
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{ fontWeight: 500, color: 'text.primary' }}
            data-testid="quiz-description"
          >
            {currentQuestion.description}
          </Typography>
        </Paper>

        <Stack spacing={2}>
          {shuffledOptions.map((word) => (
            <QuizOption
              key={word}
              word={word}
              onClick={handleOptionClick}
              disabled={isAnimating}
              selected={selectedAnswer === word}
              isCorrect={
                selectedAnswer === word
                  ? isCorrect
                  : isCorrect === false && word === currentQuestion.word
                  ? true
                  : null
              }
            />
          ))}
        </Stack>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Score: {session.score} / {session.currentStep}
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}
