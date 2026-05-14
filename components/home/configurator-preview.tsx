'use client'

import { useRef, useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { 
  ArrowRight, 
  Cpu, 
  MonitorPlay, 
  HardDrive, 
  Fan, 
  Palette, 
  Zap,
  Check,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMergedProducts } from '@/hooks/use-merged-catalog'
import { formatGBP } from '@/lib/currency'

const steps = [
  {
    icon: Cpu,
    title: 'Choose Your Base',
    description: 'Select from our range of pre-configured systems or start from scratch',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: MonitorPlay,
    title: 'Select Components',
    description: 'Pick your processor, graphics card, memory, and storage',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Fan,
    title: 'Configure Cooling',
    description: 'Choose between air, AIO, or custom liquid cooling solutions',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Palette,
    title: 'Customize RGB',
    description: 'Design your perfect lighting setup with our RGB configurator',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10',
  },
  {
    icon: HardDrive,
    title: 'Review & Order',
    description: 'Check compatibility, see performance estimates, and place your order',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
]

const features = [
  'Real-time 3D visualization',
  'Automatic compatibility checking',
  'AI-powered recommendations',
  'Live performance estimates',
  'Price match guarantee',
  'Expert build verification',
]

export function ConfiguratorPreview() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeStep, setActiveStep] = useState(0)
  const products = useMergedProducts()
  const titan = useMemo(
    () => products.find((p) => p.slug === 'unibay-titan-pro'),
    [products]
  )
  const previewPrice = titan?.basePrice ?? 4299

  return (
    <section ref={ref} className="py-24 lg:py-32 relative overflow-hidden bg-card">
      {/* Background */}
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="absolute top-1/2 left-0 w-1/2 h-96 bg-primary/5 rounded-full blur-[128px] -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-1/2 h-96 bg-accent/5 rounded-full blur-[128px] -translate-y-1/2" />

      <div className="container mx-auto px-4 lg:px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            Advanced Configurator
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Build Your Dream PC in <span className="gradient-text">5 Easy Steps</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our intuitive configurator guides you through every step, ensuring 
            perfect compatibility and optimal performance.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.button
                  key={step.title}
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                    activeStep === index 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50 bg-background/50'
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${step.bgColor} flex items-center justify-center shrink-0`}>
                      <step.icon className={`w-6 h-6 ${step.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          Step {index + 1}
                        </span>
                        {activeStep > index && (
                          <span className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Check className="w-3 h-3 text-green-500" />
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {step.description}
                      </p>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      activeStep === index ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8">
              <Link href="/configure">
                <Button size="lg" className="glow-cyan group">
                  <Cpu className="w-5 h-5 mr-2" />
                  Start Configuring
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Preview Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative">
              {/* Main Card */}
              <div className="gradient-border rounded-2xl overflow-hidden">
                <div className="bg-card p-6 lg:p-8">
                  {/* Preview Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Configuration</p>
                      <h3 className="text-xl font-bold">{titan?.name ?? 'UNIBAY Titan Pro'}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Estimated Price</p>
                      <p className="text-2xl font-bold gradient-text">{formatGBP(previewPrice)}</p>
                    </div>
                  </div>

                  {/* 3D Preview Placeholder */}
                  <div className="relative aspect-video rounded-xl bg-secondary/50 mb-6 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <Zap className="w-10 h-10 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">3D Preview</p>
                      </div>
                    </div>
                    {/* RGB Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 animate-pulse" />
                  </div>

                  {/* Quick Specs */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { label: 'CPU', value: 'i9-14900KS' },
                      { label: 'GPU', value: 'RTX 4090' },
                      { label: 'RAM', value: '64GB DDR5' },
                      { label: 'Storage', value: '2TB NVMe' },
                    ].map((spec) => (
                      <div key={spec.label} className="p-3 rounded-lg bg-secondary/50">
                        <p className="text-xs text-muted-foreground">{spec.label}</p>
                        <p className="font-semibold">{spec.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Features List */}
                  <div className="grid grid-cols-2 gap-2">
                    {features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -right-6 glass rounded-xl p-3 shadow-xl hidden lg:block"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                  <span className="text-sm font-medium">100% Compatible</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute -bottom-6 -left-6 glass rounded-xl p-3 shadow-xl hidden lg:block"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Performance</p>
                    <p className="text-sm font-medium">4K Gaming Ready</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
