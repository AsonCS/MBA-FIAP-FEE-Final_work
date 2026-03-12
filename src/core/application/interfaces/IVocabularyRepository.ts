import { VocabularyItem } from '@/core/domain/VocabularyItem'

/**
 * IVocabularyRepository Interface
 * Defines the contract for fetching vocabulary items.
 * This is a port in the hexagonal architecture that will be implemented by infrastructure adapters.
 */
export interface IVocabularyRepository {
  /**
   * Fetches a specified number of vocabulary items
   * @param count - Number of items to fetch (default: 5)
   * @returns Promise resolving to an array of VocabularyItems
   */
  getVocabularyItems(count?: number): Promise<VocabularyItem[]>
}
