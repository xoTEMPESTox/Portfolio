import { useState, useEffect, useRef } from 'react'
import { fallbackCodolioData, getCodolioProfileUrl } from '../utils/codolio'

// Responsive iframe component for Codolio profile embedding
export default function CodolioIframe({
  section = 'profile',
  height = '600px',
  className = '',
  showFallback = true,
  lazyLoad = true
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isVisible, setIsVisible] = useState(!lazyLoad)
  const iframeRef = useRef(null)

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

  // Lazy loading implementation
  useEffect(() => {
    if (!lazyLoad) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (iframeRef.current) {
      observer.observe(iframeRef.current)
    }

    return () => {
      if (observer) {
        observer.disconnect()
      }
    }
  }, [lazyLoad])

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  // Enhanced fallback component with more comprehensive information
  const FallbackComponent = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚡</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Codolio Profile
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Visit my Codolio profile to see detailed coding statistics, projects, and activity graphs.
        </p>
        
        {/* Display fallback stats */}
        <div className="grid grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {fallbackCodolioData.stats.totalProjects}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Projects</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {fallbackCodolioData.stats.totalViews}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Profile Views</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {fallbackCodolioData.stats.totalLikes}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Likes</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {fallbackCodolioData.stats.rank}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Rank</div>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Skills</h4>
          <div className="flex flex-wrap justify-center gap-2">
            {fallbackCodolioData.profile.skills.slice(0, 5).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <a
          href={getCodolioProfileUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
        >
          <span>View Full Profile on Codolio</span>
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
        
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          <p>Having trouble accessing the profile? Try refreshing the page or check your network connection.</p>
        </div>
      </div>
    </div>
  )

  // Enhanced loading component with better visual feedback
  const LoadingComponent = () => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col items-center justify-center" style={{ height }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">Loading Codolio profile...</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">This may take a few moments</p>
        </div>
        
        {/* Skeleton loading for stats */}
        <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-md">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (hasError && showFallback) {
    return <FallbackComponent />
  }

  return (
    <div
      ref={iframeRef}
      className={`relative w-full ${className}`}
      style={{ minHeight: height }}
    >
      {isLoading && <LoadingComponent />}
      
      {isVisible && (
        <iframe
          src={iframeUrl}
          className={`w-full border rounded-lg shadow-lg transition-opacity duration-300 ${
            isLoading ? 'opacity-0 absolute' : 'opacity-100'
          }`}
          style={{ height }}
          loading={lazyLoad ? "lazy" : "eager"}
          onLoad={handleLoad}
          onError={handleError}
          title={`Codolio Profile - ${section}`}
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      )}
      
      {hasError && !showFallback && (
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Unable to Load Profile</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            We couldn't load the Codolio profile. This might be due to network issues or the profile being temporarily unavailable.
          </p>
          <button
            onClick={() => {
              setIsLoading(true)
              setHasError(false)
              setIsVisible(true)
            }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 mr-3"
          >
            Retry
          </button>
          <a
            href={getCodolioProfileUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Open in New Tab
          </a>
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