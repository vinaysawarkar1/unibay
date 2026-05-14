import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type SiteLogoProps = {
  className?: string
  imgClassName?: string
}

export function SiteLogo({ className, imgClassName }: SiteLogoProps) {
  return (
    <Link href="/" className={cn('flex items-center shrink-0', className)}>
      <Image
        src="/unibay-logo.png"
        alt="UNIBAY — Custom PC Systems"
        width={220}
        height={64}
        className={cn(
          'h-8 sm:h-9 md:h-10 w-auto max-w-[min(220px,55vw)] object-contain object-left',
          imgClassName
        )}
        priority
      />
    </Link>
  )
}
