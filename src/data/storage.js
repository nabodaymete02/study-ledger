const STORAGE_KEY = 'study-ledger:v1'

export function loadLedgers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveLedgers(ledgers) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ledgers))
  } catch (err) {
    console.error('Failed to save ledgers to localStorage', err)
  }
}
