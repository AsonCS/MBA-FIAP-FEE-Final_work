import { EvaluateQuizAnswerUseCase } from '@/core/application/use-cases/EvaluateAnswer'
import { createQuizSession, QuizSession } from '@/core/domain/QuizSession'
import { VocabularyItem } from '@/core/domain/VocabularyItem'

const mockVocabulary: VocabularyItem[] = [
  { word: 'hello', description: 'olá', useCase: 'ex1' },
  { word: 'world', description: 'mundo', useCase: 'ex2' },
  { word: 'cat', description: 'gato', useCase: 'ex3' },
  { word: 'dog', description: 'cachorro', useCase: 'ex4' },
  { word: 'sun', description: 'sol', useCase: 'ex5' },
]

describe('EvaluateQuizAnswerUseCase', () => {
  let useCase: EvaluateQuizAnswerUseCase
  let session: QuizSession

  beforeEach(() => {
    useCase = new EvaluateQuizAnswerUseCase()
    session = createQuizSession(mockVocabulary)
  })

  it('should return correct result for correct answer', () => {
    const result = useCase.execute(session, 'hello')

    expect(result.isCorrect).toBe(true)
    expect(result.correctWord).toBe('hello')
    expect(result.selectedWord).toBe('hello')
  })

  it('should return incorrect result for wrong answer', () => {
    const result = useCase.execute(session, 'world')

    expect(result.isCorrect).toBe(false)
    expect(result.correctWord).toBe('hello')
    expect(result.selectedWord).toBe('world')
  })

  it('should be case insensitive', () => {
    const result = useCase.execute(session, 'HELLO')

    expect(result.isCorrect).toBe(true)
  })

  it('should update session step on correct answer', () => {
    const result = useCase.execute(session, 'hello')

    expect(result.updatedSession.currentStep).toBe(1)
    expect(result.updatedSession.score).toBe(1)
    expect(result.updatedSession.answers[0]).toBe(true)
  })

  it('should update session step on incorrect answer', () => {
    const result = useCase.execute(session, 'wrong')

    expect(result.updatedSession.currentStep).toBe(1)
    expect(result.updatedSession.score).toBe(0)
    expect(result.updatedSession.answers[0]).toBe(false)
  })

  it('should throw error when quiz is already complete', () => {
    const completedSession: QuizSession = {
      ...session,
      currentStep: 5,
    }

    expect(() => useCase.execute(completedSession, 'hello')).toThrow(
      'Quiz is already complete'
    )
  })

  it('should not modify original session', () => {
    const originalStep = session.currentStep
    const originalScore = session.score

    useCase.execute(session, 'hello')

    expect(session.currentStep).toBe(originalStep)
    expect(session.score).toBe(originalScore)
  })

  it('should track multiple answers correctly', () => {
    let currentSession = session

    // First question - correct
    let result = useCase.execute(currentSession, 'hello')
    currentSession = result.updatedSession
    expect(result.isCorrect).toBe(true)
    expect(currentSession.score).toBe(1)

    // Second question - wrong
    result = useCase.execute(currentSession, 'cat')
    currentSession = result.updatedSession
    expect(result.isCorrect).toBe(false)
    expect(currentSession.score).toBe(1)

    // Third question - correct
    result = useCase.execute(currentSession, 'cat')
    currentSession = result.updatedSession
    expect(result.isCorrect).toBe(true)
    expect(currentSession.score).toBe(2)

    expect(currentSession.answers).toEqual([true, false, true, null, null])
  })
})
