// Low-fidelity wireframe kit. Greyscale on purpose: Phase 1 agrees structure, not looks.
// Only design.md tokens are used (README Conventions).
import Link from 'next/link'
import React from 'react'

import { cn } from '@/lib/utils'

import { dummyContact, statusLabel, type WfSession, type WfStatus } from './_data'

/** Reviewer annotation. Dashed blue so it never reads as page content. */
export function Note({ children, refs }: { children: React.ReactNode; refs?: string }) {
  return (
    <aside className="my-3 rounded-sm border border-dashed border-blue-600 bg-blue-50 px-3 py-2 text-meta text-navy-800">
      <span className="font-semibold">Catatan{refs ? ` (${refs})` : ''}: </span>
      {children}
    </aside>
  )
}

/** Image placeholder. Real photos need permission (B-05). */
export function ImageBox({ label, className }: { label: string; className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'flex items-center justify-center rounded-image border border-line-control bg-paper p-4 text-center text-meta text-slate-600',
        className,
      )}
    >
      [{label}]
    </div>
  )
}

export function Btn({
  children,
  href = '#',
  variant = 'primary',
  className,
}: {
  children: React.ReactNode
  href?: string
  variant?: 'primary' | 'secondary' | 'link'
  className?: string
}) {
  const styles = {
    primary: 'min-h-12 bg-navy-800 px-5 text-white',
    secondary: 'min-h-12 border border-navy-800 bg-white px-5 text-navy-800',
    link: 'min-h-11 text-navy-800 underline underline-offset-4',
  }[variant]
  return (
    <Link
      className={cn(
        'inline-flex items-center justify-center rounded-control text-ui font-semibold',
        styles,
        className,
      )}
      href={href}
    >
      {children}
    </Link>
  )
}

export function StatusChip({ status }: { status: WfStatus }) {
  return (
    <span className="inline-flex rounded-sm border border-line-control bg-paper px-2 py-0.5 text-meta font-semibold text-navy-800">
      {statusLabel[status]}
    </span>
  )
}

export function FeeLabel({ fee }: { fee?: string }) {
  return fee ? (
    <span className="numeric">
      {fee} <span className="text-slate-600">· belum termasuk PPN*</span>
    </span>
  ) : (
    <span>Hubungi kami untuk biaya</span>
  )
}

export function SectionTitle({
  eyebrow,
  title,
  id,
}: {
  eyebrow?: string
  title: string
  id?: string
}) {
  return (
    <div className="mb-6">
      {eyebrow ? <p className="eyebrow text-slate-600">{eyebrow}</p> : null}
      <h2 className="mt-1 text-h2 text-navy-950" id={id}>
        {title}
      </h2>
    </div>
  )
}

/** Session row (design.md §8). Stacks on compact screens; never a calendar grid. */
export function SessionRow({ s }: { s: WfSession }) {
  const action = {
    open: <Btn href={`/wireframes/pendaftaran?session=${s.id}`}>Ajukan Pendaftaran</Btn>,
    'not-open': (
      <Btn href="/wireframes/detail-pelatihan" variant="secondary">
        Lihat Detail
      </Btn>
    ),
    full: (
      <Btn href="/wireframes/pendaftaran?state=full" variant="secondary">
        Tanyakan Jadwal Lain
      </Btn>
    ),
    closed: (
      <Btn href="/wireframes/pendaftaran?state=full" variant="secondary">
        Tanyakan Jadwal Lain
      </Btn>
    ),
    postponed: (
      <Btn href="/wireframes/detail-pelatihan" variant="secondary">
        Lihat Detail
      </Btn>
    ),
    cancelled: (
      <Btn href="/wireframes/jadwal" variant="secondary">
        Lihat Jadwal Lain
      </Btn>
    ),
  }[s.status]

  return (
    <li className="grid gap-4 border-b border-line-subtle py-5 md:grid-cols-[5rem_1fr_auto] md:items-center">
      <div className="flex h-20 w-20 flex-col items-center justify-center rounded-sm border border-line-control">
        <span className="numeric text-h3 text-navy-950">{s.dateBlock.day}</span>
        <span className="text-meta text-slate-600">{s.dateBlock.month}</span>
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip status={s.status} />
          <span className="text-meta text-slate-600">{s.format}</span>
        </div>
        <h3 className="mt-2 text-ui font-semibold text-navy-950">
          <Link className="underline-offset-4 hover:underline" href="/wireframes/detail-pelatihan">
            {s.course}
          </Link>
        </h3>
        <p className="mt-1 text-meta text-navy-800">
          {s.dates} · {s.time}
        </p>
        <p className="text-meta text-navy-800">
          {s.location} · <FeeLabel fee={s.fee} />
        </p>
        {s.note ? <p className="mt-2 text-meta font-semibold text-navy-800">{s.note}</p> : null}
      </div>
      <div className="md:text-right">{action}</div>
    </li>
  )
}

/** Banner that identifies the page as a wireframe and links back to the index. */
function WireframeBar({ title }: { title: string }) {
  return (
    <div className="bg-navy-950 text-white" data-surface="dark">
      <div className="container-page flex flex-wrap items-center justify-between gap-2 py-2 text-meta">
        <span>
          <span className="font-semibold">Wireframe fase 1</span> · {title} · data contoh, bukan
          konten resmi
        </span>
        <Link className="underline underline-offset-4" href="/wireframes">
          Semua wireframe
        </Link>
      </div>
    </div>
  )
}

const navLinks = [
  ['Pelatihan', '/wireframes/pelatihan'],
  ['Jadwal', '/wireframes/jadwal'],
  ['In-house Training', '/wireframes/in-house'],
  ['Tentang Kami', '#'],
] as const

function WfHeader() {
  return (
    <header className="border-b border-line-subtle bg-white">
      <div className="container-page flex min-h-18 items-center justify-between gap-6">
        <Link aria-label="Beranda" href="/wireframes/beranda">
          <ImageBox className="h-12 w-44 p-1" label="Logo BKI Academy" />
        </Link>
        <nav aria-label="Navigasi utama" className="hidden lg:block">
          <ul className="flex gap-5 whitespace-nowrap">
            {navLinks.map(([label, href]) => (
              <li key={label}>
                <Link className="text-ui text-navy-800" href={href}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden items-center gap-4 whitespace-nowrap lg:flex">
          <Btn href="/wireframes/portal-peserta" variant="link">
            Portal Peserta
          </Btn>
          <Btn href="#" variant="secondary">
            Hubungi Kami
          </Btn>
        </div>
        {/* Compact menu. Phase 2 replaces <details> with a focus-managed dialog (design.md §8). */}
        <details className="relative lg:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center rounded-control border border-navy-800 px-4 text-ui font-semibold">
            Menu
          </summary>
          <div className="absolute right-0 z-10 mt-2 w-64 rounded-sm border border-line-subtle bg-white p-4 shadow-overlay">
            <ul className="space-y-1">
              {navLinks.map(([label, href]) => (
                <li key={label}>
                  <Link className="flex min-h-11 items-center text-ui text-navy-800" href={href}>
                    {label}
                  </Link>
                </li>
              ))}
              <li className="border-t border-line-subtle pt-2">
                <Link
                  className="flex min-h-11 items-center text-ui text-navy-800"
                  href="/wireframes/portal-peserta"
                >
                  Portal Peserta
                </Link>
              </li>
              <li>
                <Link
                  className="flex min-h-11 items-center text-ui font-semibold text-navy-800"
                  href="#"
                >
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>
        </details>
      </div>
      <div className="container-page">
        <Note refs="D-07, D-08, D-11">
          Portal Peserta adalah tautan sekunder ke halaman pengarah. Tanpa pemilih bahasa, dan tanpa
          Insight sampai kontennya siap.
        </Note>
      </div>
    </header>
  )
}

function WfFooter() {
  return (
    <footer className="mt-16 border-t border-line-subtle bg-paper">
      <div className="container-page grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <ImageBox className="h-12 w-44 p-1" label="Logo BKI Academy" />
          <p className="mt-3 text-meta text-slate-600">PT Biro Klasifikasi Indonesia (Persero)</p>
        </div>
        <div>
          <p className="text-ui font-semibold">Kontak</p>
          <ul className="mt-2 space-y-1 text-meta">
            <li>Telepon: {dummyContact.phone}</li>
            <li>WhatsApp: {dummyContact.whatsapp}</li>
            <li>Email: {dummyContact.email}</li>
            <li>{dummyContact.address}</li>
            <li>{dummyContact.hours}</li>
          </ul>
        </div>
        <div>
          <p className="text-ui font-semibold">Jelajahi</p>
          <ul className="mt-2 space-y-1 text-meta">
            <li>Pelatihan</li>
            <li>Jadwal</li>
            <li>In-house Training</li>
            <li>MICE</li>
            <li>Tentang Kami</li>
            <li>Hubungi Kami</li>
            <li>Portal Peserta</li>
          </ul>
        </div>
        <div>
          <p className="text-ui font-semibold">Informasi</p>
          <ul className="mt-2 space-y-1 text-meta">
            <li>Kebijakan Privasi</li>
            <li>Ketentuan Pendaftaran</li>
          </ul>
          <ImageBox className="mt-4 h-12" label="Logo afiliasi resmi (B-01)" />
          <label className="mt-4 flex min-h-11 items-center gap-3 text-meta">
            <span aria-hidden className="h-6 w-6 rounded-sm border border-line-control" />
            Kurangi animasi
          </label>
        </div>
      </div>
      <div className="container-page pb-8">
        <Note refs="D-05, D-09">
          Semua kontak masih dummy. MICE hanya muncul di footer dan halaman In-house.
        </Note>
      </div>
    </footer>
  )
}

export function WfPage({
  title,
  motion,
  children,
}: {
  title: string
  /** This template's row of the motion map (design.md §7.1, rules in animations.md). */
  motion: string
  children: React.ReactNode
}) {
  return (
    <>
      <WireframeBar title={title} />
      <WfHeader />
      <div className="container-page">
        <Note refs="Gerak, animations.md, design.md §7.1">{motion}</Note>
      </div>
      <main id="konten-utama">{children}</main>
      <WfFooter />
    </>
  )
}
