import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getLedger } from '../data/index.js'
import './LedgerView.css'

export default function LedgerView() {
  const { ledgerId } = useParams()
  const [ledger] = useState(() => getLedger(ledgerId))

  if (!ledger) {
    return (
      <main className="ledger-view">
        <Link to="/" className="back-link">
          &larr; Dashboard
        </Link>
        <p>Ledger not found.</p>
      </main>
    )
  }

  return (
    <main className="ledger-view">
      <Link to="/" className="back-link">
        &larr; Dashboard
      </Link>
      <h1>{ledger.title}</h1>
      {ledger.description && <p className="ledger-view-desc">{ledger.description}</p>}
      <p className="ledger-view-placeholder">Sections coming soon.</p>
    </main>
  )
}
