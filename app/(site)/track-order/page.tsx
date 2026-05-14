import { Suspense } from 'react'
import { TrackOrderClient } from './track-order-client'

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-24 text-center text-muted-foreground">
          Loading order tracker…
        </div>
      }
    >
      <TrackOrderClient />
    </Suspense>
  )
}
