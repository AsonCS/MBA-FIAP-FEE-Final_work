import {
  createQuizSession,
  getCurrentQuestion,
  isQuizComplete,
  calculateScorePercentage,
  getResultMessage,
  QuizSession,
} from '@/core/domain/QuizSession'
import { VocabularyItem } from '@/core/domain/VocabularyItem'

const mockVocabulary: VocabularyItem[] = [
  { word: 'hello', description: 'olá', useCase: 'ex1' },
  { word: 'world', description: 'mundo', useCase: 'ex2' },
  { word: 'cat', description: 'gato', useCase: 'ex3' },
  { word: 'dog', description: 'cachorro', useCase: 'ex4' },
  { word: 'sun', description: 'sol', useCase: 'ex5' },
]

describe('QuizSession', () => {
  describe('createQuizSession', () => {
    it('should create a quiz session with 5 vocabulary items', () => {
      const session = createQuizSession(mockVocabulary)

      expect(session.vocabularyItems).toHaveLength(5)
      expect(session.currentStep).toBe(0)
      expect(session.score).toBe(0)
      expect(session.answers).toEqual([null, null, null, null, null])
    })

    it('should throw error for less than 5 items', () => {
      expect(() => createQuizSession(mockVocabulary.slice(0, 3))).toThrow(
        'Quiz session requires exactly 5 vocabulary items'
      )
    })

    it('should throw error for more than 5 items', () => {
      const extendedVocab = [...mockVocabulary, { word: 'extra', description: 'extra', useCase: 'ex' }]
      expect(() => createQuizSession(extendedVocab)).toThrow(
        'Quiz session requires exactly 5 vocabulary items'
      )
    })
  })

  describe('getCurrentQuestion', () => {
    it('should return the current question', () => {
      const session = createQuizSession(mockVocabulary)
      const question = getCurrentQuestion(session)

      expect(question).toEqual(mockVocabulary[0])
    })

    it('should return null when quiz is complete', () => {
      const session: QuizSession = {
        ...createQuizSession(mockVocabulary),
        currentStep: 5,
      }
      const question = getCurrentQuestion(session)

      expect(question).toBeNull()
    })
  })

  describe('isQuizComplete', () => {
    it('should return false when quiz is in progress', () => {
      const session = createQuizSession(mockVocabulary)
      expect(isQuizComplete(session)).toBe(false)
    })

    it('should return true when all questions are answered', () => {
      const session: QuizSession = {
        ...createQuizSession(mockVocabulary),
        currentStep: 5,
      }
      expect(isQuizComplete(session)).toBe(true)
    })
  })

  describe('calculateScorePercentage', () => {
    it('should calculate 0% for no correct answers', () => {
      const session: QuizSession = {
        ...createQuizSession(mockVocabulary),
        score: 0,
      }
      expect(calculateScorePercentage(session)).toBe(0)
    })

    it('should calculate 100% for all correct answers', () => {
      const session: QuizSession = {
        ...createQuizSession(mockVocabulary),
        score: 5,
      }
      expect(calculateScorePercentage(session)).toBe(100)
    })

    it('should calculate 60% for 3 out of 5 correct', () => {
      const session: QuizSession = {
        ...createQuizSession(mockVocabulary),
        score: 3,
      }
      expect(calculateScorePercentage(session)).toBe(60)
    })
  })

  describe('getResultMessage', () => {
    it('should return perfect score message for 100%', () => {
      const session: QuizSession = {
        ...createQuizSession(mockVocabulary),
        score: 5,
      }
      expect(getResultMessage(session)).toBe('Excellent! Perfect score!')
    })

    it('should return great job message for 80%', () => {
      const session: QuizSession = {
        ...createQuizSession(mockVocabulary),
        score: 4,
      }
      expect(getResultMessage(session)).toBe('Great job! Keep practicing!')
    })

    it('should return good effort message for 60%', () => {
      const session: QuizSession = {
        ...createQuizSession(mockVocabulary),
        score: 3,
      }
      expect(getResultMessage(session)).toBe('Good effort! Room for improvement.')
    })

    it('should return keep studying message for 40%', () => {
      const session: QuizSession = {
        ...createQuizSession(mockVocabulary),
        score: 2,
      }
      expect(getResultMessage(session)).toBe('Keep studying! Practice makes perfect.')
    })

    it('should return encouragement message for below 40%', () => {
      const session: QuizSession = {
        ...createQuizSession(mockVocabulary),
        score: 1,
      }
      expect(getResultMessage(session)).toBe("Don't give up! Try again to improve your score.")
    })
  })
})
