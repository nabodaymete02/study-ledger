# Study Ledger

A local, single-user productivity app with two halves: a **Tracker** home
page for daily habits, focus sessions, and todos, and **Study Ledger**, a
note-taking app built around a simple idea — notes you write once and never
reopen aren't worth much. Study Ledger organizes material into subjects,
chapters, and short, numbered sections you can check off, quiz yourself on,
and scan back through later, instead of one long page of prose.

## Tracker

The landing page (`/`). Five independent cards, each backed by the same
local `data/tracker.json` file:

- a **focus timer** with quick presets (25/45/60/90 min), a label, and a
  study/work/other kind — finished sessions are logged and totaled per day
- **habit tracking** with a 7-day grid per habit and a streak counter
- **important dates** shown as a sorted D-day countdown list
- **today's bucket**, a drag-or-click todo pile for same-day tasks, with a
  "done today" strip that clears itself each morning
- a **reading / long-term task list**, grouped by subject, each task with
  an optional deadline

## Study Ledger

Each topic gets its own **subject**. A subject is organized into
**chapters**, each chapter into **sections**, and each section can mix a few
kinds of content:

- plain paragraphs
- definition rows (term / meaning pairs) for vocab and quick facts
- three callout styles — **note**, **flag**, and **task** — for context,
  warnings, and things to actually go do
- reference blocks with a copy button, for commands or snippets meant to be
  pasted verbatim
- flashcards with the answer hidden behind a reveal toggle
- images — paste one from the clipboard or pick a file
- links, with YouTube URLs shown as a clickable thumbnail
- a "reviewed" checkbox per section, which feeds a progress bar for the
  whole subject

Every subject has two views: a clean **read-only view** for actually
studying from, and a separate **edit** mode for authoring. Data is stored
locally as real files under `data/`, organized subject-by-subject — no
account, no cloud, no external server.

## Routes

| Path | Page |
| ---- | ---- |
| `/` | Tracker home |
| `/subjects` | Study Ledger dashboard |
| `/subject/:id` | Subject view (read-only) |
| `/subject/:id/edit` | Subject edit (authoring) |
| `/subject/:id/revise` (and `/revise/:sectionId`) | Flashcard revision mode |

## Stack

- React 18 + Vite
- Express (a small local API under `server/`, reading/writing `data/`)
- React Router
- Plain CSS (no UI framework)

## Getting started

```bash
npm install
npm run dev
```

`npm run dev` starts both the Vite dev server (`http://localhost:5173`) and
the local API server (`http://localhost:4001`) together — you need both
running for the app to work. If the dashboard shows a "couldn't reach the
local server" message, the API half isn't up.

Other scripts:

```bash
npm run build     # production build of the frontend to dist/
npm run preview   # preview the production build locally
npm run server    # run just the API server on its own
```

## Project structure

```
server/          Express API — reads/writes data/, serves pasted images
data/             tracker.json, plus one folder per subject: subject.json
                  and an assets/ folder (gitignored — personal data, not source)
src/
  components/tracker/  Tracker home page (focus timer, habits, dates,
                   daily bucket, long-term tasks)
  components/     edit-mode UI (dashboard, subject/chapter/section editing,
                   revision mode)
  components/view/  read-only view-mode rendering
  data/           API client + pure data-tree helpers (src/data/tree.js,
                   src/data/trackerData.js)
  styles/         theme variables and global styles
  App.jsx
  main.jsx
```

## Status

Three generations of features are built. The original browser-only plan
(data layer, dashboard, section content blocks, flashcards,
reviewed/progress, revision mode, search, duplicate/delete, export/import,
theme+shortcuts+mobile polish) is done and was then rebuilt on a local
backend:

- Local backend + async data layer — Express server, file-backed `data/`
  folder per subject
- Chapter hierarchy — Subject → Chapter → Section → Block
- View / edit route split — `/subject/:id` for reading, `/subject/:id/edit`
  for authoring
- Image blocks — paste or file-picker upload, saved as real files
- Link blocks — YouTube URLs auto-detected and shown as a thumbnail

Most recently, a **Tracker** home page was added at `/`, backed by its own
`data/tracker.json` document and the same save-on-every-change pattern as
Study Ledger: focus timer with per-day totals, habit streaks, important
dates, a same-day todo bucket, and a subject-grouped long-term task list.
