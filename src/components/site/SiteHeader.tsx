import Link from 'next/link'

import { HeaderNav } from '@/components/site/HeaderNav'
import { MobileMenu } from '@/components/site/MobileMenu'
import { contactLink, portalLink } from '@/components/site/navigation'
import { SiteLogo } from '@/components/site/SiteLogo'
import { Button } from '@/components/ui/button'

/*
 * Site header (design.md §8, PRD §5).
 * Sticky with a constant 72 px height (--header-height); it never shrinks or auto-hides (animations.md §5.8).
 * Wide screens: logo, primary links, Portal Peserta, Hubungi Kami. Compact: logo and the Menu button.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line-subtle bg-white">
      <div className="container-page flex h-(--header-height) items-center justify-between gap-6">
        <SiteLogo />
        <HeaderNav />
        <div className="hidden items-center gap-4 lg:flex">
          <Link
            className="inline-flex min-h-11 items-center text-ui font-medium whitespace-nowrap text-navy-800 underline underline-offset-4 transition-colors duration-(--motion-fast) hover:text-blue-600"
            href={portalLink.href}
          >
            {portalLink.label}
          </Link>
          <Button asChild variant="secondary">
            <Link href={contactLink.href}>{contactLink.label}</Link>
          </Button>
        </div>
        <MobileMenu />
      </div>
    </header>
  )
}
