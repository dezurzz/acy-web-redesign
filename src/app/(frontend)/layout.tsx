import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'

import { MOTION_STORAGE_KEY } from '@/lib/motion'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import './globals.css'

// Inter, self-hosted by next/font at build time (design.md §5).
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'BKI Academy',
    template: '%s | BKI Academy',
  },
  description: 'Pelatihan maritim profesional dari BKI Academy.',
  // Not indexable until launch (PRD §7: drafts are not publicly indexable).
  robots: { index: false, follow: false },
}

const motionScript = `try{if(localStorage.getItem('${MOTION_STORAGE_KEY}')==='1')document.documentElement.dataset.motion='reduced'}catch(e){}`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script may add data-motion before React hydrates.
    <html className={inter.variable} lang="id" suppressHydrationWarning>
      <head>
        {/* Apply a stored "Kurangi animasi" choice before first paint (animations.md §6). */}
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-3"
          href="#konten-utama"
        >
          Lewati ke konten utama
        </a>
        <SiteHeader />
        <main className="flex-1" id="konten-utama">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
