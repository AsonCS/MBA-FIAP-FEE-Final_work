import {
  createVocabularyItem,
  isVocabularyItem,
  VocabularyItem,
} from '@/core/domain/VocabularyItem'

describe('VocabularyItem', () => {
  describe('createVocabularyItem', () => {
    it('should create a valid vocabulary item', () => {
      const item = createVocabularyItem('hello', 'olá', 'Eu digo olá para você')

      expect(item.word).toBe('hello')
      expect(item.description).toBe('olá')
      expect(item.useCase).toBe('Eu digo olá para você')
    })

    it('should trim whitespace from all fields', () => {
      const item = createVocabularyItem('  hello  ', '  olá  ', '  Eu digo olá  ')

      expect(item.word).toBe('hello')
      expect(item.description).toBe('olá')
      expect(item.useCase).toBe('Eu digo olá')
    })

    it('should throw error for empty word', () => {
      expect(() => createVocabularyItem('', 'olá', 'exemplo')).toThrow(
        'Word cannot be empty'
      )
    })

    it('should throw error for whitespace-only word', () => {
      expect(() => createVocabularyItem('   ', 'olá', 'exemplo')).toThrow(
        'Word cannot be empty'
      )
    })

    it('should throw error for empty description', () => {
      expect(() => createVocabularyItem('hello', '', 'exemplo')).toThrow(
        'Description cannot be empty'
      )
    })

    it('should throw error for empty useCase', () => {
      expect(() => createVocabularyItem('hello', 'olá', '')).toThrow(
        'Use case cannot be empty'
      )
    })
  })

  describe('isVocabularyItem', () => {
    it('should return true for valid vocabulary item', () => {
      const item: VocabularyItem = {
        word: 'hello',
        description: 'olá',
        useCase: 'exemplo',
      }

      expect(isVocabularyItem(item)).toBe(true)
    })

    it('should return false for null', () => {
      expect(isVocabularyItem(null)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isVocabularyItem(undefined)).toBe(false)
    })

    it('should return false for non-object', () => {
      expect(isVocabularyItem('string')).toBe(false)
      expect(isVocabularyItem(123)).toBe(false)
    })

    it('should return false for object missing word', () => {
      expect(isVocabularyItem({ description: 'olá', useCase: 'ex' })).toBe(false)
    })

    it('should return false for object missing description', () => {
      expect(isVocabularyItem({ word: 'hello', useCase: 'ex' })).toBe(false)
    })

    it('should return false for object missing useCase', () => {
      expect(isVocabularyItem({ word: 'hello', description: 'olá' })).toBe(false)
    })

    it('should return false for object with non-string fields', () => {
      expect(isVocabularyItem({ word: 123, description: 'olá', useCase: 'ex' })).toBe(
        false
      )
    })
  })
})
