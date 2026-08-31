import { generateId } from './id.js'

const now = () => new Date().toISOString()

// ---- Date helpers ----
// Keyed by local calendar day (not UTC) so "today" matches the user's clock.

export function todayKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function parseDateKey(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function daysUntil(dateKey) {
  const target = parseDateKey(dateKey)
  const today = parseDateKey(todayKey())
  return Math.round((target - today) / 86400000)
}

export function formatDDay(dateKey) {
  const n = daysUntil(dateKey)
  if (n === 0) return 'D-DAY'
  return n > 0 ? `D-${n}` : `D+${Math.abs(n)}`
}

export function lastNDays(n = 7) {
  const days = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(todayKey(d))
  }
  return days
}

// ---- Tracker root ----

const DEFAULT_HABITS = ['DSA', 'Deep Work', '6am Wakeup']

export function createDefaultTracker() {
  const ts = now()
  return {
    habits: DEFAULT_HABITS.map((name) => ({ id: generateId(), name, createdAt: ts, log: {} })),
    importantDates: [],
    todos: { stack: [], done: [] },
    longTermTasks: [],
    sessions: [],
  }
}

// ---- Habits ----

export function addHabit(tracker, name) {
  const habit = { id: generateId(), name, createdAt: now(), log: {} }
  return { ...tracker, habits: [...tracker.habits, habit] }
}

export function deleteHabit(tracker, habitId) {
  return { ...tracker, habits: tracker.habits.filter((h) => h.id !== habitId) }
}

export function toggleHabitDay(tracker, habitId, dateKey) {
  return {
    ...tracker,
    habits: tracker.habits.map((h) => {
      if (h.id !== habitId) return h
      const log = { ...h.log }
      if (log[dateKey]) delete log[dateKey]
      else log[dateKey] = true
      return { ...h, log }
    }),
  }
}

export function getHabitStreak(habit) {
  let streak = 0
  const cursor = new Date()
  if (!habit.log[todayKey(cursor)]) {
    cursor.setDate(cursor.getDate() - 1)
  }
  while (habit.log[todayKey(cursor)]) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

// ---- Important dates ----

export function addImportantDate(tracker, { label, date }) {
  const entry = { id: generateId(), label, date, createdAt: now() }
  return { ...tracker, importantDates: [...tracker.importantDates, entry] }
}

export function deleteImportantDate(tracker, id) {
  return { ...tracker, importantDates: tracker.importantDates.filter((d) => d.id !== id) }
}

// Upcoming dates first (soonest first), then past ones (most recently passed first).
export function sortedImportantDates(dates) {
  const upcoming = dates
    .filter((d) => daysUntil(d.date) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date))
  const past = dates
    .filter((d) => daysUntil(d.date) < 0)
    .sort((a, b) => b.date.localeCompare(a.date))
  return [...upcoming, ...past]
}

// ---- Daily bucket (today's todo stack) ----

export function addTodo(tracker, text) {
  const item = { id: generateId(), text, createdAt: now() }
  return { ...tracker, todos: { ...tracker.todos, stack: [...tracker.todos.stack, item] } }
}

// Pops a task out of the stack and files it under "done today".
export function popTodo(tracker, id) {
  const item = tracker.todos.stack.find((t) => t.id === id)
  if (!item) return tracker
  const stack = tracker.todos.stack.filter((t) => t.id !== id)
  const done = [...tracker.todos.done, { id: item.id, text: item.text, doneAt: now() }]
  return { ...tracker, todos: { stack, done } }
}

export function deleteTodo(tracker, id) {
  return { ...tracker, todos: { ...tracker.todos, stack: tracker.todos.stack.filter((t) => t.id !== id) } }
}

// The "done today" strip resets each day — anything not from today is dropped.
export function pruneDoneToday(tracker) {
  const today = todayKey()
  const done = tracker.todos.done.filter((t) => todayKey(new Date(t.doneAt)) === today)
  if (done.length === tracker.todos.done.length) return tracker
  return { ...tracker, todos: { ...tracker.todos, done } }
}

// ---- Long-term task list (reading / studying to get to, with a deadline) ----

export function addLongTermTask(tracker, { subject, text, notes = '', deadline = null }) {
  const task = {
    id: generateId(),
    subject,
    text,
    notes,
    deadline,
    createdAt: now(),
    done: false,
    doneAt: null,
  }
  return { ...tracker, longTermTasks: [...tracker.longTermTasks, task] }
}

export function toggleLongTermTask(tracker, id) {
  return {
    ...tracker,
    longTermTasks: tracker.longTermTasks.map((t) =>
      t.id === id ? { ...t, done: !t.done, doneAt: t.done ? null : now() } : t,
    ),
  }
}

export function deleteLongTermTask(tracker, id) {
  return { ...tracker, longTermTasks: tracker.longTermTasks.filter((t) => t.id !== id) }
}

// Groups by subject, open tasks first (soonest deadline first, no-deadline last),
// then done tasks; groups with an urgent deadline float to the top.
export function groupLongTermTasks(tasks) {
  const groups = new Map()
  for (const task of tasks) {
    const key = task.subject.trim().toLowerCase()
    if (!groups.has(key)) groups.set(key, { subject: task.subject.trim(), tasks: [] })
    groups.get(key).tasks.push(task)
  }
  const list = Array.from(groups.values())
  for (const group of list) {
    group.tasks.sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1
      if (!a.deadline && !b.deadline) return a.createdAt.localeCompare(b.createdAt)
      if (!a.deadline) return 1
      if (!b.deadline) return -1
      return a.deadline.localeCompare(b.deadline)
    })
  }
  list.sort((a, b) => {
    const aNext = a.tasks.find((t) => !t.done && t.deadline)?.deadline
    const bNext = b.tasks.find((t) => !t.done && t.deadline)?.deadline
    if (!aNext && !bNext) return a.subject.localeCompare(b.subject)
    if (!aNext) return 1
    if (!bNext) return -1
    return aNext.localeCompare(bNext)
  })
  return list
}

// ---- Focus sessions (from the clock) ----

export function logSession(tracker, { label, kind, minutes }) {
  const session = { id: generateId(), label, kind, minutes, endedAt: now() }
  return { ...tracker, sessions: [...tracker.sessions, session] }
}

export function todaysFocusMinutes(sessions) {
  const today = todayKey()
  return sessions
    .filter((s) => todayKey(new Date(s.endedAt)) === today)
    .reduce((sum, s) => sum + s.minutes, 0)
}
