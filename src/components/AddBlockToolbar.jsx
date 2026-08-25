import { generateId } from '../data/index.js'

const BLOCK_TYPES = [
  { key: 'paragraph', label: 'Paragraph', factory: () => ({ type: 'paragraph', text: '' }) },
  {
    key: 'definitions',
    label: 'Definitions',
    factory: () => ({ type: 'definitions', items: [{ term: '', meaning: '' }] }),
  },
  {
    key: 'note',
    label: 'Note',
    factory: () => ({ type: 'callout', variant: 'note', text: '' }),
  },
  {
    key: 'flag',
    label: 'Flag',
    factory: () => ({ type: 'callout', variant: 'flag', text: '' }),
  },
  {
    key: 'task',
    label: 'Task',
    factory: () => ({ type: 'callout', variant: 'task', text: '' }),
  },
  { key: 'reference', label: 'Reference', factory: () => ({ type: 'reference', text: '' }) },
  {
    key: 'flashcards',
    label: 'Flashcards',
    factory: () => ({
      type: 'flashcards',
      cards: [{ id: generateId(), question: '', answer: '' }],
    }),
  },
]

export default function AddBlockToolbar({ onAdd }) {
  return (
    <div className="add-block-toolbar">
      {BLOCK_TYPES.map((entry) => (
        <button
          key={entry.key}
          type="button"
          className="btn-ghost"
          onClick={() => onAdd(entry.factory())}
        >
          + {entry.label}
        </button>
      ))}
    </div>
  )
}
