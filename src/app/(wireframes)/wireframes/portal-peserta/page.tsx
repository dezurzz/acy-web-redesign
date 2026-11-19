import type { Metadata } from 'next'

import { dummyContact } from '../_data'
import { Btn, Note, WfPage } from '../_kit'

export const metadata: Metadata = { title: 'Portal Peserta' }

const services = [
  {
    title: 'Akun dan materi pelatihan',
    text: 'Masuk untuk melihat pelatihan yang Anda ikuti dan mengunduh materi.',
    action: 'Masuk ke Portal',
    dest: 'Portal akun yang sudah ada (contoh: portal Odoo)',
  },
  {
    title: 'Sertifikat',
    text: 'Cek dan unduh sertifikat pelatihan Anda.',
    action: 'Cek Sertifikat',
    dest: 'Sistem sertifikat BKI (D-04)',
  },
  {
    title: 'Status pendaftaran',
    text: 'Tanyakan status permintaan pendaftaran atau ubah jadwal Anda.',
    action: 'Hubungi Admin via WhatsApp',
    dest: `WhatsApp admin ${dummyContact.whatsapp}`,
  },
]

// D-07: one page on the new site that routes participants to the systems that already exist.
// The website itself has no participant login.
export default function PortalPesertaWireframe() {
  return (
    <WfPage
      motion="Intensitas rendah (animations.md §3). Hover kartu, akordeon bantuan, reveal opsional untuk kartu layanan."
      title="Portal Peserta"
    >
      <div className="container-page max-w-4xl py-10">
        <p className="text-meta text-slate-600">Beranda / Portal Peserta</p>
        <h1 className="mt-2 text-h1 text-navy-950">Portal Peserta</h1>
        <p className="mt-3 max-w-2xl text-intro text-navy-800">
          Layanan untuk peserta yang sudah terdaftar. Pilih yang Anda butuhkan.
        </p>

        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {services.map((s) => (
            <li className="flex flex-col rounded-sm border border-line-subtle p-5" key={s.title}>
              <h2 className="text-h3 text-navy-950">{s.title}</h2>
              <p className="mt-2 text-body text-navy-800">{s.text}</p>
              <div className="mt-auto pt-5">
                <Btn className="w-full" variant="secondary">
                  {s.action}
                </Btn>
                <p className="mt-2 text-meta text-slate-600">Membuka: {s.dest}</p>
              </div>
            </li>
          ))}
        </ul>

        <Note refs="D-07, D-04">
          Situs ini tidak punya login peserta. Halaman ini hanya mengarahkan ke sistem yang sudah
          ada. Setiap tujuan tautan perlu dikonfirmasi dan diuji sebelum launch. Tautan ke situs
          lain diberi label agar peserta tahu mereka berpindah situs.
        </Note>

        <section aria-labelledby="bantuan" className="mt-10 border-t border-line-subtle pt-8">
          <h2 className="text-h3 text-navy-950" id="bantuan">
            Butuh bantuan?
          </h2>
          {[
            'Lupa kata sandi portal',
            'Nama di sertifikat salah',
            'Belum menerima konfirmasi pendaftaran',
          ].map((q) => (
            <details className="border-b border-line-subtle py-3" key={q}>
              <summary className="flex min-h-11 cursor-pointer items-center text-ui font-semibold">
                {q}
              </summary>
              <p className="text-body">Jawaban singkat dan siapa yang dihubungi.</p>
            </details>
          ))}
          <p className="mt-4 text-meta text-navy-800">
            Masih ada pertanyaan? Email {dummyContact.email} atau telepon {dummyContact.phone} (
            {dummyContact.hours}).
          </p>
        </section>
      </div>
    </WfPage>
  )
}
