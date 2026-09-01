import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getTracker,
  saveTracker,
  createDefaultTracker,
  pruneDoneToday,
  addHabit,
  deleteHabit,
  toggleHabitDay,
  addImportantDate,
  deleteImportantDate,
  addTodo,
  popTodo,
  deleteTodo,
  reorderTodos,
  clearDoneToday,
  addLongTermTask,
  toggleLongTermTask,
  deleteLongTermTask,
  logSession,
} from '../../data/index.js'
import FocusTimer from './FocusTimer.jsx'
import HabitTracker from './HabitTracker.jsx'
import ImportantDates from './ImportantDates.jsx'
import DailyBucket from './DailyBucket.jsx'
import LongTermTasks from './LongTermTasks.jsx'
import './TrackerHome.css'

export default function TrackerHome() {
  const [tracker, setTracker] = useState(null)
  const [loadError, setLoadError] = useState(null)

  useEffect(() => {
    getTracker()
      .then((loaded) => {
        const base = loaded ?? createDefaultTracker()
        const pruned = pruneDoneToday(base)
        setTracker(pruned)
        if (!loaded || pruned !== base) saveTracker(pruned).catch(() => {})
      })
      .catch((err) => setLoadError(err.message))
  }, [])

  function update(fn) {
    setTracker((prev) => {
      const next = fn(prev)
      saveTracker(next).catch((err) => window.alert(`Save failed: ${err.message}`))
      return next
    })
  }

  if (loadError) {
    return (
      <main className="tracker-page">
        <p className="dashboard-error">
          Couldn&rsquo;t reach the local server ({loadError}). Make sure{' '}
          <code>npm run dev</code> is running — it starts both the web app and the API.
        </p>
      </main>
    )
  }

  if (!tracker) {
    return (
      <main className="tracker-page">
        <p className="dashboard-empty">Loading…</p>
      </main>
    )
  }

  // direction: +1 moves the task toward the top of the stack (done sooner),
  // -1 moves it back down.
  function handleMoveTodo(id, direction) {
    const stack = tracker.todos.stack
    const index = stack.findIndex((t) => t.id === id)
    const targetIndex = index + direction
    if (index === -1 || targetIndex < 0 || targetIndex >= stack.length) return
    const ids = stack.map((t) => t.id)
    const temp = ids[index]
    ids[index] = ids[targetIndex]
    ids[targetIndex] = temp
    update((t) => reorderTodos(t, ids))
  }

  return (
    <main className="tracker-page">
      <header className="tracker-header">
        <div>
          <p className="tracker-eyebrow">
            <span>Personal</span> Daily tracker
          </p>
          <h1>Tracker</h1>
        </div>
        <Link to="/subjects" className="btn-ghost">
          Study Ledger →
        </Link>
      </header>

      <div className="tracker-grid">
        <FocusTimer
          sessions={tracker.sessions}
          onLogSession={(session) => update((t) => logSession(t, session))}
        />

        <HabitTracker
          habits={tracker.habits}
          onToggleDay={(habitId, dateKey) => update((t) => toggleHabitDay(t, habitId, dateKey))}
          onAddHabit={(name) => update((t) => addHabit(t, name))}
          onDeleteHabit={(habitId) => update((t) => deleteHabit(t, habitId))}
        />

        <ImportantDates
          dates={tracker.importantDates}
          onAdd={(entry) => update((t) => addImportantDate(t, entry))}
          onDelete={(id) => update((t) => deleteImportantDate(t, id))}
        />

        <DailyBucket
          todos={tracker.todos}
          onAdd={(text) => update((t) => addTodo(t, text))}
          onPop={(id) => update((t) => popTodo(t, id))}
          onRemove={(id) => update((t) => deleteTodo(t, id))}
          onMove={handleMoveTodo}
          onClearDone={() => update((t) => clearDoneToday(t))}
        />

        <LongTermTasks
          tasks={tracker.longTermTasks}
          onAdd={(task) => update((t) => addLongTermTask(t, task))}
          onToggle={(id) => update((t) => toggleLongTermTask(t, id))}
          onDelete={(id) => update((t) => deleteLongTermTask(t, id))}
        />
      </div>
    </main>
  )
}
