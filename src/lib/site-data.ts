/*
 * The shape of the public site's content. The CMS loader (lib/cms.ts) builds it from published
 * Payload documents; the sample data (lib/sample-data.ts) builds the same shape for tests and
 * the seed script. Rule functions (catalogue, schedule, registration, course) only see this shape,
 * so they work and are tested the same way whatever the source.
 */
import type { SessionDisplayStatus } from '@/components/ui/status-badge'

export type SiteCategory = {
  slug: string
  name: string
  description: string
  /** Titles of representative courses, shown as examples. */
  examples: string[]
}

export type CourseDetail = {
  audience: string[]
  outcomes: string[]
  syllabus: { title: string; items: string[] }[]
  prerequisites: string
  method: string
  certificate: string
  faqs: { question: string; answer: string }[]
  /** Slugs of related courses. */
  related: string[]
}

export type SiteCourse = {
  slug: string
  title: string
  /** Expanded acronym, shown under the title and searchable. */
  acronym?: string
  /** Other names people search for. */
  aliases?: string[]
  categorySlug: string
  outcome: string
  duration: string
  /** Public format labels, e.g. "Tatap muka". */
  formats: string[]
  detail: CourseDetail
}

export type SiteSession = {
  /** Public session code (PRD §7), used in links and the WhatsApp message. */
  id: string
  courseSlug: string
  courseTitle: string
  startDate: string
  endDate: string
  /** e.g. "08.00–16.00 WIB" */
  time: string
  /** Public format label, e.g. "Live online". */
  format: string
  venue: string
  /** null when the fee is not confirmed (D-02: never show Rp0). */
  fee: number | null
  taxWording?: string
  status: SessionDisplayStatus
  postponementMessage?: string
  /** ISO date of the registration deadline, when staff set one. */
  deadline?: string
}

/** A course's chosen training photos (CMS "Foto pelatihan"); the first is the cover. */
export type SiteCoursePhotos = {
  id: number
  courseTitle: string
  courseSlug: string
  photos: { src: string; alt: string; caption?: string; position: string }[]
}

export type SiteData = {
  categories: SiteCategory[]
  courses: SiteCourse[]
  sessions: SiteSession[]
}

/** Sessions a visitor can still act on or plan around: not cancelled, not completed, not started. */
export function futureSessions(sessions: SiteSession[], now = new Date()) {
  return sessions
    .filter((s) => s.status !== 'cancelled' && s.status !== 'completed')
    .filter((s) => new Date(s.startDate) >= now)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
}

/** Homepage list (PRD §6): 3–6 future sessions, soonest first. */
export function upcomingSessions(sessions: SiteSession[], limit = 5, now = new Date()) {
  return futureSessions(sessions, now).slice(0, limit)
}
