'use client'

import { useState, useCallback } from 'react'
import { 
  OrbitControls, 
  Environment, 
  ContactShadows,
  PerspectiveCamera,
  Float
} from '@react-three/drei'
import { SceneWrapper } from './scene-wrapper'
import { LaptopModel } from './laptop-model'
import { DesktopModel } from './desktop-model'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { 
  RotateCcw, 
  Maximize2, 
  Palette, 
  Sun,
  Layers,
  Eye,
  EyeOff
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProductViewerProps {
  productType: 'laptop' | 'desktop'
  color?: string
  className?: string
  onColorChange?: (color: string) => void
}

const colorOptions = [
  { name: 'Stealth Black', value: '#1a1a2e' },
  { name: 'Lunar Silver', value: '#4a4a5a' },
  { name: 'Nebula Purple', value: '#2a1a3e' },
  { name: 'Arctic White', value: '#e8e8e8' },
  { name: 'Crimson Red', value: '#3a1a1a' },
]

const rgbPresets = [
  { name: 'Cyan', value: '#00f5ff' },
  { name: 'Magenta', value: '#ff00ff' },
  { name: 'Green', value: '#00ff00' },
  { name: 'Orange', value: '#ff8800' },
  { name: 'Rainbow', value: 'rainbow' },
]

function Scene({ 
  productType, 
  color, 
  rgbColor, 
  showRGB,
  screenOpen 
}: { 
  productType: 'laptop' | 'desktop'
  color: string
  rgbColor: string
  showRGB: boolean
  screenOpen: number
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 1, 5]} fov={45} />
      <OrbitControls 
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
      />
      <spotLight
        position={[-10, 10, -10]}
        angle={0.15}
        penumbra={1}
        intensity={0.5}
      />
      <pointLight position={[0, -3, 0]} intensity={0.2} color="#00f5ff" />
      
      {/* Environment */}
      <Environment preset="city" />
      
      {/* Product Model */}
      <Float
        speed={1.5}
        rotationIntensity={0.1}
        floatIntensity={0.3}
      >
        {productType === 'laptop' ? (
          <LaptopModel 
            color={color}
            rgbColor={rgbColor}
            showRGB={showRGB}
            screenOpen={screenOpen}
            isRotating={false}
          />
        ) : (
          <DesktopModel
            color={color}
            rgbColor={rgbColor}
            showRGB={showRGB}
            isRotating={false}
          />
        )}
      </Float>
      
      {/* Shadows */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.5}
        scale={10}
        blur={2}
        far={4}
      />

      {/* Floor Grid */}
      <gridHelper args={[20, 20, '#1a1a2e', '#0a0a0f']} position={[0, -1.5, 0]} />
    </>
  )
}

export function ProductViewer({ 
  productType, 
  color: initialColor = '#1a1a2e',
  className,
  onColorChange 
}: ProductViewerProps) {
  const [color, setColor] = useState(initialColor)
  const [rgbColor, setRgbColor] = useState('#00f5ff')
  const [showRGB, setShowRGB] = useState(true)
  const [screenOpen, setScreenOpen] = useState(0.7)
  const [showControls, setShowControls] = useState(true)

  const handleColorChange = useCallback((newColor: string) => {
    setColor(newColor)
    onColorChange?.(newColor)
  }, [onColorChange])

  return (
    <div className={cn('relative rounded-2xl overflow-hidden bg-card border border-border', className)}>
      {/* 3D Canvas */}
      <SceneWrapper className="aspect-[16/10] md:aspect-video">
        <Scene 
          productType={productType}
          color={color}
          rgbColor={rgbColor}
          showRGB={showRGB}
          screenOpen={screenOpen}
        />
      </SceneWrapper>

      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          size="icon"
          variant="secondary"
          className="glass"
          onClick={() => setShowControls(!showControls)}
        >
          {showControls ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className="glass"
          onClick={() => setShowRGB(!showRGB)}
        >
          <Sun className="w-4 h-4" />
        </Button>
      </div>

      {/* Control Panel */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 glass border-t border-border/50 p-4">
          <div className="flex flex-wrap items-center gap-6">
            {/* Color Selection */}
            <div className="flex items-center gap-3">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <div className="flex gap-2">
                {colorOptions.map((opt) => (
                  <button
                    key={opt.name}
                    onClick={() => handleColorChange(opt.value)}
                    className={cn(
                      'w-6 h-6 rounded-full border-2 transition-all',
                      color === opt.value 
                        ? 'border-primary scale-110' 
                        : 'border-transparent hover:border-muted-foreground/50'
                    )}
                    style={{ backgroundColor: opt.value }}
                    title={opt.name}
                  />
                ))}
              </div>
            </div>

            {/* RGB Selection */}
            {showRGB && (
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-muted-foreground" />
                <div className="flex gap-2">
                  {rgbPresets.map((opt) => (
                    <button
                      key={opt.name}
                      onClick={() => setRgbColor(opt.value)}
                      className={cn(
                        'w-6 h-6 rounded-full border-2 transition-all',
                        rgbColor === opt.value 
                          ? 'border-primary scale-110' 
                          : 'border-transparent hover:border-muted-foreground/50',
                        opt.value === 'rainbow' && 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500'
                      )}
                      style={opt.value !== 'rainbow' ? { backgroundColor: opt.value } : {}}
                      title={opt.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Screen Angle (for laptop) */}
            {productType === 'laptop' && (
              <div className="flex items-center gap-3 flex-1 max-w-xs">
                <RotateCcw className="w-4 h-4 text-muted-foreground" />
                <Slider
                  value={[screenOpen * 100]}
                  onValueChange={([value]) => setScreenOpen(value / 100)}
                  min={20}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            )}

            {/* Fullscreen */}
            <Button size="sm" variant="ghost" className="ml-auto">
              <Maximize2 className="w-4 h-4 mr-2" />
              Fullscreen
            </Button>
          </div>
        </div>
      )}

      {/* Interaction Hint */}
      <div className="absolute top-4 left-4 text-xs text-muted-foreground glass px-3 py-1.5 rounded-full">
        Drag to rotate / Scroll to zoom
      </div>
    </div>
  )
}
