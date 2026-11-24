/*
 * Registration request through WhatsApp (PRD §6 "Registration request", D-01, D-06, AC-04, AC-13).
 * The website stores nothing. It shows a session summary and opens WhatsApp with a prefilled
 * message that contains ONLY: course title, session dates, location/format and the public
 * session code. The applicant types their personal details in the chat, never in a URL.
 */
import { formatDateRange } from '@/lib/format'
import { sampleSessions, type SampleSession } from '@/lib/sample-data'

export type RegistrationSession = SampleSession & {
  dates: string
  deadline: string
  hasStarted: boolean
}

const DAY = 24 * 60 * 60 * 1000

export function getRegistrationSession(
  id: string | undefined,
  now = new Date(),
): RegistrationSession | null {
  if (!id) return null
  const session = sampleSessions.find((s) => s.id === id)
  if (!session) return null
  return {
    ...session,
    dates: formatDateRange(session.startDate, session.endDate),
    // Sample rule: registration closes 7 days before the start. Payload stores the real deadline.
    deadline: formatDateRange(new Date(new Date(session.startDate).getTime() - 7 * DAY)),
    hasStarted: new Date(session.startDate) < now,
  }
}

export type HandoffKind = 'register' | 'waitlist' | 'none'

/**
 * Server-side check (AC-04): only an open session gets the registration action.
 * A full session with a staffed waitlist gets a waitlist request instead (PRD §6 schedule rules).
 * Everything else, including sessions that already started, gets no WhatsApp action.
 */
export function handoffKind(session: RegistrationSession): HandoffKind {
  if (session.hasStarted) return 'none'
  if (session.status === 'open') return 'register'
  if (session.status === 'full-waitlist') return 'waitlist'
  return 'none'
}

/** The prefilled message. Only public session facts; no personal data (AC-13). */
export function whatsappMessage(session: RegistrationSession, kind: Exclude<HandoffKind, 'none'>) {
  const intent = kind === 'waitlist' ? 'masuk daftar tunggu untuk' : 'mendaftar'
  return [
    `Halo BKI Academy, saya ingin ${intent} pelatihan berikut:`,
    `Pelatihan: ${session.courseTitle}`,
    `Jadwal: ${session.dates}, ${session.time}`,
    `Lokasi/format: ${session.format} · ${session.venue}`,
    `Kode jadwal: ${session.id}`,
  ].join('\n')
}

/** wa.me link. The number comes from Site settings; it must be digits only. */
export function whatsappUrl(number: string, message: string) {
  const digits = number.replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

/** Other open sessions of the same course, for the "not available" state. */
export function alternativeSessions(session: RegistrationSession, now = new Date()) {
  return sampleSessions
    .filter((s) => s.courseSlug === session.courseSlug && s.id !== session.id)
    .filter((s) => s.status === 'open' && new Date(s.startDate) >= now)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
}
