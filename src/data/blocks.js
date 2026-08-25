import { loadLedgers, saveLedgers } from './storage.js'
import { generateId } from './id.js'

function mapSectionBlocks(ledgers, ledgerId, sectionId, mapFn) {
  return ledgers.map((ledger) => {
    if (ledger.id !== ledgerId) return ledger
    return {
      ...ledger,
      sections: ledger.sections.map((section) =>
        section.id === sectionId ? { ...section, blocks: mapFn(section.blocks) } : section,
      ),
      updatedAt: new Date().toISOString(),
    }
  })
}

export function addBlock(ledgerId, sectionId, block) {
  const withId = { ...block, id: generateId() }
  const ledgers = loadLedgers()
  saveLedgers(
    mapSectionBlocks(ledgers, ledgerId, sectionId, (blocks) => [...blocks, withId]),
  )
  return withId
}

export function updateBlock(ledgerId, sectionId, blockId, patch) {
  const ledgers = loadLedgers()
  saveLedgers(
    mapSectionBlocks(ledgers, ledgerId, sectionId, (blocks) =>
      blocks.map((block) => (block.id === blockId ? { ...block, ...patch } : block)),
    ),
  )
}

export function deleteBlock(ledgerId, sectionId, blockId) {
  const ledgers = loadLedgers()
  saveLedgers(
    mapSectionBlocks(ledgers, ledgerId, sectionId, (blocks) =>
      blocks.filter((block) => block.id !== blockId),
    ),
  )
}

export function reorderBlocks(ledgerId, sectionId, orderedBlockIds) {
  const ledgers = loadLedgers()
  saveLedgers(
    mapSectionBlocks(ledgers, ledgerId, sectionId, (blocks) => {
      const byId = new Map(blocks.map((block) => [block.id, block]))
      return orderedBlockIds.map((id) => byId.get(id)).filter(Boolean)
    }),
  )
}
