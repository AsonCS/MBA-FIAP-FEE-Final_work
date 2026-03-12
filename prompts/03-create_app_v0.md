Here is a comprehensive Spec Driven Development (SDD) document formatted for Vercel's v0 and your development workflow. It outlines the structure, architecture, and behavior of your English learning application.

## Project Overview

A web application designed to help Brazilian users learn English vocabulary. The app generates five random English words per session, guides the user through a memorization phase, tests their retention with a multiple-choice quiz, and provides a final score.

---

## 1. Architecture & Technologies

- **Framework:** Next.js (React) with Server-Side Rendering (SSR).
- **Language:** Typescript.
- **UI Library:** Material UI (MUI) serving as the foundation for the Design System.
- **AI Integration:** `@google/genai` SDK using the `gemini-3-flash-preview` model via Next.js API Routes.
- **Architecture:** Clean Architecture combined with Domain-Driven Design (DDD).
- **Testing:** Jest and React Testing Library using mocks (Target: >90% coverage for Unit and UI).
- **CI/CD:** GitHub Actions for automated testing.

---

## 2. Domain-Driven Design (DDD) Layers

### 2.1 Domain Layer (Entities)

The core business objects that hold no dependencies on external frameworks.

- `VocabularyItem`: Represents a single generated word. Properties: `word` (English), `description` (Portuguese), `useCase` (Portuguese).
- `QuizSession`: Represents the user's current attempt. Properties: `vocabularyItems` (Array of 5), `currentStep`, `score`.

### 2.2 Application Layer (Use Cases)

- `GenerateVocabularyUseCase`: Orchestrates the fetching of 5 words from the AI provider.
- `EvaluateQuizAnswerUseCase`: Compares the user's selected word against the correct word for a given Portuguese description.

### 2.3 Interface Adapters

- **Controllers:** Next.js API Route handlers wrapping the Gemini API.
- **Presenters:** React hooks managing local state (e.g., `useMemorization`, `useQuiz`).
- **Repositories (Interfaces):** `IVocabularyRepository` defining the contract for fetching words.

### 2.4 Infrastructure Layer

- `GeminiVocabularyRepository`: Implements `IVocabularyRepository` using the `@google/genai` SDK.
- MUI Theme configuration (Design System).

---

## 3. API Specification

### Endpoint: `GET /api/vocabulary`

Fetches 5 unique English words along with their Portuguese descriptions and usage examples.

**Implementation detail:**

```javascript
import { GoogleGenAI } from '@google/genai'

export async function GET() {
    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        })
        const response =
            await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents:
                    'Elabore 5 palavras distintas e seus respectivos significados e um exemplo de uso. Retorne um JSON estrito no formato [{"word": "", "description": "", "useCase": ""}]. Não adicione quebras de linhas ou crases de markdown. `word` em inglês, `description` em português e `useCase` em português',
                config: {
                    systemInstruction:
                        'Responda somente questões relacionadas ao ensino de inglês. Retorne apenas JSON válido.'
                }
            })

        // Parse the JSON string from the AI response
        const words = JSON.parse(response.text)

        return Response.json({
            data: words,
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        return Response.json(
            {
                error: 'Failed to generate vocabulary'
            },
            { status: 500 }
        )
    }
}
```

---

## 4. User Stories & Test Flows

### User Story 1: Memorization Phase

**As a user**, I want to see 5 English words with their Portuguese descriptions so that I can memorize them before the quiz.

- **Test Flow:**

1. Navigate to the main application route `/`.
2. Verify that the page is Server-Side Generated (SSR) and loads without immediate client-side API calls.
3. Assert that exactly 5 MUI `Card` components are rendered.
4. Assert each card displays a `word` in English, a `description` in Portuguese, and a `useCase` in Portuguese.
5. Click the "Start Quiz" MUI `Button`.
6. Verify the UI transitions to the Quiz phase.

### User Story 2: Quiz Phase

**As a user**, I want to be tested on the words I just saw by matching the Portuguese description to the correct English word.

- **Test Flow:**

1. In the Quiz phase, verify the app displays a Portuguese description.
2. Verify there are 5 button options representing the 5 English words loaded in the session.
3. Click a word option.
4. Verify the UI proceeds to the next description until all 5 have been tested.

### User Story 3: Results Display

**As a user**, I want to see my final score after answering all 5 questions so I know how well I performed.

- **Test Flow:**

1. Complete the last question of the quiz.
2. Verify the UI transitions to the Results view.
3. Assert the text "You scored X out of 5" is visible (where X is the accurate calculation of correct answers).
4. Click the "Try Again" button.
5. Verify a new Server-Side request is triggered to load 5 _new_ words, and the user is returned to the Memorization phase.

---

## 5. Business Rules & Constraints

1. **Environment Variables:** The API key (`GEMINI_API_KEY`) and any other configuration must be injected via `.env.local` and accessed securely on the server side.
2. **Single Request Efficiency:** The 5 words must be loaded together in a single `GET` request to minimize AI latency.
3. **Dynamic Generation:** No caching of the AI responses; the words must be uniquely generated by Gemini on every single request.
4. **Server-Side Generation (SSR):** The initial load of the words must happen on the server. In Next.js App Router, this means fetching the data within a Server Component before passing it to the interactive Client Components managing the quiz state.
5. **GitHub Actions Requirement:** A `.github/workflows/test.yml` file must be included to run `npm install`, `npm run lint`, and `npm run test` on every push and pull request to the `main` branch.

---

## 6. Next.js & Clean Architecture Folder Structure exemple

```text
📦 app
├── 📂 .github
│   └── 📂 workflows
│       └── 📄 test.yml                # CI/CD: Runs tests on push/PR
├── 📂 src
│   ├── 📂 app                         # 1. PRESENTATION LAYER (Next.js App Router)
│   │   ├── 📂 api
│   │   │   └── 📂 vocabulary
│   │   │       └── 📄 route.ts        # Next.js API Route (Controller)
│   │   ├── 📂 quiz
│   │   │   └── 📄 page.tsx            # Quiz UI (Client/Server Components)
│   │   ├── 📂 results
│   │   │   └── 📄 page.tsx            # Score Display UI
│   │   ├── 📄 layout.tsx              # Root Layout (MUI Theme Provider setup)
│   │   └── 📄 page.tsx                # Memorization Phase UI (SSR Server Component)
│   │
│   ├── 📂 components                  # UI COMPONENTS (Material UI)
│   │   ├── 📂 ui                      # Design System (Buttons, Typography, generic wrappers)
│   │   └── 📂 domain                  # Domain-specific UI (VocabularyCard, QuizOption)
│   │
│   ├── 📂 core                        # 2. CORE DOMAIN & APPLICATION LAYERS
│   │   ├── 📂 domain                  # Enterprise Business Rules (Entities)
│   │   │   ├── 📄 VocabularyItem.ts   # { word, description, useCase }
│   │   │   └── 📄 QuizSession.ts      # Score calculation logic
│   │   │
│   │   ├── 📂 application             # Application Business Rules (Use Cases)
│   │   │   ├── 📂 interfaces          # Contracts (Ports)
│   │   │   │   └── 📄 IVocabularyRepository.ts
│   │   │   └── 📂 use-cases           # Application actions
│   │   │       ├── 📄 GenerateVocabulary.ts
│   │   │       └── 📄 EvaluateAnswer.ts
│   │   │
│   │   └── 📂 infrastructure          # 3. INFRASTRUCTURE LAYER (Adapters)
│   │       └── 📂 repositories
│   │           └── 📄 GeminiVocabularyRepository.ts # @google/genai implementation
│   │
│   ├── 📂 theme                       # MATERIAL UI CONFIGURATION
│   │   └── 📄 theme.ts                # Custom colors, typography, component overrides
│   │
│   └── 📂 tests                       # UNIT & UI TESTS (Target: >90% coverage)
│       ├── 📂 domain                  # Jest tests for entities
│       ├── 📂 application             # Jest tests for use cases
│       ├── 📂 infrastructure          # Tests with mocked API calls
│       └── 📂 components              # React Testing Library tests for UI
│
├── 📄 .env.local                      # GEMINI_API_KEY
├── 📄 jest.config.js                  # Jest configuration
├── 📄 .gitignore
├── 📄 eslint.config.mjs
├── 📄 next.config.js
├── 📄 next-env.d.ts
├── 📄 tsconfig.json
└── 📄 package.json

```

---

### Layer Breakdown

- **`src/core/domain/`**: The absolute center of your app. These are pure TypeScript files. They know nothing about Next.js, Material UI, or Gemini. They just define what a word is and how a quiz session is scored.
- **`src/core/application/`**: Contains your Use Cases. The `GenerateVocabulary` use case will call the `IVocabularyRepository` interface to get words, without caring _how_ those words are fetched.
- **`src/core/infrastructure/`**: This is where you implement the interfaces. `GeminiVocabularyRepository.ts` will house the actual `@google/genai` logic you specified, transforming the AI's JSON output into your `VocabularyItem` entities.
- **`src/app/` & `src/components/**`: The outermost layer. `app/page.tsx`will call the`GenerateVocabulary` use case (via the API route or directly server-side) and pass the resulting data to your Material UI components.

---

### The GitHub Action (`.github/workflows/test.yml`) example

```yaml
name: Test Coverage Pipeline

on:
    push:
        branches: ['main']
    pull_request:
        branches: ['main']

jobs:
    test:
        runs-on: ubuntu-latest

        steps:
            - name: Checkout repository
              uses: actions/checkout@v4

            - name: Set up Node.js
              uses: actions/setup-node@v4
              with:
                  node-version: '20' # or your target Node version
                  cache: 'npm'

            - name: Install dependencies
              run: npm ci

            - name: Run Linter
              run: npm run lint

            - name: Run Tests with Coverage
              run: npm run test -- --coverage ## Use mock for testing
```
