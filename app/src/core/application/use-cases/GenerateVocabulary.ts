import { VocabularyItem } from '@/core/domain/VocabularyItem'
import { IVocabularyRepository } from '../interfaces/IVocabularyRepository'

/**
 * GenerateVocabularyUseCase
 * Application use case that orchestrates fetching vocabulary items from the repository.
 */
export class GenerateVocabularyUseCase {
  constructor(private readonly repository: IVocabularyRepository) {}

  /**
   * Executes the use case to generate vocabulary items
   * @param count - Number of vocabulary items to generate (default: 5)
   * @returns Promise resolving to an array of VocabularyItems
   */
  async execute(count: number = 5): Promise<VocabularyItem[]> {
    if (count < 1 || count > 10) {
      throw new Error('Count must be between 1 and 10')
    }

    const items = await this.repository.getVocabularyItems(count)
    
    if (items.length !== count) {
      throw new Error(`Expected ${count} items but received ${items.length}`)
    }

    return items
  }
}
