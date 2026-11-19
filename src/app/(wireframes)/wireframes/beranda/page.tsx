import type { Metadata } from 'next'
import Link from 'next/link'

import { categories, sessions } from '../_data'
import { Btn, ImageBox, Note, SectionTitle, SessionRow, WfPage } from '../_kit'

export const metadata: Metadata = { title: 'Beranda' }

// PRD §6 Homepage sequence. Instructors and Insights are hidden at launch (D-11).
export default function BerandaWireframe() {
  const upcoming = sessions.filter((s) => s.status !== 'cancelled').slice(0, 4)

  return (
    <WfPage
      motion="Intensitas sedang dan selektif. Hero, judul, CTA dan baris jadwal pertama tidak dianimasikan. Reveal sekali saja (12 px, 360 ms) untuk grup Kategori, Mengapa BKI Academy dan In-house. Panah tombol bergeser 3 px; gambar membesar 1.02 saat hover."
      title="Beranda"
    >
      {/* Hero */}
      <section className="container-page grid gap-8 py-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow text-slate-600">BKI Academy</p>
          <h1 className="mt-2 text-h1 text-navy-950">
            Pelatihan maritim profesional dari Biro Klasifikasi Indonesia
          </h1>
          <p className="mt-4 max-w-xl text-intro text-navy-800">
            Satu kalimat pendukung: untuk siapa pelatihan ini dan apa manfaatnya.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn href="/wireframes/jadwal">Lihat Jadwal</Btn>
            <Btn href="/wireframes/in-house" variant="secondary">
              Pelatihan untuk Perusahaan
            </Btn>
          </div>
        </div>
        <ImageBox className="aspect-4/3" label="Satu foto pelatihan asli, bukan carousel" />
      </section>

      {/* Upcoming sessions */}
      <section aria-labelledby="h-jadwal" className="container-page py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle eyebrow="Jadwal terdekat" id="h-jadwal" title="Sesi yang akan datang" />
          <Btn href="/wireframes/jadwal" variant="link">
            Lihat semua jadwal
          </Btn>
        </div>
        <ul>
          {upcoming.map((s) => (
            <SessionRow key={s.id} s={s} />
          ))}
        </ul>
        <Note refs="PRD §6">
          Tampilkan 3–6 sesi terbit terdekat. Jika tidak ada, ganti daftar dengan: “Belum ada jadwal
          terbuka. Tanyakan jadwal berikutnya lewat WhatsApp.”
        </Note>
      </section>

      {/* Categories */}
      <section aria-labelledby="h-kategori" className="bg-paper py-12">
        <div className="container-page">
          <SectionTitle eyebrow="Kategori" id="h-kategori" title="Pilih bidang pelatihan" />
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <li className="rounded-sm border border-line-subtle bg-white p-5" key={c.name}>
                <h3 className="text-h3 text-navy-950">
                  <Link
                    className="underline-offset-4 hover:underline"
                    href={`/wireframes/pelatihan?topik=${c.name}`}
                  >
                    {c.name}
                  </Link>
                </h3>
                <p className="mt-2 text-body text-navy-800">{c.text}</p>
                <p className="mt-3 text-meta text-slate-600">
                  Contoh: 2–3 nama pelatihan representatif
                </p>
              </li>
            ))}
          </ul>
          <Note refs="B-04">
            Kategori mengikuti default enam kategori sampai pemilik konten mengonfirmasi.
          </Note>
        </div>
      </section>

      {/* Reasons */}
      <section aria-labelledby="h-alasan" className="container-page py-12">
        <SectionTitle
          eyebrow="Mengapa BKI Academy"
          id="h-alasan"
          title="Alasan memilih BKI Academy"
        />
        <ul className="grid gap-6 md:grid-cols-3">
          {['Bagian dari BKI', 'Pengajar praktisi', 'Materi sesuai regulasi'].map((t) => (
            <li className="border-t border-navy-800 pt-4" key={t}>
              <h3 className="text-ui font-semibold text-navy-950">{t}</h3>
              <p className="mt-2 text-body text-navy-800">
                Dua kalimat, hanya klaim yang sudah diverifikasi.
              </p>
            </li>
          ))}
        </ul>
        <Note refs="PRD §6">
          Tanpa jumlah peserta, testimoni, rating, atau lencana persetujuan yang belum
          terverifikasi.
        </Note>
      </section>

      {/* Corporate */}
      <section aria-labelledby="h-corporate" className="bg-paper py-12">
        <div className="container-page grid gap-8 lg:grid-cols-2 lg:items-center">
          <ImageBox className="aspect-video" label="Foto kegiatan in-house (izin foto)" />
          <div>
            <SectionTitle
              eyebrow="Untuk perusahaan"
              id="h-corporate"
              title="Pelatihan in-house untuk tim Anda"
            />
            <p className="text-body text-navy-800">
              Materi disesuaikan, di lokasi Anda atau secara online.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Btn href="/wireframes/in-house">Ajukan Kebutuhan Pelatihan</Btn>
              <Btn href="#" variant="link">
                Layanan MICE
              </Btn>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="rounded-sm border border-dashed border-line-control p-6 text-center text-meta text-slate-600">
          Pengajar dan Insight terpilih: disembunyikan saat launch, ditambahkan sebagai fast-follow
          (D-11).
        </div>
      </section>
    </WfPage>
  )
}
