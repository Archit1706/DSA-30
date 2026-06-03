# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm install` — install dependencies (Windows/PowerShell environment).
- `npm run dev` — start Next.js dev server at http://localhost:3000.
- `npm run build` — production build (`next build`).
- No test runner, linter, or formatter is configured. Don't invent one — if a change requires verification, run `npm run build` and/or load the affected page in the dev server.

## Architecture

DSA-30 is a **Nextra 3 docs site on Next.js 14** (Pages Router) styled with Tailwind. There is no API layer, database, or backend — every page is MDX, and interactivity comes from React components imported into MDX.

- `next.config.mjs` wires `nextra` with `theme: 'nextra-theme-docs'` pointed at `theme.config.jsx` (site chrome: logo, head meta, banner, footer, sidebar settings).
- `pages/_app.jsx` is a minimal wrapper that only imports `styles/globals.css` (which is just the three `@tailwind` directives — no custom CSS layer).
- Content lives under `pages/dayN/`. A typical day directory has `index.mdx`, `introduction.mdx`, and topic subdirectories (e.g. `arrays/`, `strings/`) that each contain `basic_operations.mdx`, `algorithms.mdx`, and a `practice_questions/` folder.
- **Navigation is driven by `_meta.js` files**, not file discovery. Every directory that should appear in the sidebar needs one. Format: `export default { "slug": "Display Title", ... }`. Order in the object = order in the sidebar. The top-level `pages/_meta.js` controls the day list and includes external links (e.g. `github_link`).
- `templates/` holds reference MDX snippets (`chapter-page.mdx`, `practice-question.mdx`, `image.mdx`) showing the conventional structure for new content. Practice questions follow: Description → Examples → Constraints → Code (in `<Tabs>`) → Explanation → Analysis.

## Interactive components

The site's identity is "learning DSA should be fun." Most pages mix prose with interactive React components from `components/` — prefer reusing these over plain text or static images:

- `ShowHideGif` / `ShowHideSolution` — click-to-reveal GIFs and solutions.
- `ArrayVisualizer` (and `InteractiveArray`) — array boxes; insert/delete/search.
- `StringVisualizer` / `InteractiveString` / `StringCompare` — char-box visualizations.
- `StringPatternMatcher` — text/pattern alignment stepper.
- `AlgorithmStepper` — step-through algorithm runner over an array.
- `MemoryDiagram` — hover-interactive address diagram.
- `ComplexityTable` — color-coded Big-O reference.
- `QuizBox` — multiple-choice question with reveal + explanation.
- `DifficultyBadge` — Easy/Medium/Hard badge for practice questions.

Components are plain JSX with named exports (`export { Foo }`), use `useState` for local interactivity, and are styled with a mix of inline styles and Tailwind classes. Import paths from MDX use **relative paths** (e.g. `../../../components/QuizBox`).

## MDX conventions and gotchas

- Nextra 3 expects `import { Tabs, Steps, Callout } from "nextra/components"`, then `export const Tab = Tabs.Tab` before using `<Tab>` inside `<Tabs items={[...]}>`.
- **`<=` outside fenced code blocks is parsed as a JSX tag opening** and will break the build. Wrap comparisons in backticks (`` `n <= 30` ``) or rephrase.
- Backticks inside JSX attribute values can also confuse the MDX parser — prefer plain string props.
- Code blocks for multi-language solutions use ` ```cpp copy `, ` ```python copy `, ` ```java copy ` — keep the `copy` flag so the copy button renders.
- Practice questions provide solutions in C++, Python, and Java where possible (a subset is fine for simpler problems).
- Files must be `Read` before they can be `Edit`-ed (tool enforcement). Do not try to write to a file you have not read in this session.

## Public assets

Day-specific images live in `public/assets/` and are referenced from MDX as absolute paths (`/assets/foo.png`). New diagrams go there too. `public/manifest.json` and the `icon-*.png` files back the PWA manifest declared in `theme.config.jsx`.
