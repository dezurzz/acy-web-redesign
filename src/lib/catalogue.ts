/*
 * Catalogue search and filters (PRD §6 Catalogue and schedule, AC-03).
 * Pure functions: they take the site's content as input, so the same rules run on CMS data
 * (lib/cms.ts) and on the sample data in tests.
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
import {
  PAGE_SIZE,
  formatFilterOptions,
  slugify,
  toQuery,
  type CatalogueFilters,
} from '@/lib/catalogue-query'
import { formatDateRange } from '@/lib/format'
import { futureSessions, type SiteCourse, type SiteData, type SiteSession } from '@/lib/site-data'

export * from '@/lib/catalogue-query'

/** Live online sessions count as "Online", whatever the platform name. */
export const sessionLocation = (session: SiteSession) =>
  session.format === 'Live online' ? 'Online' : session.venue

export const monthKey = (iso: string) =>
  new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', timeZone: 'Asia/Jakarta' })
    .format(new Date(iso))
    .slice(0, 7)

export const monthLabel = (key: string) =>
  new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${key}-01T00:00:00Z`),
  )

export function filterOptions(data: SiteData, now = new Date()) {
  const sessions = futureSessions(data.sessions, now)
  const months = [...new Set(sessions.map((s) => monthKey(s.startDate)))]
  const locations = [...new Set(sessions.map(sessionLocation))].sort((a, b) =>
    a === 'Online' ? 1 : b === 'Online' ? -1 : a.localeCompare(b),
  )

  return {
    topik: data.categories.map((c) => ({ value: c.slug, label: c.name })),
    format: formatFilterOptions,
    bulan: months.map((key) => ({ value: key, label: monthLabel(key) })),
    lokasi: locations.map((label) => ({ value: slugify(label), label })),
  }
}

/** Lowercase and strip accents, so "Kelaikan" and "kélaikan" match. */
const normalise = (text: string) => text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')

export function matchesSearch(course: SiteCourse, q: string) {
  if (!q) return true
  const haystack = normalise([course.title, course.acronym, ...(course.aliases ?? [])].join(' '))
  // Every word must appear somewhere, so "auditor ism" finds "Internal Auditor ISM Code".
  return normalise(q)
    .split(/\s+/)
    .every((word) => haystack.includes(word))
}

export type CatalogueItem = SiteCourse & { categoryName: string; nextSession: string | null }

/** A course with its category name and next session, as shown on course cards. */
export function toCatalogueItem(
  course: SiteCourse,
  data: SiteData,
  now = new Date(),
): CatalogueItem {
  const next = futureSessions(data.sessions, now).find((s) => s.courseSlug === course.slug)
  return {
    ...course,
    categoryName: data.categories.find((c) => c.slug === course.categorySlug)?.name ?? '',
    nextSession: next ? formatDateRange(next.startDate, next.endDate) : null,
  }
}

export function searchCatalogue(filters: CatalogueFilters, data: SiteData, now = new Date()) {
  const sessions = futureSessions(data.sessions, now)

  const matches = data.courses.filter((course) => {
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

  const items = matches.map((course) => toCatalogueItem(course, data, now))
  return { total: items.length, items: items.slice(0, filters.tampil) }
}

/** Active filters as removable chips; each chip links to the URL without that value. */
export function activeFilterChips(filters: CatalogueFilters, data: SiteData, now = new Date()) {
  const options = filterOptions(data, now)
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
