/*
 * Site settings: contacts and participant-system links (PRD §6, §7).
 * Staff edit them in the CMS (global "Pengaturan situs", src/globals/SiteSettings.ts); pages load
 * them with loadSiteSettings() in lib/cms.ts. The defaults below are PLACEHOLDERS (decision D-05)
 * used until staff save real values; the site warns visitors until contacts are confirmed.
 * Pure helpers only, so they can be unit-tested and used by the CMS hooks.
 */

export type SiteSettings = {
  /** International format, digits only (wa.me requires this), e.g. 6281234567890. */
  whatsappNumber: string
  /** e.g. +62 812-3456-7890 */
  whatsappDisplay: string
  /** As people should read it, e.g. (021) 1234-5678. */
  phone: string
  /** For tel: links, e.g. +62211234567. */
  phoneHref: string
  email: string
  serviceHours: string
  address: string[]
  /** null until the destination is confirmed and tested (D-07, PRD §4). */
  portalUrl: string | null
  certificateUrl: string | null
  /** True until staff tick "Kontak sudah dikonfirmasi". */
  isPlaceholder: boolean
}

export const defaultSettings = {
  whatsappNumber: '6280000000000',
  phone: '(021) 0000-0000',
  email: 'academy@contoh.id',
  serviceHours: 'Senin–Jumat, 08.00–16.00 WIB',
  address: 'Alamat kantor menunggu konfirmasi\nJakarta',
} as const

/** Digits only; a local number starting with 0 becomes 62… (Indonesia). */
export function normaliseWhatsApp(input: string) {
  const digits = input.replace(/\D/g, '')
  return digits.startsWith('0') ? `62${digits.slice(1)}` : digits
}

/** Basic sanity check for an international mobile number. */
export const isValidWhatsApp = (digits: string) => /^[1-9]\d{8,14}$/.test(digits)

/** 6281234567890 → +62 812-3456-7890 (other countries: + and the digits). */
export function formatWhatsApp(digits: string) {
  if (!digits.startsWith('62')) return `+${digits}`
  const rest = digits.slice(2)
  return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7)}`.replace(/-$/, '')
}

/** (021) 1234-5678 → +62211234567890 for tel: links. */
export function phoneToHref(phone: string) {
  const digits = phone.replace(/\D/g, '')
  return digits.startsWith('0') ? `+62${digits.slice(1)}` : `+${digits}`
}

/** Only https links to other systems are allowed (labelled as leaving the site). */
export const isSafeExternalUrl = (url: string) => /^https:\/\/[^\s]+\.[^\s]+$/.test(url)

type SettingsDoc = {
  whatsappNumber?: string | null
  phone?: string | null
  email?: string | null
  serviceHours?: string | null
  address?: string | null
  portalUrl?: string | null
  certificateUrl?: string | null
  contactsConfirmed?: boolean | null
}

/** Converts the CMS document (possibly never saved, so fields may be empty) to what pages use. */
export function toSiteSettings(doc: SettingsDoc | null | undefined): SiteSettings {
  const whatsappNumber = normaliseWhatsApp(doc?.whatsappNumber || defaultSettings.whatsappNumber)
  const phone = doc?.phone || defaultSettings.phone
  const url = (value: string | null | undefined) =>
    value && isSafeExternalUrl(value) ? value : null

  return {
    whatsappNumber,
    whatsappDisplay: formatWhatsApp(whatsappNumber),
    phone,
    phoneHref: phoneToHref(phone),
    email: doc?.email || defaultSettings.email,
    serviceHours: doc?.serviceHours || defaultSettings.serviceHours,
    address: (doc?.address || defaultSettings.address)
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
    portalUrl: url(doc?.portalUrl),
    certificateUrl: url(doc?.certificateUrl),
    isPlaceholder: !doc?.contactsConfirmed,
  }
}
