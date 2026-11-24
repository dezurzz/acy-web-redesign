import type { Metadata } from 'next'

import { ErrorPage } from '@/components/site/ErrorPage'

export const metadata: Metadata = { title: 'Halaman tidak ditemukan' }

// Branded 404 inside the site header and footer (design.md §8 Error page).
// Used by notFound() (e.g. an unknown course slug) and by the catch-all route for unknown URLs.
export default function NotFound() {
  return <ErrorPage kind="404" />
}
