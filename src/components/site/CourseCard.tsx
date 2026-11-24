import { CalendarClock, Clock, Monitor } from 'lucide-react'
import Link from 'next/link'

import { TextLink } from '@/components/ui/text-link'
import { cn } from '@/lib/utils'

export type CourseCardProps = {
  category: string
  className?: string
  /** e.g. "3 hari" */
  duration: string
  /** e.g. "Tatap muka · Live online" */
  formats: string
  href: string
  /** Formatted date of the next open session, or null when nothing is scheduled. */
  nextSession: string | null
  outcome: string
  title: string
  /** Heading level inside the page outline. */
  headingLevel?: 2 | 3
}

// design.md §8 Course card: content-led, no poster image. One title link plus one separate action,
// no full-card overlay link (avoids nested interactive elements).
// animations.md §5.2: border and title emphasis change over 160 ms on hover/focus-within; no lift or shadow.
export function CourseCard({
  category,
  className,
  duration,
  formats,
  headingLevel = 3,
  href,
  nextSession,
  outcome,
  title,
}: CourseCardProps) {
  const Heading = `h${headingLevel}` as const

  return (
    <article
      className={cn(
        'group/card flex h-full flex-col gap-5 rounded-card border border-line-subtle bg-white p-6 transition-colors duration-(--motion-fast) ease-(--ease-standard) hover:border-blue-600 focus-within:border-blue-600 md:p-8',
        className,
      )}
    >
      <p className="eyebrow text-slate-600">{category}</p>
      <Heading className="text-h3 text-navy-950">
        <Link
          className="decoration-2 underline-offset-4 transition-colors duration-(--motion-fast) group-hover/card:text-blue-600 hover:underline"
          href={href}
        >
          {title}
        </Link>
      </Heading>
      <p className="text-body text-navy-800">{outcome}</p>

      <dl className="mt-auto flex flex-col gap-2 border-t border-line-subtle pt-4 text-meta">
        <div className="flex items-center gap-2">
          <dt className="sr-only">Durasi</dt>
          <Clock aria-hidden className="size-4 shrink-0 text-slate-600" />
          <dd>{duration}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="sr-only">Format</dt>
          <Monitor aria-hidden className="size-4 shrink-0 text-slate-600" />
          <dd>{formats}</dd>
        </div>
        <div className="flex items-start gap-2">
          <dt className="sr-only">Jadwal berikutnya</dt>
          <CalendarClock aria-hidden className="mt-0.5 size-4 shrink-0 text-slate-600" />
          <dd
            className={cn('numeric', nextSession ? 'font-medium text-navy-950' : 'text-slate-600')}
          >
            {nextSession ? `Jadwal berikutnya: ${nextSession}` : 'Jadwal berikutnya belum tersedia'}
          </dd>
        </div>
      </dl>

      <TextLink arrow href={href}>
        Lihat Detail Pelatihan<span className="sr-only">: {title}</span>
      </TextLink>
    </article>
  )
}
