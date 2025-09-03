import Layout from '../components/Layout'
import Link from 'next/link'
import { motion } from 'framer-motion'
import personalData from '../data/personal.json'
import skillsData from '../data/skills.json'
import StatsSection from '../components/StatsSection'
import Hero3D from '../components/Hero3D'
import SkillsCloud3D from '../components/SkillsCloud3D'
import GamificationLayer from '../components/GamificationLayer'
import BlogFeed from '../components/BlogFeed'
import ParallaxSection, {
  ScrollReveal,
  StaggerContainer,
  ParallaxElement,
  pageTransitionVariants,
  hoverVariants
} from '../components/ParallaxSection'

export default function Home() {
  return (
    <Layout title="Portfolio - Priyanshu Sah">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransitionVariants}
      >
        {/* 3D Hero Section */}
        <Hero3D>
          <section id="hero" className="min-h-screen flex items-center justify-center pt-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <ScrollReveal delay={0.2}>
                <div className="hero-content max-w-4xl mx-auto">
                  <motion.h1
                    className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    Hi, I&apos;m <span className="text-blue-600 dark:text-blue-400">{personalData.name}</span>
                  </motion.h1>
                  <motion.p
                    className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    {personalData.tagline}
                  </motion.p>
                  <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                  >
                    <motion.div
                      variants={hoverVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Link href="/resume" className="btn btn-primary w-full sm:w-auto">
                        View Resume
                      </Link>
                    </motion.div>
                    <motion.div
                      variants={hoverVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Link href="/contact" className="btn btn-outline w-full sm:w-auto">
                        Contact Me
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </ScrollReveal>
            </div>
          </section>
        </Hero3D>

        {/* Quick Stats Section with Parallax */}
        <ParallaxSection showFloatingElements={true}>
          <section className="py-16 bg-white dark:bg-gray-800 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal delay={0.2}>
                <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
                  Quick Overview
                </h2>
              </ScrollReveal>
              
              <StaggerContainer staggerDelay={0.2}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
                  <ParallaxElement speed={0.3} direction="up">
                    <motion.div
                      className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                      variants={hoverVariants}
                      whileHover="hover"
                    >
                      <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{personalData.stats.projectsCompleted}</h3>
                      <p className="text-gray-600 dark:text-gray-300">Projects Completed</p>
                    </motion.div>
                  </ParallaxElement>
                  
                  <ParallaxElement speed={0.4} direction="up">
                    <motion.div
                      className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                      variants={hoverVariants}
                      whileHover="hover"
                    >
                      <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{personalData.stats.yearsExperience}</h3>
                      <p className="text-gray-600 dark:text-gray-300">Years Experience</p>
                    </motion.div>
                  </ParallaxElement>
                  
                  <ParallaxElement speed={0.5} direction="up">
                    <motion.div
                      className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                      variants={hoverVariants}
                      whileHover="hover"
                    >
                      <h3 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{personalData.stats.technologiesMastered}</h3>
                      <p className="text-gray-600 dark:text-gray-300">Technologies Mastered</p>
                    </motion.div>
                  </ParallaxElement>
                </div>
              </StaggerContainer>
            </div>
          </section>
        </ParallaxSection>

        {/* Gamification Layer */}
        <ParallaxSection>
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal>
                <GamificationLayer />
              </ScrollReveal>
            </div>
          </section>
        </ParallaxSection>

        {/* 3D Skills Cloud Section */}
        <SkillsCloud3D skills={skillsData.skills} />

        {/* Blog Feed Section */}
        <ParallaxSection>
          <section className="py-16 bg-white dark:bg-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal>
                <BlogFeed />
              </ScrollReveal>
            </div>
          </section>
        </ParallaxSection>

        {/* Live Stats Section with Parallax */}
        <ParallaxSection>
          <section className="py-16 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <ScrollReveal>
                <StatsSection />
              </ScrollReveal>
            </div>
          </section>
        </ParallaxSection>
      </motion.div>
    </Layout>
  )
}