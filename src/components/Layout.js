import Navigation from './Navigation'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const Layout = ({ children, title = 'Portfolio - Priyanshu Sah' }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Handle route change loading states
  useEffect(() => {
    const handleStart = () => setIsLoading(true)
    const handleComplete = () => setIsLoading(false)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.25, 0.25, 0.75],
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 1.02,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.25, 0.25, 0.75]
      }
    }
  }

  // Loading spinner component
  const LoadingSpinner = () => (
    <motion.div
      className="fixed top-0 left-0 w-full h-1 bg-blue-600 z-50"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      exit={{ scaleX: 0 }}
      style={{ transformOrigin: "left" }}
      transition={{ duration: 0.3 }}
    />
  )

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <meta name="description" content="Portfolio of Priyanshu Sah - Full Stack Developer & AI Enthusiast" />
        <meta name="keywords" content="portfolio, developer, react, nextjs, 3d, web development" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Preload critical fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        
        {/* Performance optimizations */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </Head>
      
      <div className="bg-gray-50 min-h-screen overflow-x-hidden">
        {/* Loading indicator */}
        <AnimatePresence>
          {isLoading && <LoadingSpinner />}
        </AnimatePresence>

        {/* Enhanced Navigation */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Navigation />
        </motion.div>

        {/* Main content with page transitions */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            key={router.asPath}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative"
          >
            {children}
          </motion.main>
        </AnimatePresence>

        {/* Scroll to top button */}
        <ScrollToTop />
      </div>
    </>
  )
}

// Scroll to top button component
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200"
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default Layout