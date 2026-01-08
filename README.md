# LLMeta Client

> 🎓 **Graduation Research Project (2025)** — Nagasaki University Setozaki Lab.

The web application for **Project LLMeta** — an AI-powered metaverse platform where each user is paired with a dedicated AI agent in an immersive 3D virtual world.

## Concept

**Project LLMeta** is centered on enhancing user-to-user communication through AI assistance.

Each user is paired with a personal AI agent that facilitates communication between users by:

- 📝 **Contextual Explanations** — Providing real-time clarifications based on conversation context
- 📋 **Summaries** — Condensing discussions to help users stay aligned
- 🎨 **Image Generation** — Creating visuals to support idea sharing
- 🤝 **Understanding Enhancement** — Reducing misunderstandings and improving comprehension

## Features

- 🌐 **3D Metaverse** — Immersive virtual world powered by React Three Fiber
- 🤖 **Personal AI Agent** — Each user is paired with a dedicated AI agent
- 🎭 **VRM Avatar Support** — 3D character models via @react-three/viverse
- 🎙️ **Real-time Voice Chat** — WebRTC-based voice communication via LiveKit
- 💬 **Text Chat** — Real-time messaging with chat bubbles
- 🌍 **Multi-language Support** — English and Japanese localization
- ✨ **Modern UI** — Smooth animations with Motion and shadcn/ui components

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Core** | Next.js 16 (App Router), React 19, TypeScript |
| **3D/VR** | Three.js, React Three Fiber, @react-three/viverse, @react-three/xr, @pixiv/three-vrm |
| **Real-time** | LiveKit, Deepgram |
| **AI** | Vercel AI SDK, OpenAI |
| **Auth** | Supabase Auth (@supabase/ssr) |
| **UI** | shadcn/ui, Tailwind CSS v4, Motion, Lucide Icons |
| **State** | Zustand |
| **i18n** | next-intl |
| **Testing** | Vitest, Testing Library, Playwright, Storybook 10 |
| **Linting** | Biome |

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/ut42tech/llmeta-client.git
cd llmeta-client

# Install dependencies
pnpm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key || `LIVEKIT_API_KEY` | LiveKit API key |
| `LIVEKIT_API_SECRET` | LiveKit API secret |
| `LIVEKIT_URL` | LiveKit WebSocket URL |
| `LIVEKIT_DEFAULT_ROOM` | Default room name |
| `DEEPGRAM_PROJECT_ID` | Deepgram project ID |
| `DEEPGRAM_API_KEY` | Deepgram API key |
| `OPENAI_API_KEY` | OpenAI API key |
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway key |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token |

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                     # Next.js App Router pages
│   ├── (auth)/              # Authentication pages (login, signup)
│   ├── (hub)/               # Main hub with sidebar
│   │   ├── instance/        # Instance lobby page
│   │   ├── settings/        # User settings page
│   │   └── world/           # World detail page
│   ├── actions/             # Server actions
│   ├── api/                 # API routes
│   │   ├── ai/              # AI endpoints (chat, conversations)
│   │   ├── auth/            # Authentication endpoints
│   │   ├── blob/            # Blob storage endpoints
│   │   ├── deepgram/        # Speech-to-text endpoints
│   │   ├── livekit/         # LiveKit token endpoints
│   │   └── messages/        # Message endpoints
│   └── experience/          # Full-screen 3D world experience
├── components/
│   ├── ai-elements/         # AI agent UI components (30 components)
│   ├── character/           # VRM character & player components (8 components)
│   ├── common/              # Shared utilities (5 components)
│   ├── hud/                 # HUD overlays
│   │   ├── ai-chat/         # AI chat sidebar & window
│   │   ├── caption/         # Caption window & waveform
│   │   ├── chat/            # Text chat input & stream
│   │   ├── dock/            # Control buttons & drawers (7 components)
│   │   └── status-bar/      # Connection & player status badges
│   ├── layout/              # Hub layout (4 components)
│   ├── providers/           # Context providers (Auth, I18n, LiveKitSync)
│   ├── scene/               # 3D scene components (4 components)
│   ├── ui/                  # Shared shadcn/ui components (34 components)
│   └── world/               # World cards & instance cards
├── constants/               # App constants (animations, avatars, sync, world)
├── hooks/                   # Custom React hooks (20 hooks)
│   ├── ai-chat/             # AI chat history hooks (1 hook)
│   ├── auth/                # Authentication hooks (1 hook)
│   ├── chat/                # Text chat hooks (2 hooks)
│   ├── common/              # Common utility hooks (1 hook)
│   ├── livekit/             # LiveKit integration (7 hooks)
│   ├── scene/               # 3D scene hooks (5 hooks)
│   ├── transcription/       # Speech-to-text hooks (2 hooks)
│   └── voice-chat/          # Voice chat hooks (1 hook)
├── i18n/                    # Internationalization (en, ja)
├── lib/                     # Utility libraries
│   └── supabase/            # Supabase client (server/browser/middleware)
├── stores/                  # Zustand state stores (8 stores)
├── types/                   # TypeScript types (7 type files)
└── utils/                   # Utility functions (7 utilities)
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run Biome linter |
| `pnpm format` | Format code with Biome |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm test` | Run unit tests with Vitest |
| `pnpm test:e2e` | Run E2E tests with Playwright |
| `pnpm test:all` | Run all tests (unit + E2E) |
| `pnpm storybook` | Start Storybook dev server |
| `pnpm build-storybook` | Build Storybook for deployment |

## License

**Copyright (c) 2025 Takuya UEHARA. All Rights Reserved.**

This project is developed as part of a graduation research project.
Source code is provided for **review and portfolio purposes only**.

🚫 **No License for Reuse:**
You may not use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software without explicit written permission from the author.
