/*
 * Pre-launch check (PRD §9): does every redirect in src/lib/redirects.ts land on a real page?
 * Lists course slugs and catalogue topics that don't exist as published content yet, plus the
 * inventory rows still waiting for a decision. Run with: pnpm redirects:check (database running).
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { COURSE_SLUGS, launchRedirects, REVIEW_PATHS } from '../lib/redirects'

const payload = await getPayload({ config })
const published = { _status: { equals: 'published' } } as const
const courses = await payload.find({
  collection: 'courses',
  where: published,
  limit: 1000,
  depth: 0,
})
const categories = await payload.find({
  collection: 'categories',
  where: published,
  limit: 100,
  depth: 0,
})
const courseSlugs = new Set(courses.docs.map((c) => c.slug))
const topics = new Set(categories.docs.map((c) => c.slug))

const missingCourses = Object.entries(COURSE_SLUGS).filter(([, slug]) => !courseSlugs.has(slug))
const missingTopics = [
  ...new Set(
    launchRedirects()
      .map((r) => r.destination.match(/topik=([a-z-]+)/)?.[1])
      .filter((t): t is string => Boolean(t) && !topics.has(t!)),
  ),
]

console.log(`${launchRedirects().length} redirect rules.`)
console.log(
  missingCourses.length
    ? `\n${missingCourses.length} course redirects point to courses not published yet:\n` +
        missingCourses.map(([id, slug]) => `  Odoo ${id} → /id/pelatihan/${slug}`).join('\n')
    : '\nAll course redirects land on published courses.',
)
console.log(
  missingTopics.length
    ? `\nMissing catalogue topics: ${missingTopics.join(', ')}`
    : 'All catalogue topics exist.',
)
console.log(
  `\nStill marked "Review" in the URL Inventory (no redirect yet):\n  ${REVIEW_PATHS.join('\n  ')}`,
)
process.exit(0)
