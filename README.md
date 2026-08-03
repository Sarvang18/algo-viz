# algo.platform

An interactive Data Structures and Algorithms visualizer built with React, TypeScript, Redux Toolkit, Vite, Tailwind CSS, Monaco Editor, and Framer Motion.

The catalog contains array, recursion, backtracking, tree, graph, dynamic-programming, greedy, string, bit-manipulation, heap, and number-theory demonstrations. Each algorithm emits immutable execution steps containing a data-structure snapshot, highlighted elements, source line, and live variables.

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- A Groq API key only if the optional AlgoBot chat feature is needed

## Local setup

```bash
npm install
copy .env.example .env
npm run dev
```

Set `GROQ_API_KEY` in `.env` to enable chat. The Vite development server provides the local `/api/chat` route, so a separate server is not required.

Optional environment variables:

- `GROQ_MODEL`: overrides the default Groq model.
- `ALLOWED_CHAT_ORIGINS`: comma-separated additional frontend origins accepted by the deployed API.

Never commit `.env`; it is ignored by Git.

## Commands

```bash
npm run dev       # Vite development server with local chat API middleware
npm test          # Algorithm and API validation tests
npm run lint      # ESLint quality gate
npm run build     # Type-check and create the production bundle
npm run preview   # Preview the static production frontend
```

For a deployed chatbot, use a host that supports the serverless function in `api/chat.ts` (for example Vercel). The endpoint applies same-origin checks, bounded input validation, an upstream timeout, and a best-effort per-instance rate limit. Production deployments with significant traffic should additionally enforce account-level quotas or an edge rate limiter.

## Architecture

- `src/engine/algorithms`: generator-based algorithm implementations
- `src/engine/translations`: maintained C++, Java, and Python implementations
- `src/engine/runner.ts`: immutable step collection and safety limit
- `src/engine/Step.ts`: snapshots and execution-step contracts
- `src/components/Visualizer`: array, tree, matrix, graph, and Hanoi renderers
- `src/store`: playback state
- `api/chatCore.ts`: validated provider-independent chat request logic
- `api/chat.ts`: secured serverless HTTP boundary
- `tests`: correctness and request-validation coverage

The code panel supports C++, Java, JavaScript, and Python for every enabled algorithm. The selected language is remembered locally; execution-line highlighting is limited to JavaScript because visualizer step line numbers correspond to the JavaScript implementation.
