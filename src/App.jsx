import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react' // ✅ ADDED
import { AuthProvider } from './context/AuthContext'
import api from './api/axios' // ✅ ADDED

import Cursor             from './components/Cursor'
import ParticleBackground from './components/ParticleBackground'
import Hero               from './components/Hero'
import About              from './components/About'
import Projects           from './components/Projects'
import Skills             from './components/Skills'
import Experience         from './components/Experience'
import Education          from './components/Education'
import Contact            from './components/Contact'

import AdminLogin         from './admin/AdminLogin'
import AdminLayout        from './admin/AdminLayout'
import Dashboard          from './admin/Dashboard'
import ManageProjects     from './admin/ManageProjects'
import ManageSkills       from './admin/ManageSkills'
import ManageExperience   from './admin/ManageExperience'
import Messages           from './admin/Messages'
import ProtectedRoute     from './admin/ProtectedRoute'
import ManageEducation    from './admin/ManageEducation'

function Portfolio() {
  return (
    <div className="bg-[#0a0a0f] min-h-screen">
      <ParticleBackground />
      <Cursor />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Experience />
      <Education />
      <Contact />
    </div>
  )
}

function App() {

  // 🔥 BACKEND AUTO WAKE-UP (PRO LEVEL UX)
  useEffect(() => {
    let attempts = 0

    const wakeUpServer = async () => {
      try {
        await api.get('/projects') // public API
        console.log('✅ Backend is awake')
      } catch (err) {
        if (attempts < 5) {
          attempts++
          console.log('⏳ Waking up backend... attempt:', attempts)
          setTimeout(wakeUpServer, 3000)
        } else {
          console.log('❌ Backend still sleeping')
        }
      }
    }

    wakeUpServer()
  }, [])

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="projects" element={<ManageProjects />} />
            <Route path="skills" element={<ManageSkills />} />
            <Route path="experience" element={<ManageExperience />} />
            <Route path="education" element={<ManageEducation />} />
            <Route path="messages" element={<Messages />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App