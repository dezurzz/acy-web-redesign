'use client'

import * as React from 'react'

import { trackRaw, type AnalyticsEvent } from '@/lib/analytics'

/*
 * Click tracking without client code in every page (PRD §9). Any link or button with
 * data-analytics="<event name>" is recorded when clicked; its other data-analytics-* attributes
 * become the event fields, e.g.
 *   <a data-analytics="contact_click" data-analytics-channel="phone" data-analytics-location="kontak">
 * Fields are filtered by the event's allow-list in lib/analytics.ts. Mounted once in the layout.
 */
export function AnalyticsClicks() {
  React.useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest<HTMLElement>('[data-analytics]')
      if (!target) return
      const props: Record<string, string> = {}
      for (const [key, value] of Object.entries(target.dataset)) {
        // dataset turns data-analytics-session into analyticsSession.
        if (key.startsWith('analytics') && key !== 'analytics' && value !== undefined) {
          props[key.charAt(9).toLowerCase() + key.slice(10)] = value
        }
      }
      trackRaw(target.dataset.analytics ?? '', props)
    }
    // Capture phase, so the click is recorded even if the link opens a new tab or navigates.
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  return null
}

// React's development mode mounts components twice on purpose; an identical event within a second
// is that double mount, not a second view, so it is skipped (production mounts once anyway).
const recentViews = new Map<string, number>()

/**
 * Records an event when it renders, and again whenever `event` changes (e.g. new search results).
 * For page views and results that only the server knows (result counts).
 */
export function TrackView({ event }: { event: AnalyticsEvent }) {
  const signature = JSON.stringify(event)
  React.useEffect(() => {
    const now = Date.now()
    if (now - (recentViews.get(signature) ?? 0) < 1000) return
    recentViews.set(signature, now)
    trackRaw(event.name, event)
    // The signature captures every field; re-running on it records each new result exactly once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature])
  return null
}
