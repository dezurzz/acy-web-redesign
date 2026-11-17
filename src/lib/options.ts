// Shared option lists. Labels are the public Indonesian names (PRD §6).
export const formatOptions = [
  { label: 'Tatap muka', value: 'in-person' },
  { label: 'Live online', value: 'live-online' },
  { label: 'Belajar mandiri', value: 'self-paced' },
] as const

// Registration states (PRD §6, design.md §8).
export const sessionStatusOptions = [
  { label: 'Belum dibuka', value: 'not-open' },
  { label: 'Dibuka', value: 'open' },
  { label: 'Penuh', value: 'full' },
  { label: 'Ditutup', value: 'closed' },
  { label: 'Ditunda', value: 'postponed' },
  { label: 'Dibatalkan', value: 'cancelled' },
  { label: 'Selesai', value: 'completed' },
] as const

export type SessionStatus = (typeof sessionStatusOptions)[number]['value']

// Only these states can accept a normal registration request (AC-04).
export const REGISTRABLE_STATUSES: readonly SessionStatus[] = ['open']
