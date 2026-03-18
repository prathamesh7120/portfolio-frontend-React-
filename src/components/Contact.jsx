import { useState } from 'react'
import { motion } from 'framer-motion'
import AnimateOnScroll from './AnimateOnScroll'
import api from '../api/axios' // ✅ USE YOUR API INSTANCE

const socials = [
  { label: 'GitHub',   border: 'border-indigo-500/30 hover:border-indigo-500/60 hover:bg-indigo-500/10', text: 'text-indigo-400', link: '#' },
  { label: 'LinkedIn', border: 'border-cyan-500/30   hover:border-cyan-500/60   hover:bg-cyan-500/10',   text: 'text-cyan-400',   link: '#' },
  { label: 'Twitter',  border: 'border-violet-500/30 hover:border-violet-500/60 hover:bg-violet-500/10', text: 'text-violet-400', link: '#' },
  { label: 'Resume',   border: 'border-white/20      hover:border-white/40      hover:bg-white/5',        text: 'text-white/60',   link: '#' },
]

function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [status, setStatus] = useState('idle')
  const [errMsg, setErrMsg] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setErrMsg('')

    try {
      // ✅ FIXED: using api instance instead of localhost
      await api.post('/contact', {
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      })

      setStatus('sent')
      setForm({ name: '', email: '', subject: '', message: '' })

      setTimeout(() => setStatus('idle'), 4000)

    } catch (err) {
      setStatus('error')

      if (err.response) {
        setErrMsg(`Server error: ${err.response.status}`)
      } else if (err.request) {
        setErrMsg('Cannot reach server. Check backend deployment.')
      } else {
        setErrMsg('Something went wrong. Please try again.')
      }

      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  return (
    <section id="contact" className="relative z-10 py-24 px-8 md:px-20">

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

        {/* FORM */}
        <AnimateOnScroll direction="left" delay={0.15}>
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Your name" className="input" />
              <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" className="input" />
            </div>

            <input type="text" name="subject" value={form.subject} onChange={handleChange} required placeholder="Subject" className="input" />

            <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Write your message..." className="input" />

            {status === 'error' && (
              <div className="text-red-400 text-xs">⚠️ {errMsg}</div>
            )}

            <motion.button
              type="submit"
              disabled={status === 'sending' || status === 'sent'}
              className="btn"
            >
              {status === 'idle' && 'Send Message →'}
              {status === 'sending' && 'Sending...'}
              {status === 'sent' && '✓ Message Sent'}
              {status === 'error' && '✕ Try Again'}
            </motion.button>

          </form>
        </AnimateOnScroll>

        {/* RIGHT SIDE */}
        <AnimateOnScroll direction="right" delay={0.2}>
          <div className="space-y-6 text-white/60">
            <p>Email: chavanprathamesh813@gmail.com</p>
            <p>Location: Pune, Maharashtra</p>
            <p>Status: Open to opportunities</p>

            <div className="flex gap-2 flex-wrap">
              {socials.map(s => (
                <a key={s.label} href={s.link} className="text-xs border px-4 py-2 rounded-lg">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </AnimateOnScroll>

      </div>
    </section>
  )
}

export default Contact