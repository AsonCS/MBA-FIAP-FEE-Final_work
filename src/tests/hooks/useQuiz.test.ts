import { renderHook, act } from '@testing-library/react'
import { useQuiz } from '@/hooks/useQuiz'
import { VocabularyItem } from '@/core/domain/VocabularyItem'

const mockVocabulary: VocabularyItem[] = [
  { word: 'hello', description: 'olá', useCase: 'ex1' },
  { word: 'world', description: 'mundo', useCase: 'ex2' },
  { word: 'cat', description: 'gato', useCase: 'ex3' },
  { word: 'dog', description: 'cachorro', useCase: 'ex4' },
  { word: 'sun', description: 'sol', useCase: 'ex5' },
]

describe('useQuiz', () => {
  it('should initialize in memorization phase', () => {
    const { result } = renderHook(() => useQuiz(mockVocabulary))

    expect(result.current.phase).toBe('memorization')
    expect(result.current.session).toBeNull()
  })

  it('should transition to quiz phase when startQuiz is called', () => {
    const { result } = renderHook(() => useQuiz(mockVocabulary))

    act(() => {
      result.current.startQuiz()
    })

    expect(result.current.phase).toBe('quiz')
    expect(result.current.session).not.toBeNull()
    expect(result.current.session?.currentStep).toBe(0)
  })

  it('should return current question when quiz is active', () => {
    const { result } = renderHook(() => useQuiz(mockVocabulary))

    act(() => {
      result.current.startQuiz()
    })

    expect(result.current.currentQuestion).toEqual(mockVocabulary[0])
  })

  it('should return shuffled options', () => {
    const { result } = renderHook(() => useQuiz(mockVocabulary))

    act(() => {
      result.current.startQuiz()
    })

    expect(result.current.shuffledOptions).toHaveLength(5)
    expect(result.current.shuffledOptions).toContain('hello')
    expect(result.current.shuffledOptions).toContain('world')
    expect(result.current.shuffledOptions).toContain('cat')
    expect(result.current.shuffledOptions).toContain('dog')
    expect(result.current.shuffledOptions).toContain('sun')
  })

  it('should update session when submitAnswer is called with correct answer', () => {
    const { result } = renderHook(() => useQuiz(mockVocabulary))

    act(() => {
      result.current.startQuiz()
    })

    let isCorrect: boolean = false
    act(() => {
      isCorrect = result.current.submitAnswer('hello')
    })

    expect(isCorrect).toBe(true)
    expect(result.current.session?.score).toBe(1)
    expect(result.current.session?.currentStep).toBe(1)
  })

  it('should update session when submitAnswer is called with wrong answer', () => {
    const { result } = renderHook(() => useQuiz(mockVocabulary))

    act(() => {
      result.current.startQuiz()
    })

    let isCorrect: boolean = true
    act(() => {
      isCorrect = result.current.submitAnswer('wrong')
    })

    expect(isCorrect).toBe(false)
    expect(result.current.session?.score).toBe(0)
    expect(result.current.session?.currentStep).toBe(1)
  })

  it('should transition to results phase after all questions', () => {
    const { result } = renderHook(() => useQuiz(mockVocabulary))

    act(() => {
      result.current.startQuiz()
    })

    // Answer all questions
    mockVocabulary.forEach((item) => {
      act(() => {
        result.current.submitAnswer(item.word)
      })
    })

    expect(result.current.phase).toBe('results')
    expect(result.current.isComplete).toBe(true)
  })

  it('should reset to memorization phase when resetQuiz is called', () => {
    const { result } = renderHook(() => useQuiz(mockVocabulary))

    act(() => {
      result.current.startQuiz()
    })

    act(() => {
      result.current.resetQuiz()
    })

    expect(result.current.phase).toBe('memorization')
    expect(result.current.session).toBeNull()
  })

  it('should return result message when quiz is complete', () => {
    const { result } = renderHook(() => useQuiz(mockVocabulary))

    act(() => {
      result.current.startQuiz()
    })

    // Answer all questions correctly
    mockVocabulary.forEach((item) => {
      act(() => {
        result.current.submitAnswer(item.word)
      })
    })

    expect(result.current.resultMessage).toBe('Excelente! Pontuação perfeita!')
  })
})

  it('should return false when submitAnswer is called before startQuiz', () => {
    const { result } = renderHook(() => useQuiz(mockVocabulary))

    let isCorrect: boolean = true
    act(() => {
      isCorrect = result.current.submitAnswer('hello')
    })

    expect(isCorrect).toBe(false)
  })
