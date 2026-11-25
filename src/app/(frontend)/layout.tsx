import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'

import { IntroState } from '@/components/motion/IntroState'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import 'lenis/dist/lenis.css'
import './globals.css'

// Inter, self-hosted by next/font at build time (design.md §5).
const inter = Inter({
  subsets: ['latin'],
  // 300 for the light display and H1 type (design.md §5, v1.3).
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
})

// Every page shows contacts from the CMS (footer, Site settings), so the public site renders per
// request and never needs the database at build time. Revisit with cached pages + on-demand
// refresh once hosting is chosen (T-01).
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    default: 'BKI Academy',
    template: '%s | BKI Academy',
  },
  description: 'Pelatihan maritim profesional dari BKI Academy.',
  // Not indexable until launch (PRD §7: drafts are not publicly indexable).
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={inter.variable} lang="id">
      <body className="flex min-h-dvh flex-col">
        <a
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-3"
          href="#konten-utama"
        >
          Lewati ke konten utama
        </a>
        <SiteHeader />
        {/* pt reserves room for the fixed header; an atmosphere hero pulls itself back under it. */}
        <main className="flex-1 pt-(--header-height)" id="konten-utama">
          {children}
        </main>
        <SiteFooter />
        <SmoothScroll />
        <IntroState />
      </body>
    </html>
  )
}
