import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../api/axios'

const empty = {
  title: '',
  description: '',
  category: 'Full Stack',
  icon: '⚡',
  color: 'indigo',
  tech: '',
  liveUrl: '',
  githubUrl: '',
  featured: false,
}

function ManageProjects() {
  const [projects, setProjects] = useState([])
  const [form,     setForm]     = useState(empty)
  const [editId,   setEditId]   = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [message,  setMessage]  = useState('')

  const fetchProjects = () => {
    api.get('/projects')
      .then(r => setProjects(r.data))
      .catch(() => setProjects([]))
  }

  useEffect(() => { fetchProjects() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const payload = {
      ...form,
      tech: typeof form.tech === 'string'
        ? form.tech.split(',').map(t => t.trim()).filter(Boolean)
        : form.tech,
    }

    try {
      if (editId) {
        await api.put(`/projects/${editId}`, payload)
        setMessage('Project updated successfully')
      } else {
        await api.post('/projects', payload)
        setMessage('Project created successfully')
      }
      fetchProjects()
      setForm(empty)
      setEditId(null)
      setShowForm(false)
    } catch (err) {
      setMessage('Error saving project. Check your token.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (p) => {
    setForm({
      title:       p.title       || '',
      description: p.description || '',
      category:    p.category    || 'Full Stack',
      icon:        p.icon        || '⚡',
      color:       p.color       || 'indigo',
      tech:        Array.isArray(p.tech) ? p.tech.join(', ') : '',
      liveUrl:     p.liveUrl     || '',
      githubUrl:   p.githubUrl   || '',
      featured:    p.featured    || false,
    })
    setEditId(p.id)
    setShowForm(true)
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return
    try {
      await api.delete(`/projects/${id}`)
      setMessage('Project deleted')
      fetchProjects()
    } catch {
      setMessage('Delete failed. Check your token.')
    }
  }

  const handleCancel = () => {
    setForm(empty)
    setEditId(null)
    setShowForm(false)
    setMessage('')
  }

  return (
    <div>

      {/* ── Header ── */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Projects</h1>
          <p className="text-white/30 text-sm">{projects.length} projects total</p>
        </div>
        <button
          onClick={() => {
            setForm(empty)
            setEditId(null)
            setMessage('')
            setShowForm(prev => !prev)
          }}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-all duration-300"
        >
          {showForm ? '✕ Cancel' : '+ Add Project'}
        </button>
      </div>

      {/* ── Success / Error message ── */}
      {message && (
        <div className={`
          mb-6 px-4 py-3 rounded-lg text-sm border
          ${message.includes('Error') || message.includes('failed')
            ? 'bg-red-500/10 border-red-500/30 text-red-400'
            : 'bg-green-500/10 border-green-500/30 text-green-400'
          }
        `}>
          {message}
        </div>
      )}

      {/* ── Add / Edit Form ── */}
      {showForm && (
        <div className="bg-white/[0.03] border border-indigo-500/20 rounded-xl p-6 mb-8 space-y-5">

          <h2 className="text-white font-semibold text-lg">
            {editId ? '✏️ Edit Project' : '➕ New Project'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Title + Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-white/50 text-xs font-medium">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="E-Commerce Platform"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500 transition-all duration-300"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-white/50 text-xs font-medium">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition-all duration-300"
                >
                  <option value="Full Stack">Full Stack</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs font-medium">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Describe what this project does, the problem it solves..."
                className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500 transition-all duration-300 resize-none"
              />
            </div>

            {/* Tech + Icon */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-white/50 text-xs font-medium">
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  value={form.tech}
                  onChange={e => setForm({ ...form, tech: e.target.value })}
                  placeholder="React, Spring Boot, MongoDB"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500 transition-all duration-300"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-white/50 text-xs font-medium">
                  Icon (emoji)
                </label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={e => setForm({ ...form, icon: e.target.value })}
                  placeholder="⚡"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500 transition-all duration-300"
                />
              </div>
            </div>

            {/* Live URL + GitHub URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-white/50 text-xs font-medium">
                  Live URL
                </label>
                <input
                  type="text"
                  value={form.liveUrl}
                  onChange={e => setForm({ ...form, liveUrl: e.target.value })}
                  placeholder="https://myproject.com"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500 transition-all duration-300"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-white/50 text-xs font-medium">
                  GitHub URL
                </label>
                <input
                  type="text"
                  value={form.githubUrl}
                  onChange={e => setForm({ ...form, githubUrl: e.target.value })}
                  placeholder="https://github.com/you/repo"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500 transition-all duration-300"
                />
              </div>
            </div>

            {/* Color picker */}
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs font-medium">
                Card Color
              </label>
              <div className="flex gap-3">
                {[
                  { value: 'indigo', bg: 'bg-indigo-500', label: 'Indigo' },
                  { value: 'cyan',   bg: 'bg-cyan-500',   label: 'Cyan'   },
                  { value: 'violet', bg: 'bg-violet-500', label: 'Violet' },
                ].map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setForm({ ...form, color: c.value })}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs
                      transition-all duration-200
                      ${form.color === c.value
                        ? 'border-white/40 text-white bg-white/10'
                        : 'border-white/10 text-white/40 hover:border-white/20'
                      }
                    `}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${c.bg}`} />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Featured checkbox */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={form.featured}
                onChange={e => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 accent-indigo-500"
              />
              <label htmlFor="featured" className="text-white/50 text-sm">
                Mark as Featured project
              </label>
            </div>

            {/* Form buttons */}
            <div className="flex gap-3 pt-2">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium px-8 py-2.5 rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
              >
                {loading
                  ? 'Saving...'
                  : editId
                    ? 'Update Project'
                    : 'Create Project'
                }
              </motion.button>
              <button
                type="button"
                onClick={handleCancel}
                className="border border-white/10 text-white/40 text-sm px-6 py-2.5 rounded-lg hover:border-white/20 hover:text-white/60 transition-all"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      )}

      {/* ── Projects Table ── */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">

        {/* Table header */}
        <div className="grid grid-cols-[1fr_110px_130px_100px] gap-4 px-5 py-3 border-b border-white/[0.06]">
          <span className="text-white/30 text-xs">Title</span>
          <span className="text-white/30 text-xs">Category</span>
          <span className="text-white/30 text-xs">Tech</span>
          <span className="text-white/30 text-xs">Actions</span>
        </div>

        {/* Empty state */}
        {projects.length === 0 && (
          <div className="px-5 py-14 text-center">
            <div className="text-4xl mb-3 opacity-20">📁</div>
            <p className="text-white/20 text-sm">No projects yet</p>
            <p className="text-white/10 text-xs mt-1">
              Click "Add Project" above to create your first one
            </p>
          </div>
        )}

        {/* Rows */}
        {projects.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
            className="grid grid-cols-[1fr_110px_130px_100px] gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 items-center hover:bg-white/[0.02] transition-colors"
          >
            {/* Title */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white text-sm truncate">{p.title}</span>
                {p.featured && (
                  <span className="flex-shrink-0 text-[10px] bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 px-2 py-0.5 rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-white/25 text-xs truncate mt-0.5">
                {p.description}
              </p>
            </div>

            {/* Category */}
            <span className="text-white/40 text-xs">{p.category}</span>

            {/* Tech */}
            <span className="text-white/30 text-xs truncate">
              {Array.isArray(p.tech) ? p.tech.slice(0, 2).join(', ') : '—'}
            </span>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(p)}
                className="text-xs border border-cyan-500/30 text-cyan-400 px-3 py-1.5 rounded-lg hover:bg-cyan-500/10 transition-all duration-200"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-xs border border-red-500/30 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all duration-200"
              >
                Del
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ManageProjects