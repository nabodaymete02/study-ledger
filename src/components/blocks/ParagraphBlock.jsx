import { useState } from 'react'

export default function ParagraphBlock({ block, onChange, autoFocus }) {
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

  if (isEditing) {
    return (
      <textarea
        className="paragraph-block-input"
        value={text}
        autoFocus
        rows={3}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
      />
    )
  }

  return (
    <p className="paragraph-block-text" onClick={() => setIsEditing(true)}>
      {block.text || <span className="block-placeholder">Empty paragraph — click to write.</span>}
    </p>
  )
}
