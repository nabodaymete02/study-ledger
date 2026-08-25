import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard.jsx'
import LedgerView from './components/LedgerView.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ledger/:ledgerId" element={<LedgerView />} />
      </Routes>
    </BrowserRouter>
  )
}
