import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { loadSiteSettings } from '@/lib/cms'
import {
  formatWhatsApp,
  isSafeExternalUrl,
  normaliseWhatsApp,
  phoneToHref,
  toSiteSettings,
} from '@/lib/site-settings'
import config from '@/payload.config'

// PRD §6: contacts and the WhatsApp number come from Site settings, which staff edit in the CMS.
describe('site settings rules', () => {
  it('normalises WhatsApp numbers however staff type them', () => {
    expect(normaliseWhatsApp('0812 3456 7890')).toBe('6281234567890')
    expect(normaliseWhatsApp('+62 812-3456-7890')).toBe('6281234567890')
    expect(formatWhatsApp('6281234567890')).toBe('+62 812-3456-7890')
  })

  it('turns a written phone number into a tel: target', () => {
    expect(phoneToHref('(021) 1234-5678')).toBe('+622112345678')
  })

  it('only accepts https links to other systems', () => {
    expect(isSafeExternalUrl('https://portal.example.co.id/login')).toBe(true)
    expect(isSafeExternalUrl('http://portal.example.co.id')).toBe(false)
    expect(isSafeExternalUrl('javascript:alert(1)')).toBe(false)
  })

  it('falls back to marked placeholders before anything is saved', () => {
    const settings = toSiteSettings(null)
    expect(settings.isPlaceholder).toBe(true)
    expect(settings.portalUrl).toBeNull()
    expect(settings.address.length).toBeGreaterThan(0)
  })
})

describe('Site settings in the CMS', () => {
  let payload: Payload
  let original: Record<string, unknown>

  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    original = (await payload.findGlobal({ slug: 'site-settings', depth: 0 })) as unknown as Record<
      string,
      unknown
    >
  })

  afterAll(async () => {
    // Put every field back, including ones that were empty before (undefined would leave test values behind).
    const fields = [
      'whatsappNumber',
      'phone',
      'email',
      'serviceHours',
      'address',
      'portalUrl',
      'certificateUrl',
      'contactsConfirmed',
    ]
    const data = Object.fromEntries(fields.map((field) => [field, original[field] ?? null]))
    await payload.updateGlobal({ slug: 'site-settings', data })
  })

  it('lets admins and publishers change settings, but not editors', async () => {
    const update = (roles: ('admin' | 'publisher' | 'editor')[]) =>
      payload.updateGlobal({
        slug: 'site-settings',
        data: { serviceHours: `TEST ${roles[0]}` },
        overrideAccess: false,
        user: { id: 999999, email: 'test@bki.academy.test', roles, collection: 'users' } as never,
      })
    await expect(update(['editor'])).rejects.toThrow()
    await expect(update(['publisher'])).resolves.toBeTruthy()
  })

  it('stores the WhatsApp number in wa.me format and shows changes on the site', async () => {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: { whatsappNumber: '0812 3456 7890', portalUrl: 'https://portal.example.co.id' },
    })
    const saved = await payload.findGlobal({ slug: 'site-settings' })
    expect(saved.whatsappNumber).toBe('6281234567890')

    const settings = await loadSiteSettings()
    expect(settings.whatsappDisplay).toBe('+62 812-3456-7890')
    expect(settings.portalUrl).toBe('https://portal.example.co.id')
  })

  it('rejects an incomplete WhatsApp number and a non-https link', async () => {
    await expect(
      payload.updateGlobal({ slug: 'site-settings', data: { whatsappNumber: '0812' } }),
    ).rejects.toThrow()
    await expect(
      payload.updateGlobal({
        slug: 'site-settings',
        data: { certificateUrl: 'http://sertifikat.example' },
      }),
    ).rejects.toThrow()
  })
})
