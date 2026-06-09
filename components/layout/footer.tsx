'use client'

import Link from 'next/link'
import { 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Twitch,
  Shield,
  Truck,
  Headphones
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SiteLogo } from '@/components/brand/site-logo'
import { FooterNewsletter } from '@/components/layout/footer-newsletter'

const footerLinks = {
  products: [
    { label: 'Gaming Laptops', href: '/laptops/gaming' },
    { label: 'Creator Laptops', href: '/laptops/creator' },
    { label: 'Gaming Desktops', href: '/desktops/gaming' },
    { label: 'Workstations', href: '/desktops/workstation' },
    { label: 'Accessories', href: '/accessories' },
    { label: 'Configure Your PC', href: '/configure' },
  ],
  support: [
    { label: 'Contact Us', href: '/support/contact' },
    { label: 'FAQs', href: '/support/faq' },
    { label: 'Warranty Info', href: '/support/warranty' },
    { label: 'Returns & Exchanges', href: '/support/returns' },
    { label: 'Track Your Order', href: '/track-order' },
    { label: 'Technical Support', href: '/support/technical' },
  ],
  company: [
    { label: 'About UNIBAY', href: '/company/about' },
    { label: 'Blog', href: '/blog' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/legal/privacy' },
    { label: 'Terms of Service', href: '/legal/terms' },
    { label: 'Cookie Policy', href: '/legal/cookies' },
    { label: 'Accessibility', href: '/legal/accessibility' },
  ],
}

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
  { icon: Twitch, href: 'https://twitch.tv', label: 'Twitch' },
]

const features = [
  { icon: Truck, label: 'Free Shipping', description: 'On orders over £999' },
  { icon: Shield, label: '1 Year Warranty', description: 'Comprehensive coverage' },
  { icon: Headphones, label: '24/7 Support', description: 'Expert assistance' },
]

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      {/* Features Bar */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 lg:px-6 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.label} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{feature.label}</p>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-4">
            <SiteLogo className="mb-6" imgClassName="h-10 sm:h-11" />
            <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
              Building the future of custom PCs. Premium components, expert craftsmanship, 
              and cutting-edge technology come together to create your perfect machine.
            </p>
            
            {/* Newsletter */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Stay Updated</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Get the latest news, exclusive offers, and early access to new products.
              </p>
                <FooterNewsletter />
            </div>

            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Products */}
              <div>
                <h4 className="font-semibold mb-4">Products</h4>
                <ul className="space-y-3">
                  {footerLinks.products.map((link) => (
                    <li key={link.label}>
                      <Link 
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-3">
                  {footerLinks.support.map((link) => (
                    <li key={link.label}>
                      <Link 
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.label}>
                      <Link 
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>0333 555 0190</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>support@unibay.com</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>
                      123 Tech Boulevard<br />
                      San Francisco, CA 94105
                    </span>
                  </li>
                </ul>
                <div className="mt-6">
                  <h5 className="font-medium text-sm mb-2">Business Hours</h5>
                  <p className="text-xs text-muted-foreground">
                    Mon-Fri: 9AM - 8PM EST<br />
                    Sat-Sun: 10AM - 6PM EST
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 lg:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {new Date().getFullYear()} UNIBAY. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              {footerLinks.legal.map((link) => (
                <Link 
                  key={link.label}
                  href={link.href}
                  className="hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
