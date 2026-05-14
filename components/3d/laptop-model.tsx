'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface LaptopModelProps {
  color?: string
  rgbColor?: string
  screenOpen?: number // 0 = closed, 1 = fully open (90 degrees)
  isRotating?: boolean
  showRGB?: boolean
}

export function LaptopModel({
  color = '#1a1a2e',
  rgbColor = '#00f5ff',
  screenOpen = 0.7,
  isRotating = true,
  showRGB = true,
}: LaptopModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const screenRef = useRef<THREE.Group>(null)
  const rgbRef = useRef<THREE.Mesh>(null)
  const keyboardRgbRef = useRef<THREE.Mesh>(null)

  // RGB animation
  useFrame((state) => {
    if (groupRef.current && isRotating) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3
    }
    
    if (rgbRef.current && showRGB) {
      const hue = (state.clock.elapsedTime * 0.1) % 1
      const rgbMaterial = rgbRef.current.material as THREE.MeshStandardMaterial
      rgbMaterial.emissive.setHSL(hue, 1, 0.5)
      rgbMaterial.emissiveIntensity = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.3
    }
    
    if (keyboardRgbRef.current && showRGB) {
      const hue = ((state.clock.elapsedTime * 0.1) + 0.5) % 1
      const kbMaterial = keyboardRgbRef.current.material as THREE.MeshStandardMaterial
      kbMaterial.emissive.setHSL(hue, 1, 0.3)
    }
  })

  // Screen angle based on openness
  const screenAngle = useMemo(() => {
    return -Math.PI / 2 * screenOpen
  }, [screenOpen])

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Base / Bottom chassis */}
      <RoundedBox
        args={[3, 0.15, 2]}
        radius={0.03}
        smoothness={4}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </RoundedBox>

      {/* Keyboard area */}
      <RoundedBox
        args={[2.8, 0.02, 1.4]}
        radius={0.01}
        smoothness={4}
        position={[0, 0.08, 0.2]}
      >
        <meshStandardMaterial color="#0a0a0f" metalness={0.5} roughness={0.8} />
      </RoundedBox>

      {/* Keyboard RGB underglow */}
      {showRGB && (
        <mesh ref={keyboardRgbRef} position={[0, 0.085, 0.2]}>
          <planeGeometry args={[2.6, 1.2]} />
          <meshStandardMaterial
            color="#000"
            emissive={new THREE.Color(rgbColor)}
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Trackpad */}
      <RoundedBox
        args={[0.9, 0.01, 0.6]}
        radius={0.02}
        smoothness={4}
        position={[0, 0.085, 0.85]}
      >
        <meshStandardMaterial color="#151520" metalness={0.3} roughness={0.5} />
      </RoundedBox>

      {/* Screen hinge area */}
      <group position={[0, 0.075, -0.95]}>
        {/* Hinge */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 2.5, 16]} />
          <meshStandardMaterial color="#0a0a0f" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Screen assembly - rotates around the hinge */}
        <group ref={screenRef} rotation={[screenAngle, 0, 0]}>
          {/* Screen back panel */}
          <RoundedBox
            args={[2.9, 1.8, 0.08]}
            radius={0.02}
            smoothness={4}
            position={[0, 0.95, -0.04]}
          >
            <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
          </RoundedBox>

          {/* RGB strip on back of screen */}
          {showRGB && (
            <mesh ref={rgbRef} position={[0, 0.95, -0.09]}>
              <planeGeometry args={[2.7, 0.05]} />
              <meshStandardMaterial
                color="#000"
                emissive={new THREE.Color(rgbColor)}
                emissiveIntensity={2}
              />
            </mesh>
          )}

          {/* Screen bezel */}
          <RoundedBox
            args={[2.85, 1.75, 0.02]}
            radius={0.02}
            smoothness={4}
            position={[0, 0.95, 0.02]}
          >
            <meshStandardMaterial color="#0a0a0f" metalness={0.5} roughness={0.3} />
          </RoundedBox>

          {/* Actual screen (display) */}
          <mesh position={[0, 0.95, 0.035]}>
            <planeGeometry args={[2.5, 1.5]} />
            <MeshTransmissionMaterial
              backside
              samples={4}
              thickness={0.1}
              chromaticAberration={0.1}
              anisotropy={0.3}
              distortion={0}
              distortionScale={0}
              temporalDistortion={0}
              iridescence={0}
              iridescenceIOR={1}
              iridescenceThicknessRange={[0, 1400]}
              color="#1a1a2e"
              transmission={0.8}
            />
          </mesh>

          {/* Screen content glow */}
          <mesh position={[0, 0.95, 0.04]}>
            <planeGeometry args={[2.4, 1.4]} />
            <meshBasicMaterial color="#111122" />
          </mesh>

          {/* Webcam */}
          <mesh position={[0, 1.78, 0.02]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.2} />
          </mesh>

          {/* Webcam indicator LED */}
          <mesh position={[0.05, 1.78, 0.025]}>
            <sphereGeometry args={[0.008, 8, 8]} />
            <meshStandardMaterial
              color="#00ff00"
              emissive="#00ff00"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      </group>

      {/* Side vents */}
      {[-1.45, 1.45].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {[...Array(8)].map((_, j) => (
            <mesh key={j} position={[0, 0.04, -0.6 + j * 0.15]}>
              <boxGeometry args={[0.02, 0.03, 0.1]} />
              <meshStandardMaterial color="#0a0a0f" metalness={0.5} roughness={0.5} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Back vents with RGB */}
      <group position={[0, 0.04, -0.95]}>
        {[...Array(12)].map((_, i) => (
          <mesh key={i} position={[-1.3 + i * 0.22, 0, 0]}>
            <boxGeometry args={[0.15, 0.03, 0.02]} />
            <meshStandardMaterial
              color="#0a0a0f"
              emissive={showRGB ? new THREE.Color(rgbColor) : new THREE.Color('#000')}
              emissiveIntensity={showRGB ? 0.3 : 0}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}
