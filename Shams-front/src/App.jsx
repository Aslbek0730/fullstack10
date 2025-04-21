import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Assistant from './pages/Assistant'
import Tests from './pages/Tests'
import TestDetail from './pages/TestDetail'
import TestResults from './pages/TestResults'
import Library from './pages/Library'
import BookDetail from './pages/BookDetail'
import Payments from './pages/Payments'
import Profile from './pages/Profile'
import Settings from './pages/Settings'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:id" element={<CourseDetail />} />
        <Route path="assistant" element={<Assistant />} />
        <Route path="tests" element={<Tests />} />
        <Route path="tests/:id" element={<TestDetail />} />
        <Route path="tests/:id/results" element={<TestResults />} />
        <Route path="library" element={<Library />} />
        <Route path="library/:id" element={<BookDetail />} />
        <Route path="payments" element={<Payments />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App