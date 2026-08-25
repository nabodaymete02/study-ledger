import { useState } from 'react'
import './AddSectionForm.css'

export default function AddSectionForm({ onAdd, onCancel }) {
  const [title, setTitle] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onAdd(trimmed)
  }

  return (
    <form className="add-section-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Section title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      <div className="add-section-form-actions">
        <button type="submit" className="btn-accent" disabled={!title.trim()}>
          Add
        </button>
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
