import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { loadSiteData } from '@/lib/cms'
import config from '@/payload.config'

// The public site reads CMS content through loadSiteData (lib/cms.ts).
// AC-01 / PRD §7: only published content reaches visitors. AC-02: what staff enter is what the site shows.
let payload: Payload
const ids = { category: 0, published: 0, draft: 0, sessions: [] as number[] }

const session = {
  batchLabel: 'TEST CMS Batch',
  startDate: '2030-05-06T01:00:00.000Z', // 08.00 WIB
  endDate: '2030-05-08T09:00:00.000Z', // 16.00 WIB
  startDate_tz: 'Asia/Jakarta' as const,
  endDate_tz: 'Asia/Jakarta' as const,
  format: 'live-online' as const,
  venue: 'Zoom',
  feePolicy: 'fixed' as const,
  fee: 4500000,
  registrationStatus: 'full' as const,
  waitlistEnabled: true,
}

describe('CMS loader', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const category = await payload.create({
      collection: 'categories',
      data: { name: 'TEST CMS Category', slug: 'test-cms-category', _status: 'published' },
    })
    ids.category = category.id

    const published = await payload.create({
      collection: 'courses',
      data: {
        title: 'TEST CMS Published Course',
        slug: 'test-cms-published',
        summary: 'Ringkasan uji',
        category: category.id,
        formats: ['in-person', 'live-online'],
        audience: [{ text: 'Perwira kapal' }],
        syllabus: [{ title: 'Hari 1', topics: 'Topik A\n\n  Topik B  ' }],
        _status: 'published',
      },
    })
    ids.published = published.id

    const draft = await payload.create({
      collection: 'courses',
      draft: true,
      data: {
        title: 'TEST CMS Draft Course',
        slug: 'test-cms-draft',
        summary: 'Draft',
        category: category.id,
        formats: ['in-person'],
      },
    })
    ids.draft = draft.id

    const published1 = await payload.create({
      collection: 'sessions',
      data: { ...session, course: published.id, _status: 'published' },
    })
    const draftSession = await payload.create({
      collection: 'sessions',
      draft: true,
      data: { ...session, code: 'JDW-TDRF', course: published.id },
    })
    ids.sessions.push(published1.id, draftSession.id)
  })

  afterAll(async () => {
    for (const id of ids.sessions) await payload.delete({ collection: 'sessions', id })
    for (const id of [ids.published, ids.draft]) await payload.delete({ collection: 'courses', id })
    await payload.delete({ collection: 'categories', id: ids.category })
  })

  it('gives every new session a readable public code', async () => {
    const doc = await payload.findByID({ collection: 'sessions', id: ids.sessions[0]! })
    expect(doc.code).toMatch(/^JDW-[A-HJ-NP-Z2-9]{4}$/)
  })

  it('shows published courses and hides drafts (AC-01)', async () => {
    const data = await loadSiteData()
    const slugs = data.courses.map((c) => c.slug)
    expect(slugs).toContain('test-cms-published')
    expect(slugs).not.toContain('test-cms-draft')
    expect(data.sessions.map((s) => s.id)).not.toContain('JDW-TDRF')
  })

  it('converts CMS fields to what the pages show (AC-02)', async () => {
    const data = await loadSiteData()
    const course = data.courses.find((c) => c.slug === 'test-cms-published')!
    expect(course.categorySlug).toBe('test-cms-category')
    expect(course.formats).toEqual(['Tatap muka', 'Live online'])
    expect(course.detail.audience).toEqual(['Perwira kapal'])
    expect(course.detail.syllabus).toEqual([{ title: 'Hari 1', items: ['Topik A', 'Topik B'] }])
    expect(course.detail.prerequisites).toBe('Tidak ada prasyarat khusus.')

    const s = data.sessions.find((x) => x.courseSlug === 'test-cms-published')!
    expect(s.time).toBe('08.00–16.00 WIB')
    expect(s.format).toBe('Live online')
    expect(s.fee).toBe(4500000)
    expect(s.status).toBe('full-waitlist')
  })
})
