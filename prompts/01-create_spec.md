Help me write the Spec Driven Development to v0 by vercel of an app for Brazilians learn new words in english

# Description

A web app where the user sees a word in english with its description in portuguese, the user had to memorize it along with a sequence of other 4 words
After memorize the 5 words, a quiz should start showing the description in portuguese and 5 the 5 words as options
At the end, the user will see a result of the quiz

# Technology

- NextJs with ReactJs and API routes
- Material UI components for all components
- Gemini for generating the words
    - ```js
      const genai = require('@google/genai');  
      const ai = new genai.GoogleGenAI({})
      const response =
          await ai.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents:
                  'Elabore 5 palavras distintas e seus respectivos significados e um exemplo de uso. Retorne um JSON no formato [{word, description, useCase}]. Não adicione quebras de linhas. `word` em inglês, `description` em português e `useCase` em português',
              config: {
                  systemInstruction:
                      'Responda somente questões relacionadas ao ensino de inglês.'
              }
          })
      const message = response.text
      return {
          answer: message,
          timestamp: new Date().toISOString()
      }
      ```

# Architecture

- Clean Architecture
- Domain-Driven Design (DDD)
- Unit and UI tests with more than 90% coverage
- Design System
- NextJs API Routes for generating words with Gemini

# User Stories

- Include the user flows with steps to test

# Business Rules

- Use env variables when possible
- The 5 words should be loaded in a single GET request
- The words should be generated at each request
- The pages must be server side generated
- Must include a Github Action to run all tests
