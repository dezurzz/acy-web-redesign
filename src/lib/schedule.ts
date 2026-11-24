/*
 * Jadwal (schedule) search and filters (PRD §6 Catalogue and schedule, AC-03).
 * Same URL parameters as the catalogue (q, topik, format, bulan, lokasi, tampil), applied to
 * dated sessions instead of courses. Only future sessions, soonest first in Asia/Jakarta;
 * cancelled and completed sessions never appear (completed ones belong in an archive).
 */
import {
  futureSessions,
  matchesSearch,
  monthKey,
  monthLabel,
  sessionLocation,
  slugify,
  type CatalogueFilters,
} from '@/lib/catalogue'
import { sampleCourses, type SampleSession } from '@/lib/sample-data'

export type ScheduleGroup = { key: string; label: string; sessions: SampleSession[] }

export function searchSchedule(filters: CatalogueFilters, now = new Date()) {
  const matches = futureSessions(now).filter((session) => {
    const course = sampleCourses.find((c) => c.slug === session.courseSlug)
    if (!course) return false
    if (!matchesSearch(course, filters.q)) return false
    if (filters.topik.length && !filters.topik.includes(course.categorySlug)) return false
    if (filters.format.length && !filters.format.includes(slugify(session.format))) return false
    if (filters.bulan && monthKey(session.startDate) !== filters.bulan) return false
    if (filters.lokasi.length && !filters.lokasi.includes(slugify(sessionLocation(session))))
      return false
    return true
  })

  const shown = matches.slice(0, filters.tampil)
  const groups: ScheduleGroup[] = []
  for (const session of shown) {
    const key = monthKey(session.startDate)
    let group = groups.find((g) => g.key === key)
    if (!group) {
      group = { key, label: monthLabel(key), sessions: [] }
      groups.push(group)
    }
    group.sessions.push(session)
  }

  return { total: matches.length, shown: shown.length, groups }
}
