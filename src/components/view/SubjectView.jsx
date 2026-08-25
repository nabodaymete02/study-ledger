import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getSubject,
  saveSubject,
  toggleSectionReviewed,
  getSubjectProgress,
} from '../../data/index.js'
import ChapterView from './ChapterView.jsx'
import ProgressBar from '../ProgressBar.jsx'
import './SubjectView.css'

export default function SubjectView() {
  const { subjectId } = useParams()
  const [subject, setSubject] = useState(null)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    getSubject(subjectId)
      .then(setSubject)
      .catch((err) => setLoadError(err.message))
  }, [subjectId])

  function handleToggleReviewed(chapterId, sectionId) {
    const next = toggleSectionReviewed(subject, chapterId, sectionId)
    setSubject(next)
    saveSubject(next).catch((err) => window.alert(`Save failed: ${err.message}`))
  }

  if (loadError) {
    return (
      <main className="subject-view">
        <Link to="/" className="back-link">
          &larr; Dashboard
        </Link>
        <p className="subject-view-error">Couldn&rsquo;t load this subject ({loadError}).</p>
      </main>
    )
  }

  if (!subject) {
    return (
      <main className="subject-view">
        <p className="dashboard-empty">Loading…</p>
      </main>
    )
  }

  const progress = getSubjectProgress(subject)

  return (
    <main className="subject-view">
      <header className="subject-view-masthead">
        <Link to="/" className="back-link">
          &larr; Dashboard
        </Link>
        <h1>{subject.title}</h1>
        {subject.description && <p className="subject-view-lede">{subject.description}</p>}
      </header>

      <div className="subject-view-tracker">
        <span className="subject-view-tracker-count">
          <b>{progress.reviewed}</b> / {progress.total} sections reviewed
        </span>
        <ProgressBar pct={progress.pct} />
        <Link to={`/subject/${subject.id}/revise`} className="btn-ghost">
          Revise
        </Link>
        <Link to={`/subject/${subject.id}/edit`} className="btn-accent">
          Edit
        </Link>
      </div>

      {subject.chapters.length === 0 ? (
        <p className="subject-view-empty">
          Nothing here yet — open Edit to start adding chapters.
        </p>
      ) : (
        subject.chapters.map((chapter, index) => (
          <ChapterView
            key={chapter.id}
            chapter={chapter}
            index={index}
            onToggleReviewed={(sectionId) => handleToggleReviewed(chapter.id, sectionId)}
            revisionHrefFor={(section) =>
              section.blocks.some((b) => b.type === 'flashcards')
                ? `/subject/${subject.id}/revise/${section.id}`
                : null
            }
          />
        ))
      )}
    </main>
  )
}
