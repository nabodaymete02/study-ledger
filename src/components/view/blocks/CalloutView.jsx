const LABELS = { note: 'Note', flag: 'Flag', task: 'Task' }

export default function CalloutView({ block }) {
  if (!block.text) return null
  return (
    <div className={`view-callout view-callout-${block.variant}`}>
      <p className="view-callout-label">{LABELS[block.variant]}</p>
      <p>{block.text}</p>
    </div>
  )
}
