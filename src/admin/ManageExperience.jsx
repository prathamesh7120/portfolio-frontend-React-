import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/axios'

const empty = {
  year: '', title: '', company: '',
  description: '', color: 'indigo',
  dot: '#6366f1', order: 0
}

const colorOptions = [
  { label: 'indigo', dot: '#6366f1' },
  { label: 'cyan',   dot: '#06b6d4' },
  { label: 'violet', dot: '#a855f7' },
  { label: 'green',  dot: '#10b981' },
]

const colorText = {
  indigo: 'text-indigo-400',
  cyan:   'text-cyan-400',
  violet: 'text-violet-400',
  green:  'text-green-400',
}

function ManageExperience() {
  const [items,    setItems]    = useState([])
  const [form,     setForm]     = useState(empty)
  const [editId,   setEditId]   = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading,  setLoading]  = useState(false)

  const fetchItems = () =>
    api.get('/experience').then(r => setItems(r.data)).catch(() => {})

  useEffect(() => { fetchItems() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editId) {
        await api.put(`/experience/${editId}`, form)
      } else {
        await api.post('/experience', form)
      }
      fetchItems()
      setForm(empty)
      setEditId(null)
      setShowForm(false)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item) => {
    setForm({
      year:        item.year,
      title:       item.title,
      company:     item.company,
      description: item.description,
      color:       item.color,
      dot:         item.dot,
      order:       item.order,
    })
    setEditId(item.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this experience entry?')) return
    await api.delete(`/experience/${id}`)
    fetchItems()
  }

  const selectColor = (opt) => {
    setForm({ ...form, color: opt.label, dot: opt.dot })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Experience</h1>
          <p className="text-white/30 text-sm">{items.length} entries total</p>
        </div>
        <button
          onClick={() => {
            setForm(empty)
            setEditId(null)
            setShowForm(!showForm)
          }}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-all"
        >
          {showForm ? 'Cancel' : '+ Add Entry'}
        </button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-6 space-y-4"
            >
              <h2 className="text-white font-semibold">
                {editId ? 'Edit Entry' : 'New Entry'}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-white/40 text-xs">Year / Period</label>
                  <input
                    required
                    value={form.year}
                    onChange={e => setForm({ ...form, year: e.target.value })}
                    placeholder="e.g. 2024 — Present"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-white/40 text-xs">Display Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={e => setForm({ ...form, order: Number(e.target.value) })}
                    placeholder="1"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-white/40 text-xs">Title / Role</label>
                  <input
                    required
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Java Full Stack Developer"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-white/40 text-xs">Company / Institution</label>
                  <input
                    required
                    value={form.company}
                    onChange={e => setForm({ ...form, company: e.target.value })}
                    placeholder="e.g. ABC Tech / XYZ University"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-white/40 text-xs">Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your role, responsibilities and achievements..."
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
                />
              </div>

              {/* Color picker */}
              <div className="space-y-1.5">
                <label className="text-white/40 text-xs">Accent Color</label>
                <div className="flex gap-3 mt-1">
                  {colorOptions.map(opt => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => selectColor(opt)}
                      className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs
                        transition-all duration-200
                        ${form.color === opt.label
                          ? 'border-white/30 text-white bg-white/5'
                          : 'border-white/10 text-white/30'
                        }
                      `}
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ background: opt.dot,
                                 boxShadow: form.color === opt.label
                                   ? `0 0 8px ${opt.dot}` : 'none' }}
                      />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm px-8 py-2.5 rounded-lg hover:opacity-90 transition-all disabled:opacity-60"
              >
                {loading ? 'Saving...' : editId ? 'Update Entry' : 'Add Entry'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline list */}
      {items.length === 0 && !showForm && (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-12 text-center">
          <div className="text-4xl mb-3 opacity-20">📅</div>
          <p className="text-white/30 text-sm">No experience entries yet</p>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex gap-5 bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 hover:bg-white/[0.04] transition-all group"
          >
            {/* Dot */}
            <div className="flex-shrink-0 mt-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: item.dot,
                         boxShadow: `0 0 8px ${item.dot}60` }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className={`text-xs font-mono mb-0.5 ${colorText[item.color] || 'text-indigo-400'}`}>
                {item.year}
              </div>
              <div className="text-white font-semibold text-sm">{item.title}</div>
              <div className={`text-xs mb-1 ${colorText[item.color] || 'text-indigo-400'}`}>
                {item.company}
              </div>
              <p className="text-white/40 text-xs leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 items-start opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
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

export default ManageExperience