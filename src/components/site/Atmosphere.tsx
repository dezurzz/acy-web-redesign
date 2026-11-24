import type React from 'react'

import { cn } from '@/lib/utils'

/*
 * Atmospheric hero (design.md §4D, v1.3): deep navy-to-blue gradient with film grain, fading into
 * the page below. Built in two parts so text can never land on the light end:
 *   1. the deep part holds every word and control (white text, >= 4.5:1 everywhere);
 *   2. the fade below it is decoration only and ends in the next section's background colour.
 * As the first element of a page it slides under the floating header (data-hero, -mt header).
 * Static: no animated gradient (animations.md §5.10).
 */
export function Atmosphere({
  children,
  className,
  fadeTo = 'paper',
  fadeHeight = 'md',
  label,
}: {
  children: React.ReactNode
  className?: string
  /** Background of the section that follows. */
  fadeTo?: 'paper' | 'white'
  fadeHeight?: 'sm' | 'md' | 'lg'
  /** Accessible name for the hero region. */
  label?: string
}) {
  const fadeClass = { sm: 'h-28 md:h-40', md: 'h-36 md:h-56', lg: 'h-48 md:h-80' }[fadeHeight]

  return (
    <section
      aria-label={label}
      className="relative isolate -mt-(--header-height) overflow-hidden text-white"
      data-hero="atmosphere"
      data-surface="brand"
    >
      <div
        className={cn('relative bg-(image:--gradient-atmos-deep) pt-(--header-height)', className)}
      >
        {children}
      </div>
      <div
        aria-hidden
        className={cn(
          fadeTo === 'white'
            ? 'bg-(image:--gradient-atmos-fade-white)'
            : 'bg-(image:--gradient-atmos-fade-paper)',
          fadeClass,
        )}
      />
      {/* Grain fades out with the gradient so there is no seam against the next section. */}
      <div
        aria-hidden
        className="grain pointer-events-none absolute inset-0"
        style={{ maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)' }}
      />
    </section>
  )
}

/** "( Maritime Labour Convention )": Swiss parenthetical label. Brackets are hidden from screen readers. */
export function Paren({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-baseline gap-2', className)}>
      <span aria-hidden className="font-light opacity-60">
        (
      </span>
      <span>{children}</span>
      <span aria-hidden className="font-light opacity-60">
        )
      </span>
    </span>
  )
}

/**
 * Hairline grid with a crosshair, as on a chart or a plan. Decorative.
 * `y` is the horizontal line's distance from the top of its container; the vertical line sits
 * on the 8th of 12 columns (wide screens only).
 */
export function Crosshair({ mark, y = '58%' }: { mark?: string; y?: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-x-0 h-px bg-white/25" style={{ top: y }} />
      <div className="absolute inset-y-0 left-[66.666%] hidden w-px bg-white/25 lg:block" />
      <div
        className="absolute hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center lg:flex"
        style={{ top: y, left: '66.666%' }}
      >
        <span className="flex size-9 items-center justify-center rounded-full border border-white/50 bg-navy-950/30 eyebrow text-white/90">
          {mark ?? '+'}
        </span>
      </div>
    </div>
  )
}

/** In-flow hairline with an optional crosshair mark on the 8th-of-12 column line (wide screens). */
export function Hairline({ className, mark = false }: { className?: string; mark?: boolean }) {
  return (
    <div aria-hidden className={cn('relative h-px bg-white/25', className)}>
      {mark ? (
        <span className="absolute top-1/2 left-2/3 hidden size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-navy-950/40 text-ui font-light text-white/90 lg:flex">
          +
        </span>
      ) : null}
    </div>
  )
}
