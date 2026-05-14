'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const testimonials = [
  {
    id: 1,
    name: 'Alex Chen',
    role: 'Professional Streamer',
    avatar: 'AC',
    rating: 5,
    content: 'The Titan Pro is an absolute beast. Stream quality is flawless, gaming is buttery smooth, and the RGB sync is chef\'s kiss. Best investment I\'ve made for my career.',
    product: 'UNIBAY Titan Pro',
    verified: true,
  },
  {
    id: 2,
    name: 'Sarah Mitchell',
    role: 'Video Editor',
    avatar: 'SM',
    rating: 5,
    content: 'Coming from a Mac, I was skeptical. But the Creator Station handles 8K footage like nothing. Render times cut in half. The build quality matches the performance.',
    product: 'UNIBAY Creator Station',
    verified: true,
  },
  {
    id: 3,
    name: 'Marcus Rodriguez',
    role: 'Competitive Gamer',
    avatar: 'MR',
    rating: 5,
    content: 'Finally hit Immortal after switching to the Phantom 17. 240Hz never looked so good. The cooling keeps temps in check even during tournament-length sessions.',
    product: 'UNIBAY Phantom 17',
    verified: true,
  },
  {
    id: 4,
    name: 'Emily Watson',
    role: 'Software Developer',
    avatar: 'EW',
    rating: 5,
    content: 'Multiple VMs, Docker containers, and VS Code all running without breaking a sweat. The Stealth 14 is my perfect daily driver - powerful yet portable.',
    product: 'UNIBAY Stealth 14',
    verified: true,
  },
  {
    id: 5,
    name: 'David Park',
    role: '3D Artist',
    avatar: 'DP',
    rating: 5,
    content: 'Blender renders that used to take hours now finish in minutes. The attention to detail in cable management and thermals shows UNIBAY really understands creators.',
    product: 'UNIBAY Creator Station',
    verified: true,
  },
  {
    id: 6,
    name: 'Jordan Taylor',
    role: 'Game Developer',
    avatar: 'JT',
    rating: 5,
    content: 'Unreal Engine 5 runs like a dream. The configurator made it easy to spec out exactly what I needed. Support team was incredibly helpful throughout.',
    product: 'UNIBAY Vortex',
    verified: true,
  },
]

export function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 lg:py-32 relative overflow-hidden bg-card">
      {/* Background */}
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-[128px]" />

      <div className="container mx-auto px-4 lg:px-6 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Loved by <span className="gradient-text">Professionals</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust UNIBAY for their 
            gaming and creative workloads.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-primary/20" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating 
                          ? 'fill-yellow-500 text-yellow-500' 
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>

                {/* Product Badge */}
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
                  {testimonial.product}
                  {testimonial.verified && (
                    <span className="ml-1 text-green-500">✓</span>
                  )}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <Avatar>
                    <AvatarFallback className="bg-secondary text-foreground">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '4.9/5', label: 'Average Rating' },
            { value: '50,000+', label: 'Happy Customers' },
            { value: '98%', label: 'Would Recommend' },
            { value: '12,000+', label: 'Five Star Reviews' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl lg:text-4xl font-bold gradient-text mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
