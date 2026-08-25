# Study Ledger

A note-taking app built around a simple idea: notes you write once and never
reopen aren't worth much. Study Ledger organizes material into subjects,
chapters, and short, numbered sections you can check off, quiz yourself on,
and scan back through later, instead of one long page of prose.

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
data/             one folder per subject: subject.json + an assets/ folder
                  (gitignored — this is your personal notes, not source)
src/
  components/     edit-mode UI (dashboard, subject/chapter/section editing,
                   revision mode)
  components/view/  read-only view-mode rendering
  data/           API client + pure data-tree helpers (src/data/tree.js)
  styles/         theme variables and global styles
  App.jsx
  main.jsx
```

## Status

Two generations of features are built. The original browser-only plan (data
layer, dashboard, section content blocks, flashcards, reviewed/progress,
revision mode, search, duplicate/delete, export/import, theme+shortcuts+
mobile polish) is done and was then rebuilt on a local backend:

- Local backend + async data layer — Express server, file-backed `data/`
  folder per subject
- Chapter hierarchy — Subject → Chapter → Section → Block
- View / edit route split — `/subject/:id` for reading, `/subject/:id/edit`
  for authoring
- Image blocks — paste or file-picker upload, saved as real files
- Link blocks — YouTube URLs auto-detected and shown as a thumbnail

See `plan-stack-faq.md` (local-only, not committed) for the full history and
data model.
