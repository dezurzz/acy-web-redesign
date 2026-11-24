/*
 * Seed: loads the SAMPLE content (src/lib/sample-data.ts) into the CMS as published entries,
 * so a fresh local database looks like the prototype. Run with `pnpm seed` (database running).
 *
 * Safe to run again: entries are matched by slug (categories, courses) or session code
 * (sessions) and updated instead of duplicated. Entries you created yourself are left alone.
 * For local development and staging demos only; never run against production (PRD §7: real
 * content is entered and approved by BKI editors).
 */
import { getPayload, type Where } from 'payload'

import { formatOptions } from '../lib/options'
import { sampleCategories, sampleCourses, sampleSessions } from '../lib/sample-data'
import config from '../payload.config'

if (process.env.NODE_ENV === 'production') {
  console.error('Seed refused: NODE_ENV is production.')
  process.exit(1)
}

const payload = await getPayload({ config })
const formatValue = (label: string) =>
  formatOptions.find((o) => o.label === label)?.value ?? 'in-person'

type SeedCollection = 'categories' | 'courses' | 'sessions'

/** Create or update one document by a unique field, always as published. */
async function upsert(collection: SeedCollection, where: Where, data: Record<string, unknown>) {
  const found = await payload.find({ collection, where, limit: 1, depth: 0, draft: true })
  const existing = found.docs[0]
  const doc = existing
    ? await payload.update({
        collection,
        id: existing.id,
        data: { ...data, _status: 'published' },
        depth: 0,
      })
    : await payload.create({
        collection,
        data: { ...data, _status: 'published' } as never,
        depth: 0,
      })
  return doc.id as number
}

// 1. Categories
const categoryIds = new Map<string, number>()
for (const [index, category] of sampleCategories.entries()) {
  const id = await upsert(
    'categories',
    { slug: { equals: category.slug } },
    {
      name: category.name,
      slug: category.slug,
      shortDescription: category.description,
      displayOrder: index + 1,
    },
  )
  categoryIds.set(category.slug, id)
}

// 2. Courses (related courses are linked in step 4, once every course exists)
const courseIds = new Map<string, number>()
for (const course of sampleCourses) {
  const id = await upsert(
    'courses',
    { slug: { equals: course.slug } },
    {
      title: course.title,
      slug: course.slug,
      acronym: course.acronym,
      aliases: course.aliases ?? [],
      category: categoryIds.get(course.categorySlug),
      summary: course.outcome,
      duration: course.duration,
      formats: course.formats.map(formatValue),
      audience: course.detail.audience.map((text) => ({ text })),
      outcomes: course.detail.outcomes.map((text) => ({ text })),
      syllabus: course.detail.syllabus.map((part) => ({
        title: part.title,
        topics: part.items.join('\n'),
      })),
      prerequisites: course.detail.prerequisites,
      deliveryMethod: course.detail.method,
      certificateWording: course.detail.certificate,
      faqs: course.detail.faqs,
    },
  )
  courseIds.set(course.slug, id)
}

// 3. Sessions
for (const session of sampleSessions) {
  const isWaitlist = session.status === 'full-waitlist'
  await upsert(
    'sessions',
    { code: { equals: session.id } },
    {
      code: session.id,
      course: courseIds.get(session.courseSlug),
      batchLabel: `${session.courseTitle.slice(0, 60)} · ${session.startDate.slice(0, 10)}`,
      startDate: session.startDate,
      startDate_tz: 'Asia/Jakarta',
      endDate: session.endDate,
      endDate_tz: 'Asia/Jakarta',
      registrationDeadline: session.deadline,
      registrationDeadline_tz: 'Asia/Jakarta',
      format: formatValue(session.format),
      venue: session.venue,
      feePolicy: session.fee ? 'fixed' : 'contact',
      fee: session.fee ?? undefined,
      currency: 'IDR',
      taxWording: session.taxWording,
      registrationStatus: isWaitlist ? 'full' : session.status,
      waitlistEnabled: isWaitlist,
      postponementMessage: session.postponementMessage,
    },
  )
}

// 4. Links between documents
for (const course of sampleCourses) {
  const related = course.detail.related.map((slug) => courseIds.get(slug)).filter(Boolean)
  await payload.update({
    collection: 'courses',
    id: courseIds.get(course.slug)!,
    data: { relatedCourses: related as number[], _status: 'published' },
    depth: 0,
  })
}
for (const category of sampleCategories) {
  const examples = sampleCourses
    .filter((c) => category.examples.includes(c.title) || c.categorySlug === category.slug)
    .slice(0, 2)
    .map((c) => courseIds.get(c.slug)!)
  await payload.update({
    collection: 'categories',
    id: categoryIds.get(category.slug)!,
    data: { representativeCourses: examples, _status: 'published' },
    depth: 0,
  })
}

console.log(
  `Seed done: ${categoryIds.size} categories, ${courseIds.size} courses, ${sampleSessions.length} sessions (all published).`,
)
process.exit(0)
