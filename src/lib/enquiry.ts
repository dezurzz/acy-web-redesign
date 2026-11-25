/*
 * Corporate enquiry form rules (PRD §6 Corporate training, §8.3, §8.6).
 * One set of rules, used by the browser (instant feedback) and the server (the real check;
 * never trust the browser). Messages say what to do, not just what is wrong.
 */

export const participantOptions = [
  { value: '1-10', label: '1–10 peserta' },
  { value: '11-25', label: '11–25 peserta' },
  { value: '26-50', label: '26–50 peserta' },
  { value: '50+', label: 'Lebih dari 50 peserta' },
] as const

export const deliveryOptions = [
  { value: 'lokasi-perusahaan', label: 'Di lokasi perusahaan' },
  { value: 'fasilitas-bki', label: 'Di fasilitas BKI' },
  { value: 'live-online', label: 'Live online' },
] as const

/** Field names in form order; the error summary lists errors in this order. */
export const enquiryFields = [
  'nama',
  'email',
  'perusahaan',
  'telepon',
  'topik',
  'peserta',
  'waktu',
  'format',
  'kebutuhan',
  'setuju',
] as const

export type EnquiryField = (typeof enquiryFields)[number]
export type EnquiryValues = Record<EnquiryField, string>
export type EnquiryErrors = Partial<Record<EnquiryField, string>>

export const LIMITS = { short: 120, long: 1000 } as const

/**
 * Version of the Kebijakan Privasi the visitor agreed to, stored with each request (PRD §7).
 * Change it whenever the policy text changes. Still a draft until BKI's data owner approves it.
 */
export const PRIVACY_POLICY_VERSION = 'draf-2026-11-25'

/** Hidden field that people never see or fill; bots that fill every field do (honeypot). */
export const HONEYPOT_FIELD = 'situs_web'

/** A browser-made request key (crypto.randomUUID): one per filled-in form, reused on retries. */
export const IDEMPOTENCY_KEY = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function readEnquiry(data: FormData): EnquiryValues {
  const get = (name: string) => String(data.get(name) ?? '').trim()
  return Object.fromEntries(enquiryFields.map((f) => [f, get(f)])) as EnquiryValues
}

export function validateEnquiry(v: EnquiryValues): EnquiryErrors {
  const errors: EnquiryErrors = {}
  const required = (field: EnquiryField, message: string) => {
    if (!v[field]) errors[field] = message
  }

  required('nama', 'Isi nama kontak.')
  required('email', 'Isi email kantor, contoh nama@perusahaan.co.id.')
  if (v.email && !EMAIL.test(v.email))
    errors.email = 'Periksa format email, contoh nama@perusahaan.co.id.'
  required('perusahaan', 'Isi nama perusahaan.')
  required('telepon', 'Isi nomor telepon atau WhatsApp.')
  const digits = v.telepon.replace(/\D/g, '')
  if (v.telepon && (digits.length < 8 || digits.length > 15 || /[^\d\s+()-]/.test(v.telepon))) {
    errors.telepon = 'Periksa nomor telepon, contoh 0812 3456 7890.'
  }
  required('topik', 'Tulis topik pelatihan yang dibutuhkan.')
  if (!participantOptions.some((o) => o.value === v.peserta)) {
    errors.peserta = 'Pilih perkiraan jumlah peserta.'
  }
  required('waktu', 'Tulis perkiraan waktu pelaksanaan, contoh Maret 2027.')
  if (!deliveryOptions.some((o) => o.value === v.format)) {
    errors.format = 'Pilih lokasi atau format pelatihan.'
  }
  if (v.setuju !== 'ya')
    errors.setuju = 'Centang pernyataan bahwa Anda telah membaca Kebijakan Privasi.'

  for (const field of ['nama', 'perusahaan', 'topik', 'waktu', 'email', 'telepon'] as const) {
    if (v[field].length > LIMITS.short && !errors[field]) {
      errors[field] = `Maksimal ${LIMITS.short} karakter.`
    }
  }
  if (v.kebutuhan.length > LIMITS.long) errors.kebutuhan = `Maksimal ${LIMITS.long} karakter.`

  return errors
}

/** Field id in the page, used by the error summary links. */
export const fieldId = (field: EnquiryField) => `inhouse-${field}`
