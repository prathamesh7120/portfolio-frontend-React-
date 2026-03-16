import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import AnimateOnScroll from './AnimateOnScroll'
import api from '../api/axios'

const colorMap = {
  indigo: 'bg-indigo-500',
  cyan:   'bg-cyan-500',
  violet: 'bg-violet-500',
}

const borderMap = {
  indigo: 'border-indigo-500/30 hover:border-indigo-500/60',
  cyan:   'border-cyan-500/30   hover:border-cyan-500/60',
  violet: 'border-violet-500/30 hover:border-violet-500/60',
}

const categories = ['Backend', 'Frontend', 'Database & Tools']

function SkillBar({ name, level, color, delay }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const barColor = colorMap[color] || colorMap.indigo

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-white/70">{name}</span>
        <span className="text-white/30">{level}%</span>
      </div>
      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

function Skills() {
  const [skills,  setSkills]  = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/skills')
      .then(r => setSkills(r.data))
      .catch(() => setSkills([]))
      .finally(() => setLoading(false))
  }, [])

  // Group skills by category
  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat)
    return acc
  }, {})

  // Only show categories that have skills
  const activeCategories = categories.filter(
    cat => grouped[cat].length > 0
  )

  return (
    <section id="skills" className="relative z-10 py-24 px-8 md:px-20">

      <AnimateOnScroll direction="up">
        <div className="flex items-center gap-4 mb-16">
          <span className="text-indigo-400 font-mono text-sm">03.</span>
          <h2 className="text-3xl font-bold text-white">Skills</h2>
          <div className="flex-1 h-px bg-white/10 max-w-xs" />
        </div>
      </AnimateOnScroll>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="h-64 bg-white/[0.02] border border-white/[0.05] rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && skills.length === 0 && (
        <div className="text-center py-20">
          <div className="text-4xl mb-3 opacity-20">🛠️</div>
          <p className="text-white/20 text-sm">No skills added yet</p>
        </div>
      )}

      {/* Skills grid */}
      {!loading && skills.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6">
          {activeCategories.map((cat, gi) => (
            <AnimateOnScroll key={cat} direction="up" delay={gi * 0.15}>
              <div className={`
                bg-white/[0.02] border rounded-xl p-6
                transition-all duration-300 space-y-5
                ${borderMap[grouped[cat][0]?.color] || borderMap.indigo}
              `}>
                <h3 className="text-white font-semibold text-base">{cat}</h3>
                {grouped[cat].map((skill, si) => (
                  <SkillBar
                    key={skill.id}
                    name={skill.name}
                    level={skill.level}
                    color={skill.color}
                    delay={gi * 0.15 + si * 0.1}
                  />
                ))}
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      )}

    </section>
  )
}

export default Skills