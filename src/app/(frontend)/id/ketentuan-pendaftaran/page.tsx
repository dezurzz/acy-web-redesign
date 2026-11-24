import type { Metadata } from 'next'

import { LegalPage, Pending, type LegalSection } from '@/components/site/LegalPage'
import { TextLink } from '@/components/ui/text-link'
import { loadSiteSettings } from '@/lib/cms'
import type { SiteSettings } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'Ketentuan Pendaftaran',
  description:
    'Cara pendaftaran, konfirmasi kursi, pembayaran, dan pembatalan pelatihan BKI Academy.',
}

// DRAFT built from decisions D-01, D-03, D-04 and D-06. Needs business-owner approval (AC-09).
const sections = (siteSettings: SiteSettings): LegalSection[] => [
  {
    id: 'permintaan',
    title: 'Pendaftaran adalah permintaan',
    body: (
      <p>
        Mengajukan pendaftaran lewat situs ini berarti mengirim permintaan kepada admin BKI Academy.
        Permintaan belum menjamin kursi. Kursi Anda tercatat setelah admin mengonfirmasinya.
      </p>
    ),
  },
  {
    id: 'konfirmasi',
    title: 'Konfirmasi kursi',
    body: (
      <>
        <p>
          Pendaftaran dilanjutkan lewat WhatsApp. Admin membalas pada jam layanan (
          {siteSettings.serviceHours}) dan mengonfirmasi ketersediaan kursi.
        </p>
        <p>
          Jika jadwal penuh dan tersedia daftar tunggu, admin menghubungi Anda bila ada kursi
          kosong.
        </p>
      </>
    ),
  },
  {
    id: 'biaya',
    title: 'Biaya dan pembayaran',
    body: (
      <ul>
        <li>Tidak ada pembayaran online di situs ini.</li>
        <li>
          Biaya dan keterangan pajak tercantum di setiap jadwal. Jika tertulis “Hubungi kami untuk
          biaya”, admin menyampaikan biayanya.
        </li>
        <li>Admin mengirim informasi pembayaran setelah kursi dikonfirmasi.</li>
        <li>
          <Pending>Batas waktu pembayaran menunggu keputusan pemilik bisnis (D-03).</Pending>
        </li>
      </ul>
    ),
  },
  {
    id: 'pembatalan',
    title: 'Pembatalan dan penjadwalan ulang oleh peserta',
    body: (
      <>
        <p>
          Pembatalan dan penjadwalan ulang dikonfirmasi oleh admin. Hubungi admin secepatnya dan
          sebutkan kode jadwal Anda.
        </p>
        <p>
          <Pending>
            Batas waktu pembatalan dan ketentuan pengembalian biaya menunggu keputusan D-03.
          </Pending>
        </p>
      </>
    ),
  },
  {
    id: 'perubahan',
    title: 'Perubahan jadwal oleh BKI Academy',
    body: (
      <p>
        Jika sebuah jadwal ditunda atau dibatalkan, BKI Academy mengumumkannya di halaman jadwal dan
        admin menghubungi peserta yang sudah terkonfirmasi untuk menawarkan jadwal pengganti.
      </p>
    ),
  },
  {
    id: 'sertifikat',
    title: 'Sertifikat',
    body: (
      <p>
        Peserta yang mengikuti seluruh sesi menerima sertifikat pelatihan dari BKI Academy.
        Sertifikat dikelola di sistem sertifikat BKI dan dapat diakses lewat{' '}
        <TextLink href="/id/portal-peserta">Portal Peserta</TextLink>.
      </p>
    ),
  },
  {
    id: 'kontak',
    title: 'Pertanyaan',
    body: (
      <p>
        Hubungi admin lewat WhatsApp <span className="numeric">{siteSettings.whatsappDisplay}</span>{' '}
        atau email {siteSettings.email}. Lihat juga{' '}
        <TextLink href="/id/hubungi-kami">Hubungi Kami</TextLink>.
      </p>
    ),
  },
]

export default async function RegistrationTermsPage() {
  const siteSettings = await loadSiteSettings()
  return (
    <LegalPage
      draft="Teks ini disusun dari keputusan proyek dan belum disetujui pemilik bisnis. Bagian bertanda kuning menunggu keputusan."
      intro="Cara pendaftaran pelatihan BKI Academy berjalan, dari permintaan sampai konfirmasi kursi."
      sections={sections(siteSettings)}
      title="Ketentuan Pendaftaran"
      updated="24 November 2026"
    />
  )
}
