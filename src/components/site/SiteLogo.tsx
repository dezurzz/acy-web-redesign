import Link from 'next/link'
import * as React from 'react'

import { cn } from '@/lib/utils'

/*
 * Logo link back to the homepage (PRD §5).
 * Placeholder wordmark until the official logo files arrive (decision B-01, deferred).
 * Swap the inner span for the official SVG; never recreate the logo itself in text or CSS.
 */
export function SiteLogo({ className, ...props }: Omit<React.ComponentProps<typeof Link>, 'href'>) {
  return (
    <Link
      aria-label="BKI Academy, ke Beranda"
      className={cn('inline-flex min-h-11 items-center', className)}
      href="/id"
      {...props}
    >
      <span className="text-ui font-semibold whitespace-nowrap text-navy-950">BKI Academy</span>
    </Link>
  )
}
