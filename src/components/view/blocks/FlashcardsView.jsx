export default function FlashcardsView({ block }) {
  const cards = (block.cards ?? []).filter((c) => c.question || c.answer)
  if (cards.length === 0) return null

  return (
    <div className="view-cards">
      {cards.map((card) => (
        <div className="view-card" key={card.id}>
          <div className="view-card-q">{card.question}</div>
          <details>
            <summary>Show answer</summary>
            <div className="view-card-a">
              <p>{card.answer}</p>
            </div>
          </details>
        </div>
      ))}
    </div>
  )
}
