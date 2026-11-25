import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import { cn } from '@/lib/utils'

type TextLinkProps = React.ComponentProps<typeof Link> & {
  /** Adds an arrow that moves 3 px on hover (animations.md §5.1). */
  arrow?: boolean
  /** Use on light text over navy, brand or photo surfaces. */
  inverse?: boolean
}

// design.md §8 Text link: always underlined, so it never depends on colour alone (design.md §3).
// animations.md §5.1 (v1.2): on hover the underline drops 2 px further from the text.
export function TextLink({
  arrow = false,
  children,
  className,
  inverse = false,
  ...props
}: TextLinkProps) {
  return (
    <Link
      className={cn(
        'group/link inline-flex items-center gap-1.5 font-medium underline underline-offset-4 transition-[color,text-decoration-color,text-underline-offset] duration-(--motion-standard) ease-(--ease-standard) hover:underline-offset-[6px]',
        inverse
          ? 'text-white decoration-white/70 hover:decoration-white'
          : 'text-blue-600 hover:text-blue-800 visited:text-blue-700',
        className,
      )}
      {...props}
    >
      {children}
      {arrow ? (
        <ArrowRight
          aria-hidden
          className="size-4 shrink-0 transition-transform duration-(--motion-fast) ease-(--ease-standard) group-hover/link:translate-x-(--move-icon)"
        />
      ) : null}
    </Link>
  )
}
