import { CalendarClock, CircleAlert, CircleCheck, Info, type LucideIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

type Tone = 'success' | 'error' | 'warning' | 'info'

const tones: Record<Tone, { icon: LucideIcon; className: string; iconClass: string }> = {
  success: {
    icon: CircleCheck,
    className: 'border-success bg-success-surface',
    iconClass: 'text-success',
  },
  error: {
    icon: CircleAlert,
    className: 'border-danger bg-danger-surface',
    iconClass: 'text-danger',
  },
  warning: {
    icon: CalendarClock,
    className: 'border-warning bg-warning-surface',
    iconClass: 'text-warning',
  },
  info: { icon: Info, className: 'border-blue-600 bg-blue-50', iconClass: 'text-blue-600' },
}

type FeedbackPanelProps = {
  /** Next action: a button or link. */
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  title: string
  tone: Tone
}

// design.md §8 Feedback panel: status icon + label, short explanation, next action.
// Use "success" only after the server confirmed the save (animations.md §5.7).
export function FeedbackPanel({ action, children, className, title, tone }: FeedbackPanelProps) {
  const { className: toneClass, icon: Icon, iconClass } = tones[tone]

  return (
    <div
      className={cn('flex gap-3 rounded-card border-l-4 p-5 md:p-6', toneClass, className)}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      <Icon aria-hidden className={cn('mt-0.5 size-5 shrink-0', iconClass)} />
      <div className="flex flex-col gap-2">
        <p className="text-ui font-semibold text-navy-950">{title}</p>
        <div className="text-body text-navy-800">{children}</div>
        {action ? <div className="mt-2 flex flex-wrap gap-3">{action}</div> : null}
      </div>
    </div>
  )
}
