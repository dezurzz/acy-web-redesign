import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import * as React from 'react'

import { cn } from '@/lib/utils'

// design.md §8 and §12: 48 px minimum height, 20 px horizontal padding, 16 px text, no shadow.
const buttonVariants = cva(
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-control px-5 text-ui font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-5 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-blue-800 active:bg-blue-800',
        secondary:
          'border border-line-control bg-secondary text-secondary-foreground hover:bg-blue-50',
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
  }

function Button({ className, variant, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button'

  return <Comp className={cn(buttonVariants({ variant }), className)} data-slot="button" {...props} />
}

export { Button, buttonVariants }
