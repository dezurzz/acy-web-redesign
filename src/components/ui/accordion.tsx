'use client'

import { ChevronDown } from 'lucide-react'
import { Accordion as AccordionPrimitive } from 'radix-ui'
import * as React from 'react'

import { cn } from '@/lib/utils'

/*
 * FAQ accordion (design.md §8, animations.md §5.6).
 * Radix gives the button, aria-expanded/aria-controls, and removes collapsed content from the focus order.
 * Height animates over 220 ms using Radix's measured height (keyframes in globals.css); immediate under reduced motion.
 */

function Accordion({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root className={cn('border-t border-line-subtle', className)} {...props} />
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item className={cn('border-b border-line-subtle', className)} {...props} />
  )
}

function AccordionTrigger({
  children,
  className,
  headingLevel = 3,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & { headingLevel?: 2 | 3 | 4 }) {
  const Heading = `h${headingLevel}` as const

  return (
    <AccordionPrimitive.Header asChild>
      <Heading className="m-0">
        <AccordionPrimitive.Trigger
          className={cn(
            'group/acc flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left text-ui font-semibold text-navy-950 transition-colors duration-(--motion-fast) hover:text-blue-600',
            className,
          )}
          {...props}
        >
          {children}
          <ChevronDown
            aria-hidden
            className="size-5 shrink-0 transition-transform duration-(--motion-standard) ease-(--ease-standard) group-data-[state=open]/acc:rotate-180"
          />
        </AccordionPrimitive.Trigger>
      </Heading>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  children,
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn('max-w-[65ch] pb-5 text-body text-navy-800', className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
