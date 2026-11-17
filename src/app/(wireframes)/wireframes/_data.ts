// Phase 1 wireframe data (TIMELINE.md v1.2, Phase 1).
// Course names come from the Phase 0 Course Audit tab so text lengths are realistic.
// Dates, locations, fees and contacts are SAMPLE values, not approved content.

export type WfStatus = 'open' | 'not-open' | 'full' | 'closed' | 'postponed' | 'cancelled'

export const statusLabel: Record<WfStatus, string> = {
  open: 'Dibuka',
  'not-open': 'Belum dibuka',
  full: 'Penuh',
  closed: 'Ditutup',
  postponed: 'Ditunda',
  cancelled: 'Dibatalkan',
}

export type WfCourse = {
  slug: string
  title: string
  acronym?: string
  category: string
  outcome: string
  duration: string
  formats: string[]
  nextSession?: string
}

export const courses: WfCourse[] = [
  {
    slug: 'internal-auditor-ism-code',
    title: 'Internal Auditor ISM Code',
    acronym: 'ISM: International Safety Management',
    category: 'Safety',
    outcome: 'Merencanakan dan melaksanakan audit internal sistem manajemen keselamatan kapal.',
    duration: '3 hari',
    formats: ['Tatap muka', 'Live online'],
    nextSession: '8 – 10 Mar 2027',
  },
  {
    slug: 'imo-model-course-3-24',
    title:
      'IMO Model Course 3.24 Security Awareness Training for Port Facility Personnel with Designated Security Duties',
    acronym: 'IMO: International Maritime Organization',
    category: 'Security',
    outcome: 'Memahami tugas keamanan fasilitas pelabuhan sesuai ISPS Code.',
    duration: '1 hari',
    formats: ['Tatap muka'],
    nextSession: '22 Feb 2027',
  },
  {
    slug: 'marine-surveyor',
    title: 'Marine Surveyor',
    category: 'Survey',
    outcome: 'Melakukan survei kondisi kapal dan menyusun laporan survei.',
    duration: '5 hari',
    formats: ['Tatap muka'],
    nextSession: '15 – 19 Mar 2027',
  },
  {
    slug: 'maritime-labour-convention',
    title: 'Maritime Labour Convention',
    acronym: 'MLC',
    category: 'Crewing',
    outcome: 'Menerapkan ketentuan MLC 2006 untuk hak dan kesejahteraan awak kapal.',
    duration: '2 hari',
    formats: ['Live online'],
  },
  {
    slug: 'ballast-water-management',
    title: 'Ballast Water Management',
    category: 'Environment',
    outcome: 'Menyusun dan menjalankan rencana pengelolaan air balas.',
    duration: '2 hari',
    formats: ['Tatap muka', 'Live online'],
    nextSession: '5 – 6 Apr 2027',
  },
  {
    slug: 'ship-intact-stability',
    title: 'Ship Intact Stability and Ship Damage Stability Calculation',
    category: 'Ship Design',
    outcome: 'Menghitung stabilitas utuh dan stabilitas kerusakan kapal.',
    duration: '4 hari',
    formats: ['Tatap muka'],
  },
]

export type WfSession = {
  id: string
  course: string
  slug: string
  dateBlock: { day: string; month: string }
  dates: string
  time: string
  deadline: string
  location: string
  format: string
  fee?: string
  status: WfStatus
  note?: string
}

export const sessions: WfSession[] = [
  {
    id: 'JDW-0211',
    course:
      'IMO Model Course 3.24 Security Awareness Training for Port Facility Personnel with Designated Security Duties',
    slug: 'imo-model-course-3-24',
    dateBlock: { day: '22', month: 'Feb' },
    dates: 'Senin, 22 Februari 2027',
    time: '08.00 – 16.00 WIB',
    deadline: 'Daftar paling lambat 15 Feb 2027',
    location: 'Surabaya',
    format: 'Tatap muka',
    fee: 'Rp 2.750.000',
    status: 'full',
  },
  {
    id: 'JDW-0312',
    course: 'Internal Auditor ISM Code',
    slug: 'internal-auditor-ism-code',
    dateBlock: { day: '8', month: 'Mar' },
    dates: 'Senin, 8 Maret – Rabu, 10 Maret 2027',
    time: '08.00 – 16.00 WIB',
    deadline: 'Daftar paling lambat 1 Mar 2027',
    location: 'Jakarta Utara',
    format: 'Tatap muka',
    fee: 'Rp 9.500.000',
    status: 'open',
  },
  {
    id: 'JDW-0313',
    course: 'Internal Auditor ISM Code',
    slug: 'internal-auditor-ism-code',
    dateBlock: { day: '15', month: 'Mar' },
    dates: 'Senin, 15 Maret – Rabu, 17 Maret 2027',
    time: '09.00 – 15.00 WIB',
    deadline: 'Daftar paling lambat 8 Mar 2027',
    location: 'Zoom',
    format: 'Live online',
    status: 'not-open',
  },
  {
    id: 'JDW-0315',
    course: 'Marine Surveyor',
    slug: 'marine-surveyor',
    dateBlock: { day: '15', month: 'Mar' },
    dates: 'Senin, 15 Maret – Jumat, 19 Maret 2027',
    time: '08.00 – 16.00 WIB',
    deadline: 'Daftar paling lambat 8 Mar 2027',
    location: 'Jakarta Utara',
    format: 'Tatap muka',
    fee: 'Rp 10.250.000',
    status: 'postponed',
    note: 'Ditunda. Tanggal baru akan diumumkan; peserta terdaftar dihubungi admin.',
  },
  {
    id: 'JDW-0405',
    course: 'Ballast Water Management',
    slug: 'ballast-water-management',
    dateBlock: { day: '5', month: 'Apr' },
    dates: 'Senin, 5 April – Selasa, 6 April 2027',
    time: '08.00 – 16.00 WIB',
    deadline: 'Daftar paling lambat 29 Mar 2027',
    location: 'Batam',
    format: 'Tatap muka',
    fee: 'Rp 7.500.000',
    status: 'open',
  },
]

export const categories = [
  { name: 'Safety', text: 'Sistem manajemen keselamatan, audit ISM, investigasi kecelakaan.' },
  { name: 'Security', text: 'ISPS Code, keamanan kapal dan fasilitas pelabuhan.' },
  { name: 'Survey', text: 'Survei kapal, pengawasan bangunan baru, inspeksi las.' },
  { name: 'Crewing', text: 'Maritime Labour Convention dan pengelolaan awak kapal.' },
  { name: 'Environment', text: 'Pengelolaan air balas dan perlindungan lingkungan laut.' },
  { name: 'Ship Design', text: 'Stabilitas kapal dan tinjauan rekayasa desain.' },
]

// Dummy contacts until decision D-05 is made.
export const dummyContact = {
  phone: '(021) 0000-0000',
  whatsapp: '+62 800-0000-0000',
  email: 'academy@contoh.id',
  address: 'Alamat kantor (menunggu konfirmasi)',
  hours: 'Senin – Jumat, 08.00 – 16.00 WIB',
}

// ---------- Sitemap (PRD §5, updated with Phase 0 decisions) ----------

export type LaunchState = 'launch' | 'hidden' | 'pending' | 'optional' | 'none'

export type SitemapNode = {
  label: string
  route: string
  place: string
  state: LaunchState
  ref?: string
  wireframe?: string
  children?: SitemapNode[]
}

export const sitemap: SitemapNode[] = [
  {
    label: 'Beranda',
    route: '/id',
    place: 'Logo',
    state: 'launch',
    wireframe: '/wireframes/beranda',
    children: [
      {
        label: 'Pelatihan (katalog)',
        route: '/id/pelatihan',
        place: 'Navigasi utama',
        state: 'launch',
        ref: 'B-04',
        wireframe: '/wireframes/pelatihan',
        children: [
          {
            label: 'Detail pelatihan',
            route: '/id/pelatihan/[slug]',
            place: 'Dari katalog, jadwal, beranda',
            state: 'launch',
            ref: 'D-02, D-04',
            wireframe: '/wireframes/detail-pelatihan',
          },
        ],
      },
      {
        label: 'Jadwal',
        route: '/id/jadwal',
        place: 'Navigasi utama',
        state: 'launch',
        wireframe: '/wireframes/jadwal',
        children: [
          {
            label: 'Arsip jadwal',
            route: '/id/jadwal/arsip',
            place: 'Tautan di bawah jadwal',
            state: 'optional',
            ref: 'Scope cut #1',
          },
        ],
      },
      {
        label: 'Ajukan Pendaftaran (via WhatsApp)',
        route: '/id/pendaftaran?session=[id]',
        place: 'Dari baris jadwal dan panel sesi',
        state: 'launch',
        ref: 'D-01, D-06',
        wireframe: '/wireframes/pendaftaran',
      },
      {
        label: 'In-house Training',
        route: '/id/in-house',
        place: 'Navigasi utama',
        state: 'launch',
        wireframe: '/wireframes/in-house',
        children: [
          {
            label: 'MICE',
            route: '/id/mice',
            place: 'Footer dan halaman In-house saja',
            state: 'launch',
            ref: 'D-09',
          },
        ],
      },
      {
        label: 'Tentang Kami',
        route: '/id/tentang-kami',
        place: 'Navigasi utama',
        state: 'launch',
        children: [
          {
            label: 'Pengajar',
            route: '/id/pengajar',
            place: 'Di dalam Tentang Kami',
            state: 'hidden',
            ref: 'D-11',
          },
        ],
      },
      {
        label: 'Insight',
        route: '/id/insight, /id/insight/[slug]',
        place: 'Navigasi utama setelah tayang',
        state: 'hidden',
        ref: 'D-11',
      },
      {
        label: 'Hubungi Kami',
        route: '/id/hubungi-kami',
        place: 'Aksi di header, footer',
        state: 'launch',
        ref: 'D-05',
      },
      {
        label: 'Kebijakan Privasi',
        route: '/id/kebijakan-privasi',
        place: 'Footer',
        state: 'launch',
        ref: 'D-10',
      },
      {
        label: 'Ketentuan Pendaftaran',
        route: '/id/ketentuan-pendaftaran',
        place: 'Footer, halaman pendaftaran',
        state: 'launch',
        ref: 'D-03',
      },
      {
        label: 'Portal Peserta',
        route: '/id/portal-peserta',
        place: 'Header sekunder, footer',
        state: 'launch',
        ref: 'D-07',
        wireframe: '/wireframes/portal-peserta',
      },
      {
        label: 'Versi bahasa Inggris',
        route: '/en/* dialihkan ke halaman /id yang setara',
        place: 'Tidak ada pemilih bahasa',
        state: 'none',
        ref: 'D-08',
      },
    ],
  },
]

export const launchStateLabel: Record<LaunchState, string> = {
  launch: 'Tayang saat launch',
  hidden: 'Disembunyikan saat launch (fast-follow)',
  pending: 'Menunggu keputusan',
  optional: 'Opsional, dipotong pertama bila waktu kurang',
  none: 'Tidak ada saat launch',
}

export const templates = [
  { slug: 'beranda', name: 'Beranda', route: '/id' },
  { slug: 'pelatihan', name: 'Katalog pelatihan', route: '/id/pelatihan' },
  { slug: 'jadwal', name: 'Jadwal', route: '/id/jadwal' },
  { slug: 'detail-pelatihan', name: 'Detail pelatihan', route: '/id/pelatihan/[slug]' },
  { slug: 'pendaftaran', name: 'Ajukan pendaftaran (WhatsApp)', route: '/id/pendaftaran' },
  { slug: 'in-house', name: 'In-house training + formulir', route: '/id/in-house' },
] as const

export const decisionsApplied = [
  [
    'D-01',
    'Hanya permintaan pendaftaran; admin mengonfirmasi kursi; tanpa pembayaran online.',
    'Diisi',
  ],
  [
    'D-02',
    'Biaya terkonfirmasi + keterangan pajak; jika belum, “Hubungi kami untuk biaya”.',
    'Diisi',
  ],
  ['D-03', 'Pembatalan dikonfirmasi admin; aturan lengkap di Ketentuan Pendaftaran.', 'Diisi'],
  [
    'D-04',
    'Pelacakan sertifikat di sistem lain; halaman kursus hanya menjelaskan sertifikat singkat.',
    'Diisi',
  ],
  ['D-05', 'Kontak dummy di wireframe.', 'Diisi'],
  ['D-06', 'Pendaftaran lewat WhatsApp; alur formulir bisa ditambahkan nanti.', 'Diisi'],
  [
    'D-07',
    'Satu halaman Portal Peserta di situs baru yang mengarahkan ke sistem yang sudah ada (portal akun, sertifikat, bantuan admin).',
    'Diisi',
  ],
  ['D-08', 'Bahasa Indonesia saja; tanpa pemilih bahasa.', 'Diisi'],
  ['D-09', 'MICE aktif tapi sekunder: footer dan halaman In-house, bukan navigasi utama.', 'Diisi'],
  [
    'D-11',
    'Pengajar dan Insight disembunyikan saat launch; tayang sebagai fast-follow.',
    'Default (disetujui)',
  ],
  [
    'B-04',
    'Enam kategori: Safety, Security, Survey, Crewing, Environment, Ship Design.',
    'Default',
  ],
] as const
