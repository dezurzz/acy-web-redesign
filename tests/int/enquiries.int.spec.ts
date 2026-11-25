import { randomUUID } from 'node:crypto'
import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import type { EnquiryValues } from '@/lib/enquiry'
import { RATE_LIMIT, saveEnquiry } from '@/lib/enquiry-store'
import config from '@/payload.config'

// PRD §8.3 and AC-05: a valid corporate enquiry persists once, produces a reference, and is
// visible only to enquiry staff. Test rows use a marker email and are deleted afterwards.
const MARKER = 'tes-otomatis@contoh.co.id'

const values: EnquiryValues = {
  nama: 'Tes Otomatis',
  email: MARKER,
  perusahaan: 'PT Uji Coba',
  telepon: '0812 3456 7890',
  topik: 'Ship Security Officer',
  peserta: '11-25',
  waktu: 'Maret 2027',
  format: 'lokasi-perusahaan',
  kebutuhan: '',
  setuju: 'ya',
}

// A fresh documentation-range IP per test, so rate limits never leak between tests.
const ip = () => `192.0.2.${Math.floor(Math.random() * 250) + 1}-${randomUUID().slice(0, 4)}`

let payload: Payload

const countByKey = async (key: string) =>
  (
    await payload.count({
      collection: 'enquiries',
      where: { idempotencyKey: { equals: key } },
      overrideAccess: true,
    })
  ).totalDocs

describe('Corporate enquiries', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  afterAll(async () => {
    await payload.delete({
      collection: 'enquiries',
      where: { email: { equals: MARKER } },
      overrideAccess: true,
    })
  })

  it('saves a request once and returns a readable reference', async () => {
    const key = randomUUID()
    const result = await saveEnquiry({ ip: ip(), key, values })
    expect(result.status).toBe('saved')
    if (result.status !== 'saved') return
    expect(result.reference).toMatch(/^INH-[A-HJ-NP-Z2-9]{6}$/)
    expect(result.topic).toBe(values.topik)
    expect(await countByKey(key)).toBe(1)
  })

  it('returns the same reference for a retry with the same key', async () => {
    const key = randomUUID()
    const first = await saveEnquiry({ ip: ip(), key, values })
    const retry = await saveEnquiry({ ip: ip(), key, values })
    expect(retry).toEqual(first)
    expect(await countByKey(key)).toBe(1)
  })

  it('keeps one request when the same key arrives twice at once (double click)', async () => {
    const key = randomUUID()
    const source = ip()
    const [a, b] = await Promise.all([
      saveEnquiry({ ip: source, key, values }),
      saveEnquiry({ ip: source, key, values }),
    ])
    expect(a).toEqual(b)
    expect(await countByKey(key)).toBe(1)
  })

  it(`refuses more than ${RATE_LIMIT.max} new requests per sender in ${RATE_LIMIT.windowMinutes} minutes`, async () => {
    const source = ip()
    for (let i = 0; i < RATE_LIMIT.max; i++) {
      expect((await saveEnquiry({ ip: source, key: randomUUID(), values })).status).toBe('saved')
    }
    expect((await saveEnquiry({ ip: source, key: randomUUID(), values })).status).toBe('limited')
    // Another sender is not affected.
    expect((await saveEnquiry({ ip: ip(), key: randomUUID(), values })).status).toBe('saved')
  })

  it('stores consent time and privacy policy version, starts as Baru with notification pending', async () => {
    const key = randomUUID()
    await saveEnquiry({ ip: ip(), key, values })
    const { docs } = await payload.find({
      collection: 'enquiries',
      where: { idempotencyKey: { equals: key } },
      overrideAccess: true,
    })
    expect(docs[0]?.consentAt).toBeTruthy()
    expect(docs[0]?.policyVersion).toMatch(/\S/)
    expect(docs[0]?.status).toBe('baru')
    expect(docs[0]?.notificationStatus).toBe('menunggu')
  })

  it('only administrators and enquiry staff can read requests; nobody creates them through the API', async () => {
    const asUser = (roles: string[]) =>
      ({ id: 0, collection: 'users', email: 'x@contoh.co.id', roles }) as never

    await expect(payload.find({ collection: 'enquiries', overrideAccess: false })).rejects.toThrow()
    await expect(
      payload.find({ collection: 'enquiries', overrideAccess: false, user: asUser(['editor']) }),
    ).rejects.toThrow()

    const staff = await payload.find({
      collection: 'enquiries',
      overrideAccess: false,
      user: asUser(['enquiry']),
      where: { email: { equals: MARKER } },
    })
    expect(staff.totalDocs).toBeGreaterThan(0)
    // The duplicate key and the IP hash never leave the server.
    expect(staff.docs[0]).not.toHaveProperty('idempotencyKey')
    expect(staff.docs[0]).not.toHaveProperty('sourceHash')

    await expect(
      payload.create({
        collection: 'enquiries',
        overrideAccess: false,
        user: asUser(['admin']),
        data: { reference: 'INH-XXXXXX' } as never,
      }),
    ).rejects.toThrow()
  })
})
