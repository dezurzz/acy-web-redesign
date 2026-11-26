import { describe, expect, it } from 'vitest'

import { COURSE_SLUGS, launchRedirects } from '@/lib/redirects'

// Launch redirect map (PRD §4 P0, src/lib/redirects.ts). Matching itself is checked against the
// running site; these tests guard the map's shape and the launch switch.
describe('launch redirects', () => {
  const rules = launchRedirects(false)

  it('has no duplicate sources (Next.js would use only the first)', () => {
    const sources = rules.map((r) => r.source)
    expect(new Set(sources).size).toBe(sources.length)
  })

  it('sends every old URL to a page on the new Indonesian site', () => {
    for (const rule of rules) expect(rule.destination).toMatch(/^\/id(\/|\?|$)/)
  })

  it('covers each old path with and without the /id prefix', () => {
    const sources = new Set(rules.map((r) => r.source))
    for (const path of ['/about', '/contactus', '/schedule', '/shop', '/privacy-policy']) {
      expect(sources.has(path)).toBe(true)
      expect(sources.has(`/id${path}`)).toBe(true)
    }
  })

  it('has a course rule for each of the 21 Odoo training products', () => {
    expect(Object.keys(COURSE_SLUGS)).toHaveLength(21)
    for (const [id, slug] of Object.entries(COURSE_SLUGS)) {
      expect(
        rules.some((r) => r.source.endsWith(`-${id}`) && r.destination === `/id/pelatihan/${slug}`),
      ).toBe(true)
    }
  })

  it('is all temporary before launch', () => {
    expect(rules.every((r) => r.permanent === false)).toBe(true)
  })

  it('becomes permanent at launch, except stand-in targets', () => {
    const launched = launchRedirects(true)
    expect(launched.find((r) => r.source === '/about')?.permanent).toBe(true)
    expect(launched.find((r) => r.source === '/trainer')?.permanent).toBe(false)
    expect(launched.find((r) => r.source === '/blog')?.permanent).toBe(false)
  })
})
