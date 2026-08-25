import { Link } from 'react-router-dom'
import ProgressBar from './ProgressBar.jsx'
import { getLedgerProgress } from '../data/index.js'
import './LedgerCard.css'

export default function LedgerCard({ ledger, onDuplicate, onDelete }) {
  const progress = getLedgerProgress(ledger)

  function handleDelete() {
    if (window.confirm(`Delete "${ledger.title}"? This can't be undone.`)) {
      onDelete()
    }
  }

  return (
    <div className="ledger-card">
      <Link to={`/ledger/${ledger.id}`} className="ledger-card-link">
        <h2>{ledger.title}</h2>
        {ledger.description && <p className="ledger-card-desc">{ledger.description}</p>}
        <span className="ledger-card-meta">
          {progress.total === 0
            ? 'No sections yet'
            : `${progress.reviewed}/${progress.total} reviewed`}
        </span>
        <ProgressBar pct={progress.pct} />
      </Link>
      <div className="ledger-card-actions">
        <button type="button" className="btn-ghost ledger-card-action" onClick={onDuplicate}>
          Duplicate
        </button>
        <button type="button" className="btn-ghost ledger-card-action" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  )
}
