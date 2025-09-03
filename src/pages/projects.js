import Layout from '../components/Layout'
import projectsData from '../data/projects.json'
import { useState, useEffect } from 'react'
import { fetchGitHubRepos, fallbackGitHubData } from '../utils/github'

export default function Projects() {
  const [githubRepos, setGithubRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadGitHubData() {
      try {
        setLoading(true)
        const repos = await fetchGitHubRepos()
        
        if (repos) {
          setGithubRepos(repos)
        } else {
          // Use fallback data if API fails
          setGithubRepos(fallbackGitHubData.repos)
          setError('Using fallback data - GitHub API unavailable')
        }
      } catch (err) {
        console.error('Error loading GitHub data:', err)
        setGithubRepos(fallbackGitHubData.repos)
        setError('Failed to load live GitHub data')
      } finally {
        setLoading(false)
      }
    }

    loadGitHubData()
  }, [])
  return (
    <Layout title="Projects - Portfolio">
      {/* Projects Section */}
      <section id="projects" className="pt-24 pb-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">My Projects</h1>
          
          {/* GitHub Repositories Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">GitHub Repositories</h2>
            <p className="text-center text-gray-600 mb-12 italic max-w-3xl mx-auto">
              {projectsData.notes.repositories}
            </p>
            
            {error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 max-w-3xl mx-auto">
                <p className="text-yellow-800 text-sm text-center">⚠️ {error}</p>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="space-y-2 mb-6">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {githubRepos.map((repo) => (
                <div key={repo.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">{repo.name}</h3>
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm">{repo.icon}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {repo.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {repo.technologies.slice(0, 2).map((tech, index) => (
                        <span key={index} className={`px-2 py-1 text-xs rounded-full ${
                          tech === 'React' ? 'bg-blue-100 text-blue-800' :
                          tech === 'Node.js' ? 'bg-green-100 text-green-800' :
                          tech === 'Python' ? 'bg-purple-100 text-purple-800' :
                          tech === 'AI/ML' ? 'bg-yellow-100 text-yellow-800' :
                          tech === 'TypeScript' ? 'bg-indigo-100 text-indigo-800' :
                          tech === 'Next.js' ? 'bg-pink-100 text-pink-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {tech}
                        </span>
                      ))}
                    </div>
                    <a href={repo.githubUrl} 
                       className="btn btn-outline text-sm py-2 px-4" 
                       target="_blank" 
                       rel="noopener noreferrer">
                      View on GitHub
                    </a>
                    {repo.stars !== undefined && (
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span className="mr-3">⭐ {repo.stars}</span>
                        <span>🍴 {repo.forks}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              </div>
            )}
          </div>
          
          {/* Demo Projects Section */}
          <div className="bg-gray-50 py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Demo Projects</h2>
              <p className="text-center text-gray-600 mb-12 italic max-w-3xl mx-auto">
                {projectsData.notes.demos}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {projectsData.demos.map((demo) => (
                  <div key={demo.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{demo.name}</h3>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">{demo.icon}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {demo.description}
                    </p>
                    <a href={demo.demoUrl} 
                       className="btn btn-primary w-full" 
                       target="_blank" 
                       rel="noopener noreferrer">
                      View Live Demo
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}