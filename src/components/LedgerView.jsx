import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getLedger,
  createSection,
  updateSection,
  deleteSection,
  reorderSections,
  addBlock,
  updateBlock,
  deleteBlock,
  reorderBlocks,
  toggleSectionReviewed,
  getLedgerProgress,
} from '../data/index.js'
import SectionCard from './SectionCard.jsx'
import AddSectionForm from './AddSectionForm.jsx'
import ProgressBar from './ProgressBar.jsx'
import './LedgerView.css'

export default function LedgerView() {
  const { ledgerId } = useParams()
  const [ledger] = useState(() => getLedger(ledgerId))
  const [sections, setSections] = useState(() => ledger?.sections ?? [])
  const [isAdding, setIsAdding] = useState(false)

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

  function handleAdd(title) {
    const section = createSection(ledger.id, { title })
    setSections((prev) => [...prev, section])
    setIsAdding(false)
  }

  function handleRename(sectionId, title) {
    updateSection(ledger.id, sectionId, { title })
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, title } : s)))
  }

  function handleDelete(sectionId) {
    deleteSection(ledger.id, sectionId)
    setSections((prev) => prev.filter((s) => s.id !== sectionId))
  }

  function handleMove(sectionId, direction) {
    const index = sections.findIndex((s) => s.id === sectionId)
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= sections.length) return

    const next = [...sections]
    const temp = next[index]
    next[index] = next[targetIndex]
    next[targetIndex] = temp

    setSections(next)
    reorderSections(ledger.id, next.map((s) => s.id))
  }

  function handleAddBlock(sectionId, block) {
    const created = addBlock(ledger.id, sectionId, block)
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, blocks: [...s.blocks, created] } : s)),
    )
    return created
  }

  function handleUpdateBlock(sectionId, blockId, patch) {
    updateBlock(ledger.id, sectionId, blockId, patch)
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? { ...s, blocks: s.blocks.map((b) => (b.id === blockId ? { ...b, ...patch } : b)) }
          : s,
      ),
    )
  }

  function handleDeleteBlock(sectionId, blockId) {
    deleteBlock(ledger.id, sectionId, blockId)
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, blocks: s.blocks.filter((b) => b.id !== blockId) } : s,
      ),
    )
  }

  function handleMoveBlock(sectionId, blockId, direction) {
    const section = sections.find((s) => s.id === sectionId)
    const index = section.blocks.findIndex((b) => b.id === blockId)
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= section.blocks.length) return

    const nextBlocks = [...section.blocks]
    const temp = nextBlocks[index]
    nextBlocks[index] = nextBlocks[targetIndex]
    nextBlocks[targetIndex] = temp

    reorderBlocks(ledger.id, sectionId, nextBlocks.map((b) => b.id))
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, blocks: nextBlocks } : s)))
  }

  function handleToggleReviewed(sectionId) {
    toggleSectionReviewed(ledger.id, sectionId)
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, reviewed: !s.reviewed } : s)),
    )
  }

  const progress = getLedgerProgress({ sections })

  return (
    <main className="ledger-view">
      <Link to="/" className="back-link">
        &larr; Dashboard
      </Link>
      <h1>{ledger.title}</h1>
      {ledger.description && <p className="ledger-view-desc">{ledger.description}</p>}

      {sections.length > 0 && (
        <div className="ledger-tracker">
          <span className="ledger-tracker-count">
            <b>{progress.reviewed}</b> / {progress.total} sections reviewed
          </span>
          <ProgressBar pct={progress.pct} />
          <Link to={`/ledger/${ledger.id}/revise`} className="btn-ghost ledger-tracker-revise">
            Revise
          </Link>
        </div>
      )}

      {sections.length === 0 ? (
        <p className="ledger-view-placeholder">No sections yet.</p>
      ) : (
        <ol className="section-list">
          {sections.map((section, index) => (
            <SectionCard
              key={section.id}
              section={section}
              index={index}
              isFirst={index === 0}
              isLast={index === sections.length - 1}
              onRename={(title) => handleRename(section.id, title)}
              onDelete={() => handleDelete(section.id)}
              onMoveUp={() => handleMove(section.id, -1)}
              onMoveDown={() => handleMove(section.id, 1)}
              onAddBlock={(block) => handleAddBlock(section.id, block)}
              onUpdateBlock={(blockId, patch) => handleUpdateBlock(section.id, blockId, patch)}
              onDeleteBlock={(blockId) => handleDeleteBlock(section.id, blockId)}
              onMoveBlock={(blockId, direction) => handleMoveBlock(section.id, blockId, direction)}
              onToggleReviewed={() => handleToggleReviewed(section.id)}
              revisionHref={
                section.blocks.some((b) => b.type === 'flashcards')
                  ? `/ledger/${ledger.id}/revise/${section.id}`
                  : null
              }
            />
          ))}
        </ol>
      )}

      {isAdding ? (
        <AddSectionForm onAdd={handleAdd} onCancel={() => setIsAdding(false)} />
      ) : (
        <button className="btn-accent" onClick={() => setIsAdding(true)}>
          + Add section
        </button>
      )}
    </main>
  )
}
