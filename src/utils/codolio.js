// Codolio API utility functions
const CODOLIO_USERNAME = '_TEMPEST_'
const CODOLIO_API_BASE = 'https://codolio.com/api'

export async function fetchCodolioProfile() {
  try {
    // Note: Codolio may not have a public API, so this is a conceptual implementation
    // In practice, you might need to scrape the profile page or use alternative methods
    const response = await fetch(`${CODOLIO_API_BASE}/profile/${CODOLIO_USERNAME}`)
    
    if (!response.ok) {
      throw new Error(`Codolio API error: ${response.status}`)
    }
    
    const profile = await response.json()
    
    return {
      username: profile.username || CODOLIO_USERNAME,
      name: profile.name || 'Priyanshu Sah',
      bio: profile.bio || '',
      avatar: profile.avatar || null,
      location: profile.location || '',
      website: profile.website || '',
      company: profile.company || '',
      skills: profile.skills || [],
      projects: profile.projects || [],
      achievements: profile.achievements || [],
      stats: {
        totalProjects: profile.totalProjects || 0,
        totalSkills: profile.totalSkills || 0,
        profileViews: profile.profileViews || 0,
        connections: profile.connections || 0
      }
    }
  } catch (error) {
    console.error('Error fetching Codolio profile:', error)
    return null
  }
}

export async function fetchCodolioProjects() {
  try {
    const response = await fetch(`${CODOLIO_API_BASE}/profile/${CODOLIO_USERNAME}/projects`)
    
    if (!response.ok) {
      throw new Error(`Codolio Projects API error: ${response.status}`)
    }
    
    const projects = await response.json()
    
    return projects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      technologies: project.technologies || [],
      liveUrl: project.liveUrl || null,
      githubUrl: project.githubUrl || null,
      imageUrl: project.imageUrl || null,
      likes: project.likes || 0,
      views: project.views || 0,
      createdAt: project.createdAt
    }))
  } catch (error) {
    console.error('Error fetching Codolio projects:', error)
    return null
  }
}

export async function fetchCodolioStats() {
  try {
    const response = await fetch(`${CODOLIO_API_BASE}/profile/${CODOLIO_USERNAME}/stats`)
    
    if (!response.ok) {
      throw new Error(`Codolio Stats API error: ${response.status}`)
    }
    
    const stats = await response.json()
    
    return {
      totalProjects: stats.totalProjects || 0,
      totalLikes: stats.totalLikes || 0,
      totalViews: stats.totalViews || 0,
      totalConnections: stats.totalConnections || 0,
      rank: stats.rank || 'N/A',
      badges: stats.badges || [],
      skillsCount: stats.skillsCount || 0,
      experienceYears: stats.experienceYears || 0
    }
  } catch (error) {
    console.error('Error fetching Codolio stats:', error)
    return null
  }
}

// Fallback data in case API fails
export const fallbackCodolioData = {
  profile: {
    username: CODOLIO_USERNAME,
    name: 'Priyanshu Sah',
    bio: 'Passionate AI & Full-Stack Developer',
    location: 'India',
    company: 'Freelancer',
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