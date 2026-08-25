import { useState } from 'react'
import LedgerCard from './LedgerCard.jsx'
import NewLedgerForm from './NewLedgerForm.jsx'
import { getLedgers, createLedger } from '../data/index.js'
import './Dashboard.css'

export default function Dashboard() {
  const [ledgers, setLedgers] = useState(() => getLedgers())
  const [isCreating, setIsCreating] = useState(false)

  function handleCreate({ title, description }) {
    const ledger = createLedger({ title, description })
    setLedgers((prev) => [...prev, ledger])
    setIsCreating(false)
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>Study Ledger</h1>
        {!isCreating && (
          <button className="btn-accent" onClick={() => setIsCreating(true)}>
            + New ledger
          </button>
        )}
      </header>

      {isCreating && (
        <NewLedgerForm onCreate={handleCreate} onCancel={() => setIsCreating(false)} />
      )}

      {ledgers.length === 0 ? (
        <p className="dashboard-empty">No ledgers yet — create one to start taking notes.</p>
      ) : (
        <div className="ledger-grid">
          {ledgers.map((ledger) => (
            <LedgerCard key={ledger.id} ledger={ledger} />
          ))}
        </div>
      )}
    </main>
  )
}
