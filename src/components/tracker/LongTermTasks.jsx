import { useState } from 'react'
import { groupLongTermTasks, formatDDay, daysUntil } from '../../data/index.js'
import Linkify from '../Linkify.jsx'
import './LongTermTasks.css'

export default function LongTermTasks({ tasks, onAdd, onToggle, onDelete }) {
  const [adding, setAdding] = useState(false)
  const [subject, setSubject] = useState('')
  const [text, setText] = useState('')
  const [deadline, setDeadline] = useState('')
  const [notes, setNotes] = useState('')

  const existingSubjects = Array.from(new Set(tasks.map((t) => t.subject))).sort()

  function handleSubmit(e) {
    e.preventDefault()
    if (!subject.trim() || !text.trim()) return
    onAdd({
      subject: subject.trim(),
      text: text.trim(),
      deadline: deadline || null,
      notes: notes.trim(),
    })
    setSubject('')
    setText('')
    setDeadline('')
    setNotes('')
    setAdding(false)
  }

  const groups = groupLongTermTasks(tasks)

  return (
    <section className="tracker-card long-term-tasks">
      <div className="tracker-card-header">
        <h2>Reading &amp; long-term list</h2>
        <button
          type="button"
          className="icon-btn"
          onClick={() => setAdding((v) => !v)}
          title="Add task"
        >
          +
        </button>
      </div>

      {adding && (
        <form className="longterm-add-form" onSubmit={handleSubmit}>
          <div className="longterm-add-row">
            <input
              autoFocus
              list="longterm-subjects"
              type="text"
              placeholder="Subject (e.g. DBMS)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <datalist id="longterm-subjects">
              {existingSubjects.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
          <input
            type="text"
            placeholder="What do you need to read or do?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
          <div className="longterm-add-actions">
            <button type="submit" className="btn-accent" disabled={!subject.trim() || !text.trim()}>
              Add
            </button>
            <button type="button" className="btn-ghost" onClick={() => setAdding(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {groups.length === 0 ? (
        <p className="tracker-empty">Nothing queued up yet.</p>
      ) : (
        <div className="longterm-groups">
          {groups.map((group) => (
            <div className="longterm-group" key={group.subject}>
              <h3>{group.subject}</h3>
              <ul className="longterm-list">
                {group.tasks.map((task) => (
                  <li key={task.id} className={`longterm-item${task.done ? ' is-done' : ''}`}>
                    <label className="longterm-check">
                      <input type="checkbox" checked={task.done} onChange={() => onToggle(task.id)} />
                      <span className="longterm-text">
                        <Linkify text={task.text} />
                      </span>
                    </label>
                    <div className="longterm-meta">
                      {task.deadline && !task.done && (
                        <span
                          className={`longterm-deadline${daysUntil(task.deadline) < 0 ? ' is-past' : ''}`}
                        >
                          {formatDDay(task.deadline)}
                        </span>
                      )}
                      <button
                        type="button"
                        className="icon-btn longterm-delete"
                        onClick={() => onDelete(task.id)}
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                    {task.notes && (
                      <p className="longterm-notes">
                        <Linkify text={task.notes} />
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
