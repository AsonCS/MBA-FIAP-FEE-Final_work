'use client'

import { useState, useCallback } from 'react'
import { VocabularyItem } from '@/core/domain/VocabularyItem'
import { useQuiz } from '@/hooks/useQuiz'
import { MemorizationPhase } from './MemorizationPhase'
import { QuizPhase } from './QuizPhase'
import { ResultsPhase } from './ResultsPhase'
import { LoadingSpinner, ErrorMessage } from '@/components/ui'

interface VocabularyAppProps {
  initialVocabulary: VocabularyItem[]
}

/**
 * VocabularyApp Component
 * Main application component managing the vocabulary learning flow.
 */
export function VocabularyApp({ initialVocabulary }: VocabularyAppProps) {
  const [vocabulary, setVocabulary] = useState(initialVocabulary)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    phase,
    session,
    currentQuestion,
    shuffledOptions,
    resultMessage,
    startQuiz,
    submitAnswer,
    resetQuiz,
  } = useQuiz(vocabulary)

  const handleTryAgain = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/vocabulary')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch vocabulary')
      }

      setVocabulary(data.data)
      resetQuiz()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [resetQuiz])

  if (error) {
    return <ErrorMessage message={error} onRetry={handleTryAgain} />
  }

  if (phase === 'memorization') {
    return (
      <MemorizationPhase
        vocabularyItems={vocabulary}
        onStartQuiz={startQuiz}
      />
    )
  }

  if (phase === 'quiz' && session && currentQuestion) {
    return (
      <QuizPhase
        session={session}
        currentQuestion={currentQuestion}
        shuffledOptions={shuffledOptions}
        onAnswer={submitAnswer}
      />
    )
  }

  if (phase === 'results' && session) {
    return (
      <ResultsPhase
        session={session}
        resultMessage={resultMessage}
        onTryAgain={handleTryAgain}
        isLoading={isLoading}
      />
    )
  }

  return <LoadingSpinner message="Loading quiz..." />
}
