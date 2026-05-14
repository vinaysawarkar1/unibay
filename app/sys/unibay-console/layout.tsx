import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'UNIBAY control',
  robots: { index: false, follow: false },
}

export default function AdminConsoleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-background text-foreground">{children}</div>
}
