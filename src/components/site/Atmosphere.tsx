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
      <div className={cn('relative pt-(--header-height)', className)}>
        {/* Own layer so the first-load intro can settle the gradient without moving the text. */}
        <div aria-hidden className="atmos-bg absolute inset-0 bg-(image:--gradient-atmos-deep)" />
        <div className="relative">{children}</div>
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

/**
 * Props for one step of the hero intro (animations.md §5.11): spread onto an element,
 * e.g. <h1 {...introStep(1)}>. `kind` "line" draws a hairline from the left, "fade" only fades.
 */
export function introStep(index: number, kind?: 'line' | 'fade') {
  return {
    'data-intro': kind ?? '',
    style: { '--intro-i': index } as React.CSSProperties,
  }
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

/** In-flow hairline. Decorative. */
export function Hairline({
  className,
  intro,
}: {
  className?: string
  /** Intro step index: the line draws in from the left on first load. */
  intro?: number
}) {
  return (
    <div
      aria-hidden
      className={cn('h-px bg-white/25', className)}
      {...(intro === undefined ? {} : introStep(intro, 'line'))}
    />
  )
}
