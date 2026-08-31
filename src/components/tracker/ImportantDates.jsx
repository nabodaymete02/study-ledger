import { useState } from 'react'
import { sortedImportantDates, formatDDay, daysUntil } from '../../data/index.js'
import './ImportantDates.css'

export default function ImportantDates({ dates, onAdd, onDelete }) {
  const [adding, setAdding] = useState(false)
  const [label, setLabel] = useState('')
  const [date, setDate] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!label.trim() || !date) return
    onAdd({ label: label.trim(), date })
    setLabel('')
    setDate('')
    setAdding(false)
  }

  const sorted = sortedImportantDates(dates)

  return (
    <section className="tracker-card important-dates">
      <div className="tracker-card-header">
        <h2>Important dates</h2>
        <button
          type="button"
          className="icon-btn"
          onClick={() => setAdding((v) => !v)}
          title="Add date"
        >
          +
        </button>
      </div>

      {adding && (
        <form className="date-add-form" onSubmit={handleSubmit}>
          <input
            autoFocus
            type="text"
            placeholder="What's coming up?"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <div className="date-add-actions">
            <button type="submit" className="btn-accent" disabled={!label.trim() || !date}>
              Add
            </button>
            <button type="button" className="btn-ghost" onClick={() => setAdding(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {sorted.length === 0 ? (
        <p className="tracker-empty">Nothing on the calendar yet.</p>
      ) : (
        <ul className="date-list">
          {sorted.map((d) => {
            const n = daysUntil(d.date)
            return (
              <li key={d.id} className={`date-row${n < 0 ? ' is-past' : n <= 7 ? ' is-soon' : ''}`}>
                <span className="date-badge">{formatDDay(d.date)}</span>
                <span className="date-label">{d.label}</span>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => onDelete(d.id)}
                  title="Remove"
                >
                  ×
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
