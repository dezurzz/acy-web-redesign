/*
 * Reads the public site's content from Payload (PRD §7) and converts it to the SiteData shape.
 * Server only. The Local API skips access control by default, so this file applies the public
 * rules itself (README Conventions): only published categories, courses and sessions, and only
 * sessions whose course is published.
 * React `cache` makes every component in one request share a single set of queries.
 */
import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import { getDisplayStatus } from '@/components/ui/status-badge'
import { formatOptions, type SessionStatus } from '@/lib/options'
import type { Category, Course, Session } from '@/payload-types'
import type { SiteCategory, SiteCourse, SiteData, SiteSession } from '@/lib/site-data'
import { toSiteSettings, type SiteSettings } from '@/lib/site-settings'

const PUBLISHED = { _status: { equals: 'published' } } as const

const formatLabel = (value: string) => formatOptions.find((o) => o.value === value)?.label ?? value

const lines = (text: string | null | undefined) =>
  (text ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

const points = (rows: { text: string }[] | null | undefined) => (rows ?? []).map((row) => row.text)

/** "08.00–16.00 WIB": start and end clock times in Jakarta time. */
function timeRange(start: string, end: string) {
  const clock = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  })
  const fmt = (iso: string) => clock.format(new Date(iso)).replace(':', '.')
  return `${fmt(start)}–${fmt(end)} WIB`
}

function toCategory(doc: Category): SiteCategory {
  return {
    slug: doc.slug ?? String(doc.id),
    name: doc.name,
    description: doc.shortDescription ?? '',
    examples: (doc.representativeCourses ?? [])
      .filter((c): c is Course => typeof c === 'object' && c?._status === 'published')
      .map((c) => c.title),
  }
}

function toCourse(doc: Course, categorySlugById: Map<number, string>): SiteCourse {
  const categoryId = typeof doc.category === 'object' ? doc.category.id : doc.category
  return {
    slug: doc.slug ?? String(doc.id),
    title: doc.title,
    acronym: doc.acronym ?? undefined,
    aliases: doc.aliases ?? [],
    categorySlug: categorySlugById.get(categoryId) ?? '',
    outcome: doc.summary,
    duration: doc.duration ?? '',
    formats: (doc.formats ?? []).map(formatLabel),
    detail: {
      audience: points(doc.audience),
      outcomes: points(doc.outcomes),
      syllabus: (doc.syllabus ?? []).map((part) => ({
        title: part.title,
        items: lines(part.topics),
      })),
      prerequisites: doc.prerequisites || 'Tidak ada prasyarat khusus.',
      method: doc.deliveryMethod ?? '',
      certificate: doc.certificateWording ?? '',
      faqs: (doc.faqs ?? []).map((faq) => ({ question: faq.question, answer: faq.answer })),
      related: (doc.relatedCourses ?? [])
        .filter((c): c is Course => typeof c === 'object' && c !== null)
        .map((c) => c.slug ?? String(c.id)),
    },
  }
}

function toSession(doc: Session, course: Course): SiteSession {
  const fee = doc.feePolicy === 'fixed' && doc.fee ? doc.fee : null
  return {
    id: doc.code ?? `JDW-${doc.id}`,
    courseSlug: course.slug ?? String(course.id),
    courseTitle: course.title,
    startDate: doc.startDate,
    endDate: doc.endDate,
    time: timeRange(doc.startDate, doc.endDate),
    format: formatLabel(doc.format),
    venue: doc.venue,
    fee,
    taxWording: doc.taxWording ?? undefined,
    status: getDisplayStatus(doc.registrationStatus as SessionStatus, doc.waitlistEnabled),
    postponementMessage: doc.postponementMessage ?? undefined,
    deadline: doc.registrationDeadline ?? undefined,
  }
}

export const loadSiteData = cache(async (): Promise<SiteData> => {
  const payload = await getPayload({ config })

  const [categoryDocs, courseDocs, sessionDocs] = await Promise.all([
    payload.find({
      collection: 'categories',
      where: PUBLISHED,
      sort: 'displayOrder',
      limit: 100,
      depth: 1,
    }),
    payload.find({ collection: 'courses', where: PUBLISHED, sort: 'title', limit: 1000, depth: 1 }),
    // Completed sessions stay in the CMS for the archive; the public pages only need current ones.
    payload.find({
      collection: 'sessions',
      where: { and: [PUBLISHED, { registrationStatus: { not_equals: 'completed' } }] },
      sort: 'startDate',
      limit: 2000,
      depth: 1,
    }),
  ])

  const categorySlugById = new Map(categoryDocs.docs.map((c) => [c.id, c.slug ?? String(c.id)]))
  const courses = courseDocs.docs.map((doc) => toCourse(doc, categorySlugById))
  const publishedCourses = new Map(courseDocs.docs.map((c) => [c.id, c]))

  const sessions = sessionDocs.docs.flatMap((doc) => {
    const courseId = typeof doc.course === 'object' ? doc.course.id : doc.course
    const course = publishedCourses.get(courseId)
    return course ? [toSession(doc, course)] : []
  })

  return { categories: categoryDocs.docs.map(toCategory), courses, sessions }
})

/** Contacts and portal links from the CMS global "Pengaturan situs" (placeholders until saved). */
export const loadSiteSettings = cache(async (): Promise<SiteSettings> => {
  const payload = await getPayload({ config })
  const doc = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  return toSiteSettings(doc)
})
