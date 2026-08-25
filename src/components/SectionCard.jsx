import { useState } from 'react'
import Block from './Block.jsx'
import AddBlockToolbar from './AddBlockToolbar.jsx'
import './SectionCard.css'

export default function SectionCard({
  section,
  index,
  isFirst,
  isLast,
  onRename,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlock,
  subjectId,
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(section.title)
  const [newBlockId, setNewBlockId] = useState(null)

  function handleSaveTitle() {
    const trimmed = title.trim()
    if (trimmed && trimmed !== section.title) {
      onRename(trimmed)
    } else {
      setTitle(section.title)
    }
    setIsEditingTitle(false)
  }

  function handleTitleKeyDown(e) {
    if (e.key === 'Enter') handleSaveTitle()
    if (e.key === 'Escape') {
      setTitle(section.title)
      setIsEditingTitle(false)
    }
  }

  function handleDeleteSection() {
    if (window.confirm(`Delete section "${section.title}"? This can't be undone.`)) {
      onDelete()
    }
  }

  function handleAddBlock(block) {
    const created = onAddBlock(block)
    setNewBlockId(created.id)
  }

  const blocks = section.blocks

  return (
    <li className="section-card">
      <div className="section-card-header">
        <span className="section-row-index">{index + 1}</span>

        {isEditingTitle ? (
          <input
            className="section-row-input"
            value={title}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={handleTitleKeyDown}
          />
        ) : (
          <span className="section-row-title" onClick={() => setIsEditingTitle(true)}>
            {section.title}
          </span>
        )}

        <div className="section-row-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={onMoveUp}
            disabled={isFirst}
            aria-label="Move section up"
            title="Move up"
          >
            &uarr;
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={onMoveDown}
            disabled={isLast}
            aria-label="Move section down"
            title="Move down"
          >
            &darr;
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={handleDeleteSection}
            aria-label="Delete section"
            title="Delete"
          >
            &times;
          </button>
        </div>
      </div>

      {blocks.length > 0 && (
        <div className="section-card-blocks">
          {blocks.map((block, i) => (
            <Block
              key={block.id}
              block={block}
              isFirst={i === 0}
              isLast={i === blocks.length - 1}
              autoFocus={block.id === newBlockId}
              onChange={(patch) => onUpdateBlock(block.id, patch)}
              onDelete={() => onDeleteBlock(block.id)}
              onMoveUp={() => onMoveBlock(block.id, -1)}
              onMoveDown={() => onMoveBlock(block.id, 1)}
              subjectId={subjectId}
            />
          ))}
        </div>
      )}

      <AddBlockToolbar onAdd={handleAddBlock} />
    </li>
  )
}
