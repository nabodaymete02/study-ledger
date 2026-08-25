import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard.jsx'
import LedgerView from './components/LedgerView.jsx'
import RevisionMode from './components/RevisionMode.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ledger/:ledgerId" element={<LedgerView />} />
        <Route path="/ledger/:ledgerId/revise" element={<RevisionMode />} />
        <Route path="/ledger/:ledgerId/revise/:sectionId" element={<RevisionMode />} />
      </Routes>
    </BrowserRouter>
  )
}
