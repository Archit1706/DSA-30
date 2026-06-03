# DSA-30 — Data Structures and Algorithms in 30 Days

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/Archit1706/DSA-30)](https://github.com/Archit1706/DSA-30/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Archit1706/DSA-30)](https://github.com/Archit1706/DSA-30/network/members)

**Live site:** [dsa30.vercel.app](https://dsa30.vercel.app/)

DSA-30 is a 30-day, click-along crash course in Data Structures and Algorithms. Every concept page mixes prose with **live, interactive visualizations** — you push values into a heap, animate a recursion tree, step through DFS on a graph, watch a quicksort partition in real time. Every practice problem ships solutions in **C++, Python, and Java**.

The goal: make DSA feel less like a textbook chore and more like something you actually want to come back to tomorrow.

![Screenshot](https://github.com/Archit1706/DSA-30/assets/75872913/822eed53-d97d-422b-a1d5-88e19bca2cdc)

## Features

- **30-day structured curriculum** — one topic per day, designed to fit a single sit-down.
- **Interactive components on every page** — visualizers for arrays, stacks, queues, linked lists, heaps, hash tables, trees, graphs, sorting, bits, and more, plus step-throughs for recursion, traversal, and algorithm runs.
- **Multi-language solutions** — every practice problem includes **C++, Python, and Java** in side-by-side tabs.
- **Difficulty badges** on every practice problem (Easy / Medium / Hard).
- **Pattern-first writing** — solutions emphasize the *template* (hash-map + complement, fused traversal, sliding window) over rote memorization, with cross-references to the same shape in other problems.
- **No signup, no paywall** — open the page, read it, close the tab. Bookmark a problem, skip a day.

## Curriculum (current state)

| Day | Topic | Status |
| --- | --- | --- |
| 1 | Introduction to DSA & Big O | ✅ Available |
| 2 | Arrays & Strings | ✅ Available |
| 3 | Linked Lists (all four variants) | ✅ Available |
| 4 | Stacks & Queues | ✅ Available |
| 5 | Recursion (+ memoization) | ✅ Available |
| 6 | Binary Trees & BSTs | ✅ Available |
| 7 | Heaps & Priority Queues | ✅ Available |
| 8 | Hash Tables & Hash Functions | ✅ Available |
| 9 | Graphs (Basics) | ✅ Available |
| 10 | Graph Traversal (DFS & BFS) | ✅ Available |
| 11 | Sorting Algorithms I | ✅ Available |
| 12 | Sorting Algorithms II | ✅ Available |
| 13 | Searching Algorithms | 🚧 In progress |
| 17 | Bit Manipulation | ✅ Available |
| 14, 15, 16, 18–30 | DP, Greedy, Backtracking, Tries, Segment Trees, Union-Find, Shortest Paths, MST, Topological Sort, Sliding Window, Two Pointers, Divide & Conquer, Strings Advanced, System Design 101, Mock Interview, Victory Lap | 📋 Placeholders with topic preview |

## Tech Stack

- **Next.js 14** (Pages Router) + **Nextra 3** docs theme
- **React 18** + **Tailwind CSS 3**
- All content authored in **MDX** with custom React components for interactivity
- Static export — deployable to any static host (currently on Vercel)

## Getting Started

Clone, install, and run the dev server:

```shell
git clone https://github.com/Archit1706/DSA-30.git
cd DSA-30
npm install
npm run dev
```

Then open `http://localhost:3000`.

To produce a production build:

```shell
npm run build
```

There are no tests, linters, or formatters configured — `npm run build` is the verification step after content changes.

## Installation

For a more detailed setup (custom domains, deployment notes, troubleshooting), see the [Installation Guide](docs/installation.md).

## Usage

For tips on navigating the curriculum and getting the most out of each chapter, see the [User Guide](docs/user-guide.md).

## Contributing

Contributions are welcome — fixing typos, adding practice problems, building visualizers, completing the Coming-Soon chapters. See the [Contribution Guidelines](CONTRIBUTING.md) for the process.

## License

This project is licensed under the MIT License — see [LICENSE.md](LICENSE.md) for details.

## Acknowledgments

- Curriculum draws on standard references including LeetCode, GeeksforGeeks, and Striver's cheat sheet.
- Icons via [FontAwesome](https://fontawesome.com/).

---

Start your journey to becoming a DSA expert with DSA-30 today. **Happy Learning!** 🚀
