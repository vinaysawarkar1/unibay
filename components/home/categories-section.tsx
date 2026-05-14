'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { 
  Laptop, 
  Monitor, 
  Gamepad2, 
  Palette, 
  Briefcase, 
  Rocket,
  ArrowRight
} from 'lucide-react'
import { formatGBP } from '@/lib/currency'

const categories = [
  {
    id: 'gaming-laptops',
    title: 'Gaming Laptops',
    description: 'Portable powerhouses for gaming on the go',
    icon: Laptop,
    href: '/laptops/gaming',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-500',
    products: '12 Products',
    startingPrice: 1699,
  },
  {
    id: 'gaming-desktops',
    title: 'Gaming Desktops',
    description: 'Ultimate performance for serious gamers',
    icon: Monitor,
    href: '/desktops/gaming',
    gradient: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-500',
    products: '15 Products',
    startingPrice: 1299,
  },
  {
    id: 'esports',
    title: 'Esports Builds',
    description: 'Competitive gaming at 240+ FPS',
    icon: Gamepad2,
    href: '/gaming/esports',
    gradient: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-500',
    products: '8 Products',
    startingPrice: 1499,
  },
  {
    id: 'creator',
    title: 'Creator Systems',
    description: 'Optimized for content creation',
    icon: Palette,
    href: '/laptops/creator',
    gradient: 'from-orange-500/20 to-yellow-500/20',
    iconColor: 'text-orange-500',
    products: '10 Products',
    startingPrice: 2199,
  },
  {
    id: 'workstation',
    title: 'Workstations',
    description: 'Professional-grade computing power',
    icon: Briefcase,
    href: '/desktops/workstation',
    gradient: 'from-slate-500/20 to-zinc-500/20',
    iconColor: 'text-slate-400',
    products: '6 Products',
    startingPrice: 2999,
  },
  {
    id: 'extreme',
    title: 'Extreme Builds',
    description: 'No compromises, maximum performance',
    icon: Rocket,
    href: '/desktops/enthusiast',
    gradient: 'from-red-500/20 to-orange-500/20',
    iconColor: 'text-red-500',
    products: '4 Products',
    startingPrice: 4999,
  },
]

export function CategoriesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="container mx-auto px-4 lg:px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Find Your <span className="gradient-text">Perfect Build</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're a competitive gamer, content creator, or professional, 
            we have the perfect system for you.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={category.href}>
                <div className="group relative h-full">
                  <div className="relative h-full rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <div className="relative p-6">
                      {/* Icon */}
                      <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <category.icon className={`w-7 h-7 ${category.iconColor}`} />
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {category.description}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <p className="text-xs text-muted-foreground">{category.products}</p>
                          <p className="text-sm font-medium">
                            From <span className="text-primary">{formatGBP(category.startingPrice)}</span>
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-30 transition-opacity -z-10" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
