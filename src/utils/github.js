// GitHub API utility functions
const GITHUB_USERNAME = 'xoTEMPESTox'
const GITHUB_API_BASE = 'https://api.github.com'

export async function fetchGitHubRepos() {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`)
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }
    
    const repos = await response.json()
    
    return repos.map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || 'No description available',
      technologies: repo.language ? [repo.language] : ['Unknown'],
      githubUrl: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      updated: repo.updated_at,
      icon: '📁'
    }))
  } catch (error) {
    console.error('Error fetching GitHub repos:', error)
    return null
  }
}

export async function fetchGitHubProfile() {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`)
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }
    
    const profile = await response.json()
    
    return {
      username: profile.login,
      name: profile.name,
      bio: profile.bio,
      publicRepos: profile.public_repos,
      followers: profile.followers,
      following: profile.following,
      avatarUrl: profile.avatar_url,
      profileUrl: profile.html_url
    }
  } catch (error) {
    console.error('Error fetching GitHub profile:', error)
    return null
  }
}

// Fallback data in case API fails
export const fallbackGitHubData = {
  repos: [
    {
      id: 1,
      name: 'Portfolio',
      description: 'Personal portfolio website built with Next.js and TailwindCSS',
      technologies: ['JavaScript', 'Next.js'],
      githubUrl: `https://github.com/${GITHUB_USERNAME}/Portfolio`,
      stars: 0,
      forks: 0,
      icon: '📁'
    },
    {
      id: 2,
      name: 'AI-Project',
      description: 'Machine learning project with Python and TensorFlow',
      technologies: ['Python', 'AI/ML'],
      githubUrl: `https://github.com/${GITHUB_USERNAME}/AI-Project`,
      stars: 0,
      forks: 0,
      icon: '📁'
    }
  ],
  profile: {
    username: GITHUB_USERNAME,
    name: 'Priyanshu Sah',
    publicRepos: 10,
    followers: 5,
    following: 10
  }
}