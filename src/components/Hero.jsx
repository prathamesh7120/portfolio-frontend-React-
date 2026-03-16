import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const roles = [
  'Spring Boot REST APIs',
  'React Web Apps',
  'Full Stack Solutions',
  'MongoDB Backends',
]

function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping]       = useState(true)

  // Typing effect
  useEffect(() => {
    const current = roles[roleIndex]
    if (typing) {
      if (displayed.length < current.length) {
        const t = setTimeout(() =>
          setDisplayed(current.slice(0, displayed.length + 1)), 70)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setTyping(false), 1800)
        return () => clearTimeout(t)
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() =>
          setDisplayed(displayed.slice(0, -1)), 40)
        return () => clearTimeout(t)
      } else {
        setRoleIndex((roleIndex + 1) % roles.length)
        setTyping(true)
      }
    }
  }, [displayed, typing, roleIndex])

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">

      {/* ── Navbar ── */}
      <nav className="flex justify-between items-center px-8 py-5 border-b border-white/5 relative z-10">
        <span className="text-indigo-400 font-bold text-xl tracking-tight">
          PC<span className="text-cyan-400">.</span>
        </span>
        <ul className="hidden md:flex gap-8 text-sm text-white/50">
          {['About', 'Projects', 'Skills', 'Experience','Education', 'Contact'].map(item => (
            <li key={item}>
              
               <a href={`#${item.toLowerCase()}`}
                className="hover:text-white transition-colors duration-300"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
        
          <a href="/admin/login"
          data-cursor
          className="border border-indigo-500/50 text-indigo-400 text-xs px-4 py-2 rounded-md hover:bg-indigo-500/10 transition-all duration-300"
        >
          Admin Panel
        </a>
      </nav>

      {/* ── Background blobs ── */}
      <div className="absolute w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl -top-20 -left-20 pointer-events-none" />
      <div className="absolute w-80 h-80 rounded-full bg-cyan-500/8 blur-3xl bottom-0 right-10 pointer-events-none" />

      {/* ── Hero Body ── */}
      <div className="flex-1 flex items-center px-8 md:px-20 py-10 relative z-10">

        <div className="w-full grid md:grid-cols-2 gap-12 items-center">

          {/* ── LEFT — Text content ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col gap-5"
          >
            {/* Role badge */}
            <div className="flex items-center gap-2 w-fit bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1] animate-pulse" />
              <span className="text-indigo-300 text-xs tracking-wide">
                Java Full Stack Developer
              </span>
            </div>

            {/* Name */}
            <div>
              <p className="text-white/50 text-base mb-1">Hi, I'm</p>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">
                Prathamesh{' '}
                <span className="text-indigo-400">Chavan</span>
              </h1>
            </div>

            {/* Typing row */}
            <div className="flex items-center gap-3 h-9">
              <span className="text-white/60 text-lg">I build</span>
              <div className="bg-cyan-500/10 border border-cyan-500/25 rounded-md px-3 py-1">
                <span className="text-cyan-400 text-base font-medium">
                  {displayed}
                </span>
                <span className="text-cyan-400 animate-pulse">|</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-white/40 text-base leading-relaxed max-w-lg">
              Passionate about crafting scalable web apps with React frontends
              and robust Java backends. Currently seeking my first professional
              opportunity as a Full Stack Developer.
            </p>

            {/* CTA buttons */}
            <div className="flex gap-4">
              
                <a href="#projects"
                data-cursor
                className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium px-6 py-3 rounded-lg hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_#6366f140]"
              >
                View Projects →
              </a>
              
               <a href="https://drive.google.com/file/d/1eZoln65M18ebfq6zAvEE_xT9v4LVi3gy/view?usp=drive_link"
                data-cursor
                className="border border-white/20 text-white/70 text-sm px-6 py-3 rounded-lg hover:border-white/40 hover:text-white transition-all duration-300"
              >
                Download CV
              </a>
            </div>

            {/* Social links */}
            <div className="flex gap-6">
                            {[
              { label: 'GitHub',   href: 'https://github.com/prathamesh7120' },
              { label: 'LinkedIn', href: 'https://www.linkedin.com/in/prathameshchavan11/' },
              { label: 'Twitter',  href: '#' },
            ].map(s => (
              
                <a key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                data-cursor
                className="text-white/30 text-sm border-b border-white/10 pb-0.5 hover:text-white/70 hover:border-white/40 transition-all duration-300"
              >
                {s.label}
              </a>
            ))}
            </div>
          </motion.div>

          {/* ── RIGHT — Photo ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex justify-center items-center"
          >
            <div className="relative">

              {/* Outer glow ring — rotates slowly */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, #6366f1, #06b6d4, #a855f7, #6366f1)',
                  padding: '2px',
                  borderRadius: '50%',
                }}
              />

              {/* Static ring border */}
              <div className="absolute -inset-3 rounded-full border border-indigo-500/20" />
              <div className="absolute -inset-6 rounded-full border border-indigo-500/10" />

              {/* Floating dots around photo */}
              <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1] animate-pulse" />
              <div className="absolute -bottom-3 -left-3 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4] animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-1/2 -right-5 w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_#a855f7] animate-pulse" style={{ animationDelay: '1s' }} />

              {/* Photo container */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-indigo-500/30 shadow-[0_0_40px_#6366f120]">

                {/* ── REPLACE src WITH YOUR ACTUAL PHOTO PATH ── */}
                <img
                  src="/Profile.jpg"
                  alt="Prathamesh Chavan"
                  className="w-full h-full object-cover object-center"
                  onError={e => { e.target.style.display = 'none' }}
                />

                {/* Fallback avatar shown when no photo */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600/20 to-violet-600/20">
                 
                    
                
                  <span className="text-white/40 text-xs"></span>
                  <span className="text-white/20 text-[10px] mt-1">
                    /public/photo.jpg
                  </span>
                </div>

                {/* Overlay gradient at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0a0a0f]/60 to-transparent" />
              </div>

            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2 opacity-30">
        <span className="text-[10px] text-white tracking-[.15em] [writing-mode:vertical-lr]">
          SCROLL
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-indigo-500 to-transparent" />
      </div>

    </section>
  )
}

export default Hero


// ## How to Add Your Actual Photo

// Put your photo inside the `public` folder of your React project:
// ```
// my-portfolio/
// └── public/
//     └── photo.jpg   ← put your photo here