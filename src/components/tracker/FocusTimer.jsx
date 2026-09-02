import { useEffect, useRef, useState } from 'react'
import { todaysFocusMinutes } from '../../data/index.js'
import { IconBell, IconBellOff } from '../icons.jsx'
import './FocusTimer.css'

const STORAGE_KEY = 'study-ledger:timer'
const MUTE_KEY = 'study-ledger:timer-muted'
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

// Plays a sustained ~5.5s alarm tone via Web Audio so no sound asset needs to ship with
// the app. A tremolo LFO gives it a continuous "ringing" pulse instead of a flat drone.
function playChime(ctx) {
  const now = ctx.currentTime
  const duration = 5.5
  const attack = 0.05
  const release = 0.4

  const tone = ctx.createOscillator()
  tone.type = 'sine'
  tone.frequency.setValueAtTime(880, now) // A5
  tone.frequency.setValueAtTime(1046.5, now + duration / 2) // shift to C6 midway

  const tremolo = ctx.createOscillator()
  tremolo.type = 'sine'
  tremolo.frequency.value = 5 // pulses per second

  const tremoloDepth = ctx.createGain()
  tremoloDepth.gain.value = 0.1

  const mainGain = ctx.createGain()
  mainGain.gain.setValueAtTime(0, now)
  mainGain.gain.linearRampToValueAtTime(0.18, now + attack)
  mainGain.gain.setValueAtTime(0.18, now + duration - release)
  mainGain.gain.linearRampToValueAtTime(0, now + duration)

  tremolo.connect(tremoloDepth)
  tremoloDepth.connect(mainGain.gain)
  tone.connect(mainGain)
  mainGain.connect(ctx.destination)

  tone.start(now)
  tremolo.start(now)
  tone.stop(now + duration)
  tremolo.stop(now + duration)
}

export default function FocusTimer({ sessions, onLogSession }) {
  const stored = useRef(loadStoredTimer()).current
  const [label, setLabel] = useState(stored?.label ?? '')
  const [kind, setKind] = useState(stored?.kind ?? 'study')
  const [durationMin, setDurationMin] = useState(stored?.durationMin ?? 60)
  const [endAt, setEndAt] = useState(stored?.endAt ?? null)
  const [pausedRemainingSec, setPausedRemainingSec] = useState(stored?.pausedRemainingSec ?? null)
  const [now, setNow] = useState(Date.now())
  const [muted, setMuted] = useState(() => localStorage.getItem(MUTE_KEY) === '1')
  const audioCtxRef = useRef(null)

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
      finishSession(durationMin, { chime: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, remainingSec])

  function getAudioContext() {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      audioCtxRef.current = AudioCtx ? new AudioCtx() : null
    }
    return audioCtxRef.current
  }

  function finishSession(elapsedMin, { chime = false } = {}) {
    if (elapsedMin > 0) {
      onLogSession({ label: label.trim() || 'Focus session', kind, minutes: elapsedMin })
    }
    setEndAt(null)
    setPausedRemainingSec(null)
    if (chime && !muted) {
      const ctx = getAudioContext()
      if (ctx) {
        ctx.resume?.().then(() => playChime(ctx)).catch(() => {})
      }
    }
  }

  function toggleMuted() {
    setMuted((m) => {
      const next = !m
      try {
        localStorage.setItem(MUTE_KEY, next ? '1' : '0')
      } catch {
        // localStorage unavailable — mute preference just won't persist
      }
      return next
    })
  }

  function handleStart() {
    // Unlock/create the AudioContext on a real user gesture so the chime can play later.
    getAudioContext()?.resume?.().catch(() => {})
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
        <div className="focus-timer-header-right">
          {todayMin > 0 && <span className="focus-timer-today">Today: {todayMin} min</span>}
          <button
            type="button"
            className="focus-timer-mute"
            onClick={toggleMuted}
            title={muted ? 'Unmute completion sound' : 'Mute completion sound'}
            aria-label={muted ? 'Unmute completion sound' : 'Mute completion sound'}
          >
            {muted ? <IconBellOff size={16} /> : <IconBell size={16} />}
          </button>
        </div>
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
