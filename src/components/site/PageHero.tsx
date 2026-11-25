import type React from 'react'

import { Atmosphere, introStep, Paren } from '@/components/site/Atmosphere'
import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs'
import { cn } from '@/lib/utils'

/*
 * Interior page hero (design.md §4D, v1.3): breadcrumb, a parenthetical label, a large light H1,
 * the intro, and an optional facts column on the right (like the course posters: dates, place).
 * Everything sits in the deep part of the atmosphere; the fade leads into the page content.
 */
export function PageHero({
  actions,
  aside,
  breadcrumbs,
  fadeTo = 'white',
  intro,
  label,
  title,
  titleSize = 'h1',
}: {
  actions?: React.ReactNode
  aside?: React.ReactNode
  breadcrumbs: Crumb[]
  fadeTo?: 'paper' | 'white'
  intro?: React.ReactNode
  label?: string
  title: React.ReactNode
  titleSize?: 'h1' | 'display'
}) {
  return (
    <Atmosphere fadeHeight="sm" fadeTo={fadeTo}>
      <div className="container-page pt-8 pb-16 md:pt-10 md:pb-24">
        <div {...introStep(0, 'fade')}>
          <Breadcrumbs inverse items={breadcrumbs} />
        </div>
        <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-12 lg:gap-6">
          <div className={aside ? 'lg:col-span-8' : 'lg:col-span-10'}>
            {label ? (
              <p className="text-ui text-white/85" {...introStep(1)}>
                <Paren>{label}</Paren>
              </p>
            ) : null}
            <h1
              className={cn(
                'mt-6 text-white',
                titleSize === 'display' ? 'text-display' : 'text-h1 md:text-display',
              )}
              {...introStep(2)}
            >
              {title}
            </h1>
            {intro ? (
              <div className="mt-8 max-w-[58ch] text-intro text-white/90" {...introStep(3)}>
                {intro}
              </div>
            ) : null}
            {actions ? (
              <div
                className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
                {...introStep(4)}
              >
                {actions}
              </div>
            ) : null}
          </div>
          {aside ? (
            <div
              className="flex flex-col gap-4 border-t border-white/25 pt-6 lg:col-span-4 lg:self-end lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6"
              {...introStep(5)}
            >
              {aside}
            </div>
          ) : null}
        </div>
      </div>
    </Atmosphere>
  )
}
