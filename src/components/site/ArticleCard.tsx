import Link from 'next/link'

import { PhotoFrame } from '@/components/site/PhotoFrame'
import { formatDateRange } from '@/lib/format'
import { cn } from '@/lib/utils'

export type ArticleCardProps = {
  className?: string
  /** ISO date. For documentation this is when the activity happened. */
  date: string
  excerpt?: string
  href: string
  image?: { src: string; alt: string }
  title: string
  /** Articles and activity documentation carry separate labels (PRD §6). */
  type: 'artikel' | 'dokumentasi'
  /** Stable course page the item relates to, never an expired registration (PRD §6). */
  relatedCourse?: { href: string; title: string }
}

const typeLabel = { artikel: 'Artikel', dokumentasi: 'Dokumentasi kegiatan' } as const

/*
 * Article card (design.md §8): type, title, date, authentic image. Documentation shows its
 * historical date and links to the stable course page, with no "Daftar" button, so a past
 * activity never looks like an open session. Insight launches hidden as a fast-follow (D-11).
 */
export function ArticleCard({
  className,
  date,
  excerpt,
  href,
  image,
  relatedCourse,
  title,
  type,
}: ArticleCardProps) {
  return (
    <article
      className={cn(
        'group/article flex h-full flex-col gap-4 rounded-card border border-line-subtle bg-white p-4 transition-colors duration-(--motion-fast) ease-(--ease-standard) focus-within:border-blue-600 hover:border-blue-600',
        className,
      )}
    >
      <PhotoFrame
        alt={image?.alt ?? title}
        className="aspect-video"
        placeholderLabel="Foto dengan izin menyusul"
        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        src={image?.src}
      />
      <div className="flex flex-1 flex-col gap-2 px-1 pb-1">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-meta">
          <span
            className={cn(
              'rounded-card px-2 py-0.5 font-medium',
              type === 'artikel'
                ? 'bg-blue-50 text-navy-800'
                : 'border border-line-control text-slate-600',
            )}
          >
            {typeLabel[type]}
          </span>
          <time className="numeric text-slate-600" dateTime={date}>
            {formatDateRange(date)}
          </time>
        </p>
        <h3 className="text-h3 text-navy-950">
          <Link
            className="decoration-2 underline-offset-4 transition-colors duration-(--motion-fast) group-hover/article:text-blue-600 hover:underline"
            href={href}
          >
            {title}
          </Link>
        </h3>
        {excerpt ? <p className="text-body text-navy-800">{excerpt}</p> : null}
        {relatedCourse ? (
          <p className="mt-auto border-t border-line-subtle pt-3 text-meta text-slate-600">
            Pelatihan terkait:{' '}
            <Link
              className="font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800"
              href={relatedCourse.href}
            >
              {relatedCourse.title}
            </Link>
          </p>
        ) : null}
      </div>
    </article>
  )
}
