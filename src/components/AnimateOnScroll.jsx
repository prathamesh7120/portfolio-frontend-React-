import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// direction: 'up' | 'down' | 'left' | 'right' | 'scale'
// delay: number in seconds
// duration: number in seconds

function AnimateOnScroll({
  children,
  direction = 'up',
  delay     = 0,
  duration  = 0.6,
  className = '',
}) {

  const ref     = useRef(null)
  const inView  = useInView(ref, { once: true, margin: '-80px' })

  // Starting hidden state based on direction
  const hiddenMap = {
    up:    { opacity: 0, y: 40 },
    down:  { opacity: 0, y: -40 },
    left:  { opacity: 0, x: -60 },
    right: { opacity: 0, x: 60 },
    scale: { opacity: 0, scale: 0.85 },
  }

  const visibleMap = {
    up:    { opacity: 1, y: 0 },
    down:  { opacity: 1, y: 0 },
    left:  { opacity: 1, x: 0 },
    right: { opacity: 1, x: 0 },
    scale: { opacity: 1, scale: 1 },
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={hiddenMap[direction]}
      animate={inView ? visibleMap[direction] : hiddenMap[direction]}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

export default AnimateOnScroll