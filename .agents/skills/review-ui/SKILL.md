---
name: review-ui
description: Review frontend changes in this portfolio repository across rendered visual quality, responsive behavior, accessibility, performance, architecture, and scope. Use for UI reviews, pre-commit checks, pull-request reviews, or final verification of routes and components.
---

# Review UI

Review both the code diff and the rendered result. Report actionable findings without changing review-only work.

## Workflow

1. Establish the review scope from the user request and working-tree or branch diff. Read `AGENTS.md` and the originating requirement or spec if available.
2. Run the relevant lint, type, test, and build commands. Separate pre-existing failures from regressions introduced by the reviewed change.
3. Run the site and inspect affected routes at representative mobile, tablet, and desktop widths. Check adjacent routes sharing the same shell or primitives.
4. Exercise normal, loading, empty, locked/unlocked, error, persistence, and retry states that apply.
5. Verify keyboard order, visible focus, semantic roles and headings, labels, announcements, contrast, target sizes, touch behavior, and reduced motion.
6. Inspect the browser console and network activity. Flag hydration errors, unnecessary client boundaries, layout shift, eager optional code, and Unity assets requested before launch.
7. Inspect code for duplicated domain rules, direct balance mutation, unvalidated storage, speculative abstractions, dependency creep, raw design values, and invented portfolio content.
8. Report findings first, ordered by severity. Include a precise file location or rendered reproduction and explain the user impact. Distinguish defects from optional polish.
9. If no actionable findings remain, state that explicitly and summarize residual risks or checks that could not be performed.

## Review boundaries

- Treat tooling failures and generated Unity warnings as configuration issues, not application defects, unless the change targets them.
- Do not implement fixes unless the user asks for changes in addition to review.
- Do not stage, commit, or push review findings.
