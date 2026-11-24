import type { Metadata } from 'next'

import { LegalPage, Pending, type LegalSection } from '@/components/site/LegalPage'
import { siteSettings } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi',
  description:
    'Data apa yang dikumpulkan situs BKI Academy, untuk apa, dan bagaimana menghubungi kami.',
}

// DRAFT based on what the site actually does (PRD §4, §8.6, D-06, D-10). Needs review by the
// data/privacy owner and BKI's legal function before launch. This is not legal advice.
const sections: LegalSection[] = [
  {
    id: 'pengelola',
    title: 'Pengelola situs',
    body: (
      <p>
        Situs ini dikelola oleh BKI Academy, divisi pelatihan PT Biro Klasifikasi Indonesia
        (Persero).
      </p>
    ),
  },
  {
    id: 'data',
    title: 'Data yang kami kumpulkan',
    body: (
      <>
        <p>Kami hanya mengumpulkan data yang Anda kirim sendiri:</p>
        <ul>
          <li>
            <strong>Formulir kebutuhan pelatihan perusahaan:</strong> nama kontak, email kantor,
            perusahaan, nomor telepon, topik, perkiraan jumlah peserta, waktu dan format yang
            diinginkan, serta kebutuhan lain yang Anda tulis.
          </li>
          <li>
            <strong>Pendaftaran pelatihan:</strong> situs ini tidak menyimpan data pendaftaran. Anda
            mengirim data langsung kepada admin lewat WhatsApp.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'penggunaan',
    title: 'Untuk apa data digunakan',
    body: (
      <ul>
        <li>
          Menindaklanjuti permintaan Anda: menghubungi Anda, menyusun penawaran, dan mengatur
          jadwal.
        </li>
        <li>Tidak dijual dan tidak dipakai untuk iklan pihak lain.</li>
      </ul>
    ),
  },
  {
    id: 'statistik',
    title: 'Statistik kunjungan',
    body: (
      <p>
        Kami mencatat statistik kunjungan, misalnya halaman yang dibuka dan tombol pendaftaran yang
        diklik, tanpa data pribadi. Kata kunci pencarian di situs tidak disimpan.
      </p>
    ),
  },
  {
    id: 'penyimpanan',
    title: 'Berapa lama data disimpan',
    body: (
      <p>
        <Pending>Masa simpan data formulir menunggu keputusan pemilik data (D-10).</Pending>
      </p>
    ),
  },
  {
    id: 'akses',
    title: 'Siapa yang dapat melihat data',
    body: (
      <p>
        Hanya staf BKI Academy yang menangani permintaan pelatihan, dengan akses sesuai tugasnya.
      </p>
    ),
  },
  {
    id: 'hak',
    title: 'Hak Anda',
    body: (
      <p>
        Anda dapat meminta salinan, perbaikan, atau penghapusan data yang Anda kirim lewat formulir.
        Hubungi kami melalui kontak di bawah.
      </p>
    ),
  },
  {
    id: 'kontak',
    title: 'Kontak',
    body: (
      <p>
        Email {siteSettings.email} atau telepon{' '}
        <span className="numeric">{siteSettings.phone}</span> ({siteSettings.serviceHours}).
      </p>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <LegalPage
      draft="Teks ini menjelaskan cara kerja situs dan belum ditinjau pemilik data serta bagian hukum BKI. Bagian bertanda kuning menunggu keputusan."
      intro="Data apa yang dikumpulkan situs ini, untuk apa, dan bagaimana menghubungi kami tentang data Anda."
      sections={sections}
      title="Kebijakan Privasi"
      updated="24 November 2026"
    />
  )
}
