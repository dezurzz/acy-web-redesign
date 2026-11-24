import { describe, expect, it } from 'vitest'

import {
  getRegistrationSession,
  handoffKind,
  whatsappMessage,
  whatsappUrl,
} from '@/lib/registration'
import { sampleSessions } from '@/lib/sample-data'

const NOW = new Date('2026-11-19T00:00:00+07:00')
const session = (id: string, now = NOW) => getRegistrationSession(id, sampleSessions, now)!

// PRD §6 Registration request, AC-04 and AC-13.
describe('WhatsApp registration handoff', () => {
  it('returns null for a missing or unknown session code', () => {
    expect(getRegistrationSession(undefined, sampleSessions, NOW)).toBeNull()
    expect(getRegistrationSession('JDW-9999', sampleSessions, NOW)).toBeNull()
  })

  it('offers registration only for open sessions (AC-04)', () => {
    expect(handoffKind(session('JDW-0308'))).toBe('register') // open
    expect(handoffKind(session('JDW-0222'))).toBe('waitlist') // full, waitlist staffed
    expect(handoffKind(session('JDW-0315'))).toBe('none') // not yet open
    expect(handoffKind(session('JDW-0329'))).toBe('none') // postponed
  })

  it('offers nothing once the session has started', () => {
    expect(handoffKind(session('JDW-0308', new Date('2027-03-09T00:00:00+07:00')))).toBe('none')
  })

  it('puts only course, dates, location/format and session code in the link (AC-13)', () => {
    const s = session('JDW-0308')
    const url = new URL(whatsappUrl('+62 800-0000-0000', whatsappMessage(s, 'register')))
    const text = url.searchParams.get('text')!

    expect(url.origin).toBe('https://wa.me')
    expect(url.pathname).toBe('/6280000000000')
    expect([...url.searchParams.keys()]).toEqual(['text'])
    expect(text).toContain('Internal Auditor ISM Code')
    expect(text).toContain('8–10 Maret 2027')
    expect(text).toContain('Tatap muka · Jakarta Utara')
    expect(text).toContain('Kode jadwal: JDW-0308')
    // Every line is one of the allowed public facts.
    const labels = text
      .split('\n')
      .slice(1)
      .map((line) => line.split(':')[0])
    expect(labels).toEqual(['Pelatihan', 'Jadwal', 'Lokasi/format', 'Kode jadwal'])
  })

  it('words a waitlist request differently', () => {
    expect(whatsappMessage(session('JDW-0222'), 'waitlist')).toContain('masuk daftar tunggu')
  })
})
