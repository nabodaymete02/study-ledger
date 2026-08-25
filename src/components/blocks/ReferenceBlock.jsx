import { useState } from 'react'

export default function ReferenceBlock({ block, onChange, autoFocus }) {
  const [isEditing, setIsEditing] = useState(Boolean(autoFocus))
  const [text, setText] = useState(block.text)
  const [copied, setCopied] = useState(false)

  function handleSave() {
    if (text !== block.text) onChange({ text })
    setIsEditing(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      setText(block.text)
      setIsEditing(false)
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(block.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard permission denied — nothing to fall back to
    }
  }

  return (
    <div className="reference-block">
      {isEditing ? (
        <textarea
          className="reference-block-input"
          value={text}
          autoFocus
          rows={3}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <pre className="reference-block-pre" onClick={() => setIsEditing(true)}>
          <code>{block.text || 'Click to write.'}</code>
        </pre>
      )}
      <button
        type="button"
        className="btn-ghost reference-block-copy"
        onClick={handleCopy}
        disabled={!block.text}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}
