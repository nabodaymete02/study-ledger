export default function ImageView({ block }) {
  if (!block.url) return null
  return (
    <figure className="view-image">
      <img src={block.url} alt={block.alt || ''} />
      {block.alt && <figcaption>{block.alt}</figcaption>}
    </figure>
  )
}
