import { useState } from 'react'
import './InlineAddForm.css'

export default function InlineAddForm({ placeholder, submitLabel = 'Add', onAdd, onCancel }) {
  const [title, setTitle] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onAdd(trimmed)
  }

  return (
    <form className="inline-add-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder={placeholder}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      <div className="inline-add-form-actions">
        <button type="submit" className="btn-accent" disabled={!title.trim()}>
          {submitLabel}
        </button>
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
