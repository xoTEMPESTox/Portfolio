import { useState, useEffect } from 'react'
import { fetchGitHubProfile, fallbackGitHubData } from '../utils/github'
import { fetchLeetCodeStats, fallbackLeetCodeData } from '../utils/leetcode'
import { fetchCodolioStats, fallbackCodolioData, getCodolioProfileUrl } from '../utils/codolio'
import CodolioIframe, { CodolioStats } from './CodolioIframe'

const StatsSection = () => {
  const [stats, setStats] = useState({
    github: null,
    leetcode: null,
    codolio: null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true)
        
        // Load all stats in parallel
        const [githubData, leetcodeData, codolioData] = await Promise.allSettled([
          fetchGitHubProfile(),
          fetchLeetCodeStats(),
          fetchCodolioStats()
        ])

        setStats({
          github: githubData.status === 'fulfilled' && githubData.value 
            ? githubData.value 
            : fallbackGitHubData.profile,
          leetcode: leetcodeData.status === 'fulfilled' && leetcodeData.value 
            ? leetcodeData.value 
            : fallbackLeetCodeData.stats,
          codolio: codolioData.status === 'fulfilled' && codolioData.value 
            ? codolioData.value 
            : fallbackCodolioData.stats
        })
      } catch (error) {
        console.error('Error loading stats:', error)
        // Use fallback data
        setStats({
          github: fallbackGitHubData.profile,
          leetcode: fallbackLeetCodeData.stats,
          codolio: fallbackCodolioData.stats
        })
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Live Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Live Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          
          {/* GitHub Stats */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">GitHub</h3>
              <div className="w-8 h-8 bg-gray-800 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🐱</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Public Repos:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{stats.github?.publicRepos || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Followers:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{stats.github?.followers || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Following:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{stats.github?.following || 0}</span>
              </div>
            </div>
          </div>

          {/* LeetCode Stats */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">LeetCode</h3>
              <div className="w-8 h-8 bg-orange-500 dark:bg-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">💻</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Problems Solved:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{stats.leetcode?.totalSolved || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Easy:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{stats.leetcode?.easySolved || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Medium:</span>
                <span className="font-semibold text-yellow-600 dark:text-yellow-400">{stats.leetcode?.mediumSolved || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Hard:</span>
                <span className="font-semibold text-red-600 dark:text-red-400">{stats.leetcode?.hardSolved || 0}</span>
              </div>
            </div>
          </div>

          {/* Codolio Stats */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Codolio</h3>
              <div className="w-8 h-8 bg-green-600 dark:bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">⚡</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Projects:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{stats.codolio?.totalProjects || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Likes:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{stats.codolio?.totalLikes || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Profile Views:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{stats.codolio?.totalViews || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Rank:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">{stats.codolio?.rank || 'N/A'}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
              <a
                href={getCodolioProfileUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
              >
                <span>View Full Profile</span>
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        {/* Codolio Interactive Profile Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Interactive Codolio Profile
          </h3>
          <div className="max-w-4xl mx-auto">
            <CodolioStats height="500px" className="mb-6" />
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
            Stats are fetched live from GitHub and LeetCode APIs. Codolio profile is embedded via iframe (fallback data shown if APIs fail)
          </p>
        </div>
      </div>
    </section>
  )
}

export default StatsSection