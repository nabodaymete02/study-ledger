import { useState } from 'react'
import Linkify from '../Linkify.jsx'
import './DailyBucket.css'

// How many cards deep the stack keeps offsetting before later ones just
// pile up at the same depth — keeps a long bucket from growing forever tall.
const MAX_STACK_DEPTH = 6

export default function DailyBucket({ todos, onAdd, onPop, onRemove, onMove, onClearDone }) {
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
          stack.map((task, i) => {
            const isTop = i === stack.length - 1
            const depth = Math.min(stack.length - 1 - i, MAX_STACK_DEPTH)
            return (
              <div
                key={task.id}
                className={`bucket-card${isTop ? ' is-top' : ''}${task.id === poppingId ? ' is-popping' : ''}`}
                style={{ '--depth': depth, '--z': i }}
                draggable={isTop}
                onDragStart={
                  isTop
                    ? (e) => {
                        e.dataTransfer.setData('text/plain', task.id)
                        e.dataTransfer.effectAllowed = 'move'
                      }
                    : undefined
                }
                title={isTop ? 'Drag down to the tray when it’s done' : 'Finish the task on top first'}
              >
                <span className="bucket-card-text">
                  <Linkify text={task.text} />
                </span>
                <div className="bucket-card-controls">
                  <button
                    type="button"
                    className="bucket-card-move"
                    onClick={(e) => {
                      e.stopPropagation()
                      onMove(task.id, 1)
                    }}
                    disabled={isTop}
                    title="Move up the stack"
                    aria-label="Move task up the stack"
                  >
                    &uarr;
                  </button>
                  <button
                    type="button"
                    className="bucket-card-move"
                    onClick={(e) => {
                      e.stopPropagation()
                      onMove(task.id, -1)
                    }}
                    disabled={i === 0}
                    title="Move down the stack"
                    aria-label="Move task down the stack"
                  >
                    &darr;
                  </button>
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
              </div>
            )
          })
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
          <div className="bucket-done-header">
            <h3>Done today</h3>
            <button
              type="button"
              className="btn-ghost bucket-done-clear"
              onClick={() => {
                if (window.confirm('Clear the done-today list? This can\'t be undone.')) {
                  onClearDone()
                }
              }}
            >
              Clear
            </button>
          </div>
          <ul className="bucket-done-list">
            {doneToday
              .slice()
              .reverse()
              .map((task) => (
                <li key={task.id}>
                  <Linkify text={task.text} />
                </li>
              ))}
          </ul>
        </div>
      )}
    </section>
  )
}
