import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <p className="text-sm text-muted-foreground mb-2">404</p>
      <h1 className="text-3xl font-bold mb-4">Page not found</h1>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        That URL is not part of this UNIBAY demo. Try the catalogue or configurator instead.
      </p>
      <Button asChild className="glow-cyan">
        <Link href="/">Back home</Link>
      </Button>
    </div>
  )
}
