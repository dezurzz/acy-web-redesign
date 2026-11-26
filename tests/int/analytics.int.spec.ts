import { describe, expect, it } from 'vitest'

import { catalogueEvents, sanitizeProps } from '@/lib/analytics'

// PRD §9: analytics carry non-personal IDs and counts only; never free text or contact details.
describe('analytics privacy guard', () => {
  it('keeps the allowed, non-personal fields of an event', () => {
    expect(
      sanitizeProps('session_select', { course: 'marine-surveyor', session: 'JDW-7K3P' }),
    ).toEqual({
      course: 'marine-surveyor',
      session: 'JDW-7K3P',
    })
  })

  it('drops fields an event does not allow', () => {
    expect(sanitizeProps('course_view', { course: 'mlc', email: 'x', q: 'kursus' })).toEqual({
      course: 'mlc',
    })
  })

  it('drops anything that looks like an email, a phone number or free text', () => {
    expect(sanitizeProps('portal_link_click', { destination: 'nama@perusahaan.co.id' })).toEqual({})
    expect(sanitizeProps('portal_link_click', { destination: '081234567890' })).toEqual({})
    expect(sanitizeProps('portal_link_click', { destination: '0812-3456-7890' })).toEqual({})
    expect(sanitizeProps('portal_link_click', { destination: 'saya mau daftar' })).toEqual({})
  })

  it('allows counts and flags', () => {
    expect(
      sanitizeProps('course_search', { resultCount: 0, hasResults: false, page: 'jadwal' }),
    ).toEqual({
      resultCount: 0,
      hasResults: false,
      page: 'jadwal',
    })
  })
})

describe('search and filter events', () => {
  const none = { q: '', topik: [], format: [], bulan: '', lokasi: [] }

  it('sends nothing without a search or filter', () => {
    expect(catalogueEvents('pelatihan', none, 10)).toEqual([])
  })

  it('reports a search by its result count, never the search term', () => {
    const [event] = catalogueEvents('pelatihan', { ...none, q: 'pak budi 0812345678' }, 0)
    expect(event).toEqual({
      name: 'course_search',
      page: 'pelatihan',
      resultCount: 0,
      hasResults: false,
    })
    expect(JSON.stringify(event)).not.toContain('budi')
  })

  it('reports the selected filter values and the result count', () => {
    const [event] = catalogueEvents(
      'jadwal',
      { ...none, topik: ['safety', 'security'], bulan: '2027-03' },
      4,
    )
    expect(event).toMatchObject({
      name: 'filter_apply',
      topik: 'safety,security',
      bulan: '2027-03',
      resultCount: 4,
    })
  })
})
