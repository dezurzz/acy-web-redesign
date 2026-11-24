'use client'

import { usePathname, useRouter } from 'next/navigation'
import * as React from 'react'

type CatalogueContextValue = {
  /** True while the server renders results for the newest filter selection. */
  isPending: boolean
  navigate: (query: string) => void
}

const CatalogueContext = React.createContext<CatalogueContextValue | null>(null)

/*
 * Filters live in the URL (PRD §6, AC-03). Changing a filter replaces the URL without scrolling;
 * the server renders the new results. useTransition keeps the old results on screen and reports
 * isPending, so the page shows "Memuat pelatihan…" instead of going blank (animations.md §5.5).
 * A newer navigation supersedes an older one, so stale results never overwrite the latest choice.
 */
export function CatalogueProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = React.useTransition()

  const navigate = React.useCallback(
    (query: string) => {
      startTransition(() => router.replace(`${pathname}${query}`, { scroll: false }))
    },
    [pathname, router],
  )

  const value = React.useMemo(() => ({ isPending, navigate }), [isPending, navigate])
  return <CatalogueContext.Provider value={value}>{children}</CatalogueContext.Provider>
}

export function useCatalogue() {
  const context = React.useContext(CatalogueContext)
  if (!context) throw new Error('useCatalogue must be used inside <CatalogueProvider>')
  return context
}

/** Wraps the server-rendered results and announces loading without hiding them. */
export function ResultsRegion({ children }: { children: React.ReactNode }) {
  const { isPending } = useCatalogue()

  return (
    <div aria-busy={isPending || undefined} className="relative">
      <p className="sr-only" role="status">
        {isPending ? 'Memuat pelatihan…' : ''}
      </p>
      {isPending ? (
        <p aria-hidden className="mb-4 text-meta font-medium text-slate-600">
          Memuat pelatihan…
        </p>
      ) : null}
      {children}
    </div>
  )
}
