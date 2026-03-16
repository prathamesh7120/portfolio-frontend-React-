import { useEffect, useRef } from 'react'

function Cursor() {
  const dotRef   = useRef(null)
  const ringRef  = useRef(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current

    let mouseX = 0, mouseY = 0
    let ringX  = 0, ringY  = 0

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      // dot follows instantly
      dot.style.left = mouseX + 'px'
      dot.style.top  = mouseY + 'px'
    }

    // ring follows with lag (smooth trailing effect)
    const animate = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12

      ring.style.left = ringX + 'px'
      ring.style.top  = ringY + 'px'

      requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMouseMove)
    animate()

    // Hover effect — ring grows on links/buttons
    const addHover = () => ring.classList.add('scale-[2.5]', 'border-indigo-400')
    const removeHover = () => ring.classList.remove('scale-[2.5]', 'border-indigo-400')

    document.querySelectorAll('a, button, [data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', removeHover)
    })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <>
      {/* Small filled dot */}
      <div
        ref={dotRef}
        className="fixed w-2 h-2 bg-indigo-500 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#6366f1]"
        style={{ transition: 'none' }}
      />

      {/* Trailing ring */}
      <div
        ref={ringRef}
        className="fixed w-8 h-8 border border-indigo-400/50 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
      />
    </>
  )
}

export default Cursor