import { Suspense } from 'react'
import { BuildWizard } from '@/components/configure/build-wizard'

export default function ConfigureDesktopPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-28 text-center text-muted-foreground">
          Loading desktop configurator…
        </div>
      }
    >
      <BuildWizard mode="desktop" />
    </Suspense>
  )
}
