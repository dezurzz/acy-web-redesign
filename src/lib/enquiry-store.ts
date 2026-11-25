import config from '@payload-config'
import { createHmac, randomInt } from 'node:crypto'
import { getPayload } from 'payload'

import { PRIVACY_POLICY_VERSION, type EnquiryValues } from '@/lib/enquiry'

/*
 * Server only (database access). Saves corporate enquiries (PRD §8.3, AC-05). Success is reported only after the database has
 * the request. One request per form fill: the browser sends an idempotency key, and the database
 * rejects a second request with the same key, so double clicks and retries return the first
 * request's reference instead of creating another one.
 */

// No 0/O or 1/I: easy to read aloud on the phone (same alphabet as session codes).
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

/** Public reference, e.g. INH-7K3P2Q. 32^6 ≈ 1 billion combinations; collisions are retried. */
export function makeReference() {
  let code = ''
  for (let i = 0; i < 6; i++) code += CODE_CHARS[randomInt(CODE_CHARS.length)]
  return `INH-${code}`
}

/** At most this many new requests per sender in the window (PRD §8.6: rate-limit public forms). */
export const RATE_LIMIT = { max: 3, windowMinutes: 10 } as const

/** Keyed hash of the sender's IP address, so the address itself is never stored. */
export function hashSource(ip: string) {
  if (!ip) return undefined
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) throw new Error('PAYLOAD_SECRET is required to hash enquiry sources.')
  return createHmac('sha256', secret).update(ip).digest('hex').slice(0, 32)
}

export type SaveResult =
  { status: 'saved'; reference: string; topic: string } | { status: 'limited' }

export async function saveEnquiry({
  ip,
  key,
  values,
  now = new Date(),
}: {
  ip: string
  key: string
  values: EnquiryValues
  now?: Date
}): Promise<SaveResult> {
  const payload = await getPayload({ config })

  const findByKey = async () => {
    const { docs } = await payload.find({
      collection: 'enquiries',
      where: { idempotencyKey: { equals: key } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    return docs[0]
  }

  // A retry of a request that was already saved: hand back the same reference.
  const existing = await findByKey()
  if (existing) return { status: 'saved', reference: existing.reference, topic: existing.topic }

  const sourceHash = hashSource(ip)
  if (sourceHash) {
    const since = new Date(now.getTime() - RATE_LIMIT.windowMinutes * 60_000)
    const { totalDocs } = await payload.count({
      collection: 'enquiries',
      where: {
        and: [
          { sourceHash: { equals: sourceHash } },
          { createdAt: { greater_than: since.toISOString() } },
        ],
      },
      overrideAccess: true,
    })
    if (totalDocs >= RATE_LIMIT.max) return { status: 'limited' }
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    const reference = makeReference()
    try {
      const doc = await payload.create({
        collection: 'enquiries',
        overrideAccess: true,
        data: {
          reference,
          type: 'corporate',
          status: 'baru',
          notificationStatus: 'menunggu',
          contactName: values.nama,
          email: values.email,
          company: values.perusahaan,
          phone: values.telepon,
          topic: values.topik,
          participants: values.peserta as never,
          timing: values.waktu,
          deliveryFormat: values.format as never,
          needs: values.kebutuhan || undefined,
          consentAt: now.toISOString(),
          policyVersion: PRIVACY_POLICY_VERSION,
          idempotencyKey: key,
          sourceHash,
        },
      })
      return { status: 'saved', reference: doc.reference, topic: doc.topic }
    } catch (error) {
      // Two submits with the same key at the same moment: the database kept one; return it.
      const raced = await findByKey()
      if (raced) return { status: 'saved', reference: raced.reference, topic: raced.topic }
      // Otherwise most likely a reference collision: try a new reference.
      if (attempt === 2) throw error
    }
  }
  throw new Error('unreachable')
}
