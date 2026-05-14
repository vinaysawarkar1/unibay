'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const brands = [
  { name: 'NVIDIA', highlight: true },
  { name: 'Intel', highlight: true },
  { name: 'AMD', highlight: true },
  { name: 'ASUS' },
  { name: 'Corsair' },
  { name: 'Samsung' },
  { name: 'MSI' },
  { name: 'NZXT' },
  { name: 'Seagate' },
  { name: 'G.Skill' },
]

const techSpecs = [
  {
    label: 'Latest GPUs',
    items: ['RTX 4090', 'RTX 4080 Super', 'RTX 4070 Ti Super', 'RX 7900 XTX'],
  },
  {
    label: 'Latest CPUs',
    items: ['i9-14900KS', 'i7-14700K', 'Ryzen 9 9950X', 'Ryzen 7 9700X'],
  },
  {
    label: 'Memory',
    items: ['DDR5-6400', 'Up to 128GB', 'RGB Options', 'Low Latency'],
  },
  {
    label: 'Storage',
    items: ['Gen5 NVMe', '14,000 MB/s', 'Up to 8TB', 'RAID Support'],
  },
]

export function TechShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 lg:py-32 relative overflow-hidden bg-card">
      {/* Background */}
      <div className="absolute inset-0 dot-pattern opacity-30" />
      
      {/* Animated gradient lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Powered by the <span className="gradient-text">Best</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We partner with industry leaders to bring you the latest and most 
            powerful components available.
          </p>
        </motion.div>

        {/* Brand Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-8 lg:gap-12 mb-16"
        >
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
              className={`px-6 py-3 rounded-lg ${
                brand.highlight 
                  ? 'bg-primary/10 border border-primary/20' 
                  : 'bg-secondary/50'
              } transition-all duration-300 hover:scale-105`}
            >
              <span className={`font-semibold ${brand.highlight ? 'text-primary' : 'text-muted-foreground'}`}>
                {brand.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Tech Specs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techSpecs.map((spec, index) => (
            <motion.div
              key={spec.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl border border-border bg-background/50 transition-all duration-300 hover:border-primary/50">
                <h3 className="font-semibold text-lg mb-4 text-primary">
                  {spec.label}
                </h3>
                <ul className="space-y-2">
                  {spec.items.map((item) => (
                    <li 
                      key={item}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
