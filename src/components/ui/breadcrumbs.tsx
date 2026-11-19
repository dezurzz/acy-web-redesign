import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/lib/utils'

export type Crumb = { href?: string; label: string }

// design.md §8 Breadcrumbs: Beranda → kategori → kursus. The current page is plain text.
// On compact screens only the parent link is shown, so long course titles never truncate mid-word.
export function Breadcrumbs({ className, items }: { className?: string; items: Crumb[] }) {
  const parentIndex = items.length - 2

  return (
    <nav aria-label="Breadcrumb" className={cn('text-meta', className)}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1
          const hideOnCompact = !isCurrent && index !== parentIndex

          return (
            <li
              className={cn(
                'flex items-center gap-1.5',
                hideOnCompact && 'hidden md:flex',
                isCurrent && 'hidden md:flex',
              )}
              key={`${item.label}-${index}`}
            >
              {index > 0 ? (
                <ChevronRight
                  aria-hidden
                  className={cn(
                    'size-4 shrink-0 text-slate-600',
                    index === parentIndex && 'max-md:hidden',
                  )}
                />
              ) : null}
              {isCurrent || !item.href ? (
                <span aria-current={isCurrent ? 'page' : undefined} className="text-slate-600">
                  {item.label}
                </span>
              ) : (
                <Link
                  className="text-navy-800 underline underline-offset-4 hover:text-blue-600"
                  href={item.href}
                >
                  {index === parentIndex ? (
                    <span aria-hidden className="md:hidden">
                      ←{' '}
                    </span>
                  ) : null}
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
