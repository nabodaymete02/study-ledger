import { useState } from 'react'
import { lastNDays, getHabitStreak, todayKey } from '../../data/index.js'
import './HabitTracker.css'

export default function HabitTracker({ habits, onToggleDay, onAddHabit, onDeleteHabit }) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const days = lastNDays(7)
  const today = todayKey()

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    onAddHabit(trimmed)
    setName('')
    setAdding(false)
  }

  function handleDelete(habit) {
    if (window.confirm(`Delete habit "${habit.name}"? This can't be undone.`)) {
      onDeleteHabit(habit.id)
    }
  }

  return (
    <section className="tracker-card habit-tracker">
      <div className="tracker-card-header">
        <h2>Habits</h2>
        <button
          type="button"
          className="icon-btn"
          onClick={() => setAdding((v) => !v)}
          title="Add habit"
        >
          +
        </button>
      </div>

      {adding && (
        <form className="habit-add-form" onSubmit={handleSubmit}>
          <input
            autoFocus
            type="text"
            placeholder="Habit name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="btn-accent" disabled={!name.trim()}>
            Add
          </button>
          <button type="button" className="btn-ghost" onClick={() => setAdding(false)}>
            Cancel
          </button>
        </form>
      )}

      {habits.length === 0 ? (
        <p className="tracker-empty">No habits yet — add one to start tracking.</p>
      ) : (
        <ul className="habit-list">
          {habits.map((habit) => {
            const streak = getHabitStreak(habit)
            return (
              <li key={habit.id} className="habit-row">
                <div className="habit-row-top">
                  <span className="habit-name">{habit.name}</span>
                  {streak > 0 && (
                    <span className="habit-streak" title={`${streak}-day streak`}>
                      🔥 {streak}
                    </span>
                  )}
                  <button
                    type="button"
                    className="icon-btn habit-delete"
                    onClick={() => handleDelete(habit)}
                    title="Delete habit"
                  >
                    ×
                  </button>
                </div>
                <div className="habit-days">
                  {days.map((day) => (
                    <button
                      key={day}
                      type="button"
                      className={`habit-day${habit.log[day] ? ' is-done' : ''}${
                        day === today ? ' is-today' : ''
                      }`}
                      onClick={() => onToggleDay(habit.id, day)}
                      title={day}
                    />
                  ))}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
