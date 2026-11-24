import { describe, expect, it } from 'vitest'

import { parseFilters } from '@/lib/catalogue'
import { sampleSiteData as data } from '@/lib/sample-data'
import { searchSchedule } from '@/lib/schedule'

const NOW = new Date('2026-11-19T00:00:00+07:00')
const run = (params: Record<string, string | string[]>, now = NOW) =>
  searchSchedule(parseFilters(params), data, now)
const ids = (params: Record<string, string | string[]>, now = NOW) =>
  run(params, now).groups.flatMap((g) => g.sessions.map((s) => s.id))

// PRD §6 schedule rules and AC-03.
describe('schedule search and filters', () => {
  it('lists future sessions soonest first, grouped by month', () => {
    const result = run({})
    expect(result.total).toBe(7)
    expect(result.groups.map((g) => g.label)).toEqual([
      'Januari 2027',
      'Februari 2027',
      'Maret 2027',
      'April 2027',
    ])
    const starts = result.groups.flatMap((g) => g.sessions.map((s) => s.startDate))
    expect(starts).toEqual([...starts].sort())
  })

  it('drops sessions that have already started', () => {
    expect(ids({}, new Date('2027-03-09T00:00:00+07:00'))).not.toContain('JDW-0308')
  })

  it('filters by the session format, not the course formats', () => {
    // Internal Auditor ISM Code runs both formats; only its online session should match.
    expect(ids({ q: 'ism', format: 'live-online' })).toEqual(['JDW-0315'])
  })

  it('combines month, location and topic with AND', () => {
    expect(ids({ bulan: '2027-03', lokasi: 'jakarta-utara' })).toEqual(['JDW-0308', 'JDW-0329'])
    expect(ids({ bulan: '2027-03', lokasi: 'jakarta-utara', topik: 'survey' })).toEqual([
      'JDW-0329',
    ])
  })

  it('never lists cancelled or completed sessions', () => {
    const statuses = run({}).groups.flatMap((g) => g.sessions.map((s) => s.status))
    expect(statuses).not.toContain('cancelled')
    expect(statuses).not.toContain('completed')
  })
})
