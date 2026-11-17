import type { Metadata } from 'next'
import Link from 'next/link'

import { templates } from '../_data'

export const metadata: Metadata = { title: 'Mobile + desktop' }

// Shows one template at 390 px and 1440 px side by side (TIMELINE.md Phase 2 review widths).
export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>
}) {
  const { p } = await searchParams
  const current = templates.find((t) => t.slug === p) ?? templates[0]
  const src = `/wireframes/${current.slug}`

  return (
    <div className="space-y-6 px-4 py-6">
      <div className="flex flex-wrap items-center gap-4">
        <Link className="text-ui font-semibold underline underline-offset-4" href="/wireframes">
          ← Semua wireframe
        </Link>
        <nav aria-label="Template">
          <ul className="flex flex-wrap gap-2">
            {templates.map((t) => (
              <li key={t.slug}>
                <Link
                  aria-current={t.slug === current.slug ? 'page' : undefined}
                  className={
                    t.slug === current.slug
                      ? 'inline-flex min-h-11 items-center rounded-control bg-navy-800 px-3 text-meta text-white'
                      : 'inline-flex min-h-11 items-center rounded-control border border-line-control px-3 text-meta'
                  }
                  href={`/wireframes/bandingkan?p=${t.slug}`}
                >
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="flex flex-wrap items-start gap-8">
        <figure>
          <figcaption className="mb-2 text-meta text-slate-600">
            Mobile · 390 px (skala 75%)
          </figcaption>
          <div
            className="overflow-hidden border border-line-control"
            style={{ width: 293, height: 633 }}
          >
            <iframe
              src={src}
              style={{
                width: 390,
                height: 844,
                transform: 'scale(0.75)',
                transformOrigin: '0 0',
                border: 0,
              }}
              title={`${current.name}, mobile`}
            />
          </div>
        </figure>
        <figure>
          <figcaption className="mb-2 text-meta text-slate-600">
            Desktop · 1440 px (skala 50%)
          </figcaption>
          <div
            className="overflow-hidden border border-line-control"
            style={{ width: 720, height: 633 }}
          >
            <iframe
              src={src}
              style={{
                width: 1440,
                height: 1266,
                transform: 'scale(0.5)',
                transformOrigin: '0 0',
                border: 0,
              }}
              title={`${current.name}, desktop`}
            />
          </div>
        </figure>
      </div>
    </div>
  )
}
