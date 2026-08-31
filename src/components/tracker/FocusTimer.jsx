import { useEffect, useRef, useState } from 'react'
import { todaysFocusMinutes } from '../../data/index.js'
import './FocusTimer.css'

const STORAGE_KEY = 'study-ledger:timer'
const PRESETS = [25, 45, 60, 90]
const KINDS = [
  { value: 'study', label: 'Study' },
  { value: 'work', label: 'Work' },
  { value: 'other', label: 'Other' },
]

function loadStoredTimer() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveStoredTimer(state) {
  try {
    if (state) localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // localStorage unavailable — timer just won't survive a refresh
  }
}

export default function FocusTimer({ sessions, onLogSession }) {
  const stored = useRef(loadStoredTimer()).current
  const [label, setLabel] = useState(stored?.label ?? '')
  const [kind, setKind] = useState(stored?.kind ?? 'study')
  const [durationMin, setDurationMin] = useState(stored?.durationMin ?? 60)
  const [endAt, setEndAt] = useState(stored?.endAt ?? null)
  const [pausedRemainingSec, setPausedRemainingSec] = useState(stored?.pausedRemainingSec ?? null)
  const [now, setNow] = useState(Date.now())

  const isRunning = endAt != null
  const isPaused = pausedRemainingSec != null
  const isIdle = !isRunning && !isPaused

  useEffect(() => {
    if (!isRunning) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [isRunning])

  useEffect(() => {
    saveStoredTimer(
      isRunning || isPaused ? { label, kind, durationMin, endAt, pausedRemainingSec } : null,
    )
  }, [label, kind, durationMin, endAt, pausedRemainingSec, isRunning, isPaused])

  const remainingSec = isRunning
    ? Math.max(0, Math.round((endAt - now) / 1000))
    : isPaused
      ? pausedRemainingSec
      : durationMin * 60

  useEffect(() => {
    if (isRunning && remainingSec === 0) {
      finishSession(durationMin)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, remainingSec])

  function finishSession(elapsedMin) {
    if (elapsedMin > 0) {
      onLogSession({ label: label.trim() || 'Focus session', kind, minutes: elapsedMin })
    }
    setEndAt(null)
    setPausedRemainingSec(null)
  }

  function handleStart() {
    const totalSec = isPaused ? pausedRemainingSec : durationMin * 60
    setEndAt(Date.now() + totalSec * 1000)
    setPausedRemainingSec(null)
  }

  function handlePause() {
    setPausedRemainingSec(remainingSec)
    setEndAt(null)
  }

  function handleFinishNow() {
    const elapsedSec = durationMin * 60 - remainingSec
    finishSession(Math.round(elapsedSec / 60))
  }

  function handleReset() {
    setEndAt(null)
    setPausedRemainingSec(null)
  }

  const mm = String(Math.floor(remainingSec / 60)).padStart(2, '0')
  const ss = String(remainingSec % 60).padStart(2, '0')
  const todayMin = todaysFocusMinutes(sessions)

  return (
    <section className="tracker-card focus-timer">
      <div className="tracker-card-header">
        <h2>Focus session</h2>
        {todayMin > 0 && <span className="focus-timer-today">Today: {todayMin} min</span>}
      </div>

      <div className={`focus-timer-display${isRunning ? ' is-running' : ''}`}>
        {mm}:{ss}
      </div>

      <input
        type="text"
        className="focus-timer-label"
        placeholder="What are you working on?"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        maxLength={80}
      />

      <div className="focus-timer-row">
        <div className="focus-timer-kinds">
          {KINDS.map((k) => (
            <button
              key={k.value}
              type="button"
              className={`focus-timer-pill${kind === k.value ? ' is-active' : ''}`}
              onClick={() => setKind(k.value)}
            >
              {k.label}
            </button>
          ))}
        </div>
        <div className="focus-timer-presets">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              className={`focus-timer-pill${durationMin === p ? ' is-active' : ''}`}
              onClick={() => setDurationMin(p)}
              disabled={!isIdle}
            >
              {p}m
            </button>
          ))}
        </div>
      </div>

      <div className="focus-timer-controls">
        {isIdle && (
          <button type="button" className="btn-accent" onClick={handleStart}>
            Start
          </button>
        )}
        {isRunning && (
          <>
            <button type="button" className="btn-ghost" onClick={handlePause}>
              Pause
            </button>
            <button type="button" className="btn-accent" onClick={handleFinishNow}>
              Finish now
            </button>
          </>
        )}
        {isPaused && (
          <>
            <button type="button" className="btn-accent" onClick={handleStart}>
              Resume
            </button>
            <button type="button" className="btn-accent" onClick={handleFinishNow}>
              Finish now
            </button>
            <button type="button" className="btn-ghost" onClick={handleReset}>
              Reset
            </button>
          </>
        )}
      </div>
    </section>
  )
}
