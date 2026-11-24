'use server'

import { readEnquiry, validateEnquiry, type EnquiryErrors } from '@/lib/enquiry'

export type EnquiryResult =
  | { status: 'invalid'; errors: EnquiryErrors }
  | { status: 'failed' }
  | { status: 'simulated'; reference: string; topic: string }

/*
 * PROTOTYPE ONLY (TIMELINE Phase 2, PRD §8.6): validates on the server like the real thing,
 * then returns a clearly labelled SIMULATED result. Nothing is stored or sent.
 * Build Sprints 2–3 replace the end of this function with persistence, an idempotency key,
 * a real reference number and the notification outbox (PRD §8.3). Production must never fake success.
 */
export async function submitEnquiry(formData: FormData): Promise<EnquiryResult> {
  const values = readEnquiry(formData)
  const errors = validateEnquiry(values)
  if (Object.keys(errors).length > 0) return { status: 'invalid', errors }

  // Lets reviewers see the failure state: /id/in-house?simulasi=gagal
  if (formData.get('simulasi') === 'gagal') return { status: 'failed' }

  await new Promise((resolve) => setTimeout(resolve, 700))
  const reference = `SIMULASI-${crypto.randomUUID().slice(0, 6).toUpperCase()}`
  return { status: 'simulated', reference, topic: values.topik }
}
