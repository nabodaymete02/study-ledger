import { useRef, useState } from 'react'
import { uploadAsset } from '../../data/index.js'

export default function ImageBlock({ block, onChange, subjectId }) {
  const fileInputRef = useRef(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)

  async function upload(file) {
    if (!file || !file.type.startsWith('image/')) return
    setIsUploading(true)
    setError(null)
    try {
      const { url } = await uploadAsset(subjectId, file)
      onChange({ url, alt: block.alt ?? '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsUploading(false)
    }
  }

  function handlePaste(e) {
    const item = Array.from(e.clipboardData.items).find((i) => i.type.startsWith('image/'))
    if (!item) return
    e.preventDefault()
    upload(item.getAsFile())
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    e.target.value = ''
    if (file) upload(file)
  }

  if (!block.url) {
    return (
      <div
        className="image-block-drop"
        tabIndex={0}
        onPaste={handlePaste}
        onClick={() => fileInputRef.current?.click()}
      >
        <p>{isUploading ? 'Uploading…' : 'Click to choose an image, or paste one (Ctrl+V)'}</p>
        {error && <p className="image-block-error">{error}</p>}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="image-block-input"
          onChange={handleFileChange}
        />
      </div>
    )
  }

  return (
    <figure className="image-block">
      <img src={block.url} alt={block.alt || ''} />
      <figcaption>
        <input
          type="text"
          placeholder="Caption / alt text (optional)"
          value={block.alt || ''}
          onChange={(e) => onChange({ alt: e.target.value })}
          className="image-block-alt"
        />
        <button type="button" className="btn-ghost" onClick={() => onChange({ url: '', alt: '' })}>
          Remove
        </button>
      </figcaption>
    </figure>
  )
}
