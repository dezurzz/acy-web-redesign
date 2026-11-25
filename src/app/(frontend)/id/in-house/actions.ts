'use server'

import { headers } from 'next/headers'

import {
  HONEYPOT_FIELD,
  IDEMPOTENCY_KEY,
  readEnquiry,
  validateEnquiry,
  type EnquiryErrors,
} from '@/lib/enquiry'
import { saveEnquiry } from '@/lib/enquiry-store'

export type EnquiryResult =
  | { status: 'invalid'; errors: EnquiryErrors }
  | { status: 'failed' }
  | { status: 'limited' }
  | { status: 'saved'; reference: string; topic: string }

/*
 * Corporate enquiry submit (PRD §6, §8.3, AC-05). Checks the rules again on the server (never
 * trust the browser), then saves the request and only then reports success with its reference.
 * Retries with the same request key return the first reference instead of saving twice.
 * Email notification to staff waits for an email provider (T-04); the request records that
 * its notification is still pending. A failure never claims success and keeps the form filled.
 */
export async function submitEnquiry(formData: FormData): Promise<EnquiryResult> {
  const values = readEnquiry(formData)
  const errors = validateEnquiry(values)
  if (Object.keys(errors).length > 0) return { status: 'invalid', errors }

  // Bot filled the invisible field: refuse without saving, and without pretending success.
  if (String(formData.get(HONEYPOT_FIELD) ?? '') !== '') return { status: 'failed' }

  // Reviewers can see the failure state locally with /id/in-house?simulasi=gagal (never in production).
  if (process.env.NODE_ENV !== 'production' && formData.get('simulasi') === 'gagal') {
    return { status: 'failed' }
  }

  const key = String(formData.get('kunci') ?? '')
  if (!IDEMPOTENCY_KEY.test(key)) return { status: 'failed' }

  const list = await headers()
  const ip = (list.get('x-forwarded-for')?.split(',')[0] ?? list.get('x-real-ip') ?? '').trim()

  try {
    return await saveEnquiry({ ip, key, values })
  } catch (error) {
    // Logged without the visitor's details (PRD §8.6: no personal data in logs).
    console.error('Enquiry save failed:', error instanceof Error ? error.message : 'unknown error')
    return { status: 'failed' }
  }
}
