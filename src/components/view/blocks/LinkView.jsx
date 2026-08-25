import { youtubeThumbnailUrl, youtubeWatchUrl } from '../../../data/index.js'

export default function LinkView({ block }) {
  if (!block.url) return null

  if (block.youtubeId) {
    return (
      <a
        className="view-link view-link-youtube"
        href={youtubeWatchUrl(block.youtubeId)}
        target="_blank"
        rel="noreferrer"
      >
        <img src={youtubeThumbnailUrl(block.youtubeId)} alt="" />
        <span>{block.label || 'Watch on YouTube'}</span>
      </a>
    )
  }

  return (
    <a className="view-link" href={block.url} target="_blank" rel="noreferrer">
      {block.label || block.url}
    </a>
  )
}
