import { useEffect, useRef } from 'react'

function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationId
    let particles = []
    const mouse = { x: -999, y: -999 }

    // ── Canvas size = full window ──
    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Track mouse ──
    const onMouseMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── Particle class ──
    class Particle {
      constructor() {
        this.reset()
      }

      reset() {
        this.x     = Math.random() * canvas.width
        this.y     = Math.random() * canvas.height
        this.vx    = (Math.random() - 0.5) * 0.6
        this.vy    = (Math.random() - 0.5) * 0.6
        this.radius = Math.random() * 1.8 + 0.4
        this.color = ['#6366f1', '#06b6d4', '#a855f7'][
          Math.floor(Math.random() * 3)
        ]
      }

      update() {
        // Mouse repel effect
        const dx   = this.x - mouse.x
        const dy   = this.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 100) {
          this.vx += (dx / dist) * 0.25
          this.vy += (dy / dist) * 0.25
        }

        // Speed limit so particles don't fly off
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
        if (speed > 1.8) {
          this.vx = (this.vx / speed) * 1.8
          this.vy = (this.vy / speed) * 1.8
        }

        this.x += this.vx
        this.y += this.vy

        // Bounce off walls
        if (this.x < 0 || this.x > canvas.width)  this.vx *= -1
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.globalAlpha = 0.85
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }

    // ── Create 80 particles ──
    for (let i = 0; i < 80; i++) {
      particles.push(new Particle())
    }

    // ── Draw lines between nearby particles ──
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x
          const dy   = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = '#6366f1'
            ctx.globalAlpha = (1 - dist / 120) * 0.2
            ctx.lineWidth   = 0.5
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }
    }

    // ── Animation loop ──
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        p.update()
        p.draw()
      })

      drawConnections()
      animationId = requestAnimationFrame(animate)
    }

    animate()

    // ── Cleanup on unmount ──
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
    />
  )
}

export default ParticleBackground