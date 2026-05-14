import { Suspense } from 'react'
import { BuildWizard } from '@/components/configure/build-wizard'

export default function ConfigureLaptopPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-28 text-center text-muted-foreground">
          Loading laptop configurator…
        </div>
      }
    >
      <BuildWizard mode="laptop" />
    </Suspense>
  )
}
