import { Link } from 'react-router-dom'
import ProgressBar from './ProgressBar.jsx'
import { getSubjectProgress } from '../data/index.js'
import './SubjectCard.css'

export default function SubjectCard({ subject, onDuplicate, onDelete }) {
  const progress = getSubjectProgress(subject)
  const chapterCount = subject.chapters.length

  function handleDelete() {
    if (window.confirm(`Delete "${subject.title}"? This can't be undone.`)) {
      onDelete()
    }
  }

  return (
    <div className="subject-card">
      <Link to={`/subject/${subject.id}`} className="subject-card-link">
        <h2>{subject.title}</h2>
        {subject.description && <p className="subject-card-desc">{subject.description}</p>}
        <span className="subject-card-meta">
          {chapterCount === 0
            ? 'No chapters yet'
            : progress.total === 0
              ? `${chapterCount} chapter${chapterCount === 1 ? '' : 's'}, no sections yet`
              : `${progress.reviewed}/${progress.total} reviewed`}
        </span>
        <ProgressBar pct={progress.pct} />
      </Link>
      <div className="subject-card-actions">
        <button type="button" className="btn-ghost subject-card-action" onClick={onDuplicate}>
          Duplicate
        </button>
        <button type="button" className="btn-ghost subject-card-action" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  )
}
