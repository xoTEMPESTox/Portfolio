import { useState, useEffect } from 'react'
import { fetchGitHubProfile, fallbackGitHubData } from '../utils/github'
import { fetchLeetCodeStats, fallbackLeetCodeData } from '../utils/leetcode'
import { fetchCodolioStats, fallbackCodolioData } from '../utils/codolio'

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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Live Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Live Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          
          {/* GitHub Stats */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">GitHub</h3>
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🐱</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Public Repos:</span>
                <span className="font-semibold text-gray-900">{stats.github?.publicRepos || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Followers:</span>
                <span className="font-semibold text-gray-900">{stats.github?.followers || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Following:</span>
                <span className="font-semibold text-gray-900">{stats.github?.following || 0}</span>
              </div>
            </div>
          </div>

          {/* LeetCode Stats */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">LeetCode</h3>
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">💻</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Problems Solved:</span>
                <span className="font-semibold text-gray-900">{stats.leetcode?.totalSolved || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Easy:</span>
                <span className="font-semibold text-green-600">{stats.leetcode?.easySolved || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Medium:</span>
                <span className="font-semibold text-yellow-600">{stats.leetcode?.mediumSolved || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hard:</span>
                <span className="font-semibold text-red-600">{stats.leetcode?.hardSolved || 0}</span>
              </div>
            </div>
          </div>

          {/* Codolio Stats */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Codolio</h3>
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">⚡</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Projects:</span>
                <span className="font-semibold text-gray-900">{stats.codolio?.totalProjects || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Likes:</span>
                <span className="font-semibold text-gray-900">{stats.codolio?.totalLikes || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Profile Views:</span>
                <span className="font-semibold text-gray-900">{stats.codolio?.totalViews || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rank:</span>
                <span className="font-semibold text-blue-600">{stats.codolio?.rank || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 italic">
            Stats are fetched live from GitHub, LeetCode, and Codolio APIs
          </p>
        </div>
      </div>
    </section>
  )
}

export default StatsSection