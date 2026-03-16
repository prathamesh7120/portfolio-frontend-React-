import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/axios'

const empty = {
  name: '', level: 80, category: 'Backend', color: 'indigo'
}

const categories = ['Backend', 'Frontend', 'Database & Tools']
const colors     = ['indigo', 'cyan', 'violet']

const colorDot = {
  indigo: 'bg-indigo-500',
  cyan:   'bg-cyan-500',
  violet: 'bg-violet-500',
}

const colorText = {
  indigo: 'text-indigo-400',
  cyan:   'text-cyan-400',
  violet: 'text-violet-400',
}

const colorBorder = {
  indigo: 'border-indigo-500/30',
  cyan:   'border-cyan-500/30',
  violet: 'border-violet-500/30',
}

function ManageSkills() {
  const [skills,   setSkills]   = useState([])
  const [form,     setForm]     = useState(empty)
  const [editId,   setEditId]   = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading,  setLoading]  = useState(false)

  const fetchSkills = () =>
    api.get('/skills').then(r => setSkills(r.data)).catch(() => {})

  useEffect(() => { fetchSkills() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editId) {
        await api.put(`/skills/${editId}`, form)
      } else {
        await api.post('/skills', form)
      }
      fetchSkills()
      setForm(empty)
      setEditId(null)
      setShowForm(false)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (s) => {
    setForm({ name: s.name, level: s.level, category: s.category, color: s.color })
    setEditId(s.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return
    await api.delete(`/skills/${id}`)
    fetchSkills()
  }

  // Group by category for display
  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat)
    return acc
  }, {})

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Skills</h1>
          <p className="text-white/30 text-sm">{skills.length} skills total</p>
        </div>
        <button
          onClick={() => {
            setForm(empty)
            setEditId(null)
            setShowForm(!showForm)
          }}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm px-5 py-2.5 rounded-lg hover:opacity-90 transition-all"
        >
          {showForm ? 'Cancel' : '+ Add Skill'}
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
                {editId ? 'Edit Skill' : 'New Skill'}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-white/40 text-xs">Skill Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Spring Boot"
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-white/40 text-xs">
                    Level — {form.level}%
                  </label>
                  <input
                    type="range"
                    min="10" max="100" step="5"
                    value={form.level}
                    onChange={e => setForm({ ...form, level: Number(e.target.value) })}
                    className="w-full mt-2 accent-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-white/40 text-xs">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
                  >
                    {categories.map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-white/40 text-xs">Color</label>
                  <div className="flex gap-3 mt-2">
                    {colors.map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setForm({ ...form, color: c })}
                        className={`
                          flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs
                          transition-all duration-200
                          ${form.color === c
                            ? `${colorBorder[c]} ${colorText[c]} bg-white/5`
                            : 'border-white/10 text-white/30'
                          }
                        `}
                      >
                        <span className={`w-2 h-2 rounded-full ${colorDot[c]}`} />
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm px-8 py-2.5 rounded-lg hover:opacity-90 transition-all disabled:opacity-60"
              >
                {loading ? 'Saving...' : editId ? 'Update Skill' : 'Add Skill'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skills grouped by category */}
      <div className="space-y-6">
        {categories.map(cat => (
          <div key={cat}>
            <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">
              {cat}
            </h3>

            {grouped[cat].length === 0 && (
              <div className="text-white/20 text-sm py-3">
                No skills in this category yet
              </div>
            )}

            <div className="space-y-2">
              {grouped[cat].map((skill, i) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.06] rounded-xl px-5 py-3 hover:bg-white/[0.04] transition-all group"
                >
                  {/* Color dot */}
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colorDot[skill.color]}`} />

                  {/* Name */}
                  <span className="text-white text-sm w-36 flex-shrink-0">
                    {skill.name}
                  </span>

                  {/* Progress bar */}
                  <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 0.8, delay: i * 0.05 }}
                      className={`h-full rounded-full ${colorDot[skill.color]}`}
                    />
                  </div>

                  {/* Level */}
                  <span className={`text-xs w-10 text-right flex-shrink-0 ${colorText[skill.color]}`}>
                    {skill.level}%
                  </span>

                  {/* Actions */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="text-xs border border-cyan-500/30 text-cyan-400 px-3 py-1 rounded-lg hover:bg-cyan-500/10 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="text-xs border border-red-500/30 text-red-400 px-3 py-1 rounded-lg hover:bg-red-500/10 transition-all"
                    >
                      Del
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ManageSkills