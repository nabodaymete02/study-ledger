import { useState } from 'react'
import './NewSubjectForm.css'

export default function NewSubjectForm({ onCreate, onCancel }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return
    onCreate({ title: trimmedTitle, description: description.trim() })
  }

  return (
    <form className="new-subject-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Subject title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="new-subject-form-actions">
        <button type="submit" className="btn-accent" disabled={!title.trim()}>
          Create
        </button>
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  )
}
