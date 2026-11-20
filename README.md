# LearnPilot: Personalized AI Learning Agent

[![CI](https://github.com/vivekofficial0407-create/learnpilot/actions/workflows/ci.yml/badge.svg)](https://github.com/vivekofficial0407-create/learnpilot/actions)

> **Problem Statement:** PS04, Personalized AI Learning Agent
> **Live Demo:** https://learnpilot-khaki.vercel.app/
> **Repository:** https://github.com/vivekofficial0407-create/learnpilot

LearnPilot is an adaptive AI learning agent. It diagnoses what a learner really knows, builds a personalized roadmap, teaches each module in the learner's preferred style, quizzes them, and then **adapts the next step based on their score**. Every decision the agent makes is shown to the learner, so the personalization is visible and not a black box.

---

## The Problem

Most online learning is one-size-fits-all. Beginners get overwhelmed, advanced learners get bored, and nobody gets feedback on *why* they are being taught something. Learners also rarely know their real level, since self-assessment is unreliable.

## The Solution

LearnPilot closes the loop with an agent that follows an **Assess → Plan → Teach → Quiz → Adapt → Track** cycle:

1. **Onboard:** the learner enters a topic, self-reported level, goal, and learning style.
2. **Assess:** the agent asks 4 diagnostic MCQs to verify the real level.
3. **Plan:** it generates a roadmap of 5-7 modules with time estimates.
4. **Teach:** each module is written for the learner's level and style (Simple / Example-Heavy / Exam-Focused).
5. **Quiz:** 5 questions per module.
6. **Adapt:** the agent picks the next action from the quiz score and explains why.
7. **Track:** a dashboard shows mastery per module, weak topics, and a streak.

### Adaptive Logic

| Quiz score | Agent action |
|---|---|
| Below 60% | Re-explain the module more simply with new examples |
| 60% to 85% | Continue to the next module |
| Above 85% | Raise the difficulty or skip ahead |

The decision and its reason appear in the **Agent Decision** panel. The logic lives in `lib/adaptive-engine.ts` as pure functions, so it is easy to test.

---

## Features

- Diagnostic assessment (4 MCQs) to calibrate the real level
- Personalized roadmap with time estimates per module
- Three learning styles: Simple, Example-Heavy, Exam-Focused
- Per-module explanations and 5-question quizzes
- Visible, explained agent decisions after every quiz
- "Ask the Tutor" chat inside each module
- Progress dashboard: mastery per module, weak topics, streak counter
- One-click **Try Demo** with a built-in sample course (works even if the AI API is unavailable)
- PDF export of the study plan
- Progress saved in the browser (localStorage), so a refresh does not lose it

---

## Architecture

```
┌─────────────────────────────┐
│  Browser (Next.js client)   │
│  Onboarding → Assessment →  │
│  Roadmap → Module → Quiz →  │
│  Dashboard                  │
│  localStorage (progress)    │
└──────────────┬──────────────┘
               │  fetch (JSON)
┌──────────────▼──────────────┐
│  Next.js API Routes (server)│
│  /api/assess  /api/plan     │
│  /api/module  /api/tutor    │
│                             │
│  rate limiter → sanitizer → │
│  LLM call → schema check    │
└──────────────┬──────────────┘
               │  API key (server env only)
┌──────────────▼──────────────┐
│        LLM Provider         │
└─────────────────────────────┘
```

On LLM failure, timeout, or invalid output, the app falls back to the built-in demo content instead of crashing.

### Project Structure

```
learnpilot/
├── .github/workflows/          # CI pipeline (lint, type check, tests)
├── app/
│   ├── api/
│   │   ├── assess/route.ts     # Diagnostic questions
│   │   ├── plan/route.ts       # Roadmap generation
│   │   ├── module/route.ts     # Module content + quiz
│   │   └── tutor/route.ts      # Ask-the-tutor chat
│   ├── layout.tsx
│   └── page.tsx
├── components/                 # UI (Onboarding, Quiz, Roadmap, Dashboard, ...)
├── lib/
│   ├── adaptive-engine.ts      # Pure adaptive decision logic
│   ├── llm.ts                  # LLM client (timeout, retry, fallback)
│   ├── validation.ts           # Schema validation of inputs and LLM output
│   ├── sanitizer.ts            # Input sanitization + injection guard
│   ├── rate-limiter.ts         # Per-IP rate limiting
│   ├── storage.ts              # localStorage helpers
│   ├── demo-data.ts            # Offline demo course
│   └── constants.ts
├── types/                      # Shared TypeScript types
└── tests/
    ├── unit/                   # adaptive-engine, sanitizer, validation
    ├── component/              # OnboardingForm, QuizView
    └── e2e/                    # Playwright demo-flow test (run separately)
```

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **AI:** Gemini API, called server-side only
- **Testing:** Vitest, React Testing Library, Playwright
- **Linting:** ESLint with `@typescript-eslint`
- **CI:** GitHub Actions
- **Deployment:** Vercel

---

## How It Meets the Judging Criteria

| Criterion | What we did |
|---|---|
| **Problem Statement Alignment** | Implements the full PS04 loop: assess, plan, teach, quiz, adapt, track. Personalization is driven by level, goal, learning style, and quiz performance, and every decision is explained to the learner. |
| **Code Quality** | Strict TypeScript, ESLint, small reusable components, business logic separated from UI as pure functions, centralized constants and types, CI on every push. |
| **Security** | The API key lives only in server environment variables. Inputs are sanitized with a prompt-injection guard, LLM output is schema-validated, API routes are rate limited, and no personal data is stored on a server. |
| **Efficiency** | Skeleton loaders while content loads, lazy-loaded heavy components, concise prompts, timeouts and retries with fallback to demo content, and progress cached in the browser. |
| **Testing** | 36 automated tests: unit tests for the adaptive engine, sanitizer and validators; component tests for onboarding and quiz. A Playwright test covers the demo flow end to end. The LLM is mocked, so tests need no API key. |
| **Accessibility** | Skip-to-content link, semantic landmarks, keyboard navigation, ARIA labels and live regions for agent decisions and loading, and a responsive layout. |

---

## Security Measures

- The LLM API key is read from server-side environment variables only and never sent to the client.
- All user input is trimmed, length-limited, stripped of HTML, and checked for prompt-injection patterns before use.
- All LLM responses are validated against strict schemas. Malformed output is rejected and replaced by safe fallback content.
- API routes are rate limited per IP.
- `.env*` files are git-ignored, and `.env.example` documents the required variables.
- Only learning progress is stored, and only in the user's own browser.

## Accessibility Notes

- Skip-to-main-content link and semantic landmarks
- Full keyboard navigation with visible focus states
- Live regions announce loading status and the agent's decisions to screen readers
- Quiz feedback does not rely on color alone
- Responsive layout for mobile and desktop

---

## Getting Started

### Prerequisites
- Node.js 18 or higher
- A free Gemini API key from https://aistudio.google.com/apikey

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/vivekofficial0407-create/learnpilot.git
cd learnpilot

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local      # Windows: copy .env.example .env.local
# Open .env.local and add your API key

# 4. Run the development server
npm run dev
```

Open http://localhost:3000 in your browser.

### Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Your LLM API key (server-side only; see `.env.example` for the exact name) |

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit and component tests (Vitest) |

---

## Testing

```bash
npm test
```

This runs 36 tests across 5 files:
- **Unit:** adaptive engine thresholds, input sanitizer and injection guard, validation schemas
- **Component:** onboarding form and quiz view

The LLM is mocked, so tests run without an API key.

**End-to-end (Playwright).** The demo-flow test lives in `tests/e2e/` and runs separately from Vitest:

```bash
npx playwright install
npx playwright test
```

---

## Deployment (Vercel)

1. Push the code to GitHub.
2. Import the repository in Vercel.
3. Add the API key under **Settings → Environment Variables**.
4. Click **Deploy**.

---

## Future Improvements

- User accounts and cloud-synced progress
- Spaced-repetition reminders for weak topics
- Multi-language support
- Voice-based tutor

---
## Screenshots
<img width="1895" height="848" alt="Screenshot 2026-11-20 133250" src="https://github.com/user-attachments/assets/ef7350ea-ddad-4ef0-8f2b-ffe9166dfbeb" />
<img width="1896" height="875" alt="Screenshot 2026-11-20 133427" src="https://github.com/user-attachments/assets/21e74a99-06fd-454d-ab7f-dc28774538ec" />
<img width="1892" height="846" alt="Screenshot 2026-11-20 133821" src="https://github.com/user-attachments/assets/83f4509f-6f79-414f-82f8-d43f5a4c743e" />
<img width="1806" height="857" alt="Screenshot 2026-11-20 134000" src="https://github.com/user-attachments/assets/af370be9-9317-41dc-8025-114500f7a132" />



## Author

**Vivek Gautam**
GitHub: [@vivekofficial0407-create](https://github.com/vivekofficial0407-create)

*Built for the AI Code Submission event, PS04: Personalized AI Learning Agent.*
