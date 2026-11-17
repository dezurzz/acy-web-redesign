import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'

// Reuse the design.md tokens so wireframe spacing and type match the real build.
import '../(frontend)/globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: { default: 'Wireframes', template: '%s · Wireframe | BKI Academy' },
  robots: { index: false, follow: false },
}

// Separate root layout: Phase 1 wireframes stay apart from the real site (src/app/(frontend)).
// Delete this route group once the Phase 2 coded prototype replaces it.
export default function WireframesLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={inter.variable} lang="id">
      <body className="min-h-dvh bg-white">{children}</body>
    </html>
  )
}
