'use client'

import * as React from 'react'

/*
 * Marks the header as scrolled (data-scrolled) once the page moves. CSS in globals.css then turns
 * the transparent hero header solid white (animations.md §5.8: background change only, the header
 * keeps its size and never hides). No React state: this only toggles one attribute.
 */
export function HeaderScrollState({ headerId }: { headerId: string }) {
  React.useEffect(() => {
    const header = document.getElementById(headerId)
    if (!header) return
    let frame = 0
    const update = () => {
      frame = 0
      header.toggleAttribute('data-scrolled', window.scrollY > 16)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [headerId])

  return null
}
