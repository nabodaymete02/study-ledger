import { useState } from 'react'
import './NewLedgerForm.css'

export default function NewLedgerForm({ onCreate, onCancel }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return
    onCreate({ title: trimmedTitle, description: description.trim() })
  }

  return (
    <form className="new-ledger-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Ledger title"
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
      <div className="new-ledger-form-actions">
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
