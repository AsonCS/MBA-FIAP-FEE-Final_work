'use client'

import { useState, useCallback, useMemo } from 'react'
import { VocabularyItem } from '@/core/domain/VocabularyItem'
import {
  QuizSession,
  createQuizSession,
  getCurrentQuestion,
  isQuizComplete,
  getResultMessage,
} from '@/core/domain/QuizSession'
import { EvaluateQuizAnswerUseCase } from '@/core/application/use-cases/EvaluateAnswer'

export type QuizPhase = 'memorization' | 'quiz' | 'results'

interface UseQuizReturn {
  phase: QuizPhase
  session: QuizSession | null
  currentQuestion: VocabularyItem | null
  shuffledOptions: string[]
  isComplete: boolean
  resultMessage: string
  startQuiz: () => void
  submitAnswer: (word: string) => boolean
  resetQuiz: () => void
}

/**
 * useQuiz Hook
 * Manages the quiz state and transitions between phases.
 */
export function useQuiz(vocabularyItems: VocabularyItem[]): UseQuizReturn {
  const [phase, setPhase] = useState<QuizPhase>('memorization')
  const [session, setSession] = useState<QuizSession | null>(null)

  const evaluateUseCase = useMemo(() => new EvaluateQuizAnswerUseCase(), [])

  // Shuffle the word options for the current question
  const shuffledOptions = useMemo(() => {
    if (!session) return []
    return [...session.vocabularyItems]
      .map((item) => item.word)
      .sort(() => Math.random() - 0.5)
  }, [session])

  const currentQuestion = useMemo(() => {
    if (!session) return null
    return getCurrentQuestion(session)
  }, [session])

  const isComplete = useMemo(() => {
    if (!session) return false
    return isQuizComplete(session)
  }, [session])

  const resultMessage = useMemo(() => {
    if (!session) return ''
    return getResultMessage(session)
  }, [session])

  const startQuiz = useCallback(() => {
    const newSession = createQuizSession(vocabularyItems)
    setSession(newSession)
    setPhase('quiz')
  }, [vocabularyItems])

  const submitAnswer = useCallback(
    (word: string): boolean => {
      if (!session) return false

      const result = evaluateUseCase.execute(session, word)
      setSession(result.updatedSession)

      // Check if quiz is complete after this answer
      if (isQuizComplete(result.updatedSession)) {
        setPhase('results')
      }

      return result.isCorrect
    },
    [session, evaluateUseCase]
  )

  const resetQuiz = useCallback(() => {
    setSession(null)
    setPhase('memorization')
  }, [])

  return {
    phase,
    session,
    currentQuestion,
    shuffledOptions,
    isComplete,
    resultMessage,
    startQuiz,
    submitAnswer,
    resetQuiz,
  }
}
