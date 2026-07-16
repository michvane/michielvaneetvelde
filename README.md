# Michiel Van Eetvelde — Portfolio

Personal portfolio and frontend engineering showcase, built with Next.js, React, TypeScript, Tailwind CSS, and a self-hosted Unity WebGL experience.

The site is under active development. The repository is intentionally public so the implementation, accessibility decisions, performance boundaries, and engineering workflow can be inspected alongside the finished experience.

## Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test
npm run check
npm run build
```

## Architecture

- App Router pages and layouts are Server Components by default.
- Interactive behavior is isolated in small Client Component boundaries.
- Shared visual decisions are expressed through semantic design tokens and local UI primitives.
- Feature-specific domain rules live outside page components.
- Achievements are driven by typed domain events, validated versioned local persistence, and pure, unit-tested rules.
- Privacy-friendly Umami analytics track page views, resume downloads, and anonymous achievement unlocks in production.
- The Unity WebGL payload is treated as a separate performance boundary and is loaded only after explicit launch.

See [AGENTS.md](./AGENTS.md) for the repository contract, coding standards, validation expectations, and contribution workflow.

## Core stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Vitest
- Geist and Geist Mono
- Unity WebGL

## Status

The homepage, resume, and first local-only gamification slice form the current foundation. Documentation will evolve alongside each shipped feature.
