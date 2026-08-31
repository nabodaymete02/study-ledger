import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const DATA_DIR = path.join(__dirname, '..', 'data')

export function slugify(title) {
  const slug = String(title)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'untitled'
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true })
}

// Every subject's on-disk directory is stored as `dirName` on the subject
// itself, so renaming a subject never requires renaming (or losing track
// of) its folder or asset paths.
export function subjectDir(dirName) {
  return path.join(DATA_DIR, dirName)
}

export async function listSubjects() {
  await ensureDataDir()
  const entries = await fs.readdir(DATA_DIR, { withFileTypes: true })
  const subjects = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    try {
      const raw = await fs.readFile(path.join(DATA_DIR, entry.name, 'subject.json'), 'utf-8')
      subjects.push(JSON.parse(raw))
    } catch {
      // not a valid subject folder — skip it
    }
  }
  return subjects
}

export async function readSubject(dirName) {
  const raw = await fs.readFile(path.join(subjectDir(dirName), 'subject.json'), 'utf-8')
  return JSON.parse(raw)
}

export async function writeSubject(dirName, subject) {
  const dir = subjectDir(dirName)
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(path.join(dir, 'subject.json'), JSON.stringify(subject, null, 2), 'utf-8')
}

export async function createSubjectDir(baseName) {
  await ensureDataDir()
  const base = slugify(baseName)
  let dirName = base
  let n = 2
  while (
    await fs
      .access(subjectDir(dirName))
      .then(() => true)
      .catch(() => false)
  ) {
    dirName = `${base}-${n}`
    n += 1
  }
  await fs.mkdir(subjectDir(dirName), { recursive: true })
  return dirName
}

export async function deleteSubjectDir(dirName) {
  await fs.rm(subjectDir(dirName), { recursive: true, force: true })
}

export async function ensureAssetsDir(dirName) {
  const dir = path.join(subjectDir(dirName), 'assets')
  await fs.mkdir(dir, { recursive: true })
  return dir
}

// ---- Tracker (habits, timers, todos, dates, long-term list) ----
// Lives as a single file directly under data/, not inside a subject folder.

const TRACKER_FILE = path.join(DATA_DIR, 'tracker.json')

export async function readTracker() {
  await ensureDataDir()
  try {
    const raw = await fs.readFile(TRACKER_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function writeTracker(tracker) {
  await ensureDataDir()
  await fs.writeFile(TRACKER_FILE, JSON.stringify(tracker, null, 2), 'utf-8')
}
