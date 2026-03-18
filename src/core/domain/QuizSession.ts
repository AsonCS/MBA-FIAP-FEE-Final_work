import { VocabularyItem } from './VocabularyItem'

/**
 * QuizSession Entity
 * Represents the user's current quiz attempt with vocabulary items and progress tracking.
 */
export interface QuizSession {
  /** Array of 5 vocabulary items for the session */
  vocabularyItems: VocabularyItem[]
  /** Current step in the quiz (0-4 for questions, 5 for completed) */
  currentStep: number
  /** Number of correct answers */
  score: number
  /** Array tracking answers: true = correct, false = incorrect, null = not answered */
  answers: (boolean | null)[]
}

/**
 * Creates a new quiz session with the provided vocabulary items
 */
export function createQuizSession(vocabularyItems: VocabularyItem[]): QuizSession {
  if (vocabularyItems.length !== 5) {
    throw new Error('Quiz session requires exactly 5 vocabulary items')
  }

  return {
    vocabularyItems,
    currentStep: 0,
    score: 0,
    answers: [null, null, null, null, null],
  }
}

/**
 * Gets the current question's vocabulary item
 */
export function getCurrentQuestion(session: QuizSession): VocabularyItem | null {
  if (session.currentStep >= session.vocabularyItems.length) {
    return null
  }
  return session.vocabularyItems[session.currentStep]
}

/**
 * Checks if the quiz is complete
 */
export function isQuizComplete(session: QuizSession): boolean {
  return session.currentStep >= session.vocabularyItems.length
}

/**
 * Calculates the final score percentage
 */
export function calculateScorePercentage(session: QuizSession): number {
  return (session.score / session.vocabularyItems.length) * 100
}

/**
 * Gets the result message based on score
 */
export function getResultMessage(session: QuizSession): string {
  const percentage = calculateScorePercentage(session)
  
  if (percentage === 100) {
    return 'Excelente! Pontuação perfeita!'
  } else if (percentage >= 80) {
    return 'Ótimo trabalho! Continue praticando!'
  } else if (percentage >= 60) {
    return 'Bom esforço! Há espaço para melhorias.'
  } else if (percentage >= 40) {
    return 'Continue estudando! A prática leva à perfeição.'
  } else {
    return 'Não desista! Tente novamente para melhorar sua pontuação.'
  }
}
