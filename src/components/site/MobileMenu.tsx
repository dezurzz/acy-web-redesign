'use client'

import { ArrowRight, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Dialog } from 'radix-ui'

import { SiteLogo } from '@/components/site/SiteLogo'
import { contactLink, isActive, portalLink, primaryNav } from '@/components/site/navigation'
import { Button } from '@/components/ui/button'

/*
 * Compact-screen menu (design.md §8 Header, animations.md §5.4).
 * Radix Dialog does the accessibility work: focus moves into the menu and stays there,
 * Escape and the close button close it, focus returns to the "Menu" button,
 * and the page behind does not scroll.
 * Motion: overlay fade + 8 px panel movement over 220 ms, close over 140 ms (keyframes in globals.css).
 * Under reduced motion there is no animation, so Radix opens and closes it immediately.
 */
export function MobileMenu() {
  const pathname = usePathname()

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button
          className="inline-flex min-h-11 items-center gap-2 rounded-control border border-(--hdr-muted) px-4 text-ui font-semibold text-(--hdr-fg) transition-colors duration-(--motion-fast) hover:bg-(--hdr-hover) lg:hidden"
          type="button"
        >
          <Menu aria-hidden className="size-5" />
          Menu
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-navy-950/40 data-[state=closed]:animate-overlay-out data-[state=open]:animate-overlay-in lg:hidden" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 top-0 z-50 max-h-dvh overflow-y-auto bg-white shadow-overlay data-[state=closed]:animate-menu-out data-[state=open]:animate-menu-in lg:hidden"
        >
          <Dialog.Title className="sr-only">Menu navigasi</Dialog.Title>

          <div className="container-page flex min-h-18 items-center justify-between gap-6 border-b border-line-subtle">
            <Dialog.Close asChild>
              <SiteLogo />
            </Dialog.Close>
            <Dialog.Close asChild>
              <button
                className="inline-flex min-h-11 items-center gap-2 rounded-control border border-line-control px-4 text-ui font-semibold text-navy-950 transition-colors duration-(--motion-fast) hover:bg-blue-50"
                type="button"
              >
                <X aria-hidden className="size-5" />
                Tutup
              </button>
            </Dialog.Close>
          </div>

          <nav aria-label="Navigasi utama" className="container-page py-4">
            <ul className="flex flex-col">
              {primaryNav.map((link) => (
                <li className="border-b border-line-subtle" key={link.href}>
                  <Dialog.Close asChild>
                    <Link
                      aria-current={isActive(pathname, link.href) ? 'page' : undefined}
                      className="group/item flex min-h-14 items-center justify-between gap-4 text-h3 text-navy-950 transition-colors duration-(--motion-fast) hover:text-blue-600 aria-[current=page]:text-blue-600"
                      href={link.href}
                    >
                      <span className="aria-[current=page]:underline">{link.label}</span>
                      {isActive(pathname, link.href) ? (
                        <span className="text-meta font-medium">Halaman ini</span>
                      ) : (
                        <ArrowRight aria-hidden className="size-5 shrink-0" />
                      )}
                    </Link>
                  </Dialog.Close>
                </li>
              ))}
            </ul>
          </nav>

          <div className="container-page flex flex-col gap-3 pb-8">
            <Dialog.Close asChild>
              <Link
                aria-current={isActive(pathname, portalLink.href) ? 'page' : undefined}
                className="inline-flex min-h-11 items-center text-ui font-semibold text-blue-600 underline underline-offset-4 hover:text-blue-800"
                href={portalLink.href}
              >
                {portalLink.label}
              </Link>
            </Dialog.Close>
            <Dialog.Close asChild>
              <Button asChild variant="secondary">
                <Link href={contactLink.href}>{contactLink.label}</Link>
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
