# Contributing to DSA-30

Welcome — and thanks for considering a contribution. DSA-30 is a community-driven, open-source resource, and good contributions of any size are appreciated: a typo fix, a new visualizer, a fresh practice problem, or a full chapter for one of the Coming-Soon days.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Folder Structure](#folder-structure)
4. [Authoring a New Chapter](#authoring-a-new-chapter)
5. [Authoring a Practice Problem](#authoring-a-practice-problem)
6. [Interactive Components](#interactive-components)
7. [MDX Gotchas](#mdx-gotchas)
8. [Contributing Guidelines](#contributing-guidelines)
9. [License](#license)

## Introduction

DSA-30 is a Nextra-powered docs site that teaches Data Structures and Algorithms across 30 days. The brand voice is **playful, concrete, and opinionated** — every concept page should be paired with a visual or interactive demo, and every practice problem should foreground the *pattern* (which template, which trick), not rote memorization.

## Getting Started

Prerequisites:

- **Node.js** 18 or newer (LTS recommended).
- A code editor with MDX syntax support helps but isn't required.

Clone and run:

```shell
git clone https://github.com/Archit1706/DSA-30.git
cd DSA-30
npm install
npm run dev          # http://localhost:3000
```

Before pushing any content change:

```shell
npm run build        # the only verification step — catches MDX parse errors
```

There are no tests, linters, or formatters configured.

## Folder Structure

```
pages/
├── _app.jsx                    # global wrapper (just imports tailwind)
├── _meta.js                    # top-level sidebar order + phase separators
├── index.mdx                   # marketing landing page (custom hero, roadmap)
├── getting_started.mdx
└── dayN/
    ├── _meta.js                # sidebar order for this day's pages
    ├── index.mdx               # overview + "What you'll learn" + roadmap
    ├── introduction.mdx        # concept page(s)
    ├── basic_questions.mdx     # warm-ups (optional, uses <Steps>)
    └── practice_questions/
        ├── _meta.js            # order of practice problems
        ├── index.mdx           # Easy/Medium/Hard table + Coming Soon
        └── *.mdx               # individual interview problems

components/                     # React .jsx — XVisualizer / InteractiveX / Stepper
public/assets/                  # Day-specific images, referenced as /assets/foo.png
styles/globals.css              # just the three @tailwind directives
templates/                      # legacy reference snippets (old, prefer copying a recent day)
```

Navigation is **driven by `_meta.js` files**, not file discovery. Every directory that should appear in the sidebar needs one. Format:

```js
export default {
    "index": "Overview",
    "introduction": "Introduction",
    "practice_questions": "Practice Questions"
}
```

Order in the object literal = order in the sidebar.

For phase separators in the top-level `pages/_meta.js`:

```js
"---phase-name": {
    type: "separator",
    title: "Phase 5 — Algorithmic Patterns"
}
```

## Authoring a New Chapter

The cleanest path is to **copy a recently completed day** rather than the legacy `templates/`. Day 14 (DP), Day 16 (Backtracking), and Day 24 (Sliding Window) are the most modern shape.

A complete day has:

- **`index.mdx`** — overview with frontmatter (`title`, `description`), a `# Day N — Topic` heading, a "What you'll learn today" bullet list, an info `<Callout>`, and a numbered "Roadmap" linking to each sub-page.
- **Concept pages** (e.g. `introduction.mdx`, `the_template.mdx`, `advanced.mdx`) — prose mixed with interactive demos, multi-language code, and `<QuizBox>` checks.
- **`basic_questions.mdx`** (optional) — warm-up exercises wrapped in a `<Steps>` block.
- **`practice_questions/`** — directory with `index.mdx` (the table) plus one `.mdx` per problem.

When you finish writing a day, **flip its tile to `live: true`** in the roadmap array inside `pages/index.mdx`.

## Authoring a Practice Problem

Practice questions follow a rigid shape so readers know what to expect:

1. **Title and difficulty** — `### Problem Name <DifficultyBadge level="medium" />`.
2. **Description** — the problem statement, plain prose.
3. **Examples** — fenced ` ```py ` block with annotated cases.
4. **Constraints** — bullet list with backtick-wrapped expressions (escape `<=`!).
5. **State design / Intuition** — walk through the five-question checklist (what's the state? base case? transition? etc.).
6. **Code** — `<Tabs items={['C++', 'Python', 'Java']} defaultIndex="0">` with three `<Tab>` blocks, in that exact order. Each code fence uses ` ```cpp copy ` / ` ```python copy ` / ` ```java copy ` so the copy button renders.
7. **Analysis** — bullets for Time and Space.
8. **Same skin** — list of related problems that fit the same template.

Optional but encouraged: a `<Callout type="info">` with a clever trick or gotcha, and follow-up code blocks for optimizations.

## Interactive Components

Three patterns recur — use them rather than inventing new shapes:

- **`XVisualizer`** — static, prop-driven display of a data structure. Embed inline in prose to illustrate a specific configuration.
- **`InteractiveX`** — same visualizer wrapped with input controls. Use under a "Try it" heading.
- **`Stepper`** variants (`AlgorithmStepper`, `RecursionTreeVisualizer`, etc.) — walk through an algorithm one move at a time.

### Reusable helpers

| Component | Purpose | Usage |
| :-------- | :------ | :---- |
| `ShowHideGif` | Click-to-play GIF reveal | `<ShowHideGif gifUrl="..." pausedGifUrl="..." />` |
| `ShowHideSolution` | Collapsible solution block | `<ShowHideSolution>...</ShowHideSolution>` (children) |
| `ComplexityTable` | Color-coded O-notation table | `<ComplexityTable operations={[{name, time, space, notes}, ...]} />` |
| `QuizBox` | Multiple-choice quiz with explanation | `<QuizBox question="..." options={[...]} correctIndex={0} explanation="..." />` |
| `DifficultyBadge` | Easy/Medium/Hard badge | `<DifficultyBadge level="hard" />` |

All components use named exports (`export { Foo, FooInteractive }`). Import paths from MDX are **relative** to the file — a practice question three levels deep uses `../../../components/QuizBox`.

When adding a brand-new visualizer for a topic that doesn't have one, mirror the existing pattern: a static component that accepts `initialX` + `highlightIndices`-style props, plus a separate `InteractiveX` that owns the state.

## MDX Gotchas

These bite at least once per chapter — be ready:

- **`<=`, `<<`, and `<` followed by a letter or digit outside fenced code blocks** parse as JSX tag openings and break the build. Wrap them in backticks (`` `n << 2` ``, `` `<1ms` ``), use HTML entities, or rephrase. Constraints lists are the usual offender.
- **Nextra components live in `nextra/components`** — `import { Tabs, Steps, Callout } from "nextra/components"`. Before using `<Tab>` inside `<Tabs>`, you need `export const Tab = Tabs.Tab`.
- **Code fences need the `copy` flag** (e.g. ` ```cpp copy `) for the copy button to render.
- **Backticks inside JSX attribute values** can confuse the parser — prefer plain string props.
- **Files must be `Read` before they can be `Edit`-ed** (Claude Code's tool enforcement).

## Contributing Guidelines

1. Fork the repository to your own GitHub account.
2. Create a new branch for your changes (`git checkout -b feature/day-19-segment-trees`).
3. Make your changes — copy a recent day as the structural reference.
4. Run `npm run build` to verify there are no MDX parse errors.
5. Run `npm run dev` and visually inspect the affected pages.
6. Commit with a meaningful message (`feat(day19): add segment trees overview + lazy propagation page`).
7. Push to your fork and open a pull request against `master`.

For visual changes, attach a screenshot to the PR.

## License

This project is open-source under the [MIT License](LICENSE.md). By contributing, you agree your contributions are released under the same license.

Thanks for helping make DSA-30 better.
