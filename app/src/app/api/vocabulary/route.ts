import { NextResponse } from 'next/server'
import { GeminiVocabularyRepository } from '@/core/infrastructure/repositories/GeminiVocabularyRepository'
import { GenerateVocabularyUseCase } from '@/core/application/use-cases/GenerateVocabulary'

export const dynamic = 'force-dynamic'

/**
 * GET /api/vocabulary
 * Fetches 5 unique English words with Portuguese descriptions and usage examples.
 */
export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY is not configured' },
        { status: 500 }
      )
    }

    const repository = new GeminiVocabularyRepository(apiKey)
    const useCase = new GenerateVocabularyUseCase(repository)
    
    const words = await useCase.execute(5)

    return NextResponse.json({
      data: words,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Failed to generate vocabulary:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate vocabulary',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
