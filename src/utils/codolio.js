// Codolio fallback data and utilities
// Since Codolio doesn't have a public API, we use iframe embedding and fallback data

const CODOLIO_USERNAME = '_TEMPEST_'
const CODOLIO_PROFILE_URL = `https://codolio.com/profile/${CODOLIO_USERNAME}`

// Fallback data for when iframe embedding is not available
export const fallbackCodolioData = {
  profile: {
    username: CODOLIO_USERNAME,
    name: 'Priyanshu Sah',
    bio: 'Passionate AI & Full-Stack Developer',
    location: 'India',
    company: 'Freelancer',
    profileUrl: CODOLIO_PROFILE_URL,
    skills: ['JavaScript', 'Python', 'React', 'Node.js', 'AI/ML', 'TensorFlow'],
    stats: {
      totalProjects: 25,
      totalSkills: 15,
      profileViews: 500,
      connections: 50
    }
  },
  projects: [
    {
      id: 1,
      title: 'AI Portfolio Assistant',
      description: 'An AI-powered portfolio website with dynamic content generation',
      technologies: ['Next.js', 'TailwindCSS', 'OpenAI API'],
      liveUrl: 'https://portfolio-demo.vercel.app',
      githubUrl: 'https://github.com/xoTEMPESTox/portfolio',
      likes: 15,
      views: 200
    },
    {
      id: 2,
      title: 'Machine Learning Dashboard',
      description: 'Interactive dashboard for ML model visualization and analysis',
      technologies: ['Python', 'Streamlit', 'Pandas', 'Plotly'],
      liveUrl: 'https://ml-dashboard-demo.herokuapp.com',
      githubUrl: 'https://github.com/xoTEMPESTox/ml-dashboard',
      likes: 12,
      views: 150
    }
  ],
  stats: {
    totalProjects: 25,
    totalLikes: 150,
    totalViews: 2500,
    totalConnections: 50,
    rank: 'Advanced',
    badges: ['Top Contributor', 'AI Specialist', 'Full-Stack Expert'],
    skillsCount: 15,
    experienceYears: 3
  }
}

// Helper function to get Codolio profile URL
export function getCodolioProfileUrl(section = '') {
  const baseUrl = CODOLIO_PROFILE_URL
  return section ? `${baseUrl}#${section}` : baseUrl
}

// Helper function to get skill level color
export function getSkillLevelColor(level) {
  switch (level?.toLowerCase()) {
    case 'beginner':
      return 'text-green-600 bg-green-100'
    case 'intermediate':
      return 'text-yellow-600 bg-yellow-100'
    case 'advanced':
      return 'text-blue-600 bg-blue-100'
    case 'expert':
      return 'text-purple-600 bg-purple-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}

// Get fallback stats for StatsSection component
export function getCodolioStats() {
  return Promise.resolve(fallbackCodolioData.stats)
}

// Get fallback projects
export function getCodolioProjects() {
  return Promise.resolve(fallbackCodolioData.projects)
}

// Get fallback profile
export function getCodolioProfile() {
  return Promise.resolve(fallbackCodolioData.profile)
}

// Legacy function names for backward compatibility
export const fetchCodolioStats = getCodolioStats
export const fetchCodolioProjects = getCodolioProjects
export const fetchCodolioProfile = getCodolioProfile