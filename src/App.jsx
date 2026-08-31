import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TrackerHome from './components/tracker/TrackerHome.jsx'
import Dashboard from './components/Dashboard.jsx'
import SubjectView from './components/view/SubjectView.jsx'
import SubjectEdit from './components/SubjectEdit.jsx'
import RevisionMode from './components/RevisionMode.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<TrackerHome />} />
        <Route path="/subjects" element={<Dashboard />} />
        <Route path="/subject/:subjectId" element={<SubjectView />} />
        <Route path="/subject/:subjectId/edit" element={<SubjectEdit />} />
        <Route path="/subject/:subjectId/revise" element={<RevisionMode />} />
        <Route path="/subject/:subjectId/revise/:sectionId" element={<RevisionMode />} />
      </Routes>
    </BrowserRouter>
  )
}
