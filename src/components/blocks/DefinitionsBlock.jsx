export default function DefinitionsBlock({ block, onChange, autoFocus }) {
  const items = block.items

  function updateItem(index, patch) {
    onChange({ items: items.map((item, i) => (i === index ? { ...item, ...patch } : item)) })
  }

  function addItem() {
    onChange({ items: [...items, { term: '', meaning: '' }] })
  }

  function removeItem(index) {
    onChange({ items: items.filter((_, i) => i !== index) })
  }

  return (
    <div className="definitions-block">
      {items.map((item, index) => (
        <div className="definitions-block-row" key={index}>
          <input
            className="definitions-block-term"
            placeholder="Term"
            value={item.term}
            autoFocus={autoFocus && index === 0}
            onChange={(e) => updateItem(index, { term: e.target.value })}
          />
          <input
            className="definitions-block-meaning"
            placeholder="Meaning"
            value={item.meaning}
            onChange={(e) => updateItem(index, { meaning: e.target.value })}
          />
          <button
            type="button"
            className="icon-btn"
            onClick={() => removeItem(index)}
            disabled={items.length === 1}
            aria-label="Remove definition"
            title="Remove"
          >
            &times;
          </button>
        </div>
      ))}
      <button type="button" className="btn-ghost definitions-block-add" onClick={addItem}>
        + Add term
      </button>
    </div>
  )
}
