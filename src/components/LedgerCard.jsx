import { Link } from 'react-router-dom'
import ProgressBar from './ProgressBar.jsx'
import { getLedgerProgress } from '../data/index.js'
import './LedgerCard.css'

export default function LedgerCard({ ledger }) {
  const progress = getLedgerProgress(ledger)

  return (
    <Link to={`/ledger/${ledger.id}`} className="ledger-card">
      <h2>{ledger.title}</h2>
      {ledger.description && <p className="ledger-card-desc">{ledger.description}</p>}
      <span className="ledger-card-meta">
        {progress.total === 0
          ? 'No sections yet'
          : `${progress.reviewed}/${progress.total} reviewed`}
      </span>
      <ProgressBar pct={progress.pct} />
    </Link>
  )
}
