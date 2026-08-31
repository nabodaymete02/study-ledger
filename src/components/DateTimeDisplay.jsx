import { useEffect, useState } from 'react'
import './DateTimeDisplay.css'

const DATE_FMT = new Intl.DateTimeFormat(undefined, {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
})
const TIME_FMT = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
})

export default function DateTimeDisplay() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="datetime-display">
      <span className="datetime-display-date">{DATE_FMT.format(now)}</span>
      <span className="datetime-display-time">{TIME_FMT.format(now)}</span>
    </div>
  )
}
