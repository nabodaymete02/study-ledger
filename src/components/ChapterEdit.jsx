import { useState } from 'react'
import SectionCard from './SectionCard.jsx'
import InlineAddForm from './InlineAddForm.jsx'
import './ChapterEdit.css'

export default function ChapterEdit({
  chapter,
  index,
  isFirst,
  isLast,
  subjectId,
  onRename,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddSection,
  onRenameSection,
  onDeleteSection,
  onMoveSection,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlock,
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(chapter.title)
  const [isAddingSection, setIsAddingSection] = useState(false)

  function handleSaveTitle() {
    const trimmed = title.trim()
    if (trimmed && trimmed !== chapter.title) {
      onRename(trimmed)
    } else {
      setTitle(chapter.title)
    }
    setIsEditingTitle(false)
  }

  function handleTitleKeyDown(e) {
    if (e.key === 'Enter') handleSaveTitle()
    if (e.key === 'Escape') {
      setTitle(chapter.title)
      setIsEditingTitle(false)
    }
  }

  function handleDeleteChapter() {
    if (
      window.confirm(`Delete chapter "${chapter.title}" and all its sections? This can't be undone.`)
    ) {
      onDelete()
    }
  }

  function handleAddSection(title) {
    onAddSection(title)
    setIsAddingSection(false)
  }

  const sections = chapter.sections

  return (
    <section className="chapter-edit">
      <div className="chapter-edit-header">
        <span className="chapter-edit-index">{index + 1}</span>

        {isEditingTitle ? (
          <input
            className="chapter-edit-title-input"
            value={title}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={handleTitleKeyDown}
          />
        ) : (
          <h2 className="chapter-edit-title" onClick={() => setIsEditingTitle(true)}>
            {chapter.title}
          </h2>
        )}

        <div className="section-row-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={onMoveUp}
            disabled={isFirst}
            aria-label="Move chapter up"
            title="Move up"
          >
            &uarr;
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={onMoveDown}
            disabled={isLast}
            aria-label="Move chapter down"
            title="Move down"
          >
            &darr;
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={handleDeleteChapter}
            aria-label="Delete chapter"
            title="Delete"
          >
            &times;
          </button>
        </div>
      </div>

      {sections.length === 0 ? (
        <p className="chapter-edit-empty">No sections yet.</p>
      ) : (
        <ol className="section-list">
          {sections.map((section, i) => (
            <SectionCard
              key={section.id}
              section={section}
              index={i}
              isFirst={i === 0}
              isLast={i === sections.length - 1}
              subjectId={subjectId}
              onRename={(title) => onRenameSection(section.id, title)}
              onDelete={() => onDeleteSection(section.id)}
              onMoveUp={() => onMoveSection(section.id, -1)}
              onMoveDown={() => onMoveSection(section.id, 1)}
              onAddBlock={(block) => onAddBlock(section.id, block)}
              onUpdateBlock={(blockId, patch) => onUpdateBlock(section.id, blockId, patch)}
              onDeleteBlock={(blockId) => onDeleteBlock(section.id, blockId)}
              onMoveBlock={(blockId, direction) => onMoveBlock(section.id, blockId, direction)}
            />
          ))}
        </ol>
      )}

      {isAddingSection ? (
        <InlineAddForm
          placeholder="Section title"
          onAdd={handleAddSection}
          onCancel={() => setIsAddingSection(false)}
        />
      ) : (
        <button type="button" className="btn-ghost" onClick={() => setIsAddingSection(true)}>
          + Add section
        </button>
      )}
    </section>
  )
}
