'use client'

import * as React from 'react'

import { SESSION_PANEL_ID } from '@/components/course/SessionPanel'
import { Button } from '@/components/ui/button'
import { isMotionReduced } from '@/lib/motion'
import { cn } from '@/lib/utils'

/*
 * Mobile CTA bar (design.md §8): compact screens only, next session date + one action.
 * Fixed to the bottom with safe-area padding; the page reserves the same space (pb-28) so it
 * never covers content. It hides while the footer or a form error summary is on screen.
 * The bar never changes size (animations.md §5.8).
 */
export function MobileCtaBar({ nextSession }: { nextSession: string | null }) {
  const [hidden, setHidden] = React.useState(false)

  React.useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const targets = document.querySelectorAll('footer, [data-error-summary]')
    const visible = new Set<Element>()
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target)
        else visible.delete(entry.target)
      }
      setHidden(visible.size > 0)
    })
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  const goToSessions = () => {
    const heading = document.getElementById(SESSION_PANEL_ID)
    if (!heading) return
    heading.scrollIntoView({ behavior: isMotionReduced() ? 'auto' : 'smooth', block: 'start' })
    heading.focus({ preventScroll: true })
  }

  return (
    <div
      aria-hidden={hidden || undefined}
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 border-t border-line-control bg-white pb-[env(safe-area-inset-bottom)] transition-opacity duration-(--motion-fast) lg:hidden',
        hidden && 'invisible opacity-0',
      )}
    >
      <div className="container-page flex min-h-18 items-center justify-between gap-3 py-3">
        <p className="min-w-0 text-meta">
          <span className="block text-slate-600">Jadwal berikutnya</span>
          <span className="numeric block truncate font-semibold text-navy-950">
            {nextSession ?? 'Belum tersedia'}
          </span>
        </p>
        <Button className="shrink-0" onClick={goToSessions} tabIndex={hidden ? -1 : undefined}>
          {nextSession ? 'Pilih Jadwal' : 'Tanyakan Jadwal'}
        </Button>
      </div>
    </div>
  )
}
