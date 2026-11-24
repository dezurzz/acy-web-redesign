import type React from 'react'

import { Breadcrumbs } from '@/components/ui/breadcrumbs'

/** Breadcrumb, eyebrow, H1 and intro shared by the simpler content pages. */
export function PageIntro({
  children,
  eyebrow,
  intro,
  title,
}: {
  children?: React.ReactNode
  eyebrow?: string
  intro: string
  title: string
}) {
  return (
    <header className="max-w-3xl">
      <Breadcrumbs items={[{ href: '/id', label: 'Beranda' }, { label: title }]} />
      {eyebrow ? <p className="eyebrow mt-8 text-blue-600">{eyebrow}</p> : null}
      <h1 className={eyebrow ? 'mt-3 text-h1 text-navy-950' : 'mt-8 text-h1 text-navy-950'}>
        {title}
      </h1>
      <p className="mt-5 max-w-[60ch] text-intro text-navy-800">{intro}</p>
      {children}
    </header>
  )
}
