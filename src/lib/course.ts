/*
 * Course detail data (PRD §6 Course detail): one course, its category, and its upcoming sessions
 * in the shape the session panel needs. Pure: takes the site's content as input.
 */
import { formatDateRange } from '@/lib/format'
import { futureSessions, type SiteData, type SiteSession } from '@/lib/site-data'

export type PanelSession = Pick<
  SiteSession,
  'id' | 'status' | 'time' | 'format' | 'venue' | 'fee' | 'taxWording' | 'postponementMessage'
> & {
  dates: string
  /** Formatted deadline, or null when staff did not set one. */
  deadline: string | null
}

export function getCourse(slug: string, data: SiteData, now = new Date()) {
  const course = data.courses.find((c) => c.slug === slug)
  if (!course) return null

  const category = data.categories.find((c) => c.slug === course.categorySlug) ?? {
    slug: course.categorySlug,
    name: course.categorySlug,
    description: '',
    examples: [],
  }

  const sessions: PanelSession[] = futureSessions(data.sessions, now)
    .filter((s) => s.courseSlug === slug)
    .map((s) => ({
      id: s.id,
      status: s.status,
      time: s.time,
      format: s.format,
      venue: s.venue,
      fee: s.fee,
      taxWording: s.taxWording,
      postponementMessage: s.postponementMessage,
      dates: formatDateRange(s.startDate, s.endDate),
      deadline: s.deadline ? formatDateRange(s.deadline) : null,
    }))

  return { course, category, detail: course.detail, sessions }
}
