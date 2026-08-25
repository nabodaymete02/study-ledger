import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getLedger } from '../data/index.js'
import './RevisionMode.css'

function shuffle(items) {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = next[i]
    next[i] = next[j]
    next[j] = temp
  }
  return next
}

function collectCards(sections) {
  const collected = []
  sections.forEach((section) => {
    section.blocks.forEach((block) => {
      if (block.type === 'flashcards') {
        block.cards.forEach((card) => collected.push(card))
      }
    })
  })
  return collected
}

export default function RevisionMode() {
  const { ledgerId, sectionId } = useParams()
  const [ledger] = useState(() => getLedger(ledgerId))

  const section = sectionId ? ledger?.sections.find((s) => s.id === sectionId) : null
  const cards = useMemo(() => {
    if (!ledger) return []
    const scope = section ? [section] : ledger.sections
    return shuffle(collectCards(scope))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ledger, sectionId])

  const [index, setIndex] = useState(0)
  const [isRevealed, setIsRevealed] = useState(false)
  const [tally, setTally] = useState({ correct: 0, incorrect: 0 })
  const [isFinished, setIsFinished] = useState(false)

  if (!ledger) {
    return (
      <main className="revision-mode">
        <Link to="/" className="back-link">
          &larr; Dashboard
        </Link>
        <p>Ledger not found.</p>
      </main>
    )
  }

  const scopeTitle = section ? section.title : ledger.title

  function handleGrade(isCorrect) {
    setTally((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
    }))
    const next = index + 1
    if (next >= cards.length) {
      setIsFinished(true)
    } else {
      setIndex(next)
      setIsRevealed(false)
    }
  }

  function handleRestart() {
    setIndex(0)
    setIsRevealed(false)
    setTally({ correct: 0, incorrect: 0 })
    setIsFinished(false)
  }

  if (cards.length === 0) {
    return (
      <main className="revision-mode">
        <Link to={`/ledger/${ledger.id}`} className="back-link">
          &larr; {ledger.title}
        </Link>
        <h1>Revise {scopeTitle}</h1>
        <p className="revision-empty">
          No flashcards yet — add a flashcards block to a section first.
        </p>
      </main>
    )
  }

  if (isFinished) {
    return (
      <main className="revision-mode">
        <Link to={`/ledger/${ledger.id}`} className="back-link">
          &larr; {ledger.title}
        </Link>
        <h1>Revision complete</h1>
        <p className="revision-score">
          {tally.correct} / {cards.length} correct
        </p>
        <div className="revision-actions">
          <button type="button" className="btn-accent" onClick={handleRestart}>
            Revise again
          </button>
          <Link to={`/ledger/${ledger.id}`} className="btn-ghost">
            Back to ledger
          </Link>
        </div>
      </main>
    )
  }

  const card = cards[index]

  return (
    <main className="revision-mode">
      <Link to={`/ledger/${ledger.id}`} className="back-link">
        &larr; {ledger.title}
      </Link>
      <h1>Revise {scopeTitle}</h1>
      <div className="revision-progress">
        Card {index + 1} of {cards.length}
      </div>
      <div className="revision-card">
        <p className="revision-question">
          {card.question || <span className="block-placeholder">(blank question)</span>}
        </p>
        {isRevealed ? (
          <>
            <p className="revision-answer">
              {card.answer || <span className="block-placeholder">(blank answer)</span>}
            </p>
            <div className="revision-grade-actions">
              <button
                type="button"
                className="btn-ghost revision-grade-wrong"
                onClick={() => handleGrade(false)}
              >
                Missed it
              </button>
              <button type="button" className="btn-accent" onClick={() => handleGrade(true)}>
                Got it
              </button>
            </div>
          </>
        ) : (
          <button type="button" className="btn-accent" onClick={() => setIsRevealed(true)}>
            Reveal answer
          </button>
        )}
      </div>
    </main>
  )
}
