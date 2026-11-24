import Link from 'next/link'

import { MotionToggle } from '@/components/site/MotionToggle'
import { siteSettings } from '@/lib/site-settings'

const columns = [
  {
    title: 'Pelatihan',
    links: [
      { href: '/id/pelatihan', label: 'Semua pelatihan' },
      { href: '/id/jadwal', label: 'Jadwal' },
      { href: '/id/in-house', label: 'In-house Training' },
      { href: '/id/mice', label: 'Layanan MICE' },
    ],
  },
  {
    title: 'BKI Academy',
    links: [
      { href: '/id/tentang-kami', label: 'Tentang Kami' },
      { href: '/id/portal-peserta', label: 'Portal Peserta' },
      { href: '/id/hubungi-kami', label: 'Hubungi Kami' },
    ],
  },
  {
    title: 'Ketentuan',
    links: [
      { href: '/id/ketentuan-pendaftaran', label: 'Ketentuan Pendaftaran' },
      { href: '/id/kebijakan-privasi', label: 'Kebijakan Privasi' },
    ],
  },
]

/*
 * Site footer (design.md §8): contact details, navigation, policies; stacked on phones, grid on
 * wide screens. MICE is linked here and from In-house only, never in the main nav (D-09).
 * Contacts come from Site settings and are marked "contoh" while they are placeholders (D-05).
 * Affiliation logos wait for the approved files and order (B-01).
 */
export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-navy-950 text-white" data-surface="dark">
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-6 lg:py-16">
        <div className="flex flex-col gap-4 lg:col-span-4">
          <p className="text-ui font-semibold">BKI Academy</p>
          <address className="text-meta text-line-subtle not-italic">
            {siteSettings.address.map((line) => (
              <span className="block" key={line}>
                {line}
              </span>
            ))}
          </address>
          <ul className="flex flex-col gap-1.5 text-meta">
            <li>
              WhatsApp <span className="numeric text-white">{siteSettings.whatsappDisplay}</span>
            </li>
            <li>
              Telepon <span className="numeric text-white">{siteSettings.phone}</span>
            </li>
            <li>
              Email <span className="text-white">{siteSettings.email}</span>
            </li>
            <li className="text-line-subtle">{siteSettings.serviceHours}</li>
          </ul>
          {siteSettings.isPlaceholder ? (
            <p className="text-meta text-cyan-400">
              Kontak di atas masih contoh, belum dapat dihubungi.
            </p>
          ) : null}
        </div>

        {columns.map((column) => (
          <nav aria-label={column.title} className="lg:col-span-2" key={column.title}>
            <p className="eyebrow text-line-subtle">{column.title}</p>
            <ul className="mt-4 flex flex-col gap-1">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    className="inline-flex min-h-10 items-center text-meta text-white underline-offset-4 hover:underline"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="lg:col-span-2">
          <MotionToggle />
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="container-page py-5 text-meta text-line-subtle">
          © <span className="numeric">{year}</span> PT Biro Klasifikasi Indonesia (Persero). BKI
          Academy adalah divisi pelatihan BKI.
        </div>
      </div>
    </footer>
  )
}
