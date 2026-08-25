export default function ParagraphView({ block }) {
  if (!block.text) return null
  return <p className="view-paragraph">{block.text}</p>
}
