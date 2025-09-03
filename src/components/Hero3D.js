import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, Text, MeshDistortMaterial } from '@react-three/drei'
import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Optimized3D, ThreeErrorBoundary, mobileOptimizations, desktopOptimizations } from './Performance3D'

// Floating geometric shape component
function FloatingShape({ position, color, shape = 'box' }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2
    }
  })

  const geometry = useMemo(() => {
    switch (shape) {
      case 'sphere':
        return <sphereGeometry args={[0.5, 32, 32]} />
      case 'torus':
        return <torusGeometry args={[0.5, 0.2, 16, 100]} />
      case 'octahedron':
        return <octahedronGeometry args={[0.5]} />
      default:
        return <boxGeometry args={[0.8, 0.8, 0.8]} />
    }
  }, [shape])

  return (
    <Float
      speed={1.5}
      rotationIntensity={1}
      floatIntensity={2}
      position={position}
    >
      <mesh ref={meshRef}>
        {geometry}
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
    </Float>
  )
}

// Particle system component
function ParticleField() {
  const points = useRef()
  const particleCount = 100

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return positions
  }, [])

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
      points.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.1
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#3b82f6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Main 3D Scene component
function Scene() {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#3b82f6" intensity={0.5} />

      {/* Floating geometric shapes */}
      <FloatingShape position={[-4, 2, -2]} color="#3b82f6" shape="sphere" />
      <FloatingShape position={[4, -1, -3]} color="#8b5cf6" shape="torus" />
      <FloatingShape position={[-2, -3, -1]} color="#06b6d4" shape="octahedron" />
      <FloatingShape position={[3, 3, -4]} color="#10b981" shape="box" />
      <FloatingShape position={[0, -2, -5]} color="#f59e0b" shape="sphere" />

      {/* Particle field */}
      <ParticleField />

      {/* Controls for mouse interaction */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </>
  )
}

// WebGL fallback component
function WebGLFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-4"></div>
          <div className="w-24 h-4 bg-blue-200 rounded mx-auto mb-2"></div>
          <div className="w-32 h-4 bg-blue-200 rounded mx-auto"></div>
        </div>
      </div>
    </div>
  )
}

// Main Hero3D component
export default function Hero3D({ children }) {
  const [isMounted, setIsMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    setIsMobile(window.innerWidth < 768)
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const canvasSettings = isMobile ? mobileOptimizations : desktopOptimizations

  return (
    <div className="relative min-h-screen">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        {isMounted ? (
          <ThreeErrorBoundary fallback={<WebGLFallback />}>
            <Canvas
              camera={{ position: [0, 0, 8], fov: 75 }}
              style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)' }}
              fallback={<WebGLFallback />}
              gl={canvasSettings}
              dpr={canvasSettings.pixelRatio}
            >
              <Optimized3D>
                <Scene />
              </Optimized3D>
            </Canvas>
          </ThreeErrorBoundary>
        ) : (
          <WebGLFallback />
        )}
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}