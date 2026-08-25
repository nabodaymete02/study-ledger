import { loadLedgers, saveLedgers } from './storage.js'
import { generateId } from './id.js'
import { getLedger } from './ledgers.js'

function mapLedgerSections(ledgers, ledgerId, mapFn) {
  return ledgers.map((ledger) =>
    ledger.id === ledgerId
      ? { ...ledger, sections: mapFn(ledger.sections), updatedAt: new Date().toISOString() }
      : ledger,
  )
}

export function createSection(ledgerId, { title }) {
  const section = { id: generateId(), title, reviewed: false, blocks: [] }
  const ledgers = loadLedgers()
  saveLedgers(
    mapLedgerSections(ledgers, ledgerId, (sections) => [...sections, section]),
  )
  return section
}

export function updateSection(ledgerId, sectionId, patch) {
  const ledgers = loadLedgers()
  saveLedgers(
    mapLedgerSections(ledgers, ledgerId, (sections) =>
      sections.map((section) => (section.id === sectionId ? { ...section, ...patch } : section)),
    ),
  )
}

export function deleteSection(ledgerId, sectionId) {
  const ledgers = loadLedgers()
  saveLedgers(
    mapLedgerSections(ledgers, ledgerId, (sections) =>
      sections.filter((section) => section.id !== sectionId),
    ),
  )
}

export function reorderSections(ledgerId, orderedSectionIds) {
  const ledgers = loadLedgers()
  saveLedgers(
    mapLedgerSections(ledgers, ledgerId, (sections) => {
      const byId = new Map(sections.map((section) => [section.id, section]))
      return orderedSectionIds.map((id) => byId.get(id)).filter(Boolean)
    }),
  )
}

export function toggleSectionReviewed(ledgerId, sectionId) {
  const ledger = getLedger(ledgerId)
  const section = ledger?.sections.find((s) => s.id === sectionId)
  if (!section) return
  updateSection(ledgerId, sectionId, { reviewed: !section.reviewed })
}
