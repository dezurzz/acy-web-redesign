'use client'

import * as React from 'react'

import { isMotionReduced } from '@/lib/motion'
import { cn } from '@/lib/utils'

/*
 * One-time editorial reveal (animations.md §5.9): opacity 0 → 1 and 12 px upward over 360 ms.
 * Progressive enhancement: the server HTML is fully visible. The group is hidden ("armed") only after
 * the observer is installed and only while it is below the fold, so content that is already visible,
 * or that receives focus, is never hidden. Reduced motion (OS or "Kurangi animasi") skips it entirely.
 * Use on a few non-essential groups only, never on hero, prices, dates or forms.
 */
export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return

    if (isMotionReduced() || el.getBoundingClientRect().top < window.innerHeight) return

    const show = () => {
      el.dataset.reveal = 'shown'
      observer.disconnect()
      el.removeEventListener('focusin', show)
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) show()
      },
      { rootMargin: '0px 0px -10% 0px' },
    )

    el.dataset.reveal = 'armed'
    observer.observe(el)
    el.addEventListener('focusin', show)

    return () => {
      observer.disconnect()
      el.removeEventListener('focusin', show)
      delete el.dataset.reveal
    }
  }, [])

  return (
    <div className={cn('reveal', className)} ref={ref}>
      {children}
    </div>
  )
}
