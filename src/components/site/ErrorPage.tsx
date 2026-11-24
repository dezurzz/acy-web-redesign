import { CalendarDays, GraduationCap, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import type React from 'react'

import { cn } from '@/lib/utils'

export type ErrorKind = '404' | '500' | 'maintenance'

const content: Record<ErrorKind, { code: string; title: string; text: string }> = {
  '404': {
    code: '404',
    title: 'Halaman tidak ditemukan',
    text: 'Alamat ini mungkin salah ketik, atau halamannya sudah dipindahkan. Coba mulai dari salah satu halaman berikut.',
  },
  '500': {
    code: '500',
    title: 'Terjadi gangguan',
    text: 'Halaman ini gagal dimuat karena gangguan di sisi kami. Coba lagi sebentar lagi, atau buka halaman lain.',
  },
  maintenance: {
    code: 'Pemeliharaan',
    title: 'Situs sedang dalam pemeliharaan',
    text: 'Kami sedang memperbarui situs dan akan segera kembali. Untuk keperluan mendesak, hubungi kami.',
  },
}

const destinations = [
  {
    href: '/id/pelatihan',
    label: 'Pelatihan',
    text: 'Semua pelatihan BKI Academy',
    icon: GraduationCap,
  },
  { href: '/id/jadwal', label: 'Jadwal', text: 'Jadwal yang akan datang', icon: CalendarDays },
  {
    href: '/id/hubungi-kami',
    label: 'Hubungi Kami',
    text: 'Tanyakan langsung kepada tim',
    icon: MessageCircle,
  },
]

/*
 * Error page (design.md §8): H1, plain explanation, links to Pelatihan, Jadwal and Hubungi Kami,
 * inside the normal header and footer. States: 404, 500, maintenance.
 * `headingLevel` lets the styleguide preview it without adding a second H1 to that page.
 */
export function ErrorPage({
  action,
  className,
  headingLevel = 1,
  kind,
}: {
  /** Extra action, e.g. "Coba lagi" on the 500 page. */
  action?: React.ReactNode
  className?: string
  headingLevel?: 1 | 3
  kind: ErrorKind
}) {
  const { code, text, title } = content[kind]
  const Heading = `h${headingLevel}` as const

  return (
    <section className={cn('container-page py-16 lg:py-24', className)}>
      <div className="max-w-3xl">
        <p className="eyebrow text-blue-600">{code}</p>
        <Heading className="mt-3 text-h1 text-navy-950">{title}</Heading>
        <p className="mt-5 max-w-[60ch] text-intro text-navy-800">{text}</p>
        {action ? <div className="mt-8">{action}</div> : null}
      </div>
      <ul className="mt-12 grid max-w-4xl gap-4 md:grid-cols-3">
        {destinations.map(({ href, icon: Icon, label, text: hint }) => (
          <li key={href}>
            <Link
              className="group/dest flex h-full flex-col gap-2 rounded-card border border-line-subtle p-5 transition-colors duration-(--motion-fast) ease-(--ease-standard) hover:border-blue-600"
              href={href}
            >
              <Icon aria-hidden className="size-5 text-blue-600" />
              <span className="text-ui font-semibold text-navy-950 underline-offset-4 group-hover/dest:underline">
                {label}
              </span>
              <span className="text-meta text-slate-600">{hint}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
