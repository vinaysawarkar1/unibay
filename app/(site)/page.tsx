import { HeroSection } from '@/components/home/hero-section'
import { FeaturedProducts } from '@/components/home/featured-products'
import { ConfiguratorPreview } from '@/components/home/configurator-preview'
import { CategoriesSection } from '@/components/home/categories-section'
import { FeaturesSection } from '@/components/home/features-section'
import { TechShowcase } from '@/components/home/tech-showcase'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { CTASection } from '@/components/home/cta-section'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <ConfiguratorPreview />
      <CategoriesSection />
      <FeaturesSection />
      <TechShowcase />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
