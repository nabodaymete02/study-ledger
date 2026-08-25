import SectionView from './SectionView.jsx'

export default function ChapterView({ chapter, index, onToggleReviewed, revisionHrefFor }) {
  return (
    <div className="view-chapter">
      <h2 className="view-chapter-title">
        <span className="view-chapter-index">Chapter {index + 1}</span>
        {chapter.title}
      </h2>
      {chapter.sections.map((section, i) => (
        <SectionView
          key={section.id}
          section={section}
          index={i}
          onToggleReviewed={() => onToggleReviewed(section.id)}
          revisionHref={revisionHrefFor(section)}
        />
      ))}
    </div>
  )
}
