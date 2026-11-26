import { expect, test, type Page } from '@playwright/test'

// PRD §9 analytics events: the right event fires, with non-personal fields only.
// Events are read from window.bkiAnalytics, the queue a provider adapter will consume.
type Queued = { name: string; props: Record<string, unknown>; env: string }

async function open(page: Page, path: string) {
  await page.addInitScript(() => {
    sessionStorage.setItem('bki-tirai-dilihat', '1') // skip the first-visit curtain
    // Keep external links (WhatsApp, tel:, mailto:) from opening; analytics records in the
    // capture phase, before this bubble-phase listener cancels the navigation.
    window.addEventListener('click', (event) => {
      const link = (event.target as Element).closest('a')
      if (link && !link.getAttribute('href')?.startsWith('/')) event.preventDefault()
    })
  })
  await page.goto(`http://localhost:3000${path}`)
}

const events = (page: Page) => page.evaluate(() => (window.bkiAnalytics ?? []) as Queued[])
const named = async (page: Page, name: string) =>
  (await events(page)).filter((e) => e.name === name)

test.describe('Analytics events', () => {
  test('search sends the result count, never the search term', async ({ page }) => {
    await open(page, '/id/pelatihan?q=surveyor%20budi')
    await expect.poll(() => named(page, 'course_search')).toHaveLength(1)
    const [search] = await named(page, 'course_search')
    expect(search?.props).toMatchObject({ page: 'pelatihan', hasResults: expect.any(Boolean) })
    expect(JSON.stringify(await events(page))).not.toMatch(/surveyor|budi/)
  })

  test('a search with filters sends each event once', async ({ page }) => {
    await open(page, '/id/pelatihan?q=marine&topik=survey')
    await expect.poll(async () => (await events(page)).length).toBeGreaterThanOrEqual(2)
    await page.waitForTimeout(300)
    expect((await events(page)).map((e) => e.name).sort()).toEqual([
      'course_search',
      'filter_apply',
    ])
  })

  test('filters send the selected values', async ({ page }) => {
    await open(page, '/id/jadwal?topik=safety')
    await expect.poll(() => named(page, 'filter_apply')).toHaveLength(1)
    expect((await named(page, 'filter_apply'))[0]?.props).toMatchObject({
      page: 'jadwal',
      topik: 'safety',
    })
  })

  test('course view and session choice', async ({ page }) => {
    await open(page, '/id/pelatihan/internal-auditor-ism-code')
    await expect.poll(() => named(page, 'course_view')).toHaveLength(1)
    expect((await named(page, 'course_view'))[0]?.props).toEqual({
      course: 'internal-auditor-ism-code',
    })
    const radios = page.getByRole('radio')
    if ((await radios.count()) > 1) {
      await radios.nth(1).check()
      const [select] = await named(page, 'session_select')
      expect(select?.props).toMatchObject({
        course: 'internal-auditor-ism-code',
        session: expect.stringMatching(/^JDW-/),
      })
    }
  })

  test('registration handoff: start and WhatsApp click carry the session code', async ({
    page,
  }) => {
    await open(page, '/id/pendaftaran?session=JDW-0308')
    await expect.poll(() => named(page, 'registration_start')).toHaveLength(1)
    expect((await named(page, 'registration_start'))[0]?.props).toEqual({
      session: 'JDW-0308',
      course: 'internal-auditor-ism-code',
    })
    await page.getByRole('link', { name: /Lanjutkan ke WhatsApp|Daftar Tunggu/ }).click()
    expect((await named(page, 'whatsapp_registration_click'))[0]?.props).toEqual({
      session: 'JDW-0308',
    })
  })

  test('contact clicks record the channel and the page, not the number or address', async ({
    page,
  }) => {
    await open(page, '/id/hubungi-kami')
    await page.locator('a[href^="tel:"]').first().click()
    await page.locator('a[href^="mailto:"]').first().click()
    const clicks = await named(page, 'contact_click')
    expect(clicks.map((c) => c.props)).toEqual([
      { channel: 'phone', location: 'hubungi-kami' },
      { channel: 'email', location: 'hubungi-kami' },
    ])
    expect(clicks.every((c) => c.env === 'development')).toBe(true)
  })
})
