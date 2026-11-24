import { describe, expect, it } from 'vitest'

import { activeFilterChips, parseFilters, searchCatalogue, toQuery } from '@/lib/catalogue'
import { sampleSiteData as data } from '@/lib/sample-data'

// Fixed "today" so the sample sessions stay in the future whenever the tests run.
const NOW = new Date('2026-11-19T00:00:00+07:00')
const search = (params: Record<string, string | string[]>) =>
  searchCatalogue(parseFilters(params), data, NOW)
const slugs = (params: Record<string, string | string[]>) => search(params).items.map((c) => c.slug)

// PRD §6 catalogue rules and AC-03.
describe('catalogue search and filters', () => {
  it('shows every course with no filters', () => {
    expect(search({}).total).toBe(10)
  })

  it('search matches title, expanded acronym and aliases, ignoring case and word order', () => {
    expect(slugs({ q: 'ism auditor' })).toEqual(['internal-auditor-ism-code'])
    expect(slugs({ q: 'safety management' })).toEqual(['internal-auditor-ism-code'])
    expect(slugs({ q: 'stabilitas' })).toEqual(['ship-intact-stability'])
  })

  it('combines choices in one group with OR', () => {
    expect(slugs({ topik: ['crewing', 'ship-design'] }).sort()).toEqual([
      'maritime-labour-convention',
      'ship-intact-stability',
    ])
  })

  it('combines groups with AND', () => {
    expect(slugs({ topik: 'security', format: 'live-online' })).toEqual(['ship-security-officer'])
  })

  it('needs one session that matches both month and location', () => {
    // Internal Auditor ISM Code: 8 Mar in Jakarta Utara, 15 Mar online.
    expect(slugs({ bulan: '2027-03', lokasi: 'online' })).toEqual(['internal-auditor-ism-code'])
    expect(slugs({ bulan: '2027-01', lokasi: 'online' })).toEqual([])
  })

  it('returns an empty list, not an error, when nothing matches', () => {
    expect(search({ q: 'kapal selam nuklir' })).toEqual({ total: 0, items: [] })
  })

  it('round-trips filters through the URL so shared links give the same result', () => {
    const filters = parseFilters({ q: 'ism', topik: ['safety', 'security'], format: 'tatap-muka' })
    expect(toQuery(filters)).toBe('?q=ism&topik=safety&topik=security&format=tatap-muka')
  })

  it('ignores malformed values', () => {
    const filters = parseFilters({ bulan: 'march', tampil: '-5' })
    expect(filters.bulan).toBe('')
    expect(filters.tampil).toBe(8)
  })

  it('pages results with tampil', () => {
    expect(search({}).items).toHaveLength(8)
    expect(search({ tampil: '16' }).items).toHaveLength(10)
  })

  it('builds chips that remove only their own value', () => {
    const chips = activeFilterChips(
      parseFilters({ topik: ['safety', 'survey'], q: 'audit' }),
      data,
      NOW,
    )
    expect(chips.map((c) => c.href)).toEqual([
      '?topik=safety&topik=survey',
      '?q=audit&topik=survey',
      '?q=audit&topik=safety',
    ])
  })
})
