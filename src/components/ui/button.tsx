import { cva, type VariantProps } from 'class-variance-authority'
import { ArrowRight } from 'lucide-react'
import { Slot } from 'radix-ui'
import * as React from 'react'

import { cn } from '@/lib/utils'

// design.md §8 and §12: 48 px minimum height, 20 px horizontal padding, 16 px text, no shadow.
// animations.md §5.1: colours change over 160 ms, press darkens over 100 ms, nothing shrinks.
const buttonVariants = cva(
  'group/button inline-flex min-h-12 items-center justify-center gap-2 rounded-control px-5 text-ui font-semibold whitespace-nowrap transition-colors duration-(--motion-fast) ease-(--ease-standard) active:duration-(--motion-press) disabled:cursor-not-allowed disabled:not-aria-busy:opacity-50 aria-busy:cursor-progress [&_svg]:size-5 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground hover:bg-blue-800 active:bg-blue-700 disabled:hover:bg-primary',
        secondary:
          'border border-line-control bg-secondary text-secondary-foreground hover:bg-blue-50 active:bg-blue-50 active:border-navy-800 disabled:hover:bg-secondary',
        link: 'min-h-11 px-0 text-blue-600 underline underline-offset-4 hover:text-blue-800',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    /** Shows `loadingText` in place of the label, keeps the width, and blocks repeat clicks. */
    loading?: boolean
    loadingText?: string
  }

function Button({
  asChild = false,
  children,
  className,
  disabled,
  loading = false,
  loadingText = 'Memproses…',
  variant,
  ...props
}: ButtonProps) {
  if (asChild) {
    return (
      <Slot.Root
        className={cn(buttonVariants({ variant }), className)}
        data-slot="button"
        {...props}
      >
        {children}
      </Slot.Root>
    )
  }

  return (
    <button
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant }), className)}
      data-slot="button"
      disabled={disabled || loading}
      {...props}
    >
      {/* Both labels share one grid cell, so the button keeps the width of the longer one. */}
      <span className="grid place-items-center">
        <span
          aria-hidden={loading || undefined}
          className={cn(
            'col-start-1 row-start-1 inline-flex items-center gap-2',
            loading && 'invisible',
          )}
        >
          {children}
        </span>
        {loading ? <span className="col-start-1 row-start-1">{loadingText}</span> : null}
      </span>
    </button>
  )
}

/**
 * Optional arrow (animations.md §5.1, v1.2). On hover the arrow slides out to the right and a
 * second one slides in from the left, inside a clipped box the size of the icon. Only the icon
 * moves; the label and hit area stay put.
 */
function ButtonArrow() {
  const arrow =
    'transition-transform duration-(--motion-arrow) ease-(--ease-expo) group-disabled/button:translate-x-0'
  return (
    <span aria-hidden className="relative inline-flex size-5 shrink-0 overflow-hidden">
      <ArrowRight className={cn(arrow, 'group-hover/button:translate-x-[130%]')} />
      <ArrowRight
        className={cn(
          arrow,
          'absolute inset-0 -translate-x-[130%] group-hover/button:translate-x-0',
        )}
      />
    </span>
  )
}

export { Button, ButtonArrow, buttonVariants }
