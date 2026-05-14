'use client'

import { Suspense, ReactNode } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { Spinner } from '@/components/ui/spinner'

interface SceneWrapperProps {
  children: ReactNode
  className?: string
  camera?: {
    position?: [number, number, number]
    fov?: number
  }
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/50">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="w-8 h-8 text-primary" />
        <p className="text-sm text-muted-foreground">Loading 3D View...</p>
      </div>
    </div>
  )
}

export function SceneWrapper({ 
  children, 
  className = '',
  camera = { position: [0, 0, 5], fov: 45 }
}: SceneWrapperProps) {
  return (
    <div className={`relative ${className}`}>
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ 
            position: camera.position, 
            fov: camera.fov,
            near: 0.1,
            far: 1000
          }}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: 'high-performance'
          }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            {children}
          </Suspense>
          <Preload all />
        </Canvas>
      </Suspense>
    </div>
  )
}
