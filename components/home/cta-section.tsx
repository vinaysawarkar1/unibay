'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Cpu, Phone, MessageCircle, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 animated-gradient" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[200px]" />

      <div className="container mx-auto px-4 lg:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center"
          >
            <Zap className="w-10 h-10 text-primary" />
          </motion.div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Build Your <br />
            <span className="gradient-text text-glow-cyan">Dream Machine?</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Start your build today and experience the UNIBAY difference. 
            Premium components, expert assembly, and exceptional support - all backed by our 3-year warranty.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/configure">
              <Button size="lg" className="glow-cyan group text-base px-8 h-14">
                <Cpu className="w-5 h-5 mr-2" />
                Start Building Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/support/contact">
              <Button size="lg" variant="outline" className="group text-base px-8 h-14">
                <MessageCircle className="w-5 h-5 mr-2" />
                Talk to an Expert
              </Button>
            </Link>
          </div>

          {/* Contact Options */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <a href="tel:+443335550190" className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="w-4 h-4" />
              0333 555 0190
            </a>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-border" />
            <span>Mon-Fri: 9AM - 8PM EST</span>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-border" />
            <span>Free shipping on orders over £999</span>
          </div>
        </motion.div>

        {/* Floating Cards */}
        <div className="hidden lg:block">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute left-8 top-1/2 -translate-y-1/2 glass rounded-xl p-4 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <span className="text-green-500 font-bold">0%</span>
              </div>
              <div>
                <p className="font-medium">Financing Available</p>
                <p className="text-xs text-muted-foreground">Up to 24 months</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute right-8 top-1/2 -translate-y-1/2 glass rounded-xl p-4 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">3yr</span>
              </div>
              <div>
                <p className="font-medium">Premium Warranty</p>
                <p className="text-xs text-muted-foreground">Parts + Labor included</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
