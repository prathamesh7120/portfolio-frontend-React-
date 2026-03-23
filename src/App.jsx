import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import api from './api/axios'

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

  // ✅ SMART BACKEND LOADER
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    let timer = setTimeout(() => {
      setShowLoader(true) // show only if backend slow
    }, 2500)

    api.get('/projects')
      .then(() => {
        clearTimeout(timer)
        setShowLoader(false)
        console.log('✅ Backend ready')
      })
      .catch(() => {
        console.log('⏳ Backend waking...')
      })

  }, [])

  return (
    <AuthProvider>
      <BrowserRouter>

        {/* 🔥 SHOW ONLY IF SLOW */}
        {showLoader && (
          <div className="fixed top-0 left-0 w-full z-50 text-center">
            <div className="bg-yellow-500/10 border-b border-yellow-500/30 text-yellow-400 text-xs py-2">
              🚀 Backend is starting... please wait a few seconds
            </div>
          </div>
        )}

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