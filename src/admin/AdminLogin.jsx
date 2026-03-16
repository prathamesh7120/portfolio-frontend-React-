import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

function AdminLogin() {
  const [form, setForm]     = useState({ username: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login }           = useAuth()
  const navigate            = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.username, form.password)
      navigate('/admin/dashboard')
    } catch {
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">

      {/* Background blob */}
      <div className="absolute w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl top-20 left-1/2 -translate-x-1/2 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-indigo-400 font-bold text-2xl mb-1">
            Admin <span className="text-cyan-400">Panel</span>
          </div>
          <p className="text-white/30 text-sm">Sign in to manage your portfolio</p>
        </div>

        {/* Form card */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-1.5">
              <label className="text-white/40 text-xs">Username</label>
              <input
                type="text"
                required
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="admin"
                className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500/60 transition-all duration-300"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-white/40 text-xs">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500/60 transition-all duration-300"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-lg py-2">
                {error}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium py-3 rounded-lg shadow-[0_0_20px_#6366f130] hover:shadow-[0_0_30px_#6366f150] transition-all duration-300 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </motion.button>

          </form>
        </div>

        <p className="text-center mt-6">
          <a href="/" className="text-white/20 text-xs hover:text-white/40 transition-colors">
            ← Back to Portfolio
          </a>
        </p>
      </motion.div>
    </div>
  )
}

export default AdminLogin