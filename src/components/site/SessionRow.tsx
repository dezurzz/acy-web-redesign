import { MapPin } from 'lucide-react'
import Link from 'next/link'

import { Button, ButtonArrow } from '@/components/ui/button'
import { StatusBadge, type SessionDisplayStatus } from '@/components/ui/status-badge'
import { TextLink } from '@/components/ui/text-link'
import { dateBlock, FEE_ON_REQUEST, formatDateRange, formatRupiah } from '@/lib/format'
import { cn } from '@/lib/utils'

export type SessionRowProps = {
  className?: string
  courseHref: string
  courseTitle: string
  endDate: string
  /** Null when the fee is not confirmed (decision D-02: never show Rp0). */
  fee: number | null
  /** e.g. "Tatap muka" */
  format: string
  /** Link to the WhatsApp handoff page for this session (PRD v1.3 §6). */
  registerHref: string
  postponementMessage?: string
  startDate: string
  status: SessionDisplayStatus
  taxWording?: string
  /** e.g. "Jakarta" or "Zoom" */
  venue: string
  /** e.g. "09.00–16.00 WIB" */
  time?: string
}

// design.md §8 Session row: date block, course, location/format, fee, labelled status, action.
// animations.md: Jadwal is minimal motion; rows never move and dates, fees and status never animate.
export function SessionRow(props: SessionRowProps) {
  const {
    className,
    courseHref,
    courseTitle,
    endDate,
    fee,
    format,
    postponementMessage,
    startDate,
    status,
    taxWording,
    time,
    venue,
  } = props
  const block = dateBlock(startDate, endDate)
  const muted = status === 'cancelled' || status === 'completed'

  return (
    <article
      className={cn(
        'grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-3 border-b border-line-subtle bg-white py-5 md:grid-cols-[5.5rem_minmax(0,1fr)_12rem_13rem] md:items-start md:gap-x-6',
        className,
      )}
    >
      <p className="numeric row-span-2 flex flex-col text-navy-950 md:row-span-1" aria-hidden>
        <span
          className={cn(
            'text-h3 leading-tight font-semibold',
            muted && 'text-slate-600 line-through',
          )}
        >
          {block.top}
        </span>
        <span className="text-meta text-slate-600">{block.bottom}</span>
      </p>

      <div className="flex min-w-0 flex-col gap-2">
        <h3 className="text-ui font-semibold text-navy-950">
          <Link
            className="underline-offset-4 hover:text-blue-600 hover:underline"
            href={courseHref}
          >
            {courseTitle}
          </Link>
        </h3>
        <p className="numeric text-meta text-navy-800">
          <span className="sr-only">Tanggal: </span>
          {formatDateRange(startDate, endDate)}
          {time ? ` · ${time}` : ''}
        </p>
        <p className="flex items-start gap-1.5 text-meta text-slate-600">
          <MapPin aria-hidden className="mt-0.5 size-4 shrink-0" />
          <span>
            {format} · {venue}
          </span>
        </p>
        <div>
          <StatusBadge status={status} />
        </div>
        {status === 'postponed' && postponementMessage ? (
          <p className="text-meta text-warning">{postponementMessage}</p>
        ) : null}
      </div>

      <div className="col-start-2 flex flex-col gap-1 md:col-start-auto">
        <p className="eyebrow text-slate-600">Biaya</p>
        {fee ? (
          <>
            <p className="numeric text-ui font-semibold text-navy-950">{formatRupiah(fee)}</p>
            {taxWording ? <p className="text-meta text-slate-600">{taxWording}</p> : null}
          </>
        ) : (
          <p className="text-meta text-navy-800">{FEE_ON_REQUEST}</p>
        )}
      </div>

      <div className="col-start-2 md:col-start-auto md:justify-self-end">
        <SessionAction {...props} />
      </div>
    </article>
  )
}

function SessionAction({ courseHref, courseTitle, registerHref, status }: SessionRowProps) {
  const label = <span className="sr-only">: {courseTitle}</span>

  switch (status) {
    case 'open':
      return (
        <Button asChild className="w-full md:w-auto">
          <Link href={registerHref}>
            Ajukan Pendaftaran{label}
            <ButtonArrow />
          </Link>
        </Button>
      )
    case 'full-waitlist':
      return (
        <Button asChild className="w-full md:w-auto" variant="secondary">
          <Link href={registerHref}>Masuk Daftar Tunggu{label}</Link>
        </Button>
      )
    case 'completed':
      return null
    default:
      return (
        <TextLink arrow href={courseHref}>
          Lihat Detail Pelatihan{label}
        </TextLink>
      )
  }
}
