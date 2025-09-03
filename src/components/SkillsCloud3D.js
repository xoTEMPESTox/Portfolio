import { Canvas } from '@react-three/fiber'
import { Text, OrbitControls, Float } from '@react-three/drei'
import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Optimized3D, ThreeErrorBoundary, mobileOptimizations, desktopOptimizations } from './Performance3D'

// Individual skill bubble component
function SkillBubble({ position, skill, color, size = 1 }) {
  const meshRef = useRef()
  const textRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
      
      // Scale animation on hover
      const targetScale = hovered ? 1.2 : clicked ? 0.9 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  return (
    <Float
      speed={1}
      rotationIntensity={0.5}
      floatIntensity={1}
      position={position}
    >
      <group ref={meshRef}>
        {/* Skill bubble sphere */}
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onPointerDown={() => setClicked(true)}
          onPointerUp={() => setClicked(false)}
        >
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
            color={hovered ? '#ffffff' : color}
            transparent
            opacity={hovered ? 0.9 : 0.7}
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
        
        {/* Skill text */}
        <Text
          ref={textRef}
          position={[0, 0, size + 0.1]}
          fontSize={0.3}
          color={hovered ? '#1f2937' : '#374151'}
          anchorX="center"
          anchorY="middle"
          maxWidth={3}
          textAlign="center"
        >
          {skill}
        </Text>
      </group>
    </Float>
  )
}

// Skills cloud scene
function SkillsScene({ skills }) {
  const groupRef = useRef()
  
  // Generate positions for skills in a 3D cloud formation
  const skillPositions = useMemo(() => {
    const positions = []
    const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']
    
    skills.forEach((skillCategory, categoryIndex) => {
      const techs = skillCategory.technologies.split(', ')
      
      techs.forEach((tech, techIndex) => {
        // Create a spherical distribution
        const phi = Math.acos(-1 + (2 * (categoryIndex * techs.length + techIndex)) / (skills.length * 6))
        const theta = Math.sqrt((skills.length * 6) * Math.PI) * phi
        
        const radius = 4 + Math.random() * 2
        const x = radius * Math.cos(theta) * Math.sin(phi)
        const y = radius * Math.sin(theta) * Math.sin(phi)
        const z = radius * Math.cos(phi)
        
        positions.push({
          position: [x, y, z],
          skill: tech.trim(),
          color: colors[categoryIndex % colors.length],
          size: 0.5 + Math.random() * 0.3
        })
      })
    })
    
    return positions
  }, [skills])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} color="#3b82f6" intensity={0.3} />

      {/* Skill bubbles */}
      {skillPositions.map((item, index) => (
        <SkillBubble
          key={index}
          position={item.position}
          skill={item.skill}
          color={item.color}
          size={item.size}
        />
      ))}

      {/* Central title */}
      <Text
        position={[0, 0, 0]}
        fontSize={0.8}
        color="#1f2937"
        anchorX="center"
        anchorY="middle"
      >
        Skills & Technologies
      </Text>

      {/* Interactive controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={0.3}
        minDistance={8}
        maxDistance={15}
      />
    </group>
  )
}

// Fallback component for devices without WebGL support
function SkillsCloudFallback({ skills }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {skills.map((skillCategory, categoryIndex) => {
        const techs = skillCategory.technologies.split(', ')
        return techs.map((tech, techIndex) => (
          <div
            key={`${categoryIndex}-${techIndex}`}
            className="bg-white rounded-full px-4 py-2 shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
          >
            <span className="text-sm font-medium text-gray-700">{tech.trim()}</span>
          </div>
        ))
      })}
    </div>
  )
}

// Main Skills Cloud 3D component
export default function SkillsCloud3D({ skills }) {
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
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Interactive Skills Cloud
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore my technical skills in an interactive 3D environment.
            {isMobile ? 'Touch and drag to rotate, pinch to zoom.' : 'Click and drag to rotate, scroll to zoom, and hover over skills to learn more.'}
          </p>
        </div>

        <div className="relative">
          {/* 3D Skills Cloud */}
          <div className="h-96 md:h-[500px] w-full">
            {isMounted ? (
              <ThreeErrorBoundary fallback={<SkillsCloudFallback skills={skills} />}>
                <Canvas
                  camera={{ position: [0, 0, 12], fov: 75 }}
                  fallback={<SkillsCloudFallback skills={skills} />}
                  gl={canvasSettings}
                  dpr={canvasSettings.pixelRatio}
                  style={{ touchAction: "pan-y" }}
                >
                  <Optimized3D>
                    <SkillsScene skills={skills} />
                  </Optimized3D>
                </Canvas>
              </ThreeErrorBoundary>
            ) : (
              <SkillsCloudFallback skills={skills} />
            )}
          </div>

          {/* Instructions */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>Frontend</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span>Backend</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-cyan-500 rounded-full"></div>
                <span>AI/ML</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Tools</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}