import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SubjectCard from './SubjectCard.jsx'
import NewSubjectForm from './NewSubjectForm.jsx'
import {
  listSubjects,
  createSubject,
  deleteSubject,
  createEmptySubject,
  duplicateSubject,
  buildImportedSubject,
} from '../data/index.js'
import './Dashboard.css'

function filterSubjects(subjects, query) {
  const q = query.trim().toLowerCase()
  if (!q) return subjects
  return subjects.filter((subject) => {
    if (subject.title.toLowerCase().includes(q)) return true
    if (subject.description.toLowerCase().includes(q)) return true
    return subject.chapters.some(
      (chapter) =>
        chapter.title.toLowerCase().includes(q) ||
        chapter.sections.some((section) => section.title.toLowerCase().includes(q)),
    )
  })
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [query, setQuery] = useState('')
  const searchRef = useRef(null)

  useEffect(() => {
    listSubjects()
      .then(setSubjects)
      .catch((err) => setLoadError(err.message))
  }, [])

  useEffect(() => {
    function handleKeyDown(e) {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === 'n' && !isCreating) {
        e.preventDefault()
        setIsCreating(true)
      }
      if (e.key === '/') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCreating])

  async function handleCreate({ title, description }) {
    const subject = createEmptySubject({ title, description })
    const created = await createSubject(subject)
    navigate(`/subject/${created.id}/edit`)
  }

  async function handleDuplicate(subject) {
    const copy = duplicateSubject(subject)
    const created = await createSubject(copy)
    setSubjects((prev) => [...prev, created])
  }

  async function handleDelete(subjectId) {
    await deleteSubject(subjectId)
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId))
  }

  function handleExport() {
    const json = JSON.stringify(subjects, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `study-ledger-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleImportFile(e) {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    try {
      const parsed = JSON.parse(await file.text())
      if (!Array.isArray(parsed)) throw new Error('Expected a JSON array of subjects')
      const imported = []
      for (const raw of parsed) {
        const created = await createSubject(buildImportedSubject(raw))
        imported.push(created)
      }
      setSubjects((prev) => [...prev, ...imported])
    } catch (err) {
      window.alert(`Import failed: ${err.message}`)
    }
  }

  if (loadError) {
    return (
      <main className="dashboard">
        <p className="dashboard-error">
          Couldn&rsquo;t reach the local server ({loadError}). Make sure{' '}
          <code>npm run dev</code> is running — it starts both the web app and the API.
        </p>
      </main>
    )
  }

  if (!subjects) {
    return (
      <main className="dashboard">
        <p className="dashboard-empty">Loading…</p>
      </main>
    )
  }

  const filteredSubjects = filterSubjects(subjects, query)

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>Study Ledger</h1>
        <div className="dashboard-header-actions">
          <Link to="/" className="btn-ghost">
            ← Tracker
          </Link>
          <button
            type="button"
            className="btn-ghost"
            onClick={handleExport}
            disabled={subjects.length === 0}
          >
            Export
          </button>
          <label className="btn-ghost dashboard-import-label">
            Import
            <input
              type="file"
              accept="application/json"
              className="dashboard-import-input"
              onChange={handleImportFile}
            />
          </label>
          {!isCreating && (
            <button
              className="btn-accent"
              onClick={() => setIsCreating(true)}
              title="New subject (n)"
            >
              + New subject
            </button>
          )}
        </div>
      </header>

      {subjects.length > 0 && (
        <input
          ref={searchRef}
          type="search"
          className="dashboard-search"
          placeholder="Search subjects, chapters, and sections (press /)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      )}

      {isCreating && (
        <NewSubjectForm onCreate={handleCreate} onCancel={() => setIsCreating(false)} />
      )}

      {subjects.length === 0 ? (
        <p className="dashboard-empty">No subjects yet — create one to start taking notes.</p>
      ) : filteredSubjects.length === 0 ? (
        <p className="dashboard-empty">No subjects match &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="subject-grid">
          {filteredSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              onDuplicate={() => handleDuplicate(subject)}
              onDelete={() => handleDelete(subject.id)}
            />
          ))}
        </div>
      )}
    </main>
  )
}
