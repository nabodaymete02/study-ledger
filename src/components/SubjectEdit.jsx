import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getSubject,
  saveSubject,
  createChapter,
  renameChapter,
  deleteChapter,
  reorderChapters,
  createSection,
  updateSection,
  deleteSection,
  reorderSections,
  addBlock,
  updateBlock,
  deleteBlock,
  reorderBlocks,
  getSubjectProgress,
} from '../data/index.js'
import ChapterEdit from './ChapterEdit.jsx'
import InlineAddForm from './InlineAddForm.jsx'
import ProgressBar from './ProgressBar.jsx'
import './SubjectEdit.css'

export default function SubjectEdit() {
  const { subjectId } = useParams()
  const [subject, setSubject] = useState(null)
  const [loadError, setLoadError] = useState(null)
  const [isAddingChapter, setIsAddingChapter] = useState(false)

  useEffect(() => {
    getSubject(subjectId)
      .then(setSubject)
      .catch((err) => setLoadError(err.message))
  }, [subjectId])

  function commit(next) {
    setSubject(next)
    saveSubject(next).catch((err) => window.alert(`Save failed: ${err.message}`))
  }

  if (loadError) {
    return (
      <main className="subject-edit">
        <Link to="/" className="back-link">
          &larr; Dashboard
        </Link>
        <p className="subject-edit-error">Couldn&rsquo;t load this subject ({loadError}).</p>
      </main>
    )
  }

  if (!subject) {
    return (
      <main className="subject-edit">
        <p className="dashboard-empty">Loading…</p>
      </main>
    )
  }

  function handleAddChapter(title) {
    const { subject: next } = createChapter(subject, { title })
    commit(next)
    setIsAddingChapter(false)
  }

  function handleRenameChapter(chapterId, title) {
    commit(renameChapter(subject, chapterId, title))
  }

  function handleDeleteChapter(chapterId) {
    commit(deleteChapter(subject, chapterId))
  }

  function handleMoveChapter(chapterId, direction) {
    const index = subject.chapters.findIndex((c) => c.id === chapterId)
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= subject.chapters.length) return
    const ids = subject.chapters.map((c) => c.id)
    const temp = ids[index]
    ids[index] = ids[targetIndex]
    ids[targetIndex] = temp
    commit(reorderChapters(subject, ids))
  }

  function handleAddSection(chapterId, title) {
    const { subject: next } = createSection(subject, chapterId, { title })
    commit(next)
  }

  function handleRenameSection(chapterId, sectionId, title) {
    commit(updateSection(subject, chapterId, sectionId, { title }))
  }

  function handleDeleteSection(chapterId, sectionId) {
    commit(deleteSection(subject, chapterId, sectionId))
  }

  function handleMoveSection(chapterId, sectionId, direction) {
    const chapter = subject.chapters.find((c) => c.id === chapterId)
    const index = chapter.sections.findIndex((s) => s.id === sectionId)
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= chapter.sections.length) return
    const ids = chapter.sections.map((s) => s.id)
    const temp = ids[index]
    ids[index] = ids[targetIndex]
    ids[targetIndex] = temp
    commit(reorderSections(subject, chapterId, ids))
  }

  function handleAddBlock(chapterId, sectionId, block) {
    const { subject: next, block: created } = addBlock(subject, chapterId, sectionId, block)
    commit(next)
    return created
  }

  function handleUpdateBlock(chapterId, sectionId, blockId, patch) {
    commit(updateBlock(subject, chapterId, sectionId, blockId, patch))
  }

  function handleDeleteBlock(chapterId, sectionId, blockId) {
    commit(deleteBlock(subject, chapterId, sectionId, blockId))
  }

  function handleMoveBlock(chapterId, sectionId, blockId, direction) {
    const chapter = subject.chapters.find((c) => c.id === chapterId)
    const section = chapter.sections.find((s) => s.id === sectionId)
    const index = section.blocks.findIndex((b) => b.id === blockId)
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= section.blocks.length) return
    const ids = section.blocks.map((b) => b.id)
    const temp = ids[index]
    ids[index] = ids[targetIndex]
    ids[targetIndex] = temp
    commit(reorderBlocks(subject, chapterId, sectionId, ids))
  }

  const progress = getSubjectProgress(subject)

  return (
    <main className="subject-edit">
      <div className="subject-edit-topbar">
        <Link to="/" className="back-link">
          &larr; Dashboard
        </Link>
        <Link to={`/subject/${subject.id}`} className="btn-ghost">
          View
        </Link>
      </div>

      <h1>{subject.title}</h1>
      {subject.description && <p className="subject-edit-desc">{subject.description}</p>}

      {progress.total > 0 && (
        <div className="subject-edit-tracker">
          <span className="subject-edit-tracker-count">
            <b>{progress.reviewed}</b> / {progress.total} sections reviewed
          </span>
          <ProgressBar pct={progress.pct} />
        </div>
      )}

      {subject.chapters.length === 0 ? (
        <p className="subject-edit-empty">No chapters yet.</p>
      ) : (
        subject.chapters.map((chapter, index) => (
          <ChapterEdit
            key={chapter.id}
            chapter={chapter}
            index={index}
            isFirst={index === 0}
            isLast={index === subject.chapters.length - 1}
            subjectId={subject.id}
            onRename={(title) => handleRenameChapter(chapter.id, title)}
            onDelete={() => handleDeleteChapter(chapter.id)}
            onMoveUp={() => handleMoveChapter(chapter.id, -1)}
            onMoveDown={() => handleMoveChapter(chapter.id, 1)}
            onAddSection={(title) => handleAddSection(chapter.id, title)}
            onRenameSection={(sectionId, title) => handleRenameSection(chapter.id, sectionId, title)}
            onDeleteSection={(sectionId) => handleDeleteSection(chapter.id, sectionId)}
            onMoveSection={(sectionId, direction) =>
              handleMoveSection(chapter.id, sectionId, direction)
            }
            onAddBlock={(sectionId, block) => handleAddBlock(chapter.id, sectionId, block)}
            onUpdateBlock={(sectionId, blockId, patch) =>
              handleUpdateBlock(chapter.id, sectionId, blockId, patch)
            }
            onDeleteBlock={(sectionId, blockId) => handleDeleteBlock(chapter.id, sectionId, blockId)}
            onMoveBlock={(sectionId, blockId, direction) =>
              handleMoveBlock(chapter.id, sectionId, blockId, direction)
            }
          />
        ))
      )}

      {isAddingChapter ? (
        <InlineAddForm
          placeholder="Chapter title"
          onAdd={handleAddChapter}
          onCancel={() => setIsAddingChapter(false)}
        />
      ) : (
        <button type="button" className="btn-accent" onClick={() => setIsAddingChapter(true)}>
          + Add chapter
        </button>
      )}
    </main>
  )
}
