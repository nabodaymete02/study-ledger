import { useState } from 'react'
import { generateId } from '../../data/index.js'

export default function FlashcardsBlock({ block, onChange, autoFocus }) {
  const cards = block.cards
  const [revealedIds, setRevealedIds] = useState(() => new Set())

  function updateCard(id, patch) {
    onChange({ cards: cards.map((card) => (card.id === id ? { ...card, ...patch } : card)) })
  }

  function addCard() {
    onChange({ cards: [...cards, { id: generateId(), question: '', answer: '' }] })
  }

  function removeCard(id) {
    onChange({ cards: cards.filter((card) => card.id !== id) })
  }

  function toggleReveal(id) {
    setRevealedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flashcards-block">
      {cards.map((card, index) => (
        <div className="flashcard" key={card.id}>
          <div className="flashcard-row">
            <input
              className="flashcard-question"
              placeholder="Question"
              value={card.question}
              autoFocus={autoFocus && index === 0}
              onChange={(e) => updateCard(card.id, { question: e.target.value })}
            />
            <button
              type="button"
              className="icon-btn"
              onClick={() => removeCard(card.id)}
              disabled={cards.length === 1}
              aria-label="Remove card"
              title="Remove"
            >
              &times;
            </button>
          </div>

          {revealedIds.has(card.id) ? (
            <div className="flashcard-answer-row">
              <input
                className="flashcard-answer"
                placeholder="Answer"
                value={card.answer}
                onChange={(e) => updateCard(card.id, { answer: e.target.value })}
              />
              <button
                type="button"
                className="btn-ghost flashcard-toggle"
                onClick={() => toggleReveal(card.id)}
              >
                Hide
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn-ghost flashcard-toggle"
              onClick={() => toggleReveal(card.id)}
            >
              Reveal answer
            </button>
          )}
        </div>
      ))}
      <button type="button" className="btn-ghost flashcards-block-add" onClick={addCard}>
        + Add card
      </button>
    </div>
  )
}
