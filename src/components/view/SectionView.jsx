import { Link } from 'react-router-dom'
import BlockView from './BlockView.jsx'

export default function SectionView({ section, index, onToggleReviewed, revisionHref }) {
  return (
    <section className="view-section">
      <div className="view-section-head">
        <span className="view-section-tab">{String(index + 1).padStart(2, '0')}</span>
        <h3>{section.title}</h3>
      </div>
      <hr className="view-divider" />
      {section.blocks.map((block) => (
        <BlockView key={block.id} block={block} />
      ))}

      <div className="view-section-footer">
        <label className="view-reviewed-check">
          <input type="checkbox" checked={section.reviewed} onChange={onToggleReviewed} />
          <span className="view-reviewed-box" />
          <span className="view-reviewed-label">
            {section.reviewed
              ? 'Reviewed'
              : `Mark section ${String(index + 1).padStart(2, '0')} reviewed`}
          </span>
        </label>

        {revisionHref && (
          <Link to={revisionHref} className="btn-ghost view-section-revise">
            Revise this section
          </Link>
        )}
      </div>
    </section>
  )
}
