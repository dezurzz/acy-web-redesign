/*
 * Course detail data for the Phase 2 prototype (PRD §6 Course detail).
 * SAMPLE content: two courses have written detail, the rest use a clearly generic fallback.
 * Build Sprint 1 replaces this with the Payload Course and Session collections.
 */
import { formatDateRange } from '@/lib/format'
import {
  sampleCategories,
  sampleCourses,
  sampleSessions,
  type SampleSession,
} from '@/lib/sample-data'

export type CourseDetail = {
  audience: string[]
  outcomes: string[]
  syllabus: { title: string; items: string[] }[]
  prerequisites: string
  method: string
  certificate: string
  faqs: { question: string; answer: string }[]
  related: string[]
}

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
    related: sampleCourses
      .filter((c) => c.categorySlug === categorySlug && c.slug !== slug)
      .map((c) => c.slug)
      .slice(0, 2),
  }
}

export type PanelSession = Pick<
  SampleSession,
  'id' | 'status' | 'time' | 'format' | 'venue' | 'fee' | 'taxWording' | 'postponementMessage'
> & { dates: string; deadline: string }

const DAY = 24 * 60 * 60 * 1000

export function getCourse(slug: string, now = new Date()) {
  const course = sampleCourses.find((c) => c.slug === slug)
  if (!course) return null

  const category = sampleCategories.find((c) => c.slug === course.categorySlug)!
  const sessions: PanelSession[] = sampleSessions
    .filter((s) => s.courseSlug === slug)
    .filter((s) => s.status !== 'cancelled' && s.status !== 'completed')
    .filter((s) => new Date(s.startDate) >= now)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .map((s) => ({
      id: s.id,
      status: s.status,
      time: s.time,
      format: s.format,
      venue: s.venue,
      fee: s.fee,
      taxWording: s.taxWording,
      postponementMessage: s.postponementMessage,
      dates: formatDateRange(s.startDate, s.endDate),
      // Sample rule: registration closes 7 days before the start. Payload stores the real deadline.
      deadline: formatDateRange(new Date(new Date(s.startDate).getTime() - 7 * DAY)),
    }))

  return {
    course,
    category,
    detail: details[slug] ?? fallbackDetail(slug, course.categorySlug),
    sessions,
  }
}

export const courseSlugs = () => sampleCourses.map((c) => c.slug)
