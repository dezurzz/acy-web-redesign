'use client'

import * as React from 'react'

/*
 * The hero intro (globals.css "Hero intro") plays once, on the first page the visitor opens.
 * After it has finished this marks <html data-intro-done>, so pages reached through the site's own
 * links do not replay it (animations.md §5.11, M-10); they get the short page fade instead.
 * Nothing waits for this: the intro is pure CSS and the content is in the server HTML.
 */
const INTRO_LENGTH_MS = 2400

/** The first-visit curtain delays the intro by --intro-offset (globals.css); wait for that too. */
function introOffsetMs() {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--intro-offset')
  return Number.parseFloat(value) || 0
}

export function IntroState() {
  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      // The page on screen already played the intro: exempt it from the page fade, or flipping
      // the flag would restart that fade from opacity 0 and the page would blink white.
      for (const page of document.querySelectorAll('.page-enter')) {
        page.setAttribute('data-entered', '')
      }
      document.documentElement.setAttribute('data-intro-done', '')
    }, INTRO_LENGTH_MS + introOffsetMs())
    return () => window.clearTimeout(timer)
  }, [])

  return null
}
