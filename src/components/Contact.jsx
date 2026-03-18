import { useState } from 'react'
import { motion } from 'framer-motion'
import AnimateOnScroll from './AnimateOnScroll'
import api from '../api/axios' // ✅ USE THIS

const socials = [
  { label: 'GitHub',   border: 'border-indigo-500/30 hover:border-indigo-500/60 hover:bg-indigo-500/10', text: 'text-indigo-400', link: '#' },
  { label: 'LinkedIn', border: 'border-cyan-500/30   hover:border-cyan-500/60   hover:bg-cyan-500/10',   text: 'text-cyan-400',   link: '#' },
  { label: 'Twitter',  border: 'border-violet-500/30 hover:border-violet-500/60 hover:bg-violet-500/10', text: 'text-violet-400', link: '#' },
  { label: 'Resume',   border: 'border-white/20      hover:border-white/40      hover:bg-white/5',        text: 'text-white/60',   link: '#' },
]

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
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
      // ✅ FIXED: Using api instead of axios + no localhost
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
        setErrMsg('Cannot reach server. Check backend or CORS.')
      } else {
        setErrMsg('Something went wrong. Please try again.')
      }

      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  return (
    <section id="contact" className="relative z-10 py-24 px-8 md:px-20">

      <div className="flex items-center gap-4 mb-6">
        <span className="text-indigo-400 font-mono text-sm">06.</span>
        <h2 className="text-3xl font-bold text-white">Contact</h2>
        <div className="flex-1 h-px bg-white/10 max-w-xs" />
      </div>

      <p className="text-white/40 text-base max-w-lg mb-12 leading-relaxed">
        Open to full-time roles and freelance projects.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">

        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
        <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" required />
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" required />

        {status === 'error' && <p style={{ color: 'red' }}>{errMsg}</p>}

        <button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending...' : 'Send Message'}
        </button>

      </form>
    </section>
  )
}

export default Contact