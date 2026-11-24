import Link from 'next/link'

import { HeaderNav } from '@/components/site/HeaderNav'
import { HeaderScrollState } from '@/components/site/HeaderScrollState'
import { MobileMenu } from '@/components/site/MobileMenu'
import { contactLink, portalLink } from '@/components/site/navigation'
import { SiteLogo } from '@/components/site/SiteLogo'
import { Button } from '@/components/ui/button'

/*
 * Site header (design.md §8, PRD §5).
 * Fixed with a constant 72 px height (--header-height); it never shrinks or auto-hides (animations.md §5.8).
 * Over an atmosphere hero at the top of a page it is transparent with white text; once the page
 * scrolls it turns solid white (colours come from the .site-header variables in globals.css).
 * Wide screens: logo, primary links, Portal Peserta, Hubungi Kami. Compact: logo and the Menu button.
 */
export function SiteHeader() {
  return (
    <header className="site-header fixed inset-x-0 top-0 z-40" id="site-header">
      <HeaderScrollState headerId="site-header" />
      <div className="container-page flex h-(--header-height) items-center justify-between gap-6">
        <SiteLogo className="text-(--hdr-fg)" />
        <HeaderNav />
        <div className="hidden items-center gap-4 lg:flex">
          <Link
            className="inline-flex min-h-11 items-center text-ui font-medium whitespace-nowrap text-(--hdr-muted) underline underline-offset-4 transition-colors duration-(--motion-fast) hover:text-(--hdr-fg)"
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
