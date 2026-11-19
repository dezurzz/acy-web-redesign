import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

type StepIndicatorProps = {
  className?: string
  /** Zero-based index of the current step. */
  current: number
  steps: string[]
}

// design.md §8 Step indicator: ordered list, text labels always visible, aria-current="step".
// animations.md: functional only, no motion beyond the colour change.
export function StepIndicator({ className, current, steps }: StepIndicatorProps) {
  return (
    <nav aria-label="Langkah pendaftaran" className={className}>
      <ol className="grid gap-3 md:auto-cols-fr md:grid-flow-col md:gap-4">
        {steps.map((label, index) => {
          const state = index < current ? 'complete' : index === current ? 'current' : 'upcoming'

          return (
            <li
              aria-current={state === 'current' ? 'step' : undefined}
              className={cn(
                'flex items-center gap-3 border-l-4 pl-3 md:border-t-4 md:border-l-0 md:pt-3 md:pl-0',
                state === 'upcoming'
                  ? 'border-line-subtle text-slate-600'
                  : 'border-blue-600 text-navy-950',
              )}
              key={label}
            >
              <span
                aria-hidden
                className={cn(
                  'numeric flex size-7 shrink-0 items-center justify-center rounded-full text-meta font-semibold',
                  state === 'complete' && 'bg-blue-600 text-white',
                  state === 'current' && 'border-2 border-blue-600 text-blue-600',
                  state === 'upcoming' && 'border border-line-control',
                )}
              >
                {state === 'complete' ? <Check className="size-4" /> : index + 1}
              </span>
              <span className={cn('text-ui', state === 'current' && 'font-semibold')}>
                {label}
                <span className="sr-only">
                  {state === 'complete' ? ' (selesai)' : state === 'upcoming' ? ' (belum)' : ''}
                </span>
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
