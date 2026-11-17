import type { Metadata } from 'next'
import Link from 'next/link'

import { categories, courses } from '../_data'
import { Btn, Note, WfPage } from '../_kit'

export const metadata: Metadata = { title: 'Katalog pelatihan' }

function Filters() {
  return (
    <div className="space-y-4">
      <label className="block">
        <span className="text-ui font-semibold">Cari pelatihan</span>
        <span className="mt-1 flex min-h-12 items-center rounded-control border border-line-control px-3 text-slate-600">
          Contoh: ISM, auditor, stabilitas
        </span>
      </label>
      {[
        ['Topik', categories.map((c) => c.name)],
        ['Format', ['Tatap muka', 'Live online', 'Belajar mandiri']],
        ['Lokasi', ['Jakarta', 'Surabaya', 'Batam', 'Online']],
      ].map(([legend, options]) => (
        <fieldset className="rounded-sm border border-line-subtle p-3" key={legend as string}>
          <legend className="px-1 text-ui font-semibold">{legend}</legend>
          <ul className="space-y-1">
            {(options as string[]).map((o) => (
              <li className="flex min-h-11 items-center gap-3 text-ui" key={o}>
                <span aria-hidden className="h-6 w-6 rounded-sm border border-line-control" /> {o}
              </li>
            ))}
          </ul>
        </fieldset>
      ))}
    </div>
  )
}

// PRD §6 Catalogue: stable courses, not dated batches.
export default function KatalogWireframe() {
  return (
    <WfPage title="Katalog pelatihan">
      <div className="container-page py-10">
        <p className="text-meta text-slate-600">Beranda / Pelatihan</p>
        <h1 className="mt-2 text-h1 text-navy-950">Pelatihan</h1>
        <p className="mt-3 max-w-2xl text-intro text-navy-800">
          Semua pelatihan BKI Academy. Pilih pelatihan untuk melihat detail dan jadwal yang
          tersedia.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-4">
          {/* Wide: sidebar filters */}
          <aside aria-label="Filter" className="hidden lg:block">
            <Filters />
          </aside>

          <div className="lg:col-span-3">
            {/* Compact: filter drawer trigger */}
            <details className="mb-4 lg:hidden">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-center rounded-control border border-navy-800 text-ui font-semibold">
                Filter (2 aktif)
              </summary>
              <div className="mt-4 rounded-sm border border-line-subtle p-4">
                <Filters />
                <div className="mt-4 flex gap-3">
                  <Btn className="flex-1">Terapkan Filter</Btn>
                  <Btn variant="link">Hapus semua</Btn>
                </div>
              </div>
            </details>

            <div className="flex flex-wrap items-center gap-2 border-b border-line-subtle pb-4">
              <p aria-live="polite" className="mr-2 text-ui font-semibold">
                6 pelatihan
              </p>
              {['Topik: Safety', 'Format: Live online'].map((f) => (
                <span
                  className="inline-flex min-h-9 items-center rounded-sm border border-line-control px-2 text-meta"
                  key={f}
                >
                  {f} ✕
                </span>
              ))}
              <Btn className="ml-auto" variant="link">
                Hapus semua
              </Btn>
            </div>

            <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((c) => (
                <li className="flex flex-col rounded-sm border border-line-subtle p-5" key={c.slug}>
                  <p className="eyebrow text-slate-600">{c.category}</p>
                  <h2 className="mt-2 text-ui font-semibold text-navy-950">
                    <Link
                      className="underline-offset-4 hover:underline"
                      href="/wireframes/detail-pelatihan"
                    >
                      {c.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-meta text-navy-800">{c.outcome}</p>
                  <p className="mt-3 text-meta text-slate-600">
                    {c.duration} · {c.formats.join(', ')}
                  </p>
                  <p className="mt-1 text-meta font-semibold text-navy-800">
                    {c.nextSession ? `Jadwal berikutnya: ${c.nextSession}` : 'Belum ada jadwal'}
                  </p>
                  <div className="mt-auto pt-4">
                    <Btn href="/wireframes/detail-pelatihan" variant="secondary">
                      Lihat Detail
                    </Btn>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 text-center">
              <Btn variant="secondary">Tampilkan lebih banyak</Btn>
            </div>

            <Note refs="PRD §6">
              Pencarian mencocokkan judul, singkatan yang diperluas (ISM, ISPS, MLC) dan alias.
              Filter antar grup = DAN, dalam satu grup = ATAU. Filter tersimpan di URL
              (?topik=Safety&format=live-online) dan tetap ada saat kembali dari detail.
            </Note>

            <section
              aria-labelledby="kosong"
              className="mt-10 rounded-sm border border-line-control p-6"
            >
              <p className="eyebrow text-slate-600">State: tidak ada hasil</p>
              <h2 className="mt-2 text-h3 text-navy-950" id="kosong">
                Tidak ada pelatihan yang cocok
              </h2>
              <p className="mt-2 text-body text-navy-800">
                Coba kata kunci lain atau hapus beberapa filter. Masih belum ketemu? Tanyakan kepada
                kami.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Btn variant="secondary">Hapus semua filter</Btn>
                <Btn variant="link">Tanyakan lewat WhatsApp</Btn>
              </div>
            </section>
          </div>
        </div>
      </div>
    </WfPage>
  )
}
