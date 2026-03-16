import { useState } from 'react'
import { motion } from 'framer-motion'
import AnimateOnScroll from './AnimateOnScroll'
import axios from 'axios'

const socials = [
  { label: 'GitHub',   border: 'border-indigo-500/30 hover:border-indigo-500/60 hover:bg-indigo-500/10', text: 'text-indigo-400', link: '#' },
  { label: 'LinkedIn', border: 'border-cyan-500/30   hover:border-cyan-500/60   hover:bg-cyan-500/10',   text: 'text-cyan-400',   link: '#' },
  { label: 'Twitter',  border: 'border-violet-500/30 hover:border-violet-500/60 hover:bg-violet-500/10', text: 'text-violet-400', link: '#' },
  { label: 'Resume',   border: 'border-white/20      hover:border-white/40      hover:bg-white/5',        text: 'text-white/60',   link: '#' },
]

function Contact() {
  const [form,   setForm]   = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errMsg, setErrMsg] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setErrMsg('')

    try {
      // Direct axios call — NOT the api instance with JWT
      // Contact form is public so no token needed
      await axios.post('http://localhost:8080/api/contact', {
        name:    form.name,
        email:   form.email,
        subject: form.subject,
        message: form.message,
      })

      setStatus('sent')
      setForm({ name: '', email: '', subject: '', message: '' })

      // Reset back to idle after 4 seconds
      setTimeout(() => setStatus('idle'), 4000)

    } catch (err) {
      setStatus('error')
      if (err.response) {
        setErrMsg(`Server error: ${err.response.status}`)
      } else if (err.request) {
        setErrMsg('Cannot reach server. Is Spring Boot running on port 8080?')
      } else {
        setErrMsg('Something went wrong. Please try again.')
      }
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  return (
    <section id="contact" className="relative z-10 py-24 px-8 md:px-20">

      {/* Heading */}
      <AnimateOnScroll direction="up">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-indigo-400 font-mono text-sm">06.</span>
          <h2 className="text-3xl font-bold text-white">Contact</h2>
          <div className="flex-1 h-px bg-white/10 max-w-xs" />
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll direction="up" delay={0.1}>
        <p className="text-white/40 text-base max-w-lg mb-12 leading-relaxed">
          Open to full-time roles and freelance projects. Drop a message
          and I'll get back within 24 hours.
        </p>
      </AnimateOnScroll>

      <div className="grid md:grid-cols-2 gap-12 items-start">

        {/* Left — form */}
        <AnimateOnScroll direction="left" delay={0.15}>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name + Email */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-white/40 text-xs">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all duration-300"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-white/40 text-xs">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all duration-300"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-white/40 text-xs">Subject</label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                placeholder="Job opportunity / Project collaboration"
                className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all duration-300"
              />
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <label className="text-white/40 text-xs">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Write your message here..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all duration-300 resize-none"
              />
            </div>

            {/* Error message */}
            {status === 'error' && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-lg">
                ⚠️ {errMsg}
              </div>
            )}

            {/* Submit button */}
            <motion.button
              type="submit"
              data-cursor
              disabled={status === 'sending' || status === 'sent'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full py-3 rounded-lg text-sm font-medium
                transition-all duration-300
                ${status === 'sent'
                  ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                  : status === 'error'
                    ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                    : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_0_20px_#6366f130] hover:shadow-[0_0_30px_#6366f150]'
                }
              `}
            >
              {status === 'idle'    && 'Send Message →'}
              {status === 'sending' && 'Sending...'}
              {status === 'sent'    && '✓ Message Sent Successfully!'}
              {status === 'error'   && '✕ Failed — Try Again'}
            </motion.button>

          </form>
        </AnimateOnScroll>

        {/* Right — info + socials */}
        <AnimateOnScroll direction="right" delay={0.2}>
          <div className="space-y-8">

            {/* Info cards */}
            <div className="space-y-3">
              {[
                { label: 'Email',    value: 'prathamesh@email.com', color: 'text-indigo-400' },
                { label: 'Location', value: 'Pune, Maharashtra',     color: 'text-cyan-400'   },
                { label: 'Status',   value: 'Open to opportunities', color: 'text-green-400'  },
              ].map(info => (
                <div
                  key={info.label}
                  className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.06] rounded-xl px-5 py-4"
                >
                  <span className="text-white/30 text-xs w-16">{info.label}</span>
                  <span className={`text-sm ${info.color}`}>{info.value}</span>
                </div>
              ))}
            </div>

            {/* Social buttons */}
            <div>
              <p className="text-white/30 text-xs mb-3">Find me on</p>
              <div className="flex flex-wrap gap-2">
                {socials.map(s => (
                  
                    <a key={s.label}
                    href={s.link}
                    data-cursor
                    className={`text-xs border px-4 py-2 rounded-lg transition-all duration-300 ${s.border} ${s.text}`}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

          </div>
        </AnimateOnScroll>
      </div>

      {/* Footer */}
      <AnimateOnScroll direction="up" delay={0.2}>
        <div className="mt-24 pt-8 border-t border-white/[0.06] text-center">
          <p className="text-white/20 text-sm">
            Designed & Built by{' '}
            <span className="text-indigo-400">Prathamesh Chavan</span>
            {' '}— React + Spring Boot + MongoDB
          </p>
        </div>
      </AnimateOnScroll>

    </section>
  )
}

export default Contact