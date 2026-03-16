import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import AnimateOnScroll from './AnimateOnScroll'
import api from '../api/axios'

const colorMap = {
  indigo: 'text-indigo-400',
  cyan:   'text-cyan-400',
  violet: 'text-violet-400',
  green:  'text-green-400',
}

const borderMap = {
  indigo: 'border-indigo-500/20 hover:border-indigo-500/40',
  cyan:   'border-cyan-500/20   hover:border-cyan-500/40',
  violet: 'border-violet-500/20 hover:border-violet-500/40',
  green:  'border-green-500/20  hover:border-green-500/40',
}

function TimelineItem({ item, index }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const textColor   = colorMap[item.color]  || colorMap.indigo
  const borderColor = borderMap[item.color] || borderMap.indigo

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="flex gap-5"
    >
      {/* Dot + line */}
      <div className="flex flex-col items-center flex-shrink-0 pt-1">
        <motion.div
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.3, delay: index * 0.15 + 0.2 }}
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{
            background:  item.dot || '#6366f1',
            boxShadow:  `0 0 10px ${item.dot || '#6366f1'}80`,
          }}
        />
        {/* Connecting line — not shown on last item */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ duration: 0.6, delay: index * 0.15 + 0.3 }}
          className="w-px flex-1 mt-2 origin-top"
          style={{
            background: `linear-gradient(to bottom, ${item.dot || '#6366f1'}60, transparent)`,
            minHeight: '60px',
          }}
        />
      </div>

      {/* Card */}
      <div className={`
        flex-1 mb-10 p-5
        bg-white/[0.02] border ${borderColor}
        rounded-xl transition-all duration-300
        hover:bg-white/[0.04]
      `}>
        <span className={`text-xs font-mono ${textColor} mb-1 block`}>
          {item.year}
        </span>
        <h3 className="text-white font-semibold text-base mb-0.5">
          {item.title}
        </h3>
        <p className={`text-sm mb-3 ${textColor}`}>
          {item.company}
        </p>
        <p className="text-white/40 text-sm leading-relaxed">
          {item.description}
        </p>
      </div>
    </motion.div>
  )
}

function Experience() {
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/experience')
      .then(r => setItems(r.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="experience" className="relative z-10 py-24 px-8 md:px-20">

      <AnimateOnScroll direction="up">
        <div className="flex items-center gap-4 mb-14">
          <span className="text-indigo-400 font-mono text-sm">04.</span>
          <h2 className="text-3xl font-bold text-white">Experience</h2>
          <div className="flex-1 h-px bg-white/10 max-w-xs" />
        </div>
      </AnimateOnScroll>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4 max-w-2xl">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="h-32 bg-white/[0.02] border border-white/[0.05] rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && items.length === 0 && (
        <div className="text-center py-20">
          <div className="text-4xl mb-3 opacity-20">📅</div>
          <p className="text-white/20 text-sm">No experience added yet</p>
        </div>
      )}

      {/* Timeline */}
      {!loading && items.length > 0 && (
        <div className="max-w-2xl">
          {items.map((item, i) => (
            <TimelineItem
              key={item.id}
              item={item}
              index={i}
            />
          ))}
        </div>
      )}

    </section>
  )
}

export default Experience
