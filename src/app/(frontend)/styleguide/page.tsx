import type { Metadata } from 'next'

import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Styleguide' }

const colours = [
  ['navy-950', 'bg-navy-950'],
  ['navy-800', 'bg-navy-800'],
  ['blue-700', 'bg-blue-700'],
  ['blue-600', 'bg-blue-600'],
  ['blue-800', 'bg-blue-800'],
  ['cyan-400', 'bg-cyan-400'],
  ['blue-50', 'bg-blue-50'],
  ['paper', 'bg-paper'],
  ['slate-600', 'bg-slate-600'],
  ['line-subtle', 'bg-line-subtle'],
  ['line-control', 'bg-line-control'],
] as const

const statuses = [
  ['Dibuka', 'bg-success-surface text-success'],
  ['Belum dibuka', 'bg-blue-50 text-navy-800'],
  ['Penuh', 'border border-line-control bg-paper text-slate-600'],
  ['Ditunda', 'bg-warning-surface text-warning'],
  ['Dibatalkan', 'bg-danger-surface text-danger'],
] as const

// Living component sheet (replaces the separate design file, TIMELINE.md v1.2 Phase 2).
export default function StyleguidePage() {
  return (
    <div className="container-page space-y-16 py-16">
      <h1 className="text-h1 text-navy-950">Styleguide</h1>

      <section aria-labelledby="sg-colour">
        <h2 className="text-h2" id="sg-colour">
          Warna
        </h2>
        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {colours.map(([name, bg]) => (
            <li key={name}>
              <div className={`h-16 rounded-card border border-line-subtle ${bg}`} />
              <p className="mt-2 text-meta">{name}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 h-24 rounded-image bg-(image:--gradient-brand)" />
      </section>

      <section aria-labelledby="sg-type" className="space-y-4">
        <h2 className="text-h2" id="sg-type">
          Tipografi
        </h2>
        <p className="text-display">Display</p>
        <p className="text-h1">Heading 1</p>
        <p className="text-h2">Heading 2</p>
        <p className="text-h3">Heading 3</p>
        <p className="text-intro text-slate-600">Paragraf pembuka untuk ringkasan halaman.</p>
        <p className="max-w-[65ch] text-body">
          IMO Model Course 3.25 Security Awareness Training for all Port Facility Personnel. Judul
          panjang harus tetap terbaca utuh di layar kecil.
        </p>
        <p className="numeric text-meta text-slate-600">21–23 Oktober 2026 · 09.00–16.00 WIB · Rp 9.500.000</p>
        <p className="eyebrow text-slate-600">Eyebrow</p>
      </section>

      <section aria-labelledby="sg-buttons">
        <h2 className="text-h2" id="sg-buttons">
          Tombol
        </h2>
        <div className="mt-6 flex flex-wrap gap-4">
          <Button>Ajukan Pendaftaran</Button>
          <Button variant="secondary">Lihat Detail Pelatihan</Button>
          <Button disabled>Pendaftaran ditutup</Button>
          <Button variant="link">Lihat Jadwal</Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-4 bg-navy-950 p-6" data-surface="dark">
          <Button>Fokus di permukaan gelap</Button>
        </div>
        <div className="mt-6 flex flex-wrap gap-4 bg-(image:--gradient-brand) p-6" data-surface="brand">
          <Button variant="secondary">Fokus di gradien</Button>
        </div>
      </section>

      <section aria-labelledby="sg-status">
        <h2 className="text-h2" id="sg-status">
          Status jadwal
        </h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {statuses.map(([label, cls]) => (
            <li className={`rounded-card px-3 py-1 text-meta font-medium ${cls}`} key={label}>
              {label}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
