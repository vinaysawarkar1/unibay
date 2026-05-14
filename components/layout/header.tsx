'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, 
  X, 
  Search, 
  ShoppingCart, 
  User, 
  ChevronDown,
  Laptop,
  Monitor,
  Cpu,
  Gamepad2,
  Headphones,
  Sparkles,
  Package
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SiteLogo } from '@/components/brand/site-logo'
import { useCartStore, useUIStore } from '@/store'
import { cn } from '@/lib/utils'

const navigation = [
  {
    label: 'Laptops',
    href: '/laptops',
    icon: Laptop,
    children: [
      { label: 'Gaming Laptops', href: '/laptops/gaming', description: 'High-performance gaming machines' },
      { label: 'Creator Laptops', href: '/laptops/creator', description: 'For content creators & professionals' },
      { label: 'Ultraportable', href: '/laptops/ultraportable', description: 'Thin, light, powerful' },
      { label: 'All Laptops', href: '/laptops', description: 'Browse our complete range' },
    ]
  },
  {
    label: 'Desktops',
    href: '/desktops',
    icon: Monitor,
    children: [
      { label: 'Gaming PCs', href: '/desktops/gaming', description: 'Ultimate gaming rigs' },
      { label: 'Workstations', href: '/desktops/workstation', description: 'Professional-grade power' },
      { label: 'Compact PCs', href: '/desktops/compact', description: 'Small form factor builds' },
      { label: 'All Desktops', href: '/desktops', description: 'Browse our complete range' },
    ]
  },
  {
    label: 'Configure',
    href: '/configure',
    icon: Cpu,
    badge: 'New',
    children: [
      { label: 'Build Your Laptop', href: '/configure/laptop', description: 'Customize every component' },
      { label: 'Build Your Desktop', href: '/configure/desktop', description: 'Create your dream PC' },
      { label: 'Quick Build', href: '/configure/quick', description: 'AI-powered recommendations' },
    ]
  },
  {
    label: 'Gaming',
    href: '/gaming',
    icon: Gamepad2,
    children: [
      { label: 'By Game', href: '/gaming/games', description: 'Find the perfect PC for your games' },
      { label: 'Esports Builds', href: '/gaming/esports', description: 'Competitive gaming setups' },
      { label: 'Streaming Setups', href: '/gaming/streaming', description: 'Content creator bundles' },
    ]
  },
  {
    label: 'Accessories',
    href: '/accessories',
    icon: Headphones,
  },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, toggleSearch } =
    useUIStore()
  const { items } = useCartStore()
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled 
            ? 'glass-strong shadow-lg shadow-black/20' 
            : 'bg-transparent'
        )}
      >
        {/* Top Bar */}
        <div className="hidden lg:block border-b border-border/50">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-9 text-xs text-muted-foreground">
              <div className="flex items-center gap-6">
                <Link href="/support" className="hover:text-foreground transition-colors">
                  Support
                </Link>
                <Link href="/track-order" className="hover:text-foreground transition-colors">
                  Track Order
                </Link>
                <Link href="/financing" className="hover:text-foreground transition-colors flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  0% Financing Available
                </Link>
              </div>
              <div className="flex items-center gap-6">
                <Link href="/business" className="hover:text-foreground transition-colors">
                  Business Solutions
                </Link>
                <Link href="/education" className="hover:text-foreground transition-colors">
                  Education Discount
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <SiteLogo className="min-w-0" />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                      'hover:bg-secondary hover:text-foreground',
                      activeDropdown === item.label && 'bg-secondary text-foreground'
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary text-primary-foreground rounded">
                        {item.badge}
                      </span>
                    )}
                    {item.children && (
                      <ChevronDown className={cn(
                        'w-4 h-4 transition-transform',
                        activeDropdown === item.label && 'rotate-180'
                      )} />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {item.children && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 pt-2"
                      >
                        <div className="glass rounded-xl border border-border/50 p-2 min-w-[280px] shadow-xl shadow-black/20">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="flex flex-col gap-0.5 p-3 rounded-lg hover:bg-secondary transition-colors"
                            >
                              <span className="font-medium">{child.label}</span>
                              <span className="text-xs text-muted-foreground">
                                {child.description}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                aria-label="Search"
                type="button"
                onClick={toggleSearch}
              >
                <Search className="w-5 h-5" />
              </Button>

              <Link href="/account">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hidden sm:flex"
                  aria-label="Account"
                >
                  <User className="w-5 h-5" />
                </Button>
              </Link>

              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full relative"
                  aria-label="Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>

              <Link href="/configure" className="hidden sm:block">
                <Button className="glow-cyan ml-2">
                  <Cpu className="w-4 h-4 mr-2" />
                  Build Your PC
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-full"
                onClick={toggleMobileMenu}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={closeMobileMenu}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm glass-strong border-l border-border/50 z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-display text-lg font-bold">Menu</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={closeMobileMenu}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <nav className="space-y-2">
                  {navigation.map((item) => (
                    <div key={item.label}>
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <item.icon className="w-5 h-5 text-primary" />
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary text-primary-foreground rounded">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                      {item.children && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              onClick={closeMobileMenu}
                              className="block p-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>

                <div className="mt-8 pt-8 border-t border-border/50 space-y-4">
                  <Link href="/configure" onClick={closeMobileMenu}>
                    <Button className="w-full glow-cyan">
                      <Cpu className="w-4 h-4 mr-2" />
                      Build Your PC
                    </Button>
                  </Link>
                  <Link href="/account" onClick={closeMobileMenu}>
                    <Button variant="outline" className="w-full">
                      <User className="w-4 h-4 mr-2" />
                      Account
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 pt-8 border-t border-border/50 space-y-3 text-sm text-muted-foreground">
                  <Link href="/support" className="flex items-center gap-2 hover:text-foreground transition-colors">
                    Support
                  </Link>
                  <Link href="/track-order" className="flex items-center gap-2 hover:text-foreground transition-colors">
                    <Package className="w-4 h-4" />
                    Track Order
                  </Link>
                  <Link href="/financing" className="flex items-center gap-2 hover:text-foreground transition-colors">
                    <Sparkles className="w-4 h-4" />
                    0% Financing
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
