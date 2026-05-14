import type { Metadata, Viewport } from 'next'
import { Inter, Orbitron, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://unibay.com'),
  title: {
    default: 'UNIBAY | Custom PC Systems — Gaming PCs & Laptops',
    template: '%s | UNIBAY',
  },
  description:
    'Build your dream gaming PC or laptop with UNIBAY Custom PC Systems. Premium components, real-time 3D configuration, AI-powered recommendations, and expert craftsmanship.',
  keywords: [
    'UNIBAY',
    'gaming PC',
    'custom PC builder',
    'gaming laptop',
    'PC configurator',
    'workstation',
    'RGB PC',
    'custom build',
  ],
  authors: [{ name: 'UNIBAY' }],
  creator: 'UNIBAY',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://unibay.com',
    siteName: 'UNIBAY',
    title: 'UNIBAY | Custom PC Systems — Gaming PCs & Laptops',
    description:
      'Build your dream gaming PC or laptop with UNIBAY. Premium components, real-time 3D configuration, AI-powered recommendations.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'UNIBAY — Custom PC Systems',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UNIBAY | Custom PC Systems — Gaming PCs & Laptops',
    description: 'Build your dream gaming PC or laptop with UNIBAY.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: '/unibay-logo.png', type: 'image/png' }],
    apple: '/unibay-logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#050B1A' },
    { media: '(prefers-color-scheme: dark)', color: '#050B1A' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable} ${jetbrainsMono.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
