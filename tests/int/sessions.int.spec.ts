import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'

// PRD §7 publishing rules and AC-01 (anonymous visitors only see published content).
let payload: Payload
let categoryId: number
let draftCourseId: number
let publishedCourseId: number
const createdSessionIds: number[] = []

const baseSession = {
  batchLabel: 'TEST Batch',
  startDate: '2027-03-01T02:00:00.000Z',
  endDate: '2027-03-03T09:00:00.000Z',
  startDate_tz: 'Asia/Jakarta' as const,
  endDate_tz: 'Asia/Jakarta' as const,
  format: 'in-person' as const,
  venue: 'Graha BKI, Jakarta',
  feePolicy: 'contact' as const,
  registrationStatus: 'open' as const,
}

describe('Sessions', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    const category = await payload.create({
      collection: 'categories',
      data: { name: 'TEST Category', slug: 'test-category', _status: 'published' },
    })
    categoryId = category.id
    const draft = await payload.create({
      collection: 'courses',
      draft: true,
      data: { title: 'TEST Draft Course', summary: 'Draft', category: categoryId, formats: ['in-person'] },
    })
    draftCourseId = draft.id
    const published = await payload.create({
      collection: 'courses',
      data: {
        title: 'TEST Published Course',
        slug: 'test-published-course',
        summary: 'Published',
        category: categoryId,
        formats: ['in-person'],
        _status: 'published',
      },
    })
    publishedCourseId = published.id
  })

  afterAll(async () => {
    for (const id of createdSessionIds) await payload.delete({ collection: 'sessions', id })
    for (const id of [draftCourseId, publishedCourseId].filter(Boolean)) {
      await payload.delete({ collection: 'courses', id })
    }
    if (categoryId) await payload.delete({ collection: 'categories', id: categoryId })
  })

  it('rejects an end date before the start date', async () => {
    await expect(
      payload.create({
        collection: 'sessions',
        draft: true,
        data: { ...baseSession, course: publishedCourseId, endDate: '2027-02-28T09:00:00.000Z' },
      }),
    ).rejects.toThrow()
  })

  it('requires a fee when the fee policy is fixed', async () => {
    await expect(
      payload.create({
        collection: 'sessions',
        draft: true,
        data: { ...baseSession, course: publishedCourseId, feePolicy: 'fixed' },
      }),
    ).rejects.toThrow()
  })

  it('refuses to publish a session whose course is not published', async () => {
    await expect(
      payload.create({
        collection: 'sessions',
        data: { ...baseSession, course: draftCourseId, _status: 'published' },
      }),
    ).rejects.toThrow()
  })

  it('publishes a valid session for a published course', async () => {
    const session = await payload.create({
      collection: 'sessions',
      data: { ...baseSession, course: publishedCourseId, _status: 'published' },
    })
    createdSessionIds.push(session.id)
    expect(session._status).toBe('published')
  })

  it('hides draft courses from anonymous visitors', async () => {
    const result = await payload.find({
      collection: 'courses',
      overrideAccess: false,
      where: { id: { in: [draftCourseId, publishedCourseId] } },
    })
    const ids = result.docs.map((doc) => doc.id)
    expect(ids).toContain(publishedCourseId)
    expect(ids).not.toContain(draftCourseId)
  })
})

describe('Publishing permissions', () => {
  it('stops an editor from publishing', async () => {
    const payload = await getPayload({ config: await config })
    const editor = { id: 0, roles: ['editor'], collection: 'users' } as never
    await expect(
      payload.create({
        collection: 'categories',
        overrideAccess: false,
        user: editor,
        data: { name: 'TEST Editor Publish', slug: 'test-editor-publish', _status: 'published' },
      }),
    ).rejects.toThrow()
  })
})
