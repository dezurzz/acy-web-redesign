import type { Metadata } from 'next'

import { sessions } from '../_data'
import { Btn, Note, SessionRow, WfPage } from '../_kit'

export const metadata: Metadata = { title: 'Jadwal' }

const filters = ['Bulan', 'Topik', 'Format', 'Lokasi']

// PRD §6 Schedule: dated sessions, soonest first (Asia/Jakarta), stacked rows on compact screens.
export default function JadwalWireframe() {
  const byMonth = [
    ['Februari 2027', sessions.filter((s) => s.dateBlock.month === 'Feb')],
    ['Maret 2027', sessions.filter((s) => s.dateBlock.month === 'Mar')],
    ['April 2027', sessions.filter((s) => s.dateBlock.month === 'Apr')],
  ] as const

  return (
    <WfPage
      motion="Intensitas minimal: hanya umpan balik pilihan dan perubahan status/memuat. Baris, tanggal, biaya dan status tidak pernah bergerak."
      title="Jadwal"
    >
      <div className="container-page py-10">
        <p className="text-meta text-slate-600">Beranda / Jadwal</p>
        <h1 className="mt-2 text-h1 text-navy-950">Jadwal pelatihan</h1>
        <p className="mt-3 max-w-2xl text-intro text-navy-800">
          Sesi yang akan datang, diurutkan dari yang paling dekat. Semua waktu dalam WIB.
        </p>

        <div className="mt-8 grid gap-3 rounded-sm border border-line-subtle p-4 md:grid-cols-2 lg:grid-cols-5">
          <label className="block lg:col-span-1">
            <span className="text-meta font-semibold">Cari</span>
            <span className="mt-1 flex min-h-12 items-center rounded-control border border-line-control px-3 text-slate-600">
              Nama pelatihan
            </span>
          </label>
          {filters.map((f) => (
            <label className="block" key={f}>
              <span className="text-meta font-semibold">{f}</span>
              <span className="mt-1 flex min-h-12 items-center justify-between rounded-control border border-line-control px-3">
                Semua <span aria-hidden>▾</span>
              </span>
            </label>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <p aria-live="polite" className="text-ui font-semibold">
            5 sesi
          </p>
          <Btn className="ml-auto" variant="link">
            Hapus semua
          </Btn>
        </div>

        {byMonth.map(([month, list]) => (
          <section aria-labelledby={`m-${month}`} className="mt-8" key={month}>
            <h2 className="border-b border-navy-800 pb-2 text-h3 text-navy-950" id={`m-${month}`}>
              {month}
            </h2>
            <ul>
              {list.map((s) => (
                <SessionRow key={s.id} s={s} />
              ))}
            </ul>
          </section>
        ))}

        <Note refs="PRD §6, design.md §8">
          Contoh mencakup status Dibuka, Belum dibuka, Penuh dan Ditunda. Sesi Ditunda menampilkan
          pesan dan tidak menyimpan tanggal lama diam-diam. Sesi Selesai hanya ada di arsip. Judul
          panjang dibiarkan membungkus, tidak dipotong.
        </Note>
        <Note refs="D-02">
          *Teks pajak (“belum termasuk PPN”) adalah contoh. Gunakan kalimat yang disetujui pemilik
          bisnis.
        </Note>

        <div className="mt-8 flex flex-wrap gap-3">
          <Btn variant="secondary">Tampilkan lebih banyak</Btn>
          <Btn variant="link">Lihat arsip jadwal</Btn>
        </div>
      </div>
    </WfPage>
  )
}
