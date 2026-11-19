'use client'

import * as React from 'react'

import { MOTION_STORAGE_KEY } from '@/lib/motion'
import { cn } from '@/lib/utils'

/*
 * "Kurangi animasi" control (animations.md §6).
 * Effective reduction = OS prefers-reduced-motion OR the visitor's own choice.
 * The OS setting always wins; the toggle then explains why it cannot be turned off.
 * The visitor's choice lives on <html data-motion="reduced"> (set before paint by the inline
 * script in the root layout) and in localStorage when storage works.
 */

const OS_QUERY = '(prefers-reduced-motion: reduce)'
const CHANGE_EVENT = 'bki-motion-change'

function subscribeOs(onChange: () => void) {
  const query = window.matchMedia(OS_QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function subscribeUser(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange)
  return () => window.removeEventListener(CHANGE_EVENT, onChange)
}

const getOsReduced = () => window.matchMedia(OS_QUERY).matches
const getUserReduced = () => document.documentElement.dataset.motion === 'reduced'
const getServerValue = () => false

export function MotionToggle({ className }: { className?: string }) {
  // useSyncExternalStore reads browser state without a setState-in-effect round trip.
  const osReduced = React.useSyncExternalStore(subscribeOs, getOsReduced, getServerValue)
  const userReduced = React.useSyncExternalStore(subscribeUser, getUserReduced, getServerValue)
  const reduced = osReduced || userReduced

  function toggle() {
    const next = !userReduced
    try {
      if (next) window.localStorage.setItem(MOTION_STORAGE_KEY, '1')
      else window.localStorage.removeItem(MOTION_STORAGE_KEY)
    } catch {
      // Storage can be blocked; the choice still applies for this page view.
    }
    if (next) document.documentElement.dataset.motion = 'reduced'
    else delete document.documentElement.dataset.motion
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <button
        aria-describedby={osReduced ? 'kurangi-animasi-info' : undefined}
        aria-pressed={reduced}
        className="inline-flex min-h-11 items-center gap-3 text-meta font-medium disabled:cursor-not-allowed"
        disabled={osReduced}
        onClick={toggle}
        type="button"
      >
        <span
          aria-hidden
          className={cn(
            'relative inline-flex h-6 w-10 shrink-0 rounded-full border-2 transition-colors duration-(--motion-fast)',
            reduced ? 'border-cyan-400 bg-cyan-400' : 'border-line-control bg-transparent',
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 left-0.5 size-4 rounded-full transition-transform duration-(--motion-fast) ease-(--ease-standard)',
              reduced ? 'translate-x-4 bg-navy-950' : 'bg-line-subtle',
            )}
          />
        </span>
        Kurangi animasi
      </button>
      {osReduced ? (
        <p className="text-meta opacity-80" id="kurangi-animasi-info">
          Animasi sudah dikurangi oleh pengaturan perangkat Anda.
        </p>
      ) : null}
    </div>
  )
}
