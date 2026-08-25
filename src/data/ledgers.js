import { loadLedgers, saveLedgers } from './storage.js'
import { generateId } from './id.js'
import { regenerateBlockIds } from './blocks.js'

export function getLedgers() {
  return loadLedgers()
}

export function getLedger(ledgerId) {
  return loadLedgers().find((ledger) => ledger.id === ledgerId) ?? null
}

export function createLedger({ title, description = '' }) {
  const ledgers = loadLedgers()
  const now = new Date().toISOString()
  const ledger = {
    id: generateId(),
    title,
    description,
    createdAt: now,
    updatedAt: now,
    sections: [],
  }
  saveLedgers([...ledgers, ledger])
  return ledger
}

export function updateLedger(ledgerId, patch) {
  const ledgers = loadLedgers()
  const next = ledgers.map((ledger) =>
    ledger.id === ledgerId
      ? { ...ledger, ...patch, updatedAt: new Date().toISOString() }
      : ledger,
  )
  saveLedgers(next)
}

export function deleteLedger(ledgerId) {
  const ledgers = loadLedgers()
  saveLedgers(ledgers.filter((ledger) => ledger.id !== ledgerId))
}

export function duplicateLedger(ledgerId) {
  const original = getLedger(ledgerId)
  if (!original) return null

  const now = new Date().toISOString()
  const copy = {
    id: generateId(),
    title: `${original.title} (copy)`,
    description: original.description,
    createdAt: now,
    updatedAt: now,
    sections: original.sections.map((section) => ({
      id: generateId(),
      title: section.title,
      reviewed: false,
      blocks: section.blocks.map(regenerateBlockIds),
    })),
  }

  saveLedgers([...loadLedgers(), copy])
  return copy
}

export function getLedgerProgress(ledger) {
  const total = ledger.sections.length
  if (total === 0) return { reviewed: 0, total: 0, pct: 0 }
  const reviewed = ledger.sections.filter((section) => section.reviewed).length
  return { reviewed, total, pct: Math.round((reviewed / total) * 100) }
}
