import './ProgressBar.css'

export default function ProgressBar({ pct }) {
  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
    </div>
  )
}
