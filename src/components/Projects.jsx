import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimateOnScroll from './AnimateOnScroll'
import api from '../api/axios'

const filters = ['All', 'Full Stack', 'Frontend', 'Backend']

const cardStyle = {
  indigo: {
    border: 'border-indigo-500/20 hover:border-indigo-500/50',
    bg:     'from-indigo-600/8 to-violet-600/5',
    imgBg:  'from-indigo-600/15 to-violet-600/10',
    pill:   'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
    btn:    'border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10',
    glow:   'hover:shadow-[0_0_30px_#6366f115]',
  },
  cyan: {
    border: 'border-cyan-500/20 hover:border-cyan-500/50',
    bg:     'from-cyan-600/8 to-teal-600/5',
    imgBg:  'from-cyan-600/15 to-teal-600/10',
    pill:   'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
    btn:    'border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10',
    glow:   'hover:shadow-[0_0_30px_#06b6d415]',
  },
  violet: {
    border: 'border-violet-500/20 hover:border-violet-500/50',
    bg:     'from-violet-600/8 to-purple-600/5',
    imgBg:  'from-violet-600/15 to-purple-600/10',
    pill:   'bg-violet-500/10 border-violet-500/30 text-violet-300',
    btn:    'border-violet-500/40 text-violet-400 hover:bg-violet-500/10',
    glow:   'hover:shadow-[0_0_30px_#a855f715]',
  },
}

// Fallback style if color not found
const defaultStyle = cardStyle.indigo

function ProjectCard({ project, index }) {
  const s = cardStyle[project.color] || defaultStyle

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={`
        bg-gradient-to-br ${s.bg}
        border ${s.border} ${s.glow}
        rounded-xl overflow-hidden
        transition-all duration-300 group
        flex flex-col
      `}
    >
      {/* Icon area */}
      <div className={`
        h-36 bg-gradient-to-br ${s.imgBg}
        flex items-center justify-center
        border-b border-white/[0.05]
        relative overflow-hidden
      `}>
        <span className="text-5xl opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500">
          {project.icon || '⚡'}
        </span>
        {project.featured && (
          <div className="absolute top-3 right-3 bg-indigo-500 text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
            Featured
          </div>
        )}
        <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="text-white font-semibold text-base mb-1.5">
            {project.title}
          </h3>
          <p className="text-white/40 text-sm leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech pills */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
          {(project.tech || []).map(t => (
            <span
              key={t}
              className={`text-[10px] border px-2 py-0.5 rounded-full ${s.pill}`}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-1">
          
            <a href={project.liveUrl || '#'}
            target="_blank"
            rel="noreferrer"
            className={`flex-1 text-center text-xs border rounded-lg py-2 transition-all duration-300 ${s.btn}`}
          >
            Live Demo {'↗'}
          </a>
          
            <a href={project.githubUrl || '#'}
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-center text-xs border border-white/10 text-white/40 rounded-lg py-2 hover:border-white/25 hover:text-white/60 transition-all duration-300"
          >
            GitHub
          </a>
        </div>
      </div>
    </motion.div>
  )
}

function Projects() {
  const [projects, setProjects] = useState([])
  const [active,   setActive]   = useState('All')
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    api.get('/projects')
      .then(r => setProjects(r.data))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = active === 'All'
    ? projects
    : projects.filter(p => p.category === active)

  return (
    <section id="projects" className="relative z-10 py-24 px-8 md:px-20">

      <AnimateOnScroll direction="up">
        <div className="flex items-center gap-4 mb-10">
          <span className="text-indigo-400 font-mono text-sm">02.</span>
          <h2 className="text-3xl font-bold text-white">Projects</h2>
          <div className="flex-1 h-px bg-white/10 max-w-xs" />
        </div>
      </AnimateOnScroll>

      {/* Filter tabs */}
      <AnimateOnScroll direction="up" delay={0.1}>
        <div className="flex gap-2 flex-wrap mb-10">
          {filters.map(f => (
            <button
              key={f}
              data-cursor
              onClick={() => setActive(f)}
              className={`
                text-xs px-4 py-2 rounded-full border transition-all duration-300
                ${active === f
                  ? 'bg-indigo-500 border-indigo-500 text-white shadow-[0_0_15px_#6366f140]'
                  : 'border-white/15 text-white/40 hover:border-white/30 hover:text-white/70'
                }
              `}
            >
              {f}
            </button>
          ))}
        </div>
      </AnimateOnScroll>

      {/* Loading state */}
      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="h-72 bg-white/[0.02] border border-white/[0.05] rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && projects.length === 0 && (
        <div className="text-center py-20">
          <div className="text-4xl mb-3 opacity-20">📁</div>
          <p className="text-white/20 text-sm">No projects added yet</p>
        </div>
      )}

      {/* Cards */}
      {!loading && (
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

    </section>
  )
}

export default Projects