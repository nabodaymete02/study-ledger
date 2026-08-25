import { useState } from 'react'

const LABELS = { note: 'Note', flag: 'Flag', task: 'Task' }

export default function CalloutBlock({ block, onChange, autoFocus }) {
  const [isEditing, setIsEditing] = useState(Boolean(autoFocus))
  const [text, setText] = useState(block.text)

  function handleSave() {
    const trimmed = text.trim()
    if (trimmed !== block.text) onChange({ text: trimmed })
    setIsEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      setText(block.text)
      setIsEditing(false)
    }
  }

  return (
    <div className={`callout callout-${block.variant}`}>
      <span className="callout-label">{LABELS[block.variant]}</span>
      {isEditing ? (
        <textarea
          className="callout-input"
          value={text}
          autoFocus
          rows={2}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <p className="callout-text" onClick={() => setIsEditing(true)}>
          {block.text || <span className="block-placeholder">Click to write.</span>}
        </p>
      )}
    </div>
  )
}
