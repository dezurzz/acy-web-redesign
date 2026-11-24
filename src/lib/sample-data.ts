/*
 * SAMPLE DATA for the Phase 2 coded prototype (TIMELINE.md Phase 2).
 * Course names come from the Phase 0 Course Audit so text lengths are realistic.
 * Dates, venues, fees and statuses are invented and NOT approved content.
 * Build Sprint 1 replaces every import of this file with Payload queries.
 */
import type { CourseDetail, SiteCategory, SiteCourse, SiteData, SiteSession } from '@/lib/site-data'

// The six default categories (decision B-04).
export const sampleCategories: SiteCategory[] = [
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

const courseBase: Omit<SiteCourse, 'detail'>[] = [
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

const sessionBase: Omit<SiteSession, 'deadline'>[] = [
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

// Shared answers that follow the Phase 0 decisions (D-01, D-03, D-06).
const commonFaqs = [
  {
    question: 'Apakah ada pembayaran online?',
    answer:
      'Tidak. Anda mengajukan pendaftaran lewat WhatsApp, lalu admin mengonfirmasi kursi dan menjelaskan cara pembayaran.',
  },
  {
    question: 'Bagaimana jika saya batal ikut?',
    answer:
      'Hubungi admin secepatnya. Pembatalan dan penjadwalan ulang dikonfirmasi oleh admin sesuai Ketentuan Pendaftaran.',
  },
  {
    question: 'Apakah pelatihan ini bisa diadakan khusus untuk perusahaan?',
    answer: 'Bisa. Ajukan kebutuhan Anda lewat halaman In-house Training.',
  },
]

const details: Record<string, CourseDetail> = {
  'internal-auditor-ism-code': {
    audience: [
      'Staf DPA dan tim keselamatan di perusahaan pelayaran',
      'Perwira kapal yang akan menjadi auditor internal',
      'Staf mutu yang menangani sistem manajemen keselamatan',
    ],
    outcomes: [
      'Memahami persyaratan ISM Code dan kaitannya dengan SMS perusahaan',
      'Merencanakan program audit internal di kantor dan di kapal',
      'Melaksanakan audit, mengumpulkan bukti, dan menulis temuan',
      'Menindaklanjuti ketidaksesuaian sampai tuntas',
    ],
    syllabus: [
      {
        title: 'Hari 1: Dasar ISM Code',
        items: [
          'Latar belakang dan struktur ISM Code',
          'Elemen Safety Management System',
          'Peran DPA',
        ],
      },
      {
        title: 'Hari 2: Teknik audit',
        items: [
          'Perencanaan dan daftar periksa audit',
          'Wawancara dan pengumpulan bukti',
          'Klasifikasi temuan',
        ],
      },
      {
        title: 'Hari 3: Pelaporan dan tindak lanjut',
        items: ['Menulis laporan audit', 'Tindakan korektif', 'Studi kasus dan simulasi audit'],
      },
    ],
    prerequisites:
      'Pengalaman kerja di kapal atau di bagian keselamatan perusahaan pelayaran disarankan.',
    method:
      'Ceramah, diskusi studi kasus, dan simulasi audit berkelompok. Kelas live online memakai Zoom dengan latihan di ruang diskusi.',
    certificate:
      'Peserta yang mengikuti seluruh sesi menerima sertifikat pelatihan dari BKI Academy.',
    faqs: commonFaqs,
    related: ['accident-investigation', 'ship-security-officer'],
  },
  'ship-security-officer': {
    audience: [
      'Perwira kapal yang ditunjuk sebagai Ship Security Officer',
      'Calon SSO dan staf Company Security Officer',
    ],
    outcomes: [
      'Memahami ketentuan ISPS Code dan SOLAS Bab XI-2',
      'Menyusun dan menjaga Ship Security Plan',
      'Melaksanakan penilaian keamanan dan latihan keamanan di kapal',
    ],
    syllabus: [
      {
        title: 'Hari 1: Kerangka regulasi',
        items: ['ISPS Code dan SOLAS XI-2', 'Tingkat keamanan', 'Peran SSO, CSO, dan PFSO'],
      },
      {
        title: 'Hari 2: Rencana keamanan kapal',
        items: ['Ship Security Assessment', 'Isi Ship Security Plan', 'Pengendalian akses'],
      },
      {
        title: 'Hari 3: Latihan dan audit',
        items: ['Drill dan exercise', 'Catatan dan pelaporan', 'Studi kasus'],
      },
    ],
    prerequisites: 'Tidak ada prasyarat khusus. Pengalaman di kapal membantu memahami studi kasus.',
    method: 'Ceramah, diskusi, dan latihan menyusun bagian Ship Security Plan.',
    certificate:
      'Peserta yang mengikuti seluruh sesi menerima sertifikat pelatihan dari BKI Academy.',
    faqs: commonFaqs,
    related: ['imo-model-course-3-24', 'internal-auditor-ism-code'],
  },
}

function fallbackDetail(slug: string, categorySlug: string): CourseDetail {
  return {
    audience: ['Profesional maritim yang menangani bidang ini di kapal atau di kantor'],
    outcomes: ['Rincian hasil belajar menunggu materi dari pemilik konten'],
    syllabus: [
      { title: 'Silabus', items: ['Silabus lengkap menunggu materi dari pemilik konten'] },
    ],
    prerequisites: 'Tidak ada prasyarat khusus.',
    method: 'Ceramah, diskusi, dan studi kasus.',
    certificate:
      'Peserta yang mengikuti seluruh sesi menerima sertifikat pelatihan dari BKI Academy.',
    faqs: commonFaqs,
    related: courseBase
      .filter((c) => c.categorySlug === categorySlug && c.slug !== slug)
      .map((c) => c.slug)
      .slice(0, 2),
  }
}

const DAY = 24 * 60 * 60 * 1000

export const sampleCourses: SiteCourse[] = courseBase.map((course) => ({
  ...course,
  detail: details[course.slug] ?? fallbackDetail(course.slug, course.categorySlug),
}))

// Sample rule: registration closes 7 days before the start. In the CMS staff set the real deadline.
export const sampleSessions: SiteSession[] = sessionBase.map((session) => ({
  ...session,
  deadline: new Date(new Date(session.startDate).getTime() - 7 * DAY).toISOString(),
}))

export const sampleSiteData: SiteData = {
  categories: sampleCategories,
  courses: sampleCourses,
  sessions: sampleSessions,
}
