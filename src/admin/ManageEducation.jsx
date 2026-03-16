import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/axios'

const empty = {
  year:          '',
  degree:        '',
  institute:     '',
  description:   '',
  score:         '',
  badge:         '',
  icon:          '🎓',
  color:         'indigo',
  accent:        '#6366f1',
  certifications: '',
  order:         0,
}

const colorOptions = [
  { label: 'indigo', accent: '#6366f1', dot: 'bg-indigo-500' },
  { label: 'cyan',   accent: '#06b6d4', dot: 'bg-cyan-500'   },
  { label: 'violet', accent: '#a855f7', dot: 'bg-violet-500' },
  { label: 'green',  accent: '#10b981', dot: 'bg-green-500'  },
]

const colorText = {
  indigo: 'text-indigo-400',
  cyan:   'text-cyan-400',
  violet: 'text-violet-400',
  green:  'text-green-400',
}

const iconOptions = ['🎓', '📚', '🏫', '🏆', '📖', '🖥️', '⚡']

function ManageEducation() {
  const [items,    setItems]    = useState([])
  const [form,     setForm]     = useState(empty)
  const [editId,   setEditId]   = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [message,  setMessage]  = useState('')

  const fetchItems = () =>
    api.get('/education')
      .then(r => setItems(r.data))
      .catch(() => setItems([]))

  useEffect(() => { fetchItems() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const payload = {
      ...form,
      // Convert comma separated string to array for certifications
      certifications: typeof form.certifications === 'string'
        ? form.certifications.split(',').map(c => c.trim()).filter(Boolean)
        : form.certifications,
      order: Number(form.order),
    }

    try {
      if (editId) {
        await api.put(`/education/${editId}`, payload)
        setMessage('Education entry updated successfully')
      } else {
        await api.post('/education', payload)
        setMessage('Education entry added successfully')
      }
      fetchItems()
      setForm(empty)
      setEditId(null)
      setShowForm(false)
    } catch {
      setMessage('Error saving. Check your token.')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item) => {
    setForm({
      year:          item.year          || '',
      degree:        item.degree        || '',
      institute:     item.institute     || '',
      description:   item.description   || '',
      score:         item.score         || '',
      badge:         item.badge         || '',
      icon:          item.icon          || '🎓',
      color:         item.color         || 'indigo',
      accent:        item.accent        || '#6366f1',
      certifications: Array.isArray(item.certifications)
        ? item.certifications.join(', ')
        : '',
      order: item.order || 0,
    })
    setEditId(item.id)
    setShowForm(true)
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this education entry?')) return
    try {
      await api.delete(`/education/${id}`)
      setMessage('Entry deleted')
      fetchItems()
    } catch {
      setMessage('Delete failed')
    }
  }

  const handleCancel = () => {
    setForm(empty)
    setEditId(null)
    setShowForm(false)
    setMessage('')
  }

  const selectColor = (opt) => {
    setForm({ ...form, color: opt.label, accent: opt.accent })
  }

  return (
    <div>

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Education</h1>
          <p className="text-white/30 text-sm">{items.length} entries total</p>
        </div>
        <button
          onClick={() => {
            setForm(empty)
            setEditId(null)
            setMessage('')
            setShowForm(prev => !prev)
          }}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-all"
        >
          {showForm ? '✕ Cancel' : '+ Add Entry'}
        </button>
      </div>

      {/* Success / Error message */}
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

      {/* Form */}
      {showForm && (
        <div className="bg-white/[0.03] border border-indigo-500/20 rounded-xl p-6 mb-8">
          <h2 className="text-white font-semibold text-lg mb-5">
            {editId ? '✏️ Edit Entry' : '➕ New Entry'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Year + Order */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-white/50 text-xs font-medium">
                  Year / Period *
                </label>
                <input
                  required
                  value={form.year}
                  onChange={e => setForm({ ...form, year: e.target.value })}
                  placeholder="e.g. 2020 — 2024"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-white/50 text-xs font-medium">
                  Display Order
                </label>
                <input
                  type="number"
                  value={form.order}
                  onChange={e => setForm({ ...form, order: e.target.value })}
                  placeholder="1"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Degree + Institute */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-white/50 text-xs font-medium">
                  Degree / Title *
                </label>
                <input
                  required
                  value={form.degree}
                  onChange={e => setForm({ ...form, degree: e.target.value })}
                  placeholder="B.Tech — Computer Science"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-white/50 text-xs font-medium">
                  Institute / College *
                </label>
                <input
                  required
                  value={form.institute}
                  onChange={e => setForm({ ...form, institute: e.target.value })}
                  placeholder="XYZ University, Pune"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs font-medium">
                Description
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Describe what you studied, achievements, activities..."
                className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500 transition-all resize-none"
              />
            </div>

            {/* Score + Badge */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-white/50 text-xs font-medium">
                  Score / Grade
                </label>
                <input
                  value={form.score}
                  onChange={e => setForm({ ...form, score: e.target.value })}
                  placeholder="CGPA: 8.2 or Score: 85%"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-white/50 text-xs font-medium">
                  Badge Label
                </label>
                <input
                  value={form.badge}
                  onChange={e => setForm({ ...form, badge: e.target.value })}
                  placeholder="Computer Science"
                  className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs font-medium">
                Certifications (comma separated — leave empty if not a cert card)
              </label>
              <input
                value={form.certifications}
                onChange={e => setForm({ ...form, certifications: e.target.value })}
                placeholder="Java Full Stack — Udemy, Spring Boot Masterclass, React Complete Guide"
                className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Icon picker */}
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs font-medium">Icon</label>
              <div className="flex gap-2 flex-wrap">
                {iconOptions.map(ic => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setForm({ ...form, icon: ic })}
                    className={`
                      w-10 h-10 rounded-lg border text-xl
                      transition-all duration-200
                      ${form.icon === ic
                        ? 'border-indigo-500/60 bg-indigo-500/15'
                        : 'border-white/10 hover:border-white/20'
                      }
                    `}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div className="space-y-1.5">
              <label className="text-white/50 text-xs font-medium">
                Card Color
              </label>
              <div className="flex gap-3 flex-wrap">
                {colorOptions.map(opt => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => selectColor(opt)}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs
                      transition-all duration-200
                      ${form.color === opt.label
                        ? 'border-white/40 text-white bg-white/10'
                        : 'border-white/10 text-white/40 hover:border-white/20'
                      }
                    `}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${opt.dot}`} />
                    {opt.label}
                  </button>
                ))}
              </div>
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
                  : editId ? 'Update Entry' : 'Add Entry'
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

      {/* List */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden">

        <div className="grid grid-cols-[1fr_120px_100px_90px] gap-4 px-5 py-3 border-b border-white/[0.06]">
          <span className="text-white/30 text-xs">Degree</span>
          <span className="text-white/30 text-xs">Year</span>
          <span className="text-white/30 text-xs">Score</span>
          <span className="text-white/30 text-xs">Actions</span>
        </div>

        {items.length === 0 && (
          <div className="px-5 py-14 text-center">
            <div className="text-4xl mb-3 opacity-20">🎓</div>
            <p className="text-white/20 text-sm">No education entries yet</p>
            <p className="text-white/10 text-xs mt-1">
              Click "Add Entry" above to get started
            </p>
          </div>
        )}

        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="grid grid-cols-[1fr_120px_100px_90px] gap-4 px-5 py-4 border-b border-white/[0.04] last:border-0 items-center hover:bg-white/[0.02] transition-colors"
          >
            {/* Degree */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">{item.icon}</span>
                <div className="min-w-0">
                  <p className="text-white text-sm truncate">{item.degree}</p>
                  <p className="text-white/30 text-xs truncate">{item.institute}</p>
                </div>
              </div>
            </div>

            {/* Year */}
            <span className={`text-xs ${colorText[item.color] || 'text-indigo-400'}`}>
              {item.year}
            </span>

            {/* Score */}
            <span className="text-white/30 text-xs">
              {item.score || '—'}
            </span>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="text-xs border border-cyan-500/30 text-cyan-400 px-3 py-1.5 rounded-lg hover:bg-cyan-500/10 transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-xs border border-red-500/30 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all"
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

export default ManageEducation