import { GenerateVocabularyUseCase } from '@/core/application/use-cases/GenerateVocabulary'
import { IVocabularyRepository } from '@/core/application/interfaces/IVocabularyRepository'
import { VocabularyItem } from '@/core/domain/VocabularyItem'

const mockVocabulary: VocabularyItem[] = [
  { word: 'hello', description: 'olá', useCase: 'ex1' },
  { word: 'world', description: 'mundo', useCase: 'ex2' },
  { word: 'cat', description: 'gato', useCase: 'ex3' },
  { word: 'dog', description: 'cachorro', useCase: 'ex4' },
  { word: 'sun', description: 'sol', useCase: 'ex5' },
]

describe('GenerateVocabularyUseCase', () => {
  let mockRepository: jest.Mocked<IVocabularyRepository>
  let useCase: GenerateVocabularyUseCase

  beforeEach(() => {
    mockRepository = {
      getVocabularyItems: jest.fn(),
    }
    useCase = new GenerateVocabularyUseCase(mockRepository)
  })

  it('should return vocabulary items from repository', async () => {
    mockRepository.getVocabularyItems.mockResolvedValue(mockVocabulary)

    const result = await useCase.execute(5)

    expect(result).toEqual(mockVocabulary)
    expect(mockRepository.getVocabularyItems).toHaveBeenCalledWith(5)
  })

  it('should use default count of 5', async () => {
    mockRepository.getVocabularyItems.mockResolvedValue(mockVocabulary)

    await useCase.execute()

    expect(mockRepository.getVocabularyItems).toHaveBeenCalledWith(5)
  })

  it('should throw error for count less than 1', async () => {
    await expect(useCase.execute(0)).rejects.toThrow('Count must be between 1 and 10')
  })

  it('should throw error for count greater than 10', async () => {
    await expect(useCase.execute(11)).rejects.toThrow('Count must be between 1 and 10')
  })

  it('should throw error when repository returns wrong number of items', async () => {
    mockRepository.getVocabularyItems.mockResolvedValue(mockVocabulary.slice(0, 3))

    await expect(useCase.execute(5)).rejects.toThrow(
      'Expected 5 items but received 3'
    )
  })

  it('should propagate repository errors', async () => {
    mockRepository.getVocabularyItems.mockRejectedValue(new Error('API Error'))

    await expect(useCase.execute()).rejects.toThrow('API Error')
  })
})
