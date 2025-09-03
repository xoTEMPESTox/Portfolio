import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'

// Individual parallax element component
export function ParallaxElement({ 
  children, 
  speed = 0.5, 
  direction = 'up',
  className = '',
  ...props 
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  // Transform scroll progress to movement
  const yRange = direction === 'up' ? [-100, 100] : [100, -100]
  const y = useTransform(scrollYProgress, [0, 1], yRange.map(val => val * speed))
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      ref={ref}
      style={{ y: smoothY }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Scroll-triggered reveal animation
export function ScrollReveal({ 
  children, 
  delay = 0, 
  duration = 0.6,
  direction = 'up',
  distance = 50,
  className = '',
  ...props 
}) {
  const ref = useRef(null)
  
  const getInitialPosition = () => {
    switch (direction) {
      case 'left': return { x: -distance, y: 0 }
      case 'right': return { x: distance, y: 0 }
      case 'down': return { x: 0, y: -distance }
      default: return { x: 0, y: distance }
    }
  }

  const variants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition()
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.25, 0.25, 0.75]
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Staggered children animation
export function StaggerContainer({ 
  children, 
  staggerDelay = 0.1,
  className = '',
  ...props 
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.25, 0.25, 0.75]
      }
    }
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
      className={className}
      {...props}
    >
      {Array.isArray(children) 
        ? children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : <motion.div variants={itemVariants}>{children}</motion.div>
      }
    </motion.div>
  )
}

// Floating background elements
export function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating circles */}
      <ParallaxElement speed={0.3} direction="up" className="absolute top-20 left-10">
        <motion.div
          className="w-32 h-32 bg-blue-100 rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </ParallaxElement>

      <ParallaxElement speed={0.5} direction="down" className="absolute top-40 right-20">
        <motion.div
          className="w-24 h-24 bg-purple-100 rounded-full opacity-20"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </ParallaxElement>

      <ParallaxElement speed={0.4} direction="up" className="absolute bottom-40 left-1/4">
        <motion.div
          className="w-20 h-20 bg-cyan-100 rounded-full opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 20, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </ParallaxElement>

      {/* Floating geometric shapes */}
      <ParallaxElement speed={0.6} direction="down" className="absolute top-60 right-10">
        <motion.div
          className="w-16 h-16 bg-green-100 opacity-20"
          style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
          animate={{
            rotate: [0, 120, 240, 360]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </ParallaxElement>

      <ParallaxElement speed={0.3} direction="up" className="absolute bottom-20 right-1/3">
        <motion.div
          className="w-12 h-12 bg-yellow-100 opacity-20 transform rotate-45"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [45, 225, 405]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </ParallaxElement>
    </div>
  )
}

// Main parallax section wrapper
export default function ParallaxSection({ 
  children, 
  className = '',
  showFloatingElements = false,
  ...props 
}) {
  return (
    <div className={`relative ${className}`} {...props}>
      {showFloatingElements && <FloatingElements />}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

// Smooth scroll hook for navigation
export function useSmoothScroll() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return { scrollToSection }
}

// Page transition variants
export const pageTransitionVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.25, 0.25, 0.75]
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.25, 0.25, 0.75]
    }
  }
}

// Hover animation variants
export const hoverVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: "easeInOut"
    }
  }
}