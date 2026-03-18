import { GoogleGenAI } from '@google/genai'
import { VocabularyItem, isVocabularyItem } from '@/core/domain/VocabularyItem'
import { IVocabularyRepository } from '@/core/application/interfaces/IVocabularyRepository'

/**
 * GeminiVocabularyRepository
 * Infrastructure implementation of IVocabularyRepository using Google's Gemini AI.
 */
export class GeminiVocabularyRepository implements IVocabularyRepository {
  private readonly ai: GoogleGenAI

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is required')
    }
    this.ai = new GoogleGenAI({ apiKey })
  }

  /**
   * Fetches vocabulary items from Gemini AI
   */
  async getVocabularyItems(count: number = 5): Promise<VocabularyItem[]> {
    const prompt = `Elabore ${count} palavras distintas, comuns e não comuns e seus respectivos significados e um exemplo de uso. Retorne um JSON estrito no formato [{"word": "", "description": "", "useCase": ""}]. Seja criativo na escolha das palavras. Não adicione quebras de linhas ou crases de markdown. \`word\` em inglês, \`description\` em português e \`useCase\` em português`

    const response = await this.ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: 'Responda somente questões relacionadas ao ensino de inglês. Retorne apenas JSON válido.',
      },
    })

    const text = response.text
    // console.log(text)
    if (!text) {
      throw new Error('Empty response from Gemini AI')
    }

    // Clean the response text (remove potential markdown code blocks)
    let cleanedText = text.trim()
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.slice(7)
    }
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.slice(3)
    }
    if (cleanedText.endsWith('```')) {
      cleanedText = cleanedText.slice(0, -3)
    }
    cleanedText = cleanedText.trim()

    let parsed: unknown
    try {
      parsed = JSON.parse(cleanedText)
    } catch {
      throw new Error('Failed to parse Gemini response as JSON')
    }

    if (!Array.isArray(parsed)) {
      throw new Error('Gemini response is not an array')
    }

    const items: VocabularyItem[] = []
    for (const item of parsed) {
      if (!isVocabularyItem(item)) {
        throw new Error('Invalid vocabulary item structure in response')
      }
      items.push(item)
    }

    if (items.length !== count) {
      throw new Error(`Expected ${count} items but received ${items.length}`)
    }

    return items
  }
}
