'use client'

import * as React from 'react'

import { useCatalogue } from '@/components/catalogue/CatalogueProvider'
import { LoadMore } from '@/components/ui/load-more'
import { PAGE_SIZE, toQuery, type CatalogueFilters } from '@/lib/catalogue-query'

/*
 * "Tampilkan lebih banyak" for the catalogue. The number shown is kept in the URL (tampil=16),
 * so the back button returns to the same list length. After loading, focus moves to the first
 * new course so keyboard users continue where the new items start.
 */
export function CatalogueLoadMore({
  filters,
  shownCount,
  totalCount,
  noun,
}: {
  filters: CatalogueFilters
  shownCount: number
  totalCount: number
  noun?: string
}) {
  const { isPending, navigate } = useCatalogue()
  const [previousCount, setPreviousCount] = React.useState<number | null>(null)
  const added = previousCount !== null && !isPending ? shownCount - previousCount : undefined

  React.useEffect(() => {
    if (added && previousCount !== null) {
      document.querySelector<HTMLElement>(`[data-result-index="${previousCount}"] h3 a`)?.focus()
    }
  }, [added, previousCount])

  return (
    <LoadMore
      addedCount={added}
      hasMore={shownCount < totalCount}
      loading={isPending && previousCount !== null}
      noun={noun}
      onLoadMore={() => {
        setPreviousCount(shownCount)
        navigate(toQuery({ ...filters, tampil: shownCount + PAGE_SIZE }))
      }}
      shownCount={shownCount}
      totalCount={totalCount}
    />
  )
}
