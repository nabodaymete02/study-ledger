# Study Ledger

A note-taking app built around a simple idea: notes you write once and never
reopen aren't worth much. Study Ledger organizes material into short, numbered
sections you can check off, quiz yourself on, and scan back through later,
instead of one long page of prose.

Each topic gets its own ledger. A ledger is a list of sections, and each
section can mix a few kinds of content:

- plain paragraphs
- definition rows (term / meaning pairs) for vocab and quick facts
- three callout styles — **note**, **flag**, and **task** — for context,
  warnings, and things to actually go do
- reference blocks with a copy button, for commands or snippets meant to be
  pasted verbatim
- flashcards with the answer hidden behind a reveal toggle
- a "reviewed" checkbox per section, which feeds a progress bar for the whole
  ledger

Everything is stored locally in the browser — there's no account and no
server component.

## Stack

- React 18
- Vite
- React Router
- Plain CSS (no UI framework)

## Getting started

```bash
npm install
npm run dev
```

This starts a local dev server (Vite will print the URL, typically
`http://localhost:5173`).

Other scripts:

```bash
npm run build     # production build to dist/
npm run preview   # preview the production build locally
```

## Project structure

```
src/
  components/   UI building blocks (dashboard, ledger view, section blocks)
  data/         localStorage persistence and ledger data helpers
  styles/       theme variables and global styles
  App.jsx
  main.jsx
```

## Status

Building feature by feature. Done so far:

- Data layer — localStorage persistence and CRUD helpers for ledgers,
  sections, and content blocks (`src/data/`)

Next up: dashboard shell and routing, then the ledger view.
