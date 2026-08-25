import { useEffect, useState } from 'react'
import './ThemeToggle.css'

const STORAGE_KEY = 'study-ledger:theme'
const ORDER = ['system', 'light', 'dark']
const LABELS = { system: 'Auto', light: 'Light', dark: 'Dark' }

function getStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return ORDER.includes(stored) ? stored : 'system'
  } catch {
    return 'system'
  }
}

function applyTheme(theme) {
  const root = document.documentElement
  if (theme === 'system') {
    delete root.dataset.theme
  } else {
    root.dataset.theme = theme
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getStoredTheme)

  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // localStorage unavailable — theme choice just won't persist
    }
  }, [theme])

  function handleClick() {
    setTheme((prev) => ORDER[(ORDER.indexOf(prev) + 1) % ORDER.length])
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={handleClick}
      title="Toggle theme (auto / light / dark)"
    >
      {LABELS[theme]}
    </button>
  )
}
