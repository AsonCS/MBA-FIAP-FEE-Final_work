import { VocabularyApp } from '@/components/domain/VocabularyApp'
import { GeminiVocabularyRepository } from '@/core/infrastructure/repositories/GeminiVocabularyRepository'
import { GenerateVocabularyUseCase } from '@/core/application/use-cases/GenerateVocabulary'
import { ErrorMessage } from '@/components/ui/ErrorMessage'

/**
 * Home Page - Server Component
 * Fetches vocabulary items server-side and passes them to the client component.
 */
export default async function HomePage() {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return (
        <main>
          <ErrorMessage message="GEMINI_API_KEY is not configured. Please add it to your environment variables." />
        </main>
      )
    }

    const repository = new GeminiVocabularyRepository(apiKey)
    const useCase = new GenerateVocabularyUseCase(repository)
    const vocabulary = await useCase.execute(5)

    return (
      <main>
        <VocabularyApp initialVocabulary={vocabulary} />
      </main>
    )
  } catch (error) {
    console.error('Failed to load vocabulary:', error)
    
    return (
      <main>
        <ErrorMessage
          message={
            error instanceof Error
              ? error.message
              : 'Failed to load vocabulary. Please try again later.'
          }
        />
      </main>
    )
  }
}
