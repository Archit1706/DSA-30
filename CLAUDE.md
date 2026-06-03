# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm install` — install dependencies (Windows / PowerShell environment).
- `npm run dev` — start Next.js dev server at http://localhost:3000.
- `npm run build` — production build (`next build`). The fastest way to catch MDX parse errors after any large content change. Run this before pushing.
- No test runner, linter, or formatter is configured. If a change requires verification, run `npm run build` and/or load the affected page in the dev server.

## Architecture

DSA-30 is a **Nextra 3 docs site on Next.js 14** (Pages Router) styled with Tailwind. There is no API layer, database, or backend — every page is MDX, and interactivity comes from React components imported into MDX.

- `next.config.mjs` wires `nextra` with `theme: 'nextra-theme-docs'` pointed at `theme.config.jsx` (site chrome: logo, head meta, banner, footer, sidebar settings).
- `pages/_app.jsx` is a minimal wrapper that only imports `styles/globals.css` (which is just the three `@tailwind` directives — no custom CSS layer).
- Content lives under `pages/dayN/`. The landing page `pages/index.mdx` is a custom marketing-style page with a 30-tile roadmap; tiles flagged `live: true` link to days with real content and unflagged tiles render as grey "soon" placeholders.
- **Navigation is driven by `_meta.js` files**, not file discovery. Every directory that should appear in the sidebar needs one. Format: `export default { "slug": "Display Title", ... }`. Order in the object = order in the sidebar. The top-level `pages/_meta.js` controls the day list and includes external links (e.g. `github_link`).
- `templates/` holds reference MDX snippets (`chapter-page.mdx`, `practice-question.mdx`, `image.mdx`) showing the conventional shape for new content. They're older than the current chapters — when in doubt, copy the structure of a recently completed day (4, 5, 6, 7, 8, 10, 11, 12) rather than the template.

## Day-chapter conventions

A complete day (currently 1–12 and 17) follows the same shape:

- **`index.mdx`** — overview with a "What you'll learn today" checklist, an info `<Callout>`, and a numbered roadmap of the sub-pages. Title is `# Day N — Topic`.
- **One or more concept pages** (e.g. `introduction`, `operations`, `traversals`, `bst_operations`) — prose + interactive demos + multi-language code.
- An optional **`basic_questions.mdx`** for warm-up exercises.
- A **`practice_questions/`** directory containing 4–10 interview problems plus an `index.mdx` table listing Easy / Medium / Hard with links and a "Coming Soon" section.

Each practice question file follows this exact shape: **`### Title <DifficultyBadge level="..." />` → Description → Examples → Constraints → Intuition → Code (in `<Tabs>` with C++ / Python / Java, C++ first) → Analysis (time + space table or bullets)**.

For days that aren't built out yet (currently 14–16, 18–30 outside the live set), the convention is a **single `index.mdx`** with a "Coming Soon" `<Callout type="info">`, a "What you'll learn here" bullet list previewing the chapter, and cross-links to related existing material — plus a `_meta.js` listing only `index`.

## Interactive components

Site identity is "learning DSA should be fun." Most pages mix prose with React components from `components/`. Three patterns recur — recognize and reuse them rather than inventing new shapes:

- **`XVisualizer`** — static, prop-driven display of a data structure (array, stack, heap, tree, graph, hash table, bits). Embed inline in prose to illustrate a specific configuration.
- **`InteractiveX`** — the same visualizer wrapped with input controls (push/pop/insert/delete/search). Use under a "Try it" heading so the reader can break things.
- **Stepper** variants (`AlgorithmStepper`, `StackOperationStepper`, `CallStackStepper`, `TraversalStepper`, `RecursionTreeVisualizer`) — walk through an algorithm one move at a time with Prev / Next / Reset controls.

Other reusable helpers: `ShowHideGif`, `ShowHideSolution`, `ComplexityTable` (takes `operations={[{name, time, space, notes}, ...]}` — note the prop name), `QuizBox`, `DifficultyBadge`.

Components are plain JSX with **named exports** (`export { Foo, FooInteractive }`), use `useState` for local interactivity, and mix inline styles with Tailwind classes. **Import paths from MDX are relative** — a practice question three levels deep uses `../../../components/QuizBox`. When adding a visualizer for a topic that doesn't have one, mirror the existing pattern: a static component that accepts `initialX` + `highlightIndices`-style props, plus a separate `InteractiveX` that owns the state.

## MDX conventions and gotchas

- Nextra 3 expects `import { Tabs, Steps, Callout } from "nextra/components"` and then `export const Tab = Tabs.Tab` before using `<Tab>` inside `<Tabs items={[...]}>`. The Day 17 bit-manipulation pages have the most fragile parser interactions; copy their pattern when working with operator-heavy content.
- **`<=`, `<<`, and `<` followed by a letter outside fenced code blocks** are parsed as JSX tag openings and break the build. Wrap comparisons and bit shifts in backticks (`` `n << 2` ``), use HTML entities, or rephrase.
- Backticks inside JSX attribute values can also confuse the parser — prefer plain string props.
- Code fences for multi-language solutions use ` ```cpp copy `, ` ```python copy `, ` ```java copy ` — keep the `copy` flag so the copy button renders.
- **Solutions are written in C++, Python, and Java**, in that tab order. Preserve the convention for consistency across the site.
- Files must be `Read` before they can be `Edit`-ed (tool enforcement). After a `Write` overwrites a file the harness keeps state — no need to re-`Read` before the next edit in the same turn.

## Public assets

Day-specific images live in `public/assets/` and are referenced from MDX as absolute paths (`/assets/foo.png`). New diagrams go there. `public/manifest.json` and the `icon-*.png` files back the PWA manifest declared in `theme.config.jsx`.

## Style and tone

The brand voice is "DSA, but make it addictive" — playful, concrete, opinionated, allergic to academic-textbook hedging. Every concept page should pay off the prose with at least one **interactive demo** or **worked example**. Practice questions emphasize the *pattern* (which template, which trick) over rote memorization — most pages end with a "this same shape solves..." list to make the transfer explicit.
