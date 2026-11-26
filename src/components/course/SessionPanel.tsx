'use client'

import { CalendarClock, MapPin } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import { Button, ButtonArrow } from '@/components/ui/button'
import { StatusBadge } from '@/components/ui/status-badge'
import { TextLink } from '@/components/ui/text-link'
import type { PanelSession } from '@/lib/course'
import { FEE_ON_REQUEST, formatRupiah } from '@/lib/format'
import { cn } from '@/lib/utils'
import { track } from '@/lib/analytics'

export const SESSION_PANEL_ID = 'jadwal-sesi'

/*
 * Session panel on the course detail page (design.md §8, PRD §6).
 * States: sessions available, session selected, no session ("Tanyakan Jadwal").
 * Sessions are a radio group; the selected option changes border/background over 160 ms.
 * Only an open session gets "Ajukan Pendaftaran" (AC-04). Full with waitlist gets "Masuk Daftar Tunggu".
 */
export function SessionPanel({
  course,
  sessions,
}: {
  /** Course slug, for the session_select analytics event. */
  course: string
  sessions: PanelSession[]
}) {
  const firstOpen = sessions.find((s) => s.status === 'open') ?? sessions[0]
  const [selectedId, setSelectedId] = React.useState(firstOpen?.id)
  const selected = sessions.find((s) => s.id === selectedId)

  return (
    <section
      aria-labelledby={SESSION_PANEL_ID}
      className="rounded-card border border-line-control bg-white p-5 md:p-6"
    >
      <h2
        className="scroll-mt-[calc(var(--header-height)+1.5rem)] text-h3 text-navy-950"
        id={SESSION_PANEL_ID}
        tabIndex={-1}
      >
        Jadwal tersedia
      </h2>

      {sessions.length === 0 ? (
        <div className="mt-4 flex flex-col gap-4">
          <p className="text-body text-navy-800">
            Jadwal berikutnya belum tersedia. Hubungi kami untuk informasi pelaksanaan.
          </p>
          <Button asChild className="w-full" variant="secondary">
            <Link href="/id/hubungi-kami">Tanyakan Jadwal</Link>
          </Button>
        </div>
      ) : (
        <>
          <fieldset className="mt-4 flex flex-col gap-3">
            <legend className="sr-only">Pilih jadwal pelaksanaan</legend>
            {sessions.map((session) => {
              const isSelected = session.id === selectedId
              return (
                <label
                  className={cn(
                    'flex cursor-pointer gap-3 rounded-card border p-4 transition-colors duration-(--motion-fast) ease-(--ease-standard) has-focus-visible:outline-3 has-focus-visible:outline-offset-3 has-focus-visible:outline-blue-600',
                    isSelected
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-line-subtle hover:border-line-control',
                  )}
                  key={session.id}
                >
                  <input
                    checked={isSelected}
                    className="mt-0.5 size-6 shrink-0 accent-blue-600 focus-visible:outline-none"
                    name="sesi"
                    onChange={() => {
                      setSelectedId(session.id)
                      track({ name: 'session_select', course, session: session.id })
                    }}
                    type="radio"
                    value={session.id}
                  />
                  <span className="flex min-w-0 flex-col gap-1 text-meta text-navy-800">
                    <span className="numeric text-ui font-semibold text-navy-950">
                      {session.dates}
                    </span>
                    <span className="numeric">{session.time}</span>
                    <span>
                      {session.format} · {session.venue}
                    </span>
                    <span className="mt-1">
                      <StatusBadge status={session.status} />
                    </span>
                  </span>
                </label>
              )
            })}
          </fieldset>

          {selected ? <SelectedSession session={selected} /> : null}
        </>
      )}
    </section>
  )
}

function SelectedSession({ session }: { session: PanelSession }) {
  return (
    <div aria-live="polite" className="mt-5 border-t border-line-subtle pt-5">
      <dl className="flex flex-col gap-3 text-meta">
        <div>
          <dt className="eyebrow text-slate-600">Biaya</dt>
          {session.fee ? (
            <dd>
              <span className="numeric block text-h3 font-semibold text-navy-950">
                {formatRupiah(session.fee)}
              </span>
              {session.taxWording ? (
                <span className="text-slate-600">{session.taxWording}</span>
              ) : null}
            </dd>
          ) : (
            <dd className="text-ui text-navy-800">{FEE_ON_REQUEST}</dd>
          )}
        </div>
        {session.deadline ? (
          <div className="flex items-start gap-2">
            <dt className="sr-only">Batas pendaftaran</dt>
            <CalendarClock aria-hidden className="mt-0.5 size-4 shrink-0 text-slate-600" />
            <dd className="numeric">Daftar paling lambat {session.deadline}</dd>
          </div>
        ) : null}
        <div className="flex items-start gap-2">
          <dt className="sr-only">Lokasi</dt>
          <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-slate-600" />
          <dd>
            {session.format} · {session.venue}
          </dd>
        </div>
      </dl>

      <div className="mt-5">
        <SessionAction session={session} />
      </div>
    </div>
  )
}

function SessionAction({ session }: { session: PanelSession }) {
  const register = `/id/pendaftaran?session=${session.id}`

  switch (session.status) {
    case 'open':
      return (
        <>
          <Button asChild className="w-full">
            <Link href={register}>
              Ajukan Pendaftaran
              <ButtonArrow />
            </Link>
          </Button>
          <p className="mt-3 text-meta text-slate-600">
            Ini permintaan, bukan pemesanan. Admin mengonfirmasi kursi lewat WhatsApp.
          </p>
        </>
      )
    case 'full-waitlist':
      return (
        <>
          <Button asChild className="w-full" variant="secondary">
            <Link href={register}>Masuk Daftar Tunggu</Link>
          </Button>
          <p className="mt-3 text-meta text-slate-600">
            Kursi penuh. Admin menghubungi Anda jika ada kursi kosong.
          </p>
        </>
      )
    case 'not-open':
      return <Note text="Pendaftaran untuk jadwal ini belum dibuka." />
    case 'postponed':
      return <Note text={session.postponementMessage ?? 'Jadwal ini ditunda.'} />
    default:
      return <Note text="Pendaftaran untuk jadwal ini sudah ditutup." />
  }
}

function Note({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-body text-navy-800">{text}</p>
      <TextLink arrow href="/id/hubungi-kami">
        Tanyakan Jadwal
      </TextLink>
    </div>
  )
}
