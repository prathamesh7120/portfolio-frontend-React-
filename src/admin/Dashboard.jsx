import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import api from '../api/axios'

function Dashboard() {
  const [counts, setCounts] = useState({
    projects:  0,
    messages:  0,
    skills:    0,
    experience: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [projects, messages, skills, experience] = await Promise.allSettled([
          api.get('/projects'),
          api.get('/contact'),
          api.get('/skills'),
          api.get('/experience'),
        ])

        setCounts({
          projects:   projects.status   === 'fulfilled' ? projects.value.data.length   : 0,
          messages:   messages.status   === 'fulfilled' ? messages.value.data.length   : 0,
          skills:     skills.status     === 'fulfilled' ? skills.value.data.length     : 0,
          experience: experience.status === 'fulfilled' ? experience.value.data.length : 0,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  const statCards = [
    {
      label: 'Total Projects',
      value: counts.projects,
      color: 'text-indigo-400',
      border: 'border-indigo-500/20',
      bg:    'bg-indigo-500/5',
      to:    '/admin/projects',
    },
    {
      label: 'Tech Skills',
      value: counts.skills,
      color: 'text-cyan-400',
      border: 'border-cyan-500/20',
      bg:    'bg-cyan-500/5',
      to:    '/admin/skills',
    },
    {
      label: 'Experience',
      value: counts.experience,
      color: 'text-green-400',
      border: 'border-green-500/20',
      bg:    'bg-green-500/5',
      to:    '/admin/experience',
    },
    {
      label: 'Messages',
      value: counts.messages,
      color: 'text-violet-400',
      border: 'border-violet-500/20',
      bg:    'bg-violet-500/5',
      to:    '/admin/messages',
    },
  ]

  const quickActions = [
    { label: 'Add New Project', to: '/admin/projects',  color: 'border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10' },
    { label: 'Add Skill',       to: '/admin/skills',    color: 'border-cyan-500/40   text-cyan-400   hover:bg-cyan-500/10'   },
    { label: 'Add Experience',  to: '/admin/experience',color: 'border-green-500/40  text-green-400  hover:bg-green-500/10'  },
    { label: 'View Messages',   to: '/admin/messages',  color: 'border-violet-500/40 text-violet-400 hover:bg-violet-500/10' },
    { label: 'View Portfolio',  to: '/',                color: 'border-white/20      text-white/50   hover:bg-white/5'        },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
      <p className="text-white/30 text-sm mb-8">Welcome back, admin</p>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {statCards.map((s, i) => (
          <Link to={s.to} key={s.label}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`
                ${s.bg} border ${s.border} rounded-xl p-5
                hover:scale-[1.03] transition-transform duration-200 cursor-pointer
              `}
            >
              <div className="text-white/30 text-xs mb-2">{s.label}</div>
              {loading ? (
                <div className="h-8 w-12 bg-white/10 rounded animate-pulse" />
              ) : (
                <div className={`text-3xl font-bold ${s.color}`}>
                  {s.value}
                </div>
              )}
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Summary row */}
      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-6 py-4 mb-6 flex flex-wrap gap-6"
        >
          <div className="text-sm text-white/40">
            Portfolio has{' '}
            <span className="text-indigo-400 font-medium">{counts.projects} projects</span>
            {', '}
            <span className="text-cyan-400 font-medium">{counts.skills} skills</span>
            {' and '}
            <span className="text-green-400 font-medium">{counts.experience} experience entries</span>
            {' live right now.'}
          </div>
        </motion.div>
      )}

      {/* Quick actions */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6">
        <h2 className="text-white font-semibold text-base mb-4">Quick Actions</h2>
        <div className="flex gap-3 flex-wrap">
          {quickActions.map(a => (
            <Link
              key={a.label}
              to={a.to}
              className={`
                text-sm border px-5 py-2.5 rounded-lg
                transition-all duration-300 ${a.color}
              `}
            >
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard