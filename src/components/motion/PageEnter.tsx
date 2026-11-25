'use client'

import { usePathname } from 'next/navigation'
import type React from 'react'

/*
 * Wraps each page in the "page-enter" fade (globals.css, animations.md §5.8).
 * Keyed by the path, so every new path gets a fresh element and the fade plays again. A Next.js
 * template alone is not enough: it only re-mounts when the segment right below it changes, and
 * every page lives under /id. Query changes (filters) keep the same path, so they do not fade.
 */
export function PageEnter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div className="page-enter" key={pathname}>
      {children}
    </div>
  )
}
