import React, { useEffect, useState } from 'react'
import { useThree, useFrame } from '@react-three/fiber'

// Performance monitor hook
export function usePerformanceMonitor() {
  const [fps, setFps] = useState(60)
  const [isLowPerformance, setIsLowPerformance] = useState(false)
  
  useFrame((state) => {
    // Simple FPS calculation
    const currentFps = 1 / state.clock.getDelta()
    setFps(Math.round(currentFps))
    
    // Detect low performance
    if (currentFps < 30) {
      setIsLowPerformance(true)
    } else if (currentFps > 45) {
      setIsLowPerformance(false)
    }
  })

  return { fps, isLowPerformance }
}

// Adaptive quality component
export function AdaptiveQuality({ children }) {
  const { gl, camera } = useThree()
  const { fps, isLowPerformance } = usePerformanceMonitor()
  const [quality, setQuality] = useState('high')

  useEffect(() => {
    if (isLowPerformance) {
      // Reduce quality for better performance
      setQuality('low')
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 1))
      gl.shadowMap.enabled = false
    } else {
      // Restore quality
      setQuality('high')
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      gl.shadowMap.enabled = true
    }
  }, [isLowPerformance, gl])

  return (
    <>
      {children}
      {/* Performance indicator (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <mesh position={[5, 5, 0]}>
          <planeGeometry args={[1, 0.5]} />
          <meshBasicMaterial 
            color={fps > 45 ? 'green' : fps > 30 ? 'yellow' : 'red'} 
            transparent 
            opacity={0.7} 
          />
        </mesh>
      )}
    </>
  )
}

// WebGL capability detector
export function useWebGLCapabilities() {
  const [capabilities, setCapabilities] = useState({
    webgl: false,
    webgl2: false,
    maxTextureSize: 0,
    maxVertexUniforms: 0,
    extensions: []
  })

  useEffect(() => {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    const gl2 = canvas.getContext('webgl2')

    if (gl) {
      const extensions = gl.getSupportedExtensions() || []
      setCapabilities({
        webgl: true,
        webgl2: !!gl2,
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        maxVertexUniforms: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
        extensions
      })
    }

    return () => {
      canvas.remove()
    }
  }, [])

  return capabilities
}

// Device performance detector
export function useDevicePerformance() {
  const [deviceTier, setDeviceTier] = useState('high')
  
  useEffect(() => {
    // Detect device performance based on various factors
    const detectPerformance = () => {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl')
      
      if (!gl) {
        setDeviceTier('low')
        return
      }

      // Check GPU renderer
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : ''
      
      // Check memory
      const memory = navigator.deviceMemory || 4
      
      // Check CPU cores
      const cores = navigator.hardwareConcurrency || 4
      
      // Simple heuristic for device performance
      let score = 0
      
      // Memory score
      if (memory >= 8) score += 3
      else if (memory >= 4) score += 2
      else score += 1
      
      // CPU score
      if (cores >= 8) score += 3
      else if (cores >= 4) score += 2
      else score += 1
      
      // GPU score (basic check)
      if (renderer.toLowerCase().includes('nvidia') || renderer.toLowerCase().includes('amd')) {
        score += 3
      } else if (renderer.toLowerCase().includes('intel')) {
        score += 2
      } else {
        score += 1
      }
      
      // Determine tier
      if (score >= 7) setDeviceTier('high')
      else if (score >= 5) setDeviceTier('medium')
      else setDeviceTier('low')
      
      canvas.remove()
    }

    detectPerformance()
  }, [])

  return deviceTier
}

// Optimized 3D wrapper component
export function Optimized3D({ children, fallback = null }) {
  const capabilities = useWebGLCapabilities()
  const deviceTier = useDevicePerformance()
  const [shouldRender3D, setShouldRender3D] = useState(true)

  useEffect(() => {
    // Decide whether to render 3D based on capabilities
    const should3D = capabilities.webgl && 
                     capabilities.maxTextureSize >= 1024 &&
                     deviceTier !== 'low'
    
    setShouldRender3D(should3D)
  }, [capabilities, deviceTier])

  if (!shouldRender3D) {
    return fallback || <div className="text-center p-8 text-gray-500">3D features disabled for better performance</div>
  }

  return (
    <AdaptiveQuality>
      {children}
    </AdaptiveQuality>
  )
}

// Preloader for 3D assets
export function Asset3DPreloader({ onProgress, onComplete }) {
  const [progress, setProgress] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Simulate asset loading
    const loadAssets = async () => {
      const steps = 10
      for (let i = 0; i <= steps; i++) {
        await new Promise(resolve => setTimeout(resolve, 100))
        const currentProgress = (i / steps) * 100
        setProgress(currentProgress)
        onProgress?.(currentProgress)
      }
      setLoaded(true)
      onComplete?.()
    }

    loadAssets()
  }, [onProgress, onComplete])

  if (loaded) return null

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-32 h-32 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium text-gray-700 mb-2">Loading 3D Experience</p>
        <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}%</p>
      </div>
    </div>
  )
}

// Error boundary for 3D components
export class ThreeErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Component Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <div className="text-red-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">3D Content Unavailable</h3>
          <p className="text-gray-600">Your device doesn&apos;t support the required 3D features.</p>
        </div>
      )
    }

    return this.props.children
  }
}

// Mobile optimization settings
export const mobileOptimizations = {
  pixelRatio: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1,
  antialias: typeof window !== 'undefined' ? window.innerWidth > 768 : false,
  shadows: typeof window !== 'undefined' ? window.innerWidth > 1024 : false,
  powerPreference: 'high-performance',
  alpha: true,
  premultipliedAlpha: true,
  preserveDrawingBuffer: false,
  failIfMajorPerformanceCaveat: false
}

// Desktop optimization settings
export const desktopOptimizations = {
  pixelRatio: typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1,
  antialias: true,
  shadows: true,
  powerPreference: 'high-performance',
  alpha: true,
  premultipliedAlpha: true,
  preserveDrawingBuffer: false,
  failIfMajorPerformanceCaveat: false
}

const Performance3DUtils = {
  usePerformanceMonitor,
  AdaptiveQuality,
  useWebGLCapabilities,
  useDevicePerformance,
  Optimized3D,
  Asset3DPreloader,
  ThreeErrorBoundary,
  mobileOptimizations,
  desktopOptimizations
}

export default Performance3DUtils