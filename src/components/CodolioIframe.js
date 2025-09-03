import { useState } from 'react'

// Responsive iframe component for Codolio profile embedding
export default function CodolioIframe({ 
  section = 'profile', 
  height = '600px', 
  className = '',
  showFallback = true 
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const username = '_TEMPEST_'
  const baseUrl = 'https://codolio.com/profile'
  
  // Different sections of Codolio profile
  const sectionUrls = {
    profile: `${baseUrl}/${username}`,
    stats: `${baseUrl}/${username}#stats`,
    projects: `${baseUrl}/${username}#projects`,
    badges: `${baseUrl}/${username}#badges`,
    analysis: `${baseUrl}/${username}#analysis`,
    commits: `${baseUrl}/${username}#commits`
  }

  const iframeUrl = sectionUrls[section] || sectionUrls.profile

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  // Fallback component when iframe fails to load
  const FallbackComponent = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚡</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Codolio Profile
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Visit my Codolio profile to see detailed coding statistics and projects.
        </p>
        <a
          href={iframeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
        >
          <span>View on Codolio</span>
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  )

  // Loading component
  const LoadingComponent = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading Codolio profile...</p>
        </div>
      </div>
    </div>
  )

  if (hasError && showFallback) {
    return <FallbackComponent />
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && <LoadingComponent />}
      
      <iframe
        src={iframeUrl}
        className={`w-full border rounded-lg shadow-lg transition-opacity duration-300 ${
          isLoading ? 'opacity-0 absolute' : 'opacity-100'
        }`}
        style={{ height }}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        title={`Codolio Profile - ${section}`}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
      
      {hasError && !showFallback && (
        <div className="text-center p-4 text-gray-500 dark:text-gray-400">
          <p>Unable to load Codolio profile. Please try again later.</p>
        </div>
      )}
    </div>
  )
}

// Specific components for different sections
export function CodolioStats({ className = '', height = '400px' }) {
  return (
    <CodolioIframe 
      section="stats" 
      height={height}
      className={className}
    />
  )
}

export function CodolioProjects({ className = '', height = '600px' }) {
  return (
    <CodolioIframe 
      section="projects" 
      height={height}
      className={className}
    />
  )
}

export function CodolioBadges({ className = '', height = '300px' }) {
  return (
    <CodolioIframe 
      section="badges" 
      height={height}
      className={className}
    />
  )
}

export function CodolioAnalysis({ className = '', height = '500px' }) {
  return (
    <CodolioIframe 
      section="analysis" 
      height={height}
      className={className}
    />
  )
}

export function CodolioCommits({ className = '', height = '400px' }) {
  return (
    <CodolioIframe 
      section="commits" 
      height={height}
      className={className}
    />
  )
}