import { useState } from 'react'
import { extractYouTubeId, youtubeThumbnailUrl } from '../../data/index.js'

export default function LinkBlock({ block, onChange, autoFocus }) {
  const [url, setUrl] = useState(block.url || '')
  const [label, setLabel] = useState(block.label || '')

  function commit(nextUrl, nextLabel) {
    onChange({ url: nextUrl, label: nextLabel, youtubeId: extractYouTubeId(nextUrl) })
  }

  const youtubeId = extractYouTubeId(url)

  return (
    <div className="link-block">
      <input
        type="url"
        placeholder="https://…"
        value={url}
        autoFocus={autoFocus}
        onChange={(e) => setUrl(e.target.value)}
        onBlur={() => url !== block.url && commit(url, label)}
        className="link-block-url"
      />
      <input
        type="text"
        placeholder="Label (optional)"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        onBlur={() => label !== block.label && commit(url, label)}
        className="link-block-label"
      />
      {youtubeId && <img className="link-block-thumb" src={youtubeThumbnailUrl(youtubeId)} alt="" />}
    </div>
  )
}
