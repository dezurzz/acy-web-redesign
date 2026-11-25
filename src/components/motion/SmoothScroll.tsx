'use client'

import Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import { isMotionReduced, subscribeMotion } from '@/lib/motion'

/*
 * Smooth wheel scrolling with Lenis (animations.md §7, v1.2). Native scrolling stays underneath:
 * the page keeps its normal scrollbar, keyboard scrolling, find-in-page and focus scrolling.
 * - Off when motion is reduced (OS setting or "Kurangi animasi"); switches live when either changes.
 * - Touch devices keep native scrolling (Lenis default), so phones feel like phones.
 * - Stops while a modal locks the page (Radix sets data-scroll-locked on <body>), so the mobile
 *   menu and dialogs scroll on their own. Any element with data-lenis-prevent scrolls natively.
 * - Anchor links are left to the browser so the skip link still moves focus.
 */
export function SmoothScroll() {
  const lenisRef = React.useRef<Lenis | null>(null)
  const pathname = usePathname()

  React.useEffect(() => {
    const start = () => {
      if (lenisRef.current || isMotionReduced()) return
      // lerp (not a fixed duration): each frame closes 12% of the gap, so the page follows the
      // wheel closely and settles softly instead of trailing behind it ("heavy").
      lenisRef.current = new Lenis({ autoRaf: true, lerp: 0.12, wheelMultiplier: 1 })
    }
    const stop = () => {
      lenisRef.current?.destroy()
      lenisRef.current = null
    }
    const sync = () => (isMotionReduced() ? stop() : start())

    sync()
    const unsubscribe = subscribeMotion(sync)

    const lockObserver = new MutationObserver(() => {
      if (document.body.hasAttribute('data-scroll-locked')) lenisRef.current?.stop()
      else lenisRef.current?.start()
    })
    lockObserver.observe(document.body, { attributeFilter: ['data-scroll-locked'], attributes: true })

    return () => {
      unsubscribe()
      lockObserver.disconnect()
      stop()
    }
  }, [])

  // A new page starts at the top without gliding there from the old scroll position.
  React.useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true, force: true })
  }, [pathname])

  return null
}
