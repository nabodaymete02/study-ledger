import { generateId } from './id.js'

const now = () => new Date().toISOString()

// ---- Subject ----

export function createEmptySubject({ title, description = '' }) {
  const ts = now()
  return {
    id: generateId(),
    title,
    description,
    createdAt: ts,
    updatedAt: ts,
    chapters: [],
  }
}

export function renameSubject(subject, { title, description }) {
  return { ...subject, title, description, updatedAt: now() }
}

export function getSubjectProgress(subject) {
  const sections = subject.chapters.flatMap((c) => c.sections)
  const total = sections.length
  if (total === 0) return { reviewed: 0, total: 0, pct: 0 }
  const reviewed = sections.filter((s) => s.reviewed).length
  return { reviewed, total, pct: Math.round((reviewed / total) * 100) }
}

// Finds the chapter that owns a given section id — used by revision mode
// (a section id alone is enough to identify it; callers shouldn't need to
// track which chapter it lives under).
export function findChapterForSection(subject, sectionId) {
  return subject.chapters.find((c) => c.sections.some((s) => s.id === sectionId)) ?? null
}

export function regenerateBlockIds(block) {
  const copy = { ...block, id: generateId() }
  if (block.type === 'definitions') {
    copy.items = (block.items ?? []).map((item) => ({ ...item }))
  }
  if (block.type === 'flashcards') {
    copy.cards = (block.cards ?? []).map((card) => ({ ...card, id: generateId() }))
  }
  return copy
}

function regenerateSectionIds(section) {
  return {
    id: generateId(),
    title: section.title,
    reviewed: false,
    blocks: (section.blocks ?? []).map(regenerateBlockIds),
  }
}

function regenerateChapterIds(chapter) {
  return {
    id: generateId(),
    title: chapter.title,
    sections: (chapter.sections ?? []).map(regenerateSectionIds),
  }
}

export function duplicateSubject(subject) {
  const ts = now()
  return {
    id: generateId(),
    title: `${subject.title} (copy)`,
    description: subject.description,
    createdAt: ts,
    updatedAt: ts,
    chapters: subject.chapters.map(regenerateChapterIds),
  }
}

// Builds a fresh subject (new ids throughout) from an imported/exported
// plain-object subject — used by Dashboard import.
export function buildImportedSubject(raw) {
  const ts = now()
  return {
    id: generateId(),
    title: String(raw.title ?? 'Untitled'),
    description: String(raw.description ?? ''),
    createdAt: ts,
    updatedAt: ts,
    chapters: (raw.chapters ?? []).map((chapter) => ({
      id: generateId(),
      title: String(chapter.title ?? 'Untitled chapter'),
      sections: (chapter.sections ?? []).map((section) => ({
        id: generateId(),
        title: String(section.title ?? 'Untitled section'),
        reviewed: false,
        blocks: (section.blocks ?? []).map(regenerateBlockIds),
      })),
    })),
  }
}

// ---- Chapter ----

function mapChapters(subject, mapFn) {
  return { ...subject, chapters: mapFn(subject.chapters), updatedAt: now() }
}

export function createChapter(subject, { title }) {
  const chapter = { id: generateId(), title, sections: [] }
  const next = mapChapters(subject, (chapters) => [...chapters, chapter])
  return { subject: next, chapter }
}

export function renameChapter(subject, chapterId, title) {
  return mapChapters(subject, (chapters) =>
    chapters.map((c) => (c.id === chapterId ? { ...c, title } : c)),
  )
}

export function deleteChapter(subject, chapterId) {
  return mapChapters(subject, (chapters) => chapters.filter((c) => c.id !== chapterId))
}

export function reorderChapters(subject, orderedChapterIds) {
  return mapChapters(subject, (chapters) => {
    const byId = new Map(chapters.map((c) => [c.id, c]))
    return orderedChapterIds.map((id) => byId.get(id)).filter(Boolean)
  })
}

// ---- Section (nested under a chapter) ----

function mapChapterSections(subject, chapterId, mapFn) {
  return mapChapters(subject, (chapters) =>
    chapters.map((c) => (c.id === chapterId ? { ...c, sections: mapFn(c.sections) } : c)),
  )
}

export function createSection(subject, chapterId, { title }) {
  const section = { id: generateId(), title, reviewed: false, blocks: [] }
  const next = mapChapterSections(subject, chapterId, (sections) => [...sections, section])
  return { subject: next, section }
}

export function updateSection(subject, chapterId, sectionId, patch) {
  return mapChapterSections(subject, chapterId, (sections) =>
    sections.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)),
  )
}

export function deleteSection(subject, chapterId, sectionId) {
  return mapChapterSections(subject, chapterId, (sections) =>
    sections.filter((s) => s.id !== sectionId),
  )
}

export function reorderSections(subject, chapterId, orderedSectionIds) {
  return mapChapterSections(subject, chapterId, (sections) => {
    const byId = new Map(sections.map((s) => [s.id, s]))
    return orderedSectionIds.map((id) => byId.get(id)).filter(Boolean)
  })
}

export function toggleSectionReviewed(subject, chapterId, sectionId) {
  const chapter = subject.chapters.find((c) => c.id === chapterId)
  const section = chapter?.sections.find((s) => s.id === sectionId)
  if (!section) return subject
  return updateSection(subject, chapterId, sectionId, { reviewed: !section.reviewed })
}

// ---- Block (nested under a chapter + section) ----

function mapSectionBlocks(subject, chapterId, sectionId, mapFn) {
  return mapChapterSections(subject, chapterId, (sections) =>
    sections.map((s) => (s.id === sectionId ? { ...s, blocks: mapFn(s.blocks) } : s)),
  )
}

export function addBlock(subject, chapterId, sectionId, block) {
  const withId = { ...block, id: generateId() }
  const next = mapSectionBlocks(subject, chapterId, sectionId, (blocks) => [...blocks, withId])
  return { subject: next, block: withId }
}

export function updateBlock(subject, chapterId, sectionId, blockId, patch) {
  return mapSectionBlocks(subject, chapterId, sectionId, (blocks) =>
    blocks.map((b) => (b.id === blockId ? { ...b, ...patch } : b)),
  )
}

export function deleteBlock(subject, chapterId, sectionId, blockId) {
  return mapSectionBlocks(subject, chapterId, sectionId, (blocks) =>
    blocks.filter((b) => b.id !== blockId),
  )
}

export function reorderBlocks(subject, chapterId, sectionId, orderedBlockIds) {
  return mapSectionBlocks(subject, chapterId, sectionId, (blocks) => {
    const byId = new Map(blocks.map((b) => [b.id, b]))
    return orderedBlockIds.map((id) => byId.get(id)).filter(Boolean)
  })
}
