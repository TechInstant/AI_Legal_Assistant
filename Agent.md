# Agent.md — Constitutional Intelligence Platform Specification

## Product Vision

Build a modern AI-powered legal knowledge platform that allows users to:
- Search and explore constitutions and laws of countries worldwide
- Listen to constitutional articles and legal content using AI voice narration
- Ask legal questions conversationally
- Bookmark, highlight, and compare laws
- Translate laws into simpler language
- Access offline reading for saved materials
- Receive updates when laws or constitutions change

The platform should feel trustworthy, academic, modern, and accessible to both legal professionals and ordinary citizens.

---

# Core Product Goals

1. Make constitutional law easy to access globally
2. Simplify legal understanding for non-lawyers
3. Support accessibility through voice reading
4. Provide AI-assisted legal navigation
5. Maintain legal accuracy and source traceability
6. Deliver a premium reading experience

---

# Recommended Tech Stack

## Frontend
- React + Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand or Redux Toolkit
- React Query / TanStack Query

## Backend
- Node.js + Express.js or NestJS
- TypeScript
- REST API or GraphQL

## Database
- PostgreSQL
- Prisma ORM

## Search Infrastructure
- Elasticsearch or Meilisearch

## AI Features
- OpenAI API
- LangChain
- RAG architecture for legal document retrieval

## Authentication
- Firebase Authentication
OR
- Clerk
OR
- Auth0

## Storage
- AWS S3
- Cloudflare R2

## Voice Features
- ElevenLabs
OR
- OpenAI TTS API

## Deployment
- Vercel (Frontend)
- Railway / Render / AWS (Backend)

---

# System Architecture

## Architecture Style
Use modular clean architecture.

Recommended structure:
- Presentation Layer
- Application Layer
- Domain Layer
- Infrastructure Layer

---

# Core Features

## 1. Global Constitution Explorer

Users can:
- Select any country
- View constitution
- Browse by chapter/article
- Search specific terms
- Jump to sections quickly

### Requirements
- Fast loading
- Indexed search
- Article anchors
- Responsive UI
- Source citations

---

## 2. AI Legal Assistant

Users can ask:
- "What does freedom of speech mean in Nigeria?"
- "Compare Ghana and Kenya constitutions"
- "Explain this article in simple English"

### AI Requirements
- Retrieval-Augmented Generation (RAG)
- Prevent hallucinations
- Cite exact legal sections
- Maintain conversational memory

### Important
Never allow the AI to invent laws.

Every AI response must:
- Include source references
- Include article/chapter references
- Display confidence indicators

---

## 3. Voice Reading System

Users can:
- Listen to constitutional articles
- Change narration speed
- Pause/resume
- Select voice types

### Voice Features
- Natural voice narration
- Multi-language support
- Streaming playback
- Cached audio generation
- Background playback

### Accessibility
Must support:
- Screen readers
- Dyslexia-friendly modes
- High contrast mode

---

## 4. Constitution Comparison Engine

Allow side-by-side comparisons:
- Country vs country
- Article vs article
- Rights comparison
- Executive powers comparison

### Example
Compare:
- Freedom of speech
- Judicial structure
- Human rights protections

---

## 5. Legal Timeline

Display:
- Constitutional amendments
- Historical legal changes
- Major judicial reforms

---

## 6. AI Simplification Layer

Users can:
- Convert legal text to plain English
- Generate summaries
- Create student study notes

### Reading Modes
- Scholar mode
- Student mode
- Beginner mode

---

## 7. Bookmarking and Annotation

Users should be able to:
- Highlight text
- Save articles
- Add notes
- Export annotations

---

## 8. Offline Access

Allow:
- Saved constitutions
- Downloaded audio
- Reading without internet

---

## 9. Multi-language Translation

Support:
- English
- French
- Arabic
- Spanish
- Portuguese

Future:
- Auto-detect language

---

# Recommended UI/UX Features

## Reading Experience
- Smooth typography
- Minimal distractions
- Sticky article navigation
- Smart progress tracking

## Interaction
- Smooth animations
- Skeleton loaders
- Keyboard navigation
- Fast transitions

## Premium Feel
- Glassmorphism accents
- Soft gradients
- Elevated cards
- Fluid scrolling

---

# Security Practices

## Authentication
- JWT authentication
- OAuth support
- Session expiration
- MFA support

## Data Protection
- Encrypt sensitive data
- Secure API keys
- Rate limiting
- Input validation

## Legal Safety
- Clearly state:
  "AI responses are informational and not legal advice."

---

# Software Engineering Standards

## Code Quality
- ESLint
- Prettier
- Husky Git hooks
- Strict TypeScript mode

## Architecture Rules
- Avoid massive components
- Use reusable hooks
- Separate business logic
- Keep components modular

## Naming Conventions
- PascalCase for components
- camelCase for variables
- kebab-case for folders

## Git Workflow
- Feature branches
- Pull request reviews
- Conventional commits

Example:
- feat:
- fix:
- chore:
- refactor:

---

# Performance Requirements

## Frontend
- Lazy loading
- Route splitting
- Optimized images
- Memoization

## Backend
- Redis caching
- Query optimization
- Pagination
- Streaming APIs

## Voice Optimization
- Cache generated audio
- Use CDN delivery

---

# Accessibility Standards

Must follow:
- WCAG 2.1
- Keyboard accessibility
- Proper ARIA labels
- Semantic HTML

---

# AI Engineering Practices

## Prompt Engineering
- Structured prompts
- Context windows
- Citation enforcement

## RAG Pipeline
- Chunk legal documents
- Vector embeddings
- Semantic retrieval

## Hallucination Prevention
- Never answer without sources
- Show uncertainty
- Validate retrieved context

---

# Suggested Database Schema

## Users
- id
- name
- email
- role
- preferences

## Countries
- id
- name
- code
- flag

## Constitutions
- id
- countryId
- title
- version
- publishedDate

## Articles
- id
- constitutionId
- articleNumber
- title
- content

## AudioNarrations
- id
- articleId
- voiceType
- audioUrl

## Bookmarks
- id
- userId
- articleId

---

# API Design Suggestions

## REST Endpoints

### Auth
POST /auth/login
POST /auth/register

### Constitutions
GET /countries
GET /constitutions/:country
GET /articles/:id

### AI
POST /ai/explain
POST /ai/compare

### Voice
POST /voice/generate
GET /voice/:id

---

# Testing Strategy

## Frontend Testing
- Vitest
- React Testing Library
- Playwright

## Backend Testing
- Jest
- Supertest

## AI Evaluation
- Prompt evaluation
- Response validation
- Hallucination checks

---

# Monitoring and Observability

Use:
- Sentry
- LogRocket
- Prometheus
- Grafana

Track:
- API latency
- Voice generation errors
- Search failures
- AI response quality

---

# Monetization Ideas

## Free Plan
- Limited searches
- Basic voice reading

## Premium Plan
- Unlimited access
- AI legal assistant
- Advanced comparisons
- Offline downloads
- Premium narration voices

## Enterprise
- Law firms
- Universities
- Government institutions

---

# Future Expansion Ideas

## Mobile App
- React Native
- Flutter

## AI Debate Mode
AI discusses constitutional interpretation.

## Legal Learning Platform
- Quizzes
- Flashcards
- Law school prep

## Court Case Integration
Link laws to important court cases.

## Civic Education Mode
Educational version for schools.

---

# Final Product Direction

The app should combine:
- Legal accuracy
- Premium UX
- Accessibility
- AI intelligence
- Global legal education

The experience should feel:
- Modern
- Elegant
- Intelligent
- Trustworthy
- Academic
- Accessible
