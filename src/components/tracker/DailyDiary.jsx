import { useEffect, useState } from 'react'
import { todayKey, daysUntil, diaryDays } from '../../data/index.js'
import './DailyDiary.css'

function formatDayLabel(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const n = daysUntil(dateKey)
  const weekday = date.toLocaleDateString(undefined, { weekday: 'short' })
  const full = date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
  const suffix = n === 0 ? 'Today' : n === -1 ? 'Yesterday' : null
  return { weekday, full, suffix }
}

export default function DailyDiary({ diary, onSave }) {
  const today = todayKey()
  const days = diaryDays(diary)

  const [openDay, setOpenDay] = useState(null)
  const [draft, setDraft] = useState('')
  const [picking, setPicking] = useState(false)
  const [pickedDate, setPickedDate] = useState(today)

  // Autosave a moment after typing stops, so a page isn't lost if it's never
  // explicitly closed (e.g. the user navigates away instead).
  useEffect(() => {
    if (!openDay) return
    const timer = setTimeout(() => onSave(openDay, draft), 800)
    return () => clearTimeout(timer)
  }, [openDay, draft, onSave])

  function openEntry(dateKey) {
    if (openDay === dateKey) {
      onSave(dateKey, draft)
      setOpenDay(null)
      setDraft('')
      return
    }
    if (openDay) onSave(openDay, draft)
    setOpenDay(dateKey)
    setDraft(diary[dateKey]?.text ?? '')
  }

  function handlePick(e) {
    e.preventDefault()
    setPicking(false)
    openEntry(pickedDate)
  }

  return (
    <section className="tracker-card daily-diary">
      <div className="tracker-card-header">
        <h2>Daily diary</h2>
        <button
          type="button"
          className="icon-btn"
          onClick={() => setPicking((v) => !v)}
          title="Open a date"
        >
          +
        </button>
      </div>

      {picking && (
        <form className="diary-pick-form" onSubmit={handlePick}>
          <input
            autoFocus
            type="date"
            value={pickedDate}
            max={today}
            onChange={(e) => setPickedDate(e.target.value)}
          />
          <button type="submit" className="btn-accent">
            Open
          </button>
          <button type="button" className="btn-ghost" onClick={() => setPicking(false)}>
            Cancel
          </button>
        </form>
      )}

      <ul className="diary-day-list">
        {days.map((dateKey) => {
          const isOpen = openDay === dateKey
          const hasEntry = Boolean(diary[dateKey]?.text)
          const { weekday, full, suffix } = formatDayLabel(dateKey)
          return (
            <li key={dateKey} className={`diary-day${isOpen ? ' is-open' : ''}`}>
              <button type="button" className="diary-day-header" onClick={() => openEntry(dateKey)}>
                <span className="diary-day-weekday">{weekday}</span>
                <span className="diary-day-full">{full}</span>
                {suffix && <span className="diary-day-suffix">{suffix}</span>}
                {hasEntry && !isOpen && <span className="diary-day-dot" title="Has an entry" />}
                <span className="diary-day-caret">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className="diary-page">
                  <textarea
                    autoFocus
                    className="diary-page-text"
                    placeholder="Write this day&rsquo;s page…"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={7}
                  />
                  <div className="diary-page-actions">
                    <button type="button" className="btn-accent" onClick={() => openEntry(dateKey)}>
                      Done
                    </button>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
