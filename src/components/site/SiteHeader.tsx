import Link from 'next/link'

const primaryLinks = [
  { href: '/id/pelatihan', label: 'Pelatihan' },
  { href: '/id/jadwal', label: 'Jadwal' },
  { href: '/id/in-house', label: 'In-house Training' },
  { href: '/id/tentang-kami', label: 'Tentang Kami' },
  { href: '/id/insight', label: 'Insight' },
]

// Navigation per PRD §5. Mobile menu and active states arrive with the component library (Phase 2).
export function SiteHeader() {
  return (
    <header className="border-b border-line-subtle bg-white">
      <div className="container-page flex min-h-18 items-center justify-between gap-6">
        <Link className="text-ui font-semibold text-navy-950" href="/id">
          BKI Academy
        </Link>
        <nav aria-label="Navigasi utama" className="hidden lg:block">
          <ul className="flex gap-6">
            {primaryLinks.map((link) => (
              <li key={link.href}>
                <Link className="text-ui text-navy-800 hover:text-blue-600" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link className="text-ui font-semibold text-blue-600 underline underline-offset-4" href="/id/hubungi-kami">
          Hubungi Kami
        </Link>
      </div>
    </header>
  )
}
