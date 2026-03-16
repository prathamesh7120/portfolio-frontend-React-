import AnimateOnScroll from './AnimateOnScroll'

const stats = [
  { number: '10+',  label: 'Projects Built'     },
  { number: '6+',   label: 'Months Experience'  },
  { number: '5+',   label: 'Tech Stacks'        },
  { number: '100%', label: 'Passion for Code'   },
]

function About() {
  return (
    <section id="about" className="relative z-10 py-24 px-8 md:px-20">

      {/* Section heading */}
      <AnimateOnScroll direction="up">
        <div className="flex items-center gap-4 mb-16">
          <span className="text-indigo-400 font-mono text-sm">01.</span>
          <h2 className="text-3xl font-bold text-white">About Me</h2>
          <div className="flex-1 h-px bg-white/10 max-w-xs" />
        </div>
      </AnimateOnScroll>

      <div className="grid md:grid-cols-2 gap-16 items-center">

        {/* Left — text */}
        <AnimateOnScroll direction="left" delay={0.1}>
          <div className="space-y-5">
            <p className="text-white/60 text-base leading-relaxed">
              I'm a passionate <span className="text-indigo-400 font-medium">Java Full Stack Developer</span> who
              loves turning ideas into real, scalable web applications. I work with
              React on the frontend and Spring Boot on the backend.
            </p>
            <p className="text-white/60 text-base leading-relaxed">
              Currently focused on building projects that demonstrate clean architecture,
              RESTful API design, and modern UI/UX principles. I believe great software
              is both technically solid <span className="text-cyan-400">and</span> visually delightful.
            </p>
            <p className="text-white/60 text-base leading-relaxed">
              When I'm not coding, I'm learning — whether that's a new design pattern,
              a new library, or improving my problem-solving on LeetCode.
            </p>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {['Java', 'Spring Boot', 'React', 'MongoDB', 'Tailwind CSS', 'REST APIs', 'JWT', 'Git'].map(tech => (
                <span
                  key={tech}
                  className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </AnimateOnScroll>

        {/* Right — stats grid */}
        <AnimateOnScroll direction="right" delay={0.2}>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, i) => (
              <AnimateOnScroll key={stat.label} direction="scale" delay={0.2 + i * 0.08}>
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-6 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all duration-300 group">
                  <div className="text-3xl font-bold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                    {stat.number}
                  </div>
                  <div className="text-white/40 text-sm mt-1">{stat.label}</div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </AnimateOnScroll>

      </div>
    </section>
  )
}

export default About