import { expect, test } from '@playwright/test'

test.describe('Frontend', () => {
  test('root redirects to the Indonesian homepage', async ({ page }) => {
    await page.goto('http://localhost:3000/')
    await expect(page).toHaveURL('http://localhost:3000/id')
    await expect(page).toHaveTitle(/BKI Academy/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'id')
  })

  test('homepage has one H1 and the primary actions', async ({ page }) => {
    await page.goto('http://localhost:3000/id')
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.getByRole('link', { name: 'Lihat Jadwal' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Pelatihan untuk Perusahaan' })).toBeVisible()
  })

  test('skip link is the first focusable element and targets main', async ({ page }) => {
    await page.goto('http://localhost:3000/id')
    await page.keyboard.press('Tab')
    const skip = page.getByRole('link', { name: 'Lewati ke konten utama' })
    await expect(skip).toBeFocused()
    await expect(skip).toHaveAttribute('href', '#konten-utama')
  })

  test('no horizontal scroll at 320 px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 })
    await page.goto('http://localhost:3000/id')
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )
    expect(overflow).toBe(false)
  })
})
