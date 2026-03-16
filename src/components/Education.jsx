import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import AnimateOnScroll from './AnimateOnScroll'
import axios from 'axios'

const styleMap = {
  indigo: {
    border: 'border-indigo-500/25 hover:border-indigo-500/50',
    bg:     'from-indigo-600/8 to-violet-600/5',
    bar:    'from-indigo-500 to-violet-500',
    year:   'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
    inst:   'text-indigo-400',
    pill:   'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
    glow:   'hover:shadow-[0_0_25px_#6366f115]',
  },
  cyan: {
    border: 'border-cyan-500/25 hover:border-cyan-500/50',
    bg:     'from-cyan-600/8 to-teal-600/5',
    bar:    'from-cyan-500 to-teal-500',
    year:   'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
    inst:   'text-cyan-400',
    pill:   'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
    glow:   'hover:shadow-[0_0_25px_#06b6d415]',
  },
  violet: {
    border: 'border-violet-500/25 hover:border-violet-500/50',
    bg:     'from-violet-600/8 to-purple-600/5',
    bar:    'from-violet-500 to-purple-500',
    year:   'bg-violet-500/15 border-violet-500/30 text-violet-300',
    inst:   'text-violet-400',
    pill:   'bg-violet-500/10 border-violet-500/30 text-violet-300',
    glow:   'hover:shadow-[0_0_25px_#a855f715]',
  },
  green: {
    border: 'border-green-500/25 hover:border-green-500/50',
    bg:     'from-green-600/8 to-emerald-600/5',
    bar:    'from-green-500 to-emerald-500',
    year:   'bg-green-500/15 border-green-500/30 text-green-300',
    inst:   'text-green-400',
    pill:   'bg-green-500/10 border-green-500/30 text-green-300',
    glow:   'hover:shadow-[0_0_25px_#10b98115]',
  },
}

const defaultStyle = styleMap.indigo

function EducationCard({ item, index }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const s      = styleMap[item.color] || defaultStyle

  const isCertCard = Array.isArray(item.certifications) &&
                     item.certifications.length > 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className={`
        relative bg-gradient-to-br ${s.bg}
        border ${s.border} ${s.glow}
        rounded-xl p-6 overflow-hidden
        transition-all duration-300 group
      `}
    >
      {/* Left accent bar */}
      <div
        className={`absolute top-0 left-0 w-[3px] h-full rounded-l-xl bg-gradient-to-b ${s.bar}`}
      />

      <div className="pl-3">

        {/* Top row */}
        <div className="flex justify-between items-start mb-4">
          <span className={`text-xs border px-3 py-1 rounded-full ${s.year}`}>
            {item.year}
          </span>
          <span className="text-3xl opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-500">
            {item.icon || '🎓'}
          </span>
        </div>

        {/* Degree */}
        <h3 className="text-white font-semibold text-base mb-1">
          {item.degree}
        </h3>

        {/* Institute */}
        <p className={`text-sm mb-3 ${s.inst}`}>
          {item.institute}
        </p>

        {/* Description */}
        {item.description && (
          <p className="text-white/40 text-sm leading-relaxed mb-4">
            {item.description}
          </p>
        )}

        {/* Pills for normal education */}
        {!isCertCard && (item.score || item.badge) && (
          <div className="flex flex-wrap gap-2">
            {item.score && (
              <span className={`text-xs border px-2.5 py-0.5 rounded-full ${s.pill}`}>
                {item.score}
              </span>
            )}
            {item.badge && (
              <span className={`text-xs border px-2.5 py-0.5 rounded-full ${s.pill}`}>
                {item.badge}
              </span>
            )}
          </div>
        )}

        {/* Certifications list */}
        {isCertCard && (
          <div className="space-y-3">
            {item.certifications.map((cert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.12 + i * 0.08 }}
                className="flex items-center gap-2.5"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    background:  item.accent || '#10b981',
                    boxShadow:  `0 0 6px ${item.accent || '#10b981'}`,
                  }}
                />
                <span className="text-white/60 text-sm">{cert}</span>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </motion.div>
  )
}

function Education() {
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  useEffect(() => {
    // Use plain axios — NOT the JWT api instance
  axios.get((import.meta.env.VITE_API_URL || 'http://localhost:8080') + '/api/education')
      .then(r => {
        setItems(r.data)
        setError('')
      })
      .catch(err => {
        console.error('Education fetch error:', err)
        setError('Could not load education data')
        setItems([])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="education" className="relative z-10 py-24 px-8 md:px-20">

      <AnimateOnScroll direction="up">
        <div className="flex items-center gap-4 mb-14">
          <span className="text-indigo-400 font-mono text-sm">05.</span>
          <h2 className="text-3xl font-bold text-white">Education</h2>
          <div className="flex-1 h-px bg-white/10 max-w-xs" />
        </div>
      </AnimateOnScroll>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="h-52 bg-white/[0.02] border border-white/[0.05] rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="text-center py-20">
          <div className="text-4xl mb-3 opacity-20">⚠️</div>
          <p className="text-white/20 text-sm">{error}</p>
          <p className="text-white/10 text-xs mt-1">
            Make sure Spring Boot is running on port 8080
          </p>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && items.length === 0 && (
        <div className="text-center py-20">
          <div className="text-4xl mb-3 opacity-20">🎓</div>
          <p className="text-white/20 text-sm">No education entries yet</p>
          <p className="text-white/10 text-xs mt-1">
            Add from Admin Panel → Education
          </p>
        </div>
      )}

      {/* Cards grid */}
      {!loading && !error && items.length > 0 && (
        <div className="grid md:grid-cols-2 gap-5">
          {items.map((item, i) => (
            <EducationCard key={item.id} item={item} index={i} />
          ))}
        </div>
      )}

    </section>
  )
}

export default Education