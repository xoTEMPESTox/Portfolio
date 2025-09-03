import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

const Navigation = () => {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/experience', label: 'Experience' },
    { href: '/projects', label: 'Projects' },
    { href: '/hackathons', label: 'Hackathons' },
    { href: '/publications', label: 'Publications' },
    { href: '/resume', label: 'Resume' },
    { href: '/contact', label: 'Contact' }
  ]

  const isActive = (href) => {
    return router.pathname === href
  }

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [router.pathname])

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0.25, 0.75]
      }
    }
  }

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.25, 0.25, 0.75]
      }
    },
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: [0.25, 0.25, 0.25, 0.75],
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const mobileItemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  }

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-white shadow-md'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div
            className="logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="text-2xl font-bold text-blue-600 cursor-pointer">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Portfolio
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex space-x-8">
            {navItems.map((item, index) => (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.3 }}
              >
                <Link href={item.href}>
                  <motion.span
                    className={`relative font-medium transition-all duration-300 cursor-pointer ${
                      isActive(item.href)
                        ? 'text-blue-600'
                        : 'text-gray-800 hover:text-blue-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <motion.div
                        className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600"
                        layoutId="activeTab"
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30
                        }}
                      />
                    )}
                  </motion.span>
                </Link>
              </motion.li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle mobile menu"
          >
            <motion.span
              className="w-6 h-0.5 bg-gray-800 transition-all duration-300"
              animate={{
                rotate: isOpen ? 45 : 0,
                y: isOpen ? 6 : 0
              }}
            />
            <motion.span
              className="w-6 h-0.5 bg-gray-800 transition-all duration-300"
              animate={{
                opacity: isOpen ? 0 : 1
              }}
            />
            <motion.span
              className="w-6 h-0.5 bg-gray-800 transition-all duration-300"
              animate={{
                rotate: isOpen ? -45 : 0,
                y: isOpen ? -6 : 0
              }}
            />
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="lg:hidden overflow-hidden"
            >
              <motion.ul className="py-4 space-y-4">
                {navItems.map((item) => (
                  <motion.li
                    key={item.href}
                    variants={mobileItemVariants}
                  >
                    <Link href={item.href}>
                      <motion.span
                        className={`block py-2 px-4 rounded-lg font-medium transition-all duration-300 cursor-pointer ${
                          isActive(item.href)
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-800 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                        whileHover={{ x: 10 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {item.label}
                      </motion.span>
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navigation
