import { expect, test } from '@playwright/test'
import { getPayload } from 'payload'

import config from '../../src/payload.config.js'

// AC-05: a valid corporate enquiry persists once and shows its reference (PRD §8.3).
const EMAIL = 'e2e-permintaan@contoh.co.id'

test.describe('Corporate enquiry form', () => {
  test.afterAll(async () => {
    const payload = await getPayload({ config })
    await payload.delete({
      collection: 'enquiries',
      where: { email: { equals: EMAIL } },
      overrideAccess: true,
    })
  })

  test('saves a request once, even on a double click, and shows its reference', async ({
    page,
  }) => {
    // Skip the first-visit curtain so it never covers the form during the test.
    await page.addInitScript(() => sessionStorage.setItem('bki-tirai-dilihat', '1'))
    await page.goto('http://localhost:3000/id/in-house')

    await page.fill('#inhouse-nama', 'E2E Permintaan')
    await page.fill('#inhouse-email', EMAIL)
    await page.fill('#inhouse-perusahaan', 'PT E2E')
    await page.fill('#inhouse-telepon', '0812 3456 7890')
    await page.fill('#inhouse-topik', 'Welding Inspector')
    await page.fill('#inhouse-waktu', 'Mei 2027')
    await page.check('#inhouse-peserta-0')
    await page.check('#inhouse-format-2')
    await page.check('#inhouse-setuju')
    await page.getByRole('button', { name: 'Kirim Kebutuhan Pelatihan' }).dblclick()

    await expect(page.getByText('Kebutuhan pelatihan Anda sudah kami terima')).toBeVisible()
    const reference = await page.locator('strong.numeric').textContent()
    // Analytics: counted once, after the save, with no form contents (PRD §9).
    const successes = await page.evaluate(() =>
      (window.bkiAnalytics ?? []).filter((e) => e.name === 'corporate_enquiry_success'),
    )
    expect(successes).toHaveLength(1)
    expect(successes[0]?.props).toEqual({})
    expect(reference).toMatch(/^INH-[A-HJ-NP-Z2-9]{6}$/)

    const payload = await getPayload({ config })
    const saved = await payload.count({
      collection: 'enquiries',
      where: { email: { equals: EMAIL } },
      overrideAccess: true,
    })
    expect(saved.totalDocs).toBe(1)
  })
})
