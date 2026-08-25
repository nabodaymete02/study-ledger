import { useState } from 'react'

export default function ReferenceView({ block }) {
  const [copied, setCopied] = useState(false)
  if (!block.text) return null

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
    <div className="view-ref">
      <pre>
        <code>{block.text}</code>
      </pre>
      <button type="button" className="view-ref-copy" onClick={handleCopy}>
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}
