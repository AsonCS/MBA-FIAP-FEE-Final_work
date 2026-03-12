/**
 * VocabularyItem Entity
 * Represents a single vocabulary word with its translation and usage example.
 * This is a core domain entity with no external dependencies.
 */
export interface VocabularyItem {
  /** The English word */
  word: string
  /** Portuguese description/translation */
  description: string
  /** Usage example in Portuguese */
  useCase: string
}

/**
 * Factory function to create a VocabularyItem with validation
 */
export function createVocabularyItem(
  word: string,
  description: string,
  useCase: string
): VocabularyItem {
  if (!word || word.trim().length === 0) {
    throw new Error('Word cannot be empty')
  }
  if (!description || description.trim().length === 0) {
    throw new Error('Description cannot be empty')
  }
  if (!useCase || useCase.trim().length === 0) {
    throw new Error('Use case cannot be empty')
  }

  return {
    word: word.trim(),
    description: description.trim(),
    useCase: useCase.trim(),
  }
}

/**
 * Type guard to check if an object is a valid VocabularyItem
 */
export function isVocabularyItem(obj: unknown): obj is VocabularyItem {
  if (typeof obj !== 'object' || obj === null) {
    return false
  }
  const item = obj as Record<string, unknown>
  return (
    typeof item.word === 'string' &&
    typeof item.description === 'string' &&
    typeof item.useCase === 'string'
  )
}
