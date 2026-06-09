'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

interface DesktopModelProps {
  color?: string
  rgbColor?: string
  isRotating?: boolean
  showRGB?: boolean
  showGlass?: boolean
}

export function DesktopModel({
  color = '#1a1a2e',
  rgbColor = '#00f5ff',
  isRotating = true,
  showRGB = true,
  showGlass = true,
}: DesktopModelProps) {
  const groupRef = useRef<THREE.Group>(null)
  const fanRefs = useRef<THREE.Mesh[]>([])
  const rgbStripRef = useRef<THREE.Mesh>(null)
  const gpuRgbRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (groupRef.current && isRotating) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.4 - 0.3
    }

    // Rotate fans
    fanRefs.current.forEach((fan) => {
      if (fan) {
        fan.rotation.z += 0.1
      }
    })

    // Animate RGB strips
    if (rgbStripRef.current && showRGB) {
      const hue = (state.clock.elapsedTime * 0.1) % 1
      const material = rgbStripRef.current.material as THREE.MeshStandardMaterial
      material.emissive.setHSL(hue, 1, 0.5)
      material.emissiveIntensity = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.5
    }

    if (gpuRgbRef.current && showRGB) {
      const hue = ((state.clock.elapsedTime * 0.1) + 0.3) % 1
      const material = gpuRgbRef.current.material as THREE.MeshStandardMaterial
      material.emissive.setHSL(hue, 1, 0.4)
    }
  })

  const addFanRef = (el: THREE.Mesh) => {
    if (el && !fanRefs.current.includes(el)) {
      fanRefs.current.push(el)
    }
  }

  return (
    <group ref={groupRef} position={[0, -0.5, 0]} rotation={[0, 0.3, 0]}>
      {/* Main Case */}
      <RoundedBox
        args={[2.2, 2.8, 2]}
        radius={0.05}
        smoothness={4}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </RoundedBox>

      {/* Glass Side Panel */}
      {showGlass && (
        <mesh position={[-1.11, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[1.9, 2.7]} />
          <meshPhysicalMaterial
            color="#1a1a2e"
            metalness={0}
            roughness={0}
            transmission={0.9}
            thickness={0.1}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}

      {/* Front Panel */}
      <RoundedBox
        args={[2.15, 2.75, 0.05]}
        radius={0.03}
        smoothness={4}
        position={[0, 0, 1]}
      >
        <meshStandardMaterial color="#0a0a0f" metalness={0.5} roughness={0.5} />
      </RoundedBox>

      {/* Front Mesh Panel */}
      <group position={[0, 0.5, 1.03]}>
        {[...Array(15)].map((_, i) => (
          <mesh key={i} position={[0, 0.8 - i * 0.11, 0]}>
            <boxGeometry args={[1.8, 0.02, 0.01]} />
            <meshStandardMaterial color="#0a0a0f" metalness={0.5} roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* RGB Strip on Front */}
      {showRGB && (
        <mesh ref={rgbStripRef} position={[-0.95, 0, 1.03]}>
          <boxGeometry args={[0.02, 2.5, 0.01]} />
          <meshStandardMaterial
            color="#000"
            emissive={new THREE.Color(rgbColor)}
            emissiveIntensity={2}
          />
        </mesh>
      )}

      {/* Power Button */}
      <mesh position={[0.8, 1.2, 1.03]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
        <meshStandardMaterial
          color="#222"
          emissive={showRGB ? new THREE.Color('#ffffff') : new THREE.Color('#333')}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Front Fans (visible through mesh) */}
      {[0.4, -0.4].map((y, i) => (
        <group key={i} position={[0, y, 0.95]}>
          {/* Fan Frame */}
          <RoundedBox args={[0.8, 0.8, 0.1]} radius={0.02} smoothness={4}>
            <meshStandardMaterial color="#0a0a0f" metalness={0.5} roughness={0.5} />
          </RoundedBox>
          {/* Fan Blades */}
          <mesh ref={addFanRef} position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.02, 7]} />
            <meshStandardMaterial
              color="#222"
              emissive={showRGB ? new THREE.Color(rgbColor) : undefined}
              emissiveIntensity={showRGB ? 0.5 : 0}
              transparent
              opacity={0.9}
            />
          </mesh>
        </group>
      ))}

      {/* Internal Components (visible through glass) */}
      <group position={[-0.3, 0, 0]}>
        {/* Motherboard */}
        <RoundedBox args={[1.4, 2.2, 0.05]} radius={0.01} smoothness={4} position={[0.3, 0, 0]}>
          <meshStandardMaterial color="#1a2a1a" metalness={0.3} roughness={0.7} />
        </RoundedBox>

        {/* CPU Cooler */}
        <group position={[0.3, 0.5, 0.3]}>
          {/* Cooler Base */}
          <RoundedBox args={[0.5, 0.5, 0.3]} radius={0.02} smoothness={4}>
            <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
          </RoundedBox>
          {/* AIO Tubes */}
          <mesh position={[-0.3, 0, 0.1]}>
            <torusGeometry args={[0.15, 0.02, 8, 16, Math.PI]} />
            <meshStandardMaterial color="#111" metalness={0.5} roughness={0.5} />
          </mesh>
        </group>

        {/* RAM Sticks */}
        {[0.55, 0.65, 0.75, 0.85].map((x, i) => (
          <RoundedBox
            key={i}
            args={[0.08, 0.6, 0.15]}
            radius={0.01}
            smoothness={4}
            position={[x, 0.5, 0.15]}
          >
            <meshStandardMaterial
              color="#1a1a2e"
              emissive={showRGB ? new THREE.Color(rgbColor) : undefined}
              emissiveIntensity={showRGB ? 0.3 + (i * 0.1) : 0}
            />
          </RoundedBox>
        ))}

        {/* GPU */}
        <group position={[0.3, -0.3, 0.4]}>
          {/* GPU Body */}
          <RoundedBox args={[1.2, 0.15, 0.5]} radius={0.02} smoothness={4}>
            <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
          </RoundedBox>
          {/* GPU Fans */}
          {[-0.35, 0.35].map((x, i) => (
            <mesh key={i} ref={addFanRef} position={[x, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.02, 7]} />
              <meshStandardMaterial color="#222" transparent opacity={0.9} />
            </mesh>
          ))}
          {/* GPU RGB */}
          {showRGB && (
            <mesh ref={gpuRgbRef} position={[0, 0.08, 0.26]}>
              <boxGeometry args={[1.1, 0.02, 0.01]} />
              <meshStandardMaterial
                color="#000"
                emissive={new THREE.Color(rgbColor)}
                emissiveIntensity={1}
              />
            </mesh>
          )}
          {/* GPU Backplate */}
          <RoundedBox args={[1.15, 0.02, 0.45]} radius={0.01} smoothness={4} position={[0, -0.085, 0]}>
            <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
          </RoundedBox>
        </group>

        {/* PSU Shroud */}
        <RoundedBox
          args={[1.5, 0.6, 0.9]}
          radius={0.02}
          smoothness={4}
          position={[0.2, -1, 0.1]}
        >
          <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
        </RoundedBox>
      </group>

      {/* Top Fans */}
      <group position={[0, 1.4, 0]}>
        {[...Array(3)].map((_, i) => (
          <group key={i} position={[-0.6 + i * 0.6, 0, 0]}>
            <RoundedBox args={[0.55, 0.05, 0.55]} radius={0.02} smoothness={4}>
              <meshStandardMaterial color="#0a0a0f" metalness={0.5} roughness={0.5} />
            </RoundedBox>
            <mesh ref={addFanRef} position={[0, 0.03, 0]}>
              <cylinderGeometry args={[0.23, 0.23, 0.02, 7]} />
              <meshStandardMaterial
                color="#222"
                emissive={showRGB ? new THREE.Color(rgbColor) : undefined}
                emissiveIntensity={showRGB ? 0.3 : 0}
                transparent
                opacity={0.9}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Rear IO and Fan */}
      <group position={[0, 0, -1]}>
        {/* Rear Panel */}
        <RoundedBox args={[2.15, 2.75, 0.05]} radius={0.03} smoothness={4}>
          <meshStandardMaterial color="#0a0a0f" metalness={0.5} roughness={0.5} />
        </RoundedBox>
        {/* Exhaust Fan */}
        <group position={[0.5, 0.8, -0.03]}>
          <mesh ref={addFanRef} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.02, 7]} />
            <meshStandardMaterial color="#222" transparent opacity={0.9} />
          </mesh>
        </group>
        {/* IO Ports */}
        <group position={[-0.3, 0.2, -0.03]}>
          {[...Array(6)].map((_, i) => (
            <mesh key={i} position={[0, -i * 0.15, 0]}>
              <boxGeometry args={[0.8, 0.1, 0.02]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Feet */}
      {[
        [-0.9, -1.45, 0.8],
        [0.9, -1.45, 0.8],
        [-0.9, -1.45, -0.8],
        [0.9, -1.45, -0.8],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.08, 0.1, 0.1, 16]} />
          <meshStandardMaterial color="#111" metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}
