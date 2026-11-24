/*
 * SAMPLE DATA for the Phase 2 coded prototype (TIMELINE.md Phase 2).
 * Course names come from the Phase 0 Course Audit so text lengths are realistic.
 * Dates, venues, fees and statuses are invented and NOT approved content.
 * Build Sprint 1 replaces every import of this file with Payload queries.
 */
import type { SessionDisplayStatus } from '@/components/ui/status-badge'

export type SampleCategory = {
  slug: string
  name: string
  description: string
  examples: string[]
}

// The six default categories (decision B-04).
export const sampleCategories: SampleCategory[] = [
  {
    slug: 'safety',
    name: 'Safety',
    description: 'Sistem manajemen keselamatan, audit ISM, dan investigasi kecelakaan.',
    examples: ['Internal Auditor ISM Code', 'Accident Investigation'],
  },
  {
    slug: 'security',
    name: 'Security',
    description: 'ISPS Code serta keamanan kapal dan fasilitas pelabuhan.',
    examples: ['Ship Security Officer', 'Port Facility Security Officer'],
  },
  {
    slug: 'survey',
    name: 'Survey',
    description: 'Survei kondisi kapal, pengawasan bangunan baru, dan inspeksi las.',
    examples: ['Marine Surveyor', 'Welding Inspector'],
  },
  {
    slug: 'crewing',
    name: 'Crewing',
    description: 'Maritime Labour Convention dan pengelolaan awak kapal.',
    examples: ['Maritime Labour Convention'],
  },
  {
    slug: 'environment',
    name: 'Environment',
    description: 'Pengelolaan air balas dan perlindungan lingkungan laut.',
    examples: ['Ballast Water Management', 'MARPOL Annex VI'],
  },
  {
    slug: 'ship-design',
    name: 'Ship Design',
    description: 'Stabilitas kapal dan tinjauan rekayasa desain.',
    examples: ['Ship Intact Stability and Ship Damage Stability Calculation'],
  },
]

export type SampleCourse = {
  slug: string
  title: string
  /** Expanded acronym, shown once on the detail page and searchable (PRD §6). */
  acronym?: string
  /** Other names people search for. */
  aliases?: string[]
  categorySlug: string
  outcome: string
  duration: string
  formats: string[]
}

export const sampleCourses: SampleCourse[] = [
  {
    slug: 'internal-auditor-ism-code',
    title: 'Internal Auditor ISM Code',
    acronym: 'International Safety Management Code',
    aliases: ['audit ISM', 'auditor internal'],
    categorySlug: 'safety',
    outcome: 'Merencanakan dan melaksanakan audit internal sistem manajemen keselamatan kapal.',
    duration: '3 hari',
    formats: ['Tatap muka', 'Live online'],
  },
  {
    slug: 'accident-investigation',
    title: 'Marine Accident Investigation',
    aliases: ['investigasi kecelakaan'],
    categorySlug: 'safety',
    outcome: 'Menyelidiki kecelakaan kapal dan menyusun rekomendasi pencegahan.',
    duration: '3 hari',
    formats: ['Tatap muka'],
  },
  {
    slug: 'ship-security-officer',
    title: 'Ship Security Officer (SSO)',
    acronym: 'International Ship and Port Facility Security Code',
    aliases: ['SSO', 'ISPS', 'perwira keamanan kapal'],
    categorySlug: 'security',
    outcome: 'Menjalankan tugas Ship Security Officer sesuai ISPS Code.',
    duration: '3 hari',
    formats: ['Tatap muka', 'Live online'],
  },
  {
    slug: 'imo-model-course-3-24',
    title:
      'IMO Model Course 3.24 Security Awareness Training for Port Facility Personnel with Designated Security Duties',
    acronym: 'International Maritime Organization',
    aliases: ['ISPS', 'keamanan pelabuhan'],
    categorySlug: 'security',
    outcome: 'Memahami tugas keamanan fasilitas pelabuhan sesuai ISPS Code.',
    duration: '1 hari',
    formats: ['Tatap muka'],
  },
  {
    slug: 'marine-surveyor',
    title: 'Marine Surveyor',
    aliases: ['surveyor kapal', 'survei kapal'],
    categorySlug: 'survey',
    outcome: 'Melakukan survei kondisi kapal dan menyusun laporan survei.',
    duration: '5 hari',
    formats: ['Tatap muka'],
  },
  {
    slug: 'welding-inspector',
    title: 'Welding Inspector',
    aliases: ['inspeksi las', 'pengelasan'],
    categorySlug: 'survey',
    outcome: 'Memeriksa mutu pengelasan pada konstruksi kapal sesuai standar klasifikasi.',
    duration: '5 hari',
    formats: ['Tatap muka'],
  },
  {
    slug: 'maritime-labour-convention',
    title: 'Maritime Labour Convention',
    acronym: 'MLC 2006',
    aliases: ['MLC', 'awak kapal'],
    categorySlug: 'crewing',
    outcome: 'Menerapkan ketentuan MLC 2006 untuk hak dan kesejahteraan awak kapal.',
    duration: '2 hari',
    formats: ['Live online', 'Belajar mandiri'],
  },
  {
    slug: 'ballast-water-management',
    title: 'Ballast Water Management',
    aliases: ['BWM', 'air balas'],
    categorySlug: 'environment',
    outcome: 'Menyusun dan menjalankan rencana pengelolaan air balas.',
    duration: '2 hari',
    formats: ['Tatap muka', 'Live online'],
  },
  {
    slug: 'marpol-annex-vi',
    title: 'MARPOL Annex VI: Air Pollution and Energy Efficiency',
    acronym: 'International Convention for the Prevention of Pollution from Ships',
    aliases: ['MARPOL', 'emisi kapal', 'EEXI', 'CII'],
    categorySlug: 'environment',
    outcome: 'Memahami ketentuan emisi udara dan efisiensi energi kapal.',
    duration: '2 hari',
    formats: ['Live online'],
  },
  {
    slug: 'ship-intact-stability',
    title: 'Ship Intact Stability and Ship Damage Stability Calculation',
    aliases: ['stabilitas kapal'],
    categorySlug: 'ship-design',
    outcome: 'Menghitung stabilitas utuh dan stabilitas kerusakan kapal.',
    duration: '4 hari',
    formats: ['Tatap muka'],
  },
]

export type SampleSession = {
  id: string
  courseSlug: string
  courseTitle: string
  startDate: string
  endDate: string
  time: string
  format: string
  venue: string
  fee: number | null
  taxWording?: string
  status: SessionDisplayStatus
  postponementMessage?: string
}

export const sampleSessions: SampleSession[] = [
  {
    id: 'JDW-0118',
    courseSlug: 'ship-security-officer',
    courseTitle: 'Ship Security Officer (SSO)',
    startDate: '2027-01-18T08:00:00+07:00',
    endDate: '2027-01-20T16:00:00+07:00',
    time: '08.00–16.00 WIB',
    format: 'Tatap muka',
    venue: 'Jakarta Utara',
    fee: 6500000,
    taxWording: 'Belum termasuk PPN',
    status: 'open',
  },
  {
    id: 'JDW-0222',
    courseSlug: 'imo-model-course-3-24',
    courseTitle:
      'IMO Model Course 3.24 Security Awareness Training for Port Facility Personnel with Designated Security Duties',
    startDate: '2027-02-22T08:00:00+07:00',
    endDate: '2027-02-22T16:00:00+07:00',
    time: '08.00–16.00 WIB',
    format: 'Tatap muka',
    venue: 'Surabaya',
    fee: 2750000,
    taxWording: 'Belum termasuk PPN',
    status: 'full-waitlist',
  },
  {
    id: 'JDW-0308',
    courseSlug: 'internal-auditor-ism-code',
    courseTitle: 'Internal Auditor ISM Code',
    startDate: '2027-03-08T08:00:00+07:00',
    endDate: '2027-03-10T16:00:00+07:00',
    time: '08.00–16.00 WIB',
    format: 'Tatap muka',
    venue: 'Jakarta Utara',
    fee: 9500000,
    taxWording: 'Belum termasuk PPN',
    status: 'open',
  },
  {
    id: 'JDW-0315',
    courseSlug: 'internal-auditor-ism-code',
    courseTitle: 'Internal Auditor ISM Code',
    startDate: '2027-03-15T09:00:00+07:00',
    endDate: '2027-03-17T15:00:00+07:00',
    time: '09.00–15.00 WIB',
    format: 'Live online',
    venue: 'Zoom',
    fee: null,
    status: 'not-open',
  },
  {
    id: 'JDW-0329',
    courseSlug: 'marine-surveyor',
    courseTitle: 'Marine Surveyor',
    startDate: '2027-03-29T08:00:00+07:00',
    endDate: '2027-04-02T16:00:00+07:00',
    time: '08.00–16.00 WIB',
    format: 'Tatap muka',
    venue: 'Jakarta Utara',
    fee: 10250000,
    taxWording: 'Belum termasuk PPN',
    status: 'postponed',
    postponementMessage: 'Tanggal baru akan diumumkan. Peserta terdaftar dihubungi admin.',
  },
  {
    id: 'JDW-0405',
    courseSlug: 'ballast-water-management',
    courseTitle: 'Ballast Water Management',
    startDate: '2027-04-05T08:00:00+07:00',
    endDate: '2027-04-06T16:00:00+07:00',
    time: '08.00–16.00 WIB',
    format: 'Tatap muka',
    venue: 'Batam',
    fee: 7500000,
    taxWording: 'Belum termasuk PPN',
    status: 'open',
  },
  {
    id: 'JDW-0412',
    courseSlug: 'maritime-labour-convention',
    courseTitle: 'Maritime Labour Convention',
    startDate: '2027-04-12T09:00:00+07:00',
    endDate: '2027-04-13T15:00:00+07:00',
    time: '09.00–15.00 WIB',
    format: 'Live online',
    venue: 'Zoom',
    fee: 3500000,
    taxWording: 'Belum termasuk PPN',
    status: 'not-open',
  },
]

/**
 * Homepage list (PRD §6): 3–6 future sessions, soonest first.
 * Cancelled and completed sessions never appear here.
 */
export function upcomingSessions(limit = 5, now = new Date()) {
  return sampleSessions
    .filter((s) => s.status !== 'cancelled' && s.status !== 'completed')
    .filter((s) => new Date(s.startDate) >= now)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .slice(0, limit)
}
