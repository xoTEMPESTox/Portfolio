// LeetCode API utility functions
const LEETCODE_USERNAME = 'priyanshu123sah' // Replace with actual LeetCode username

export async function fetchLeetCodeStats() {
  try {
    // Using a public LeetCode stats API (there are several available)
    // Note: LeetCode doesn't have an official public API, so we use third-party services
    const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${LEETCODE_USERNAME}`)
    
    if (!response.ok) {
      throw new Error(`LeetCode API error: ${response.status}`)
    }
    
    const stats = await response.json()
    
    return {
      username: LEETCODE_USERNAME,
      totalSolved: stats.totalSolved || 0,
      totalQuestions: stats.totalQuestions || 0,
      easySolved: stats.easySolved || 0,
      mediumSolved: stats.mediumSolved || 0,
      hardSolved: stats.hardSolved || 0,
      acceptanceRate: stats.acceptanceRate || '0%',
      ranking: stats.ranking || 'N/A',
      contributionPoints: stats.contributionPoints || 0,
      reputation: stats.reputation || 0
    }
  } catch (error) {
    console.error('Error fetching LeetCode stats:', error)
    return null
  }
}

export async function fetchLeetCodeProfile() {
  try {
    // Alternative API endpoint for profile data
    const response = await fetch(`https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}`)
    
    if (!response.ok) {
      throw new Error(`LeetCode Profile API error: ${response.status}`)
    }
    
    const profile = await response.json()
    
    return {
      username: profile.username || LEETCODE_USERNAME,
      name: profile.name || 'Priyanshu Sah',
      avatar: profile.avatar || null,
      ranking: profile.ranking || 'N/A',
      reputation: profile.reputation || 0,
      gitHubLink: profile.gitHubLink || null,
      twitterLink: profile.twitterLink || null,
      linkedInLink: profile.linkedInLink || null,
      website: profile.website || null
    }
  } catch (error) {
    console.error('Error fetching LeetCode profile:', error)
    return null
  }
}

// Fallback data in case API fails
export const fallbackLeetCodeData = {
  stats: {
    username: LEETCODE_USERNAME,
    totalSolved: 150,
    totalQuestions: 2500,
    easySolved: 80,
    mediumSolved: 60,
    hardSolved: 10,
    acceptanceRate: '75%',
    ranking: '50000',
    contributionPoints: 100,
    reputation: 50
  },
  profile: {
    username: LEETCODE_USERNAME,
    name: 'Priyanshu Sah',
    ranking: '50000',
    reputation: 50
  }
}

// Helper function to calculate solve percentage
export function calculateSolvePercentage(solved, total) {
  if (!total || total === 0) return 0
  return Math.round((solved / total) * 100)
}

// Helper function to get difficulty color
export function getDifficultyColor(difficulty) {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'text-green-600 bg-green-100'
    case 'medium':
      return 'text-yellow-600 bg-yellow-100'
    case 'hard':
      return 'text-red-600 bg-red-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}