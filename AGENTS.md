<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project contract

## Purpose

This repository is Michiel Van Eetvelde's public portfolio and an engineering showcase. Treat visual quality, code quality, accessibility, performance, and documentation as product requirements.

Do not invent resume facts, career metrics, testimonials, project outcomes, or confidential work details. Keep private planning files and personal address information out of commits.

## Repository map

- `src/app`: App Router pages, layouts, metadata, and global styles.
- `src/components`: reusable layout and visual primitives.
- `src/features`: feature-specific domain logic and UI.
- `src/content`: typed public portfolio content.
- `public/game`: generated Unity WebGL export. Treat it as a generated artifact unless a task explicitly targets the game build.
- `.agents/skills`: repeatable repository workflows for implementation and review.

Create these directories only when they have real contents. Do not add placeholder modules merely to match the intended structure.

## Canonical commands

Use npm because `package-lock.json` is the canonical lockfile.

```bash
npm run dev
npm run lint
npm run typecheck
npm run check
npm run build
```

Add test commands here when their tools are introduced. Run checks relevant to the change and run the production build before declaring a user-facing slice complete.

## Architecture

- Keep pages and layouts as Server Components by default.
- Add `'use client'` only at the smallest boundary that needs browser APIs, effects, state, or event handlers.
- Keep gamification rules, economy configuration, persistence, and migrations outside visual components.
- Use stable domain events; do not let page components mutate Bit balances directly.
- Keep public content typed and separate from page layout where practical.
- Do not mount or preload the Unity iframe or build assets until the visitor explicitly launches the game.
- Prefer direct imports and feature-local types. Avoid broad barrel files and generic dumping grounds such as `utils.ts`.
- Do not add speculative abstractions. Extract shared code when multiple real consumers establish a stable pattern.

## Design system and UI

- Use Geist and Geist Mono through `next/font`.
- Use semantic design tokens from the global theme. Do not scatter raw brand colors, shadows, radii, or motion timings through page components.
- Build branded primitives locally. Use shadcn or another headless primitive selectively when complex accessible behavior justifies it; restyle it to the local system.
- Prefer semantic HTML and native interaction behavior. Do not make clickable `div` or `span` elements.
- Every interactive feature must work with keyboard, touch, and pointer input.
- Respect `prefers-reduced-motion`; reduced motion must preserve the same information and outcome.
- Playful interactions must not block the resume, direct contact information, navigation, or accessibility controls.
- Keep animations purposeful: communicate earning, spending, unlocking, navigation, or state change.

## Dependencies

- Prefer the platform and existing stack when they provide a clear, reliable implementation.
- Add a dependency only for a concrete need; explain why it is preferable to a small local implementation.
- Review maintenance quality, client-bundle impact, accessibility behavior, and transitive scope before adding frontend packages.
- Do not introduce a full component suite or state manager for isolated needs.

## TypeScript and code style

- Keep TypeScript strict. Avoid `any`, unsafe casts, and unvalidated browser storage.
- Prefer named exports for reusable components and modules; use default exports where Next.js file conventions expect them.
- Keep business rules pure and testable. Keep side effects behind narrow adapters.
- Name props and domain objects for what they represent; avoid vague names such as `data` and `item` when a precise term exists.
- Comments explain intent, constraints, or surprising behavior—not syntax.
- Do not suppress lint, type, or accessibility errors without documenting the reason.
- Remove dead code instead of commenting it out.
- Do not mix unrelated cleanup into a feature change.

## Accessibility and performance

- Target WCAG 2.2 AA for the portfolio experience.
- Preserve logical landmarks, heading order, focus order, visible focus states, useful labels, and sufficient contrast.
- Give every route a unique title and one clear `h1` so client-side route announcements are meaningful.
- Announce earned achievements and transaction results without moving focus.
- Reserve layout space for hydrated UI and media to avoid layout shift.
- Keep core identity, resume, contact, and game-description content useful without JavaScript.
- Treat the non-game routes and the game payload as separate performance budgets.

## Verification

For UI changes, use the `implement-ui` workflow and verify at representative mobile, tablet, and desktop widths. Check keyboard navigation, focus, reduced motion, loading and error states, browser console output, and adjacent routes.

For reviews, use `review-ui`. Report actionable findings by severity and include file or rendered-state evidence. Do not implement fixes when the request is review-only.

## Git and pull requests

- Do not stage, commit, push, rewrite history, or create a pull request unless the user explicitly requests it.
- Preserve unrelated working-tree changes.
- Use lowercase Conventional Commit subjects when committing, for example `feat(gamification): add Bits persistence`.
- Prefer one coherent, reviewable outcome per commit and pull request. Keep implementation, relevant tests, and necessary documentation together.
- Avoid `WIP`, vague subjects, unrelated refactors, and AI attribution in commit messages.
- UI pull requests should include representative desktop and mobile evidence plus verification, accessibility, and performance notes.

## Definition of done

A user-facing change is done when its relevant normal, responsive, loading, empty, locked/unlocked, error, persistence, keyboard, touch, and reduced-motion states are handled; appropriate tests exist; lint, type checks, and the production build pass; and public documentation matches what shipped.
