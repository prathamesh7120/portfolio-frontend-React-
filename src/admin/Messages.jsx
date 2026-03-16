import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../api/axios'

function Messages() {
  const [messages,  setMessages]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [selected,  setSelected]  = useState(null)

  useEffect(() => {
    api.get('/contact')
      .then(r => {
        setMessages(r.data)
        setError('')
      })
      .catch(err => {
        if (err.response?.status === 401) {
          setError('Session expired. Please login again.')
        } else if (err.response?.status === 403) {
          setError('Access denied. Admin token required.')
        } else {
          setError('Could not load messages. Is Spring Boot running?')
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return
    try {
      await api.delete(`/contact/${id}`)
      setMessages(prev => prev.filter(m => m.id !== id))
      if (selected?.id === id) setSelected(null)
    } catch {
      alert('Delete failed. Check your token.')
    }
  }

  // Format date safely
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day:   '2-digit',
        month: 'short',
        year:  'numeric',
      })
    } catch {
      return 'N/A'
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Messages</h1>
      <p className="text-white/30 text-sm mb-8">
        {loading ? 'Loading...' : `${messages.length} message${messages.length !== 1 ? 's' : ''} received`}
      </p>

      {/* Error state */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-5 py-4 rounded-xl mb-6 flex items-center gap-3">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="font-medium">Failed to load messages</p>
            <p className="text-red-400/70 text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="h-20 bg-white/[0.02] border border-white/[0.05] rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && messages.length === 0 && (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-16 text-center">
          <div className="text-5xl mb-4 opacity-20">📭</div>
          <p className="text-white/30 text-base">No messages yet</p>
          <p className="text-white/15 text-xs mt-2">
            Messages sent from your contact form will appear here
          </p>
        </div>
      )}

      {/* Messages layout */}
      {!loading && !error && messages.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">

          {/* Left — list */}
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setSelected(msg)}
                className={`
                  p-4 rounded-xl border cursor-pointer
                  transition-all duration-200 select-none
                  ${selected?.id === msg.id
                    ? 'bg-indigo-500/10 border-indigo-500/40'
                    : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/10'
                  }
                `}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <span className="text-white text-sm font-medium">
                    {msg.name || 'Unknown'}
                  </span>
                  <span className="text-white/20 text-xs flex-shrink-0 ml-2">
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
                <div className="text-indigo-400 text-xs mb-1.5">
                  {msg.email || 'No email'}
                </div>
                <div className="text-white/40 text-xs truncate">
                  {msg.subject || 'No subject'}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right — detail */}
          <div>
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-6 sticky top-8"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="text-white font-semibold text-base mb-0.5">
                      {selected.name}
                    </h3>
                    
                     <a href={`mailto:${selected.email}`}
                      className="text-indigo-400 text-xs hover:text-indigo-300 transition-colors"
                    >
                      {selected.email}
                    </a>
                  </div>
                  <button
                    onClick={() => handleDelete(selected.id)}
                    className="text-xs border border-red-500/30 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-all flex-shrink-0"
                  >
                    Delete
                  </button>
                </div>

                {/* Date */}
                <div className="text-white/20 text-xs mb-4">
                  Received on {formatDate(selected.createdAt)}
                </div>

                {/* Subject */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-3 mb-3">
                  <div className="text-white/30 text-xs mb-1">Subject</div>
                  <div className="text-white text-sm">
                    {selected.subject || 'No subject'}
                  </div>
                </div>

                {/* Message body */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg px-4 py-3 mb-5">
                  <div className="text-white/30 text-xs mb-1">Message</div>
                  <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                    {selected.message || 'No message content'}
                  </p>
                </div>

                {/* Reply button */}
                
                  <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="block w-full text-center bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium py-2.5 rounded-lg hover:opacity-90 transition-all"
                >
                  Reply via Email
                </a>
              </motion.div>
            ) : (
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-10 text-center sticky top-8">
                <div className="text-3xl mb-3 opacity-20">👈</div>
                <p className="text-white/20 text-sm">
                  Select a message to read it
                </p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}

export default Messages