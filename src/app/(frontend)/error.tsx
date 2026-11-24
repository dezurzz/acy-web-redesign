'use client'

import { ErrorPage } from '@/components/site/ErrorPage'
import { Button } from '@/components/ui/button'

// Branded 500 for unexpected errors on any public page (design.md §8 Error page).
// Pages with their own error.tsx (Pelatihan, Jadwal) keep their more specific message.
export default function SiteError({ reset }: { error: Error; reset: () => void }) {
  return <ErrorPage action={<Button onClick={reset}>Coba lagi</Button>} kind="500" />
}
