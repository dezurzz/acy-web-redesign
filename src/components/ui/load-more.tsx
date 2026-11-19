'use client'

import { Button } from '@/components/ui/button'

type LoadMoreProps = {
  /** How many items the last click added; announced politely. */
  addedCount?: number
  hasMore: boolean
  loading?: boolean
  onLoadMore: () => void
  shownCount: number
  totalCount: number
}

// design.md §8 Load more: button below results, announces how many items were added.
// The caller keeps filter state in the URL; this component only renders states.
export function LoadMore({
  addedCount,
  hasMore,
  loading = false,
  onLoadMore,
  shownCount,
  totalCount,
}: LoadMoreProps) {
  return (
    <div className="flex flex-col items-center gap-3 pt-8">
      <p className="numeric text-meta text-slate-600">
        Menampilkan {shownCount} dari {totalCount} pelatihan
      </p>
      {hasMore ? (
        <Button loading={loading} loadingText="Memuat…" onClick={onLoadMore} variant="secondary">
          Tampilkan lebih banyak
        </Button>
      ) : (
        <p className="text-meta text-slate-600">Semua pelatihan sudah ditampilkan.</p>
      )}
      <p aria-live="polite" className="sr-only">
        {addedCount ? `${addedCount} pelatihan ditambahkan.` : ''}
      </p>
    </div>
  )
}
