'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import { ErrorSummary } from '@/components/ui/error-summary'
import { LoadMore } from '@/components/ui/load-more'

// Interactive demos for the styleguide only.

export function ErrorSummaryDemo() {
  const [shown, setShown] = React.useState(false)

  return (
    <div className="flex flex-col items-start gap-4">
      {shown ? (
        <ErrorSummary
          errors={[
            { fieldId: 'sg-wa', message: 'Masukkan nomor WhatsApp yang aktif.' },
            { fieldId: 'sg-setuju-1', message: 'Centang persetujuan untuk melanjutkan.' },
          ]}
        />
      ) : null}
      <Button onClick={() => setShown((value) => !value)} variant="secondary">
        {shown ? 'Sembunyikan ringkasan' : 'Simulasikan kirim tidak valid'}
      </Button>
    </div>
  )
}

export function LoadMoreDemo() {
  const total = 22
  const [shown, setShown] = React.useState(9)
  const [added, setAdded] = React.useState<number>()
  const [loading, setLoading] = React.useState(false)

  return (
    <LoadMore
      addedCount={added}
      hasMore={shown < total}
      loading={loading}
      onLoadMore={() => {
        setLoading(true)
        // Simulated request for the demo.
        window.setTimeout(() => {
          const next = Math.min(shown + 9, total)
          setAdded(next - shown)
          setShown(next)
          setLoading(false)
        }, 800)
      }}
      shownCount={shown}
      totalCount={total}
    />
  )
}
