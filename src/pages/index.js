import Layout from '../components/Layout'
import Link from 'next/link'
import personalData from '../data/personal.json'
import StatsSection from '../components/StatsSection'

export default function Home() {
  return (
    <Layout title="Portfolio - Priyanshu Sah">
      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="hero-content max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Hi, I&apos;m <span className="text-blue-600">{personalData.name}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              {personalData.tagline}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/resume" className="btn btn-primary w-full sm:w-auto">
                View Resume
              </Link>
              <Link href="/contact" className="btn btn-outline w-full sm:w-auto">
                Contact Me
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-gray-50 rounded-lg shadow-md">
              <h3 className="text-3xl font-bold text-blue-600 mb-2">{personalData.stats.projectsCompleted}</h3>
              <p className="text-gray-600">Projects Completed</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-md">
              <h3 className="text-3xl font-bold text-blue-600 mb-2">{personalData.stats.yearsExperience}</h3>
              <p className="text-gray-600">Years Experience</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg shadow-md">
              <h3 className="text-3xl font-bold text-blue-600 mb-2">{personalData.stats.technologiesMastered}</h3>
              <p className="text-gray-600">Technologies Mastered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Section */}
      <StatsSection />
    </Layout>
  )
}