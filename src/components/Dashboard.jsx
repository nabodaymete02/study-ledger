import { useEffect, useRef, useState } from 'react'
import LedgerCard from './LedgerCard.jsx'
import NewLedgerForm from './NewLedgerForm.jsx'
import {
  getLedgers,
  createLedger,
  duplicateLedger,
  deleteLedger,
  exportLedgers,
  importLedgers,
} from '../data/index.js'
import './Dashboard.css'

function filterLedgers(ledgers, query) {
  const q = query.trim().toLowerCase()
  if (!q) return ledgers
  return ledgers.filter((ledger) => {
    if (ledger.title.toLowerCase().includes(q)) return true
    if (ledger.description.toLowerCase().includes(q)) return true
    return ledger.sections.some((section) => section.title.toLowerCase().includes(q))
  })
}

export default function Dashboard() {
  const [ledgers, setLedgers] = useState(() => getLedgers())
  const [isCreating, setIsCreating] = useState(false)
  const [query, setQuery] = useState('')
  const searchRef = useRef(null)

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

  function handleCreate({ title, description }) {
    const ledger = createLedger({ title, description })
    setLedgers((prev) => [...prev, ledger])
    setIsCreating(false)
  }

  function handleDuplicate(ledgerId) {
    const copy = duplicateLedger(ledgerId)
    setLedgers((prev) => [...prev, copy])
  }

  function handleDelete(ledgerId) {
    deleteLedger(ledgerId)
    setLedgers((prev) => prev.filter((l) => l.id !== ledgerId))
  }

  function handleExport() {
    const json = exportLedgers()
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
      const text = await file.text()
      const imported = importLedgers(text)
      setLedgers((prev) => [...prev, ...imported])
    } catch (err) {
      window.alert(`Import failed: ${err.message}`)
    }
  }

  const filteredLedgers = filterLedgers(ledgers, query)

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>Study Ledger</h1>
        <div className="dashboard-header-actions">
          <button type="button" className="btn-ghost" onClick={handleExport}>
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
              title="New ledger (n)"
            >
              + New ledger
            </button>
          )}
        </div>
      </header>

      {ledgers.length > 0 && (
        <input
          ref={searchRef}
          type="search"
          className="dashboard-search"
          placeholder="Search ledgers and sections (press /)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      )}

      {isCreating && (
        <NewLedgerForm onCreate={handleCreate} onCancel={() => setIsCreating(false)} />
      )}

      {ledgers.length === 0 ? (
        <p className="dashboard-empty">No ledgers yet — create one to start taking notes.</p>
      ) : filteredLedgers.length === 0 ? (
        <p className="dashboard-empty">No ledgers match &ldquo;{query}&rdquo;.</p>
      ) : (
        <div className="ledger-grid">
          {filteredLedgers.map((ledger) => (
            <LedgerCard
              key={ledger.id}
              ledger={ledger}
              onDuplicate={() => handleDuplicate(ledger.id)}
              onDelete={() => handleDelete(ledger.id)}
            />
          ))}
        </div>
      )}
    </main>
  )
}
