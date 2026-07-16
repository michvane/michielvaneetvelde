---
name: implement-ui
description: Build or modify polished frontend UI in this portfolio repository. Use when implementing routes, components, responsive layouts, styling, animations, or interaction states under src/app, src/components, or src/features.
---

# Implement UI

Implement one coherent vertical slice, then verify its rendered behavior and repository quality gates.

## Workflow

1. Read `AGENTS.md`, inspect the target route and its neighboring patterns, and read the relevant bundled Next.js guide before changing framework behavior.
2. State the slice's user outcome. Identify the normal, responsive, interactive, loading, empty, locked/unlocked, error, persistence, keyboard, touch, and reduced-motion states that actually apply.
3. Inspect the current rendered page before choosing styles. Reuse semantic tokens and local primitives; do not design an isolated component that ignores its page context.
4. Keep static content and page composition server-rendered. Place client boundaries only around behavior requiring browser APIs or React client state.
5. Implement the smallest complete slice. Keep domain rules out of visual components, use semantic HTML, and avoid inventing portfolio content.
6. Add or update tests at stable public seams. Do not test Tailwind class strings or private implementation details.
7. Run lint, type checking, relevant tests, and a production build.
8. Run the site and inspect the result at representative mobile, tablet, and desktop widths. Exercise keyboard navigation, touch-sized controls, focus, reduced motion, loading/error states, console output, and adjacent routes.
9. Review the final diff for scope creep, unnecessary client JavaScript, unused code, accidental Unity asset loading, and unrelated formatting.
10. Report the outcome, verification performed, and any remaining uncertainty. Do not stage or commit unless explicitly requested.

## Project-specific guardrails

- Preserve direct access to resume and contact content.
- Keep the Unity payload unloaded until explicit launch.
- Use Geist and the repository's semantic tokens.
- Prefer purposeful motion and provide an equivalent reduced-motion state.
- Add dependencies only when their behavior is materially better than a small local implementation.
