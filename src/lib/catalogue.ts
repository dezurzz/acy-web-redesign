/*
 * Catalogue search and filters (PRD §6 Catalogue and schedule, AC-03).
 * Pure functions so the rules can be unit-tested and later reused with Payload data.
 *
 * URL parameters (shareable, survive the back button):
 *   q       search text: matches title, expanded acronym and aliases
 *   topik   category slug, repeatable
 *   format  format slug, repeatable
 *   bulan   YYYY-MM of an upcoming session
 *   lokasi  location slug, repeatable
 *   tampil  how many results are shown (load more)
 * Different groups combine with AND; several choices in one group combine with OR.
 * Month and location must be satisfied by the same session.
 */
import { formatDateRange } from '@/lib/format'
import {
  sampleCategories,
  sampleCourses,
  sampleSessions,
  type SampleCourse,
  type SampleSession,
} from '@/lib/sample-data'

import {
  PAGE_SIZE,
  formatFilterOptions,
  slugify,
  toQuery,
  type CatalogueFilters,
} from '@/lib/catalogue-query'

export * from '@/lib/catalogue-query'

/** "Zoom" sessions count as Online. */
export const sessionLocation = (session: SampleSession) =>
  session.format === 'Live online' ? 'Online' : session.venue

export const monthKey = (iso: string) =>
  new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', timeZone: 'Asia/Jakarta' })
    .format(new Date(iso))
    .slice(0, 7)

export const monthLabel = (key: string) =>
  new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${key}-01T00:00:00Z`),
  )

/** Sessions a visitor can still act on or plan around. */
export function futureSessions(now: Date) {
  return sampleSessions
    .filter((s) => s.status !== 'cancelled' && s.status !== 'completed')
    .filter((s) => new Date(s.startDate) >= now)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
}

export function filterOptions(now = new Date()) {
  const sessions = futureSessions(now)
  const months = [...new Set(sessions.map((s) => monthKey(s.startDate)))]
  const locations = [...new Set(sessions.map(sessionLocation))].sort((a, b) =>
    a === 'Online' ? 1 : b === 'Online' ? -1 : a.localeCompare(b),
  )

  return {
    topik: sampleCategories.map((c) => ({ value: c.slug, label: c.name })),
    format: formatFilterOptions,
    bulan: months.map((key) => ({ value: key, label: monthLabel(key) })),
    lokasi: locations.map((label) => ({ value: slugify(label), label })),
  }
}

const normalise = (text: string) => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

export function matchesSearch(course: SampleCourse, q: string) {
  if (!q) return true
  const haystack = normalise([course.title, course.acronym, ...(course.aliases ?? [])].join(' '))
  // Every word must appear somewhere, so "auditor ism" finds "Internal Auditor ISM Code".
  return normalise(q)
    .split(/\s+/)
    .every((word) => haystack.includes(word))
}

export type CatalogueItem = SampleCourse & { categoryName: string; nextSession: string | null }

export function searchCatalogue(filters: CatalogueFilters, now = new Date()) {
  const sessions = futureSessions(now)

  const matches = sampleCourses.filter((course) => {
    if (!matchesSearch(course, filters.q)) return false
    if (filters.topik.length && !filters.topik.includes(course.categorySlug)) return false
    if (filters.format.length && !course.formats.some((f) => filters.format.includes(slugify(f))))
      return false

    if (filters.bulan || filters.lokasi.length) {
      return sessions.some(
        (s) =>
          s.courseSlug === course.slug &&
          (!filters.bulan || monthKey(s.startDate) === filters.bulan) &&
          (!filters.lokasi.length || filters.lokasi.includes(slugify(sessionLocation(s)))),
      )
    }
    return true
  })

  const items: CatalogueItem[] = matches.map((course) => {
    const next = sessions.find((s) => s.courseSlug === course.slug)
    return {
      ...course,
      categoryName: sampleCategories.find((c) => c.slug === course.categorySlug)?.name ?? '',
      nextSession: next ? formatDateRange(next.startDate, next.endDate) : null,
    }
  })

  return { total: items.length, items: items.slice(0, filters.tampil) }
}

/** Active filters as removable chips; each chip links to the URL without that value. */
export function activeFilterChips(filters: CatalogueFilters, now = new Date()) {
  const options = filterOptions(now)
  const label = (group: keyof typeof options, value: string) =>
    options[group].find((o) => o.value === value)?.label ?? value
  const base = { ...filters, tampil: PAGE_SIZE }
  const chips: { key: string; label: string; href: string }[] = []

  if (filters.q)
    chips.push({ key: 'q', label: `“${filters.q}”`, href: toQuery({ ...base, q: '' }) })
  for (const group of ['topik', 'format', 'lokasi'] as const) {
    for (const value of filters[group]) {
      chips.push({
        key: `${group}-${value}`,
        label: label(group, value),
        href: toQuery({ ...base, [group]: filters[group].filter((v) => v !== value) }),
      })
    }
  }
  if (filters.bulan) {
    chips.push({
      key: 'bulan',
      label: label('bulan', filters.bulan),
      href: toQuery({ ...base, bulan: '' }),
    })
  }
  return chips
}
