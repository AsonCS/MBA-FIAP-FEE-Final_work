import { QuizSession } from '@/core/domain/QuizSession'

/**
 * Result of evaluating an answer
 */
export interface EvaluateAnswerResult {
  /** Whether the answer was correct */
  isCorrect: boolean
  /** The correct word for the question */
  correctWord: string
  /** The word the user selected */
  selectedWord: string
  /** Updated quiz session with the new state */
  updatedSession: QuizSession
}

/**
 * EvaluateQuizAnswerUseCase
 * Application use case that evaluates user answers and updates the quiz session.
 */
export class EvaluateQuizAnswerUseCase {
  /**
   * Evaluates the user's answer for the current question
   * @param session - Current quiz session
   * @param selectedWord - The English word selected by the user
   * @returns Result containing correctness and updated session
   */
  execute(session: QuizSession, selectedWord: string): EvaluateAnswerResult {
    if (session.currentStep >= session.vocabularyItems.length) {
      throw new Error('Quiz is already complete')
    }

    const currentQuestion = session.vocabularyItems[session.currentStep]
    const isCorrect = currentQuestion.word.toLowerCase() === selectedWord.toLowerCase()

    const updatedAnswers = [...session.answers]
    updatedAnswers[session.currentStep] = isCorrect

    const updatedSession: QuizSession = {
      ...session,
      currentStep: session.currentStep + 1,
      score: isCorrect ? session.score + 1 : session.score,
      answers: updatedAnswers,
    }

    return {
      isCorrect,
      correctWord: currentQuestion.word,
      selectedWord,
      updatedSession,
    }
  }
}
