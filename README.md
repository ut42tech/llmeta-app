# LLMeta Client Desktop

A 3D multiplayer metaverse client built with Next.js, React Three Fiber, and LiveKit for real-time state sync.

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- pnpm

### Installation & Setup

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```

2.  **Set up environment variables:**
    Create a `.env.local` file (use `.env.example` as a template) and add your LiveKit credentials:
    ```
    LIVEKIT_API_KEY=your_livekit_api_key
    LIVEKIT_API_SECRET=your_livekit_api_secret
    LIVEKIT_URL=wss://your-livekit-host
    LIVEKIT_DEFAULT_ROOM=playground
    DEEPGRAM_API_KEY=your_deepgram_api_key
    ```
    The public variable selects which room to join from the browser, while the server-side values are only read inside the `/api/livekit/token` route when minting access tokens.

3.  **Run the development server:**
    ```bash
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Controls

- **Move:** WASD
- **Camera:** Drag mouse
- **Jump:** Space

## Real-time Voice Captions

- When you enable the microphone, the client streams a copy of your voice to Deepgram via `/api/deepgram/token` and renders live captions in the overlay.
- Make sure `DEEPGRAM_API_KEY` is configured on the server (never expose it directly to the browser); the API route mints short-lived access tokens so the key is never sent to the client.
- The caption pill appears near the dock once audio is detected; disable the mic to pause transcription.

## Available Scripts

- `pnpm dev`: Starts the development server.
- `pnpm build`: Creates a production build.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Runs the linter.
- `pnpm format`: Formats the code.

## LiveKit Notes

- The `/api/livekit/token` Next.js route issues access tokens using the server-side environment variables; ensure this API key/secret pair is never exposed on the client.
- The LiveKit data channel is responsible for both movement (`MOVE`) and profile (`CHANGE_PROFILE`) broadcasts, so a running LiveKit deployment is required for multiplayer features.