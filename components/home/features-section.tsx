'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  Shield, 
  Truck, 
  Headphones, 
  Award, 
  Wrench, 
  RefreshCcw,
  Clock,
  Cpu
} from 'lucide-react'

const features = [
  {
    icon: Cpu,
    title: 'Premium Components',
    description: 'Only top-tier components from trusted brands like NVIDIA, Intel, AMD, and Corsair.',
  },
  {
    icon: Shield,
    title: '3-Year Warranty',
    description: 'Comprehensive coverage including parts and labor for complete peace of mind.',
  },
  {
    icon: Wrench,
    title: 'Expert Assembly',
    description: 'Every system is hand-built by certified technicians with meticulous attention to detail.',
  },
  {
    icon: Award,
    title: 'Quality Testing',
    description: '48-hour burn-in testing and comprehensive benchmarks before shipping.',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Fast, insured delivery on all orders over £999. International shipping available.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Expert technical support available around the clock via phone, chat, or email.',
  },
  {
    icon: RefreshCcw,
    title: '30-Day Returns',
    description: 'Not satisfied? Return within 30 days for a full refund, no questions asked.',
  },
  {
    icon: Clock,
    title: 'Fast Build Times',
    description: 'Most systems ship within 5-7 business days. Rush options available.',
  },
]

export function FeaturesSection() {
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
            The <span className="gradient-text">UNIBAY Difference</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We go beyond just building PCs. Every system comes with exceptional 
            service, support, and warranty coverage.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl border border-border bg-card/50 transition-all duration-300 hover:border-primary/50 hover:bg-card">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
