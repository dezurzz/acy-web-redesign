'use client'

import * as React from 'react'

import { isMotionReduced } from '@/lib/motion'
import { cn } from '@/lib/utils'

/*
 * One-time editorial reveal (animations.md §5.9, v1.3).
 * Each item (the <li>s of a list directly inside, otherwise the direct children) is watched on its
 * own and rises 56 px from transparent over 1.4 s once it is well inside the screen. Items that
 * arrive together (a row of cards) go one after another, 160 ms apart. A photo inside an item
 * (PhotoFrame's .unveil layer) opens from the bottom and settles from a zoom at the same time.
 * Progressive enhancement: the server HTML is fully visible. Items are hidden ("armed") only after
 * the observer is installed and only while below the fold, so content that is already visible, or
 * that receives focus, is never hidden. Reduced motion (OS or "Kurangi animasi") skips it entirely.
 * Use on a few non-essential groups only, never on hero, prices, dates or forms.
 */
const STEP_MS = 160

export function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window) || isMotionReduced()) return

    const listItems = el.querySelectorAll<HTMLElement>(':scope > ul > li, :scope > ol > li')
    const items = listItems.length
      ? Array.from(listItems)
      : (Array.from(el.children) as HTMLElement[])

    const show = (item: HTMLElement, delay = 0) => {
      item.style.setProperty('--reveal-delay', `${delay}ms`)
      item.dataset.reveal = 'shown'
      observer.unobserve(item)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target as HTMLElement)
          .sort((a, b) => items.indexOf(a) - items.indexOf(b))
          .forEach((item, order) => show(item, order * STEP_MS))
      },
      { rootMargin: '0px 0px -12% 0px' },
    )

    const armed = items.filter((item) => item.getBoundingClientRect().top >= window.innerHeight)
    armed.forEach((item) => {
      item.setAttribute('data-reveal-item', '')
      item.dataset.reveal = 'armed'
      observer.observe(item)
    })

    const onFocus = (event: FocusEvent) => {
      const item = armed.find((candidate) => candidate.contains(event.target as Node))
      if (item && item.dataset.reveal === 'armed') show(item)
    }
    el.addEventListener('focusin', onFocus)

    return () => {
      observer.disconnect()
      el.removeEventListener('focusin', onFocus)
      armed.forEach((item) => {
        item.removeAttribute('data-reveal-item')
        delete item.dataset.reveal
        item.style.removeProperty('--reveal-delay')
      })
    }
  }, [])

  return (
    <div className={cn('reveal', className)} ref={ref}>
      {children}
    </div>
  )
}
