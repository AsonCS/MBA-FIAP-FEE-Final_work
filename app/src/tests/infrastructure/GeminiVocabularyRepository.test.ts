import { GeminiVocabularyRepository } from '@/core/infrastructure/repositories/GeminiVocabularyRepository'

// Mock the @google/genai module
jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: jest.fn(),
    },
  })),
}))

import { GoogleGenAI } from '@google/genai'

const MockedGoogleGenAI = GoogleGenAI as jest.MockedClass<typeof GoogleGenAI>

describe('GeminiVocabularyRepository', () => {
  const mockApiKey = 'test-api-key'
  let mockGenerateContent: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockGenerateContent = jest.fn()
    MockedGoogleGenAI.mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent,
      },
    }) as unknown as GoogleGenAI)
  })

  it('should throw error when API key is not provided', () => {
    expect(() => new GeminiVocabularyRepository('')).toThrow(
      'GEMINI_API_KEY is required'
    )
  })

  it('should create repository with valid API key', () => {
    expect(() => new GeminiVocabularyRepository(mockApiKey)).not.toThrow()
  })

  it('should return vocabulary items on successful API call', async () => {
    const mockResponse = [
      { word: 'hello', description: 'olá', useCase: 'ex1' },
      { word: 'world', description: 'mundo', useCase: 'ex2' },
      { word: 'cat', description: 'gato', useCase: 'ex3' },
      { word: 'dog', description: 'cachorro', useCase: 'ex4' },
      { word: 'sun', description: 'sol', useCase: 'ex5' },
    ]

    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify(mockResponse),
    })

    const repository = new GeminiVocabularyRepository(mockApiKey)
    const result = await repository.getVocabularyItems(5)

    expect(result).toEqual(mockResponse)
    expect(mockGenerateContent).toHaveBeenCalledWith(
      expect.objectContaining({
        model: 'gemini-3-flash-preview',
      })
    )
  })

  it('should handle JSON response with markdown code blocks', async () => {
    const mockResponse = [
      { word: 'hello', description: 'olá', useCase: 'ex1' },
      { word: 'world', description: 'mundo', useCase: 'ex2' },
      { word: 'cat', description: 'gato', useCase: 'ex3' },
      { word: 'dog', description: 'cachorro', useCase: 'ex4' },
      { word: 'sun', description: 'sol', useCase: 'ex5' },
    ]

    mockGenerateContent.mockResolvedValue({
      text: '```json\n' + JSON.stringify(mockResponse) + '\n```',
    })

    const repository = new GeminiVocabularyRepository(mockApiKey)
    const result = await repository.getVocabularyItems(5)

    expect(result).toEqual(mockResponse)
  })

  it('should throw error on empty response', async () => {
    mockGenerateContent.mockResolvedValue({
      text: '',
    })

    const repository = new GeminiVocabularyRepository(mockApiKey)

    await expect(repository.getVocabularyItems(5)).rejects.toThrow(
      'Empty response from Gemini AI'
    )
  })

  it('should throw error on invalid JSON response', async () => {
    mockGenerateContent.mockResolvedValue({
      text: 'not valid json',
    })

    const repository = new GeminiVocabularyRepository(mockApiKey)

    await expect(repository.getVocabularyItems(5)).rejects.toThrow(
      'Failed to parse Gemini response as JSON'
    )
  })

  it('should throw error when response is not an array', async () => {
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify({ word: 'hello' }),
    })

    const repository = new GeminiVocabularyRepository(mockApiKey)

    await expect(repository.getVocabularyItems(5)).rejects.toThrow(
      'Gemini response is not an array'
    )
  })

  it('should throw error on invalid vocabulary item structure', async () => {
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify([
        { word: 'hello', description: 'olá' }, // missing useCase
        { word: 'world', description: 'mundo', useCase: 'ex2' },
        { word: 'cat', description: 'gato', useCase: 'ex3' },
        { word: 'dog', description: 'cachorro', useCase: 'ex4' },
        { word: 'sun', description: 'sol', useCase: 'ex5' },
      ]),
    })

    const repository = new GeminiVocabularyRepository(mockApiKey)

    await expect(repository.getVocabularyItems(5)).rejects.toThrow(
      'Invalid vocabulary item structure in response'
    )
  })

  it('should throw error when count does not match', async () => {
    mockGenerateContent.mockResolvedValue({
      text: JSON.stringify([
        { word: 'hello', description: 'olá', useCase: 'ex1' },
        { word: 'world', description: 'mundo', useCase: 'ex2' },
      ]),
    })

    const repository = new GeminiVocabularyRepository(mockApiKey)

    await expect(repository.getVocabularyItems(5)).rejects.toThrow(
      'Expected 5 items but received 2'
    )
  })
})
