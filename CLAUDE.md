# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm install` — install dependencies (Windows / PowerShell environment).
- `npm run dev` — start Next.js dev server at http://localhost:3000.
- `npm run build` — production build (`next build`). The fastest way to catch MDX parse errors after any large content change. **Run this before pushing.**
- No test runner, linter, or formatter is configured. If a change requires verification, run `npm run build` and/or load the affected page in the dev server.

## Architecture

DSA-30 is a **Nextra 3 docs site on Next.js 15** (Pages Router) styled with Tailwind. There is no API layer, database, or backend — every page is MDX, and interactivity comes from React components imported into MDX.

- `next.config.mjs` wires `nextra` with `theme: 'nextra-theme-docs'` pointed at `theme.config.jsx` (site chrome: logo, head meta, banner, footer, sidebar settings).
- `pages/_app.jsx` is a minimal wrapper that only imports `styles/globals.css` (which is just the three `@tailwind` directives — no custom CSS layer).
- Content lives under `pages/dayN/`. The landing page `pages/index.mdx` is a custom marketing-style page with a 30-tile roadmap; tiles flagged `live: true` link to days with real content and unflagged tiles render as grey "soon" placeholders. **Whenever you finish a day, flip its `live` flag in the roadmap array.**
- **Navigation is driven by `_meta.js` files**, not file discovery. Every directory that should appear in the sidebar needs one. Format: `export default { "slug": "Display Title", ... }`. Order in the object = order in the sidebar. The top-level `pages/_meta.js` controls the day list and includes external links (e.g. `github_link`) and `type: "separator"` phase dividers.
- `templates/` holds reference MDX snippets (`chapter-page.mdx`, `practice-question.mdx`, `image.mdx`). They're old and don't reflect the current shape. When starting a new chapter, **copy a recently completed day** (14, 16, 24 are the most modern; 4, 5, 6, 7, 8, 10–13 are also good references).

## Pinned stack (current)

- `next` 15.x · `react`/`react-dom` 19.x · `nextra` + `nextra-theme-docs` 3.x · `tailwindcss` 3.x · `react-icons` 5.x.
- **Do not upgrade Nextra to 4.x without an App Router migration** — Nextra 4 requires `app/` layout and the catch-all `[[...mdxPath]]/page.jsx` pattern, plus rewriting `theme.config.jsx` into `app/layout.jsx`. The entire `pages/` tree (100+ MDX files) would need to move to `content/`.
- **Do not upgrade Tailwind to 4.x without a CSS-first config rewrite** — Tailwind 4 deletes `tailwind.config.js` in favor of `@theme {}` blocks inside the stylesheet, and uses `@tailwindcss/postcss` instead of the `tailwindcss` PostCSS plugin.

## Day-chapter conventions

A complete day (currently 1–17 plus 24) follows the same shape:

- **`index.mdx`** — overview with a "What you'll learn today" checklist, an info `<Callout>`, and a numbered roadmap of the sub-pages. Title is `# Day N — Topic`. Frontmatter `title` and `description` go at the very top between `---` fences (Nextra reads them for SEO).
- **One or more concept pages** (e.g. `introduction`, `operations`, `the_template`, `advanced`) — prose + interactive demos + multi-language code.
- An optional **`basic_questions.mdx`** for warm-up exercises wrapped in a `<Steps>` block.
- A **`practice_questions/`** directory containing 8–10 interview problems plus an `index.mdx` table listing Easy / Medium / Hard with links and a "Coming Soon" section.

Each practice question file follows this exact shape: **`### Title <DifficultyBadge level="..." />` → Description → Examples → Constraints → State design / Intuition → Code (in `<Tabs>` with C++ / Python / Java, C++ first) → Analysis (time + space bullets) → "Same skin" list of related problems**.

For days that aren't built out yet, the convention is a **single `index.mdx`** with a "Coming Soon" `<Callout type="info">`, a "What you'll learn here" bullet list previewing the chapter, and cross-links to related existing material — plus a `_meta.js` listing only `index`.

## Interactive components

Site identity is "learning DSA should be fun." Most pages mix prose with React components from `components/`. Three patterns recur — recognize and reuse them rather than inventing new shapes:

- **`XVisualizer`** — static, prop-driven display of a data structure (array, stack, heap, tree, graph, hash table, bits). Embed inline in prose to illustrate a specific configuration.
- **`InteractiveX`** — the same visualizer wrapped with input controls (push/pop/insert/delete/search). Use under a "Try it" heading so the reader can break things.
- **Stepper** variants (`AlgorithmStepper`, `StackOperationStepper`, `CallStackStepper`, `TraversalStepper`, `RecursionTreeVisualizer`) — walk through an algorithm one move at a time with Prev / Next / Reset controls.

Other reusable helpers: `ShowHideGif`, `ShowHideSolution`, `ComplexityTable` (takes `operations={[{name, time, space, notes}, ...]}` — note the prop name), `QuizBox`, `DifficultyBadge`.

Components are plain JSX with **named exports** (`export { Foo, FooInteractive }`), use `useState` for local interactivity, and mix inline styles with Tailwind classes. **Import paths from MDX are relative** — a practice question three levels deep uses `../../../components/QuizBox`. When adding a visualizer for a topic that doesn't have one, mirror the existing pattern: a static component that accepts `initialX` + `highlightIndices`-style props, plus a separate `InteractiveX` that owns the state.

## MDX conventions and gotchas

- Nextra 3 expects `import { Tabs, Steps, Callout } from "nextra/components"` and then `export const Tab = Tabs.Tab` before using `<Tab>` inside `<Tabs items={[...]}>`. The Day 17 bit-manipulation pages have the most fragile parser interactions; copy their pattern when working with operator-heavy content.
- **`<=`, `<<`, and `<` followed by a letter or digit outside fenced code blocks** are parsed as JSX tag openings and break the build. Wrap comparisons and bit shifts in backticks (`` `n << 2` ``, `` `<1ms` ``), use HTML entities, or rephrase. This bites at least once per chapter — grep `'[^`]<= '` and `'<[0-9]'` before pushing.
- Backticks inside JSX attribute values can also confuse the parser — prefer plain string props.
- Code fences for multi-language solutions use ` ```cpp copy `, ` ```python copy `, ` ```java copy ` — keep the `copy` flag so the copy button renders.
- **Solutions are written in C++, Python, and Java**, in that tab order. Preserve the convention for consistency across the site.
- Nextra renders its own opinionated styles for `<h1>` (smaller line-height for in-content anchor headings). For hero / marketing-style pages, use `<div role="heading" aria-level={1}>` with inline `style={{lineHeight: ...}}` to bypass the override — see `pages/index.mdx`.
- Files must be `Read` before they can be `Edit`-ed (tool enforcement). After a `Write` overwrites a file the harness keeps state — no need to re-`Read` before the next edit in the same turn.

## Landing-page conventions

`pages/index.mdx` is the only page that isn't a docs chapter — it's a marketing-style landing with a hero, problem-agitation section, live demo, quiz, features grid, 30-tile roadmap, and final CTA. **No emojis** — use `react-icons/lu` (Lucide) icons. When adding icon+text inside a flex container, apply `leading-none` on the container and `shrink-0` on the icon, and wrap bare text in `<span>` so Nextra's prose layer doesn't mangle the alignment.

**Tailwind text-size + line-height trap.** Tailwind v3's `text-5xl` through `text-9xl` utilities bundle `line-height: 1` into the same class declaration as the font-size. If you mark the size class with `!` (e.g. `!text-7xl`) to override Nextra's heading rules, you also mark that `line-height: 1` as `!important` — and an inline `style={{ lineHeight: 1.2 }}` cannot beat a class with `!important`. To fix overlapping hero text on large screens, apply the line-height as a Tailwind class with `!` of its own (`!leading-[1.25]` / `!leading-tight`) — same specificity but appears later in the cascade and wins.

## Public assets

Day-specific images live in `public/assets/` and are referenced from MDX as absolute paths (`/assets/foo.png`). New diagrams go there. `public/manifest.json` and the `icon-*.png` files back the PWA manifest declared in `theme.config.jsx`.

## Style and tone

The brand voice is "DSA, but make it addictive" — playful, concrete, opinionated, allergic to academic-textbook hedging. Every concept page should pay off the prose with at least one **interactive demo** or **worked example**. Practice questions emphasize the *pattern* (which template, which trick) over rote memorization — most pages end with a "Same skin" / "this same shape solves..." list to make the transfer explicit.
