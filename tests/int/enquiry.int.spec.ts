import { describe, expect, it } from 'vitest'

import { validateEnquiry, type EnquiryValues } from '@/lib/enquiry'

const valid: EnquiryValues = {
  nama: 'Rina Wulandari',
  email: 'rina@pelayaran.co.id',
  perusahaan: 'PT Pelayaran Contoh',
  telepon: '0812 3456 7890',
  topik: 'Internal Auditor ISM Code',
  peserta: '11-25',
  waktu: 'Maret 2027',
  format: 'lokasi-perusahaan',
  kebutuhan: '',
  setuju: 'ya',
}

// PRD §6 Corporate training form and §8.6 server-side validation.
describe('corporate enquiry validation', () => {
  it('accepts a complete enquiry; extra needs are optional', () => {
    expect(validateEnquiry(valid)).toEqual({})
  })

  it('reports every missing required field', () => {
    const empty = Object.fromEntries(Object.keys(valid).map((k) => [k, ''])) as EnquiryValues
    expect(Object.keys(validateEnquiry(empty)).sort()).toEqual(
      [
        'email',
        'format',
        'nama',
        'perusahaan',
        'peserta',
        'setuju',
        'telepon',
        'topik',
        'waktu',
      ].sort(),
    )
  })

  it('checks email and phone formats', () => {
    expect(validateEnquiry({ ...valid, email: 'rina@pelayaran' }).email).toMatch(/format email/)
    expect(validateEnquiry({ ...valid, telepon: '0812' }).telepon).toMatch(/nomor telepon/)
    expect(validateEnquiry({ ...valid, telepon: '+62 (21) 555-0123' })).toEqual({})
    expect(validateEnquiry({ ...valid, telepon: '0812abc34567' }).telepon).toBeDefined()
  })

  it('rejects option values that are not on the list', () => {
    expect(validateEnquiry({ ...valid, peserta: '1000' }).peserta).toBeDefined()
    expect(validateEnquiry({ ...valid, format: 'kapal' }).format).toBeDefined()
  })

  it('limits text length', () => {
    expect(validateEnquiry({ ...valid, kebutuhan: 'a'.repeat(1001) }).kebutuhan).toMatch(/1000/)
    expect(validateEnquiry({ ...valid, nama: 'a'.repeat(121) }).nama).toMatch(/120/)
  })
})
