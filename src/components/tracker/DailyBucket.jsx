import { useState } from 'react'
import './DailyBucket.css'

// Deterministic small stagger so the pile looks hand-tossed but never jitters
// on re-render.
function cardRotation(i) {
  return ((i * 47) % 11) - 5
}

export default function DailyBucket({ todos, onAdd, onPop, onRemove }) {
  const [text, setText] = useState('')
  const [poppingId, setPoppingId] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setText('')
  }

  function triggerPop(id) {
    if (poppingId) return
    setPoppingId(id)
    setTimeout(() => {
      onPop(id)
      setPoppingId(null)
    }, 260)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const id = e.dataTransfer.getData('text/plain')
    if (id) triggerPop(id)
  }

  const stack = todos.stack
  const doneToday = todos.done

  return (
    <section className="tracker-card daily-bucket">
      <div className="tracker-card-header">
        <h2>Today&rsquo;s bucket</h2>
      </div>

      <form className="bucket-add-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Drop a task in the bucket…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="btn-accent" disabled={!text.trim()}>
          Add
        </button>
      </form>

      <div className="bucket-stack">
        {stack.length === 0 ? (
          <p className="tracker-empty bucket-empty">Bucket&rsquo;s empty — add a task above.</p>
        ) : (
          stack.map((task, i) => (
            <div
              key={task.id}
              className={`bucket-card${task.id === poppingId ? ' is-popping' : ''}`}
              style={{ '--rot': `${cardRotation(i)}deg`, '--depth': Math.min(i, 10), zIndex: i }}
              draggable
              role="button"
              tabIndex={0}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', task.id)
                e.dataTransfer.effectAllowed = 'move'
              }}
              onClick={() => triggerPop(task.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  triggerPop(task.id)
                }
              }}
              title="Click, or drag down to the tray, when it's done"
            >
              <span className="bucket-card-text">{task.text}</span>
              <button
                type="button"
                className="bucket-card-remove"
                onClick={(e) => {
                  e.stopPropagation()
                  onRemove(task.id)
                }}
                title="Remove (didn't mean to add this)"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {stack.length > 0 && (
        <div
          className={`bucket-drop-zone${dragOver ? ' is-over' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          drag here when done
        </div>
      )}

      {doneToday.length > 0 && (
        <div className="bucket-done">
          <h3>Done today</h3>
          <ul className="bucket-done-list">
            {doneToday
              .slice()
              .reverse()
              .map((task) => (
                <li key={task.id}>{task.text}</li>
              ))}
          </ul>
        </div>
      )}
    </section>
  )
}
