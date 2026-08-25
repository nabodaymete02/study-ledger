import { loadLedgers, saveLedgers } from './storage.js'
import { generateId } from './id.js'
import { regenerateBlockIds } from './blocks.js'

export function exportLedgers() {
  return JSON.stringify(loadLedgers(), null, 2)
}

// Imported ledgers are appended (not merged in place) with fresh ids
// throughout, so re-importing an old export never collides with what's
// already here.
export function importLedgers(json) {
  const parsed = JSON.parse(json)
  if (!Array.isArray(parsed)) {
    throw new Error('Expected a JSON array of ledgers')
  }

  const now = new Date().toISOString()
  const imported = parsed.map((ledger) => ({
    id: generateId(),
    title: String(ledger.title ?? 'Untitled'),
    description: String(ledger.description ?? ''),
    createdAt: now,
    updatedAt: now,
    sections: (ledger.sections ?? []).map((section) => ({
      id: generateId(),
      title: String(section.title ?? 'Untitled section'),
      reviewed: false,
      blocks: (section.blocks ?? []).map(regenerateBlockIds),
    })),
  }))

  saveLedgers([...loadLedgers(), ...imported])
  return imported
}
