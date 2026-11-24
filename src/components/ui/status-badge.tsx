import {
  CircleCheck,
  CircleMinus,
  CircleSlash,
  CircleX,
  Clock,
  Hourglass,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react'

import type { SessionStatus } from '@/lib/options'
import { cn } from '@/lib/utils'

// "full-waitlist" is a display state: status "full" with waitlistEnabled (PRD §6).
export type SessionDisplayStatus = SessionStatus | 'full-waitlist'

// design.md §8 status label mapping. The text label is always shown; colour and icon support it.
const statusStyles: Record<
  SessionDisplayStatus,
  { label: string; icon: LucideIcon; className: string }
> = {
  open: { label: 'Dibuka', icon: CircleCheck, className: 'bg-success-surface text-success' },
  'not-open': { label: 'Belum dibuka', icon: Clock, className: 'bg-blue-50 text-navy-800' },
  full: {
    label: 'Penuh',
    icon: CircleMinus,
    className: 'border border-line-control bg-paper text-slate-600',
  },
  'full-waitlist': {
    label: 'Penuh · daftar tunggu tersedia',
    icon: Hourglass,
    className: 'border border-line-control bg-paper text-slate-600',
  },
  closed: {
    label: 'Pendaftaran ditutup',
    icon: CircleSlash,
    className: 'border border-line-control bg-paper text-slate-600',
  },
  postponed: {
    label: 'Ditunda',
    icon: TriangleAlert,
    className: 'bg-warning-surface text-warning',
  },
  cancelled: { label: 'Dibatalkan', icon: CircleX, className: 'bg-danger-surface text-danger' },
  completed: { label: 'Selesai', icon: CircleCheck, className: 'text-slate-600' },
}

export function getDisplayStatus(
  status: SessionStatus,
  waitlistEnabled?: boolean | null,
): SessionDisplayStatus {
  return status === 'full' && waitlistEnabled ? 'full-waitlist' : status
}

export function StatusBadge({
  className,
  status,
}: {
  className?: string
  status: SessionDisplayStatus
}) {
  const { className: tone, icon: Icon, label } = statusStyles[status]

  return (
    <span
      className={cn(
        'inline-flex items-start gap-1.5 rounded-card px-2.5 py-1 text-meta font-medium',
        status === 'completed' && 'px-0',
        tone,
        className,
      )}
    >
      <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />
      {label}
    </span>
  )
}
