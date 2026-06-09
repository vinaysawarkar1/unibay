import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { GlobalSearchDialog } from '@/components/search/global-search-dialog'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/providers/auth-provider'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <GlobalSearchDialog />
        <Toaster richColors position="top-center" />
      </div>
    </AuthProvider>
  )
}

