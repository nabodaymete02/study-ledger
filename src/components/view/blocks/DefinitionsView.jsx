export default function DefinitionsView({ block }) {
  const items = (block.items ?? []).filter((item) => item.term || item.meaning)
  if (items.length === 0) return null

  return (
    <div className="view-rows">
      {items.map((item, i) => (
        <div className="view-row" key={i}>
          <b>{item.term}</b>
          <span>{item.meaning}</span>
        </div>
      ))}
    </div>
  )
}
