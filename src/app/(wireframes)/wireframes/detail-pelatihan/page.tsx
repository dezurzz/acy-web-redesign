import type { Metadata } from 'next'
import type React from 'react'

import { courses, sessions } from '../_data'
import { Btn, FeeLabel, Note, StatusChip, WfPage } from '../_kit'

export const metadata: Metadata = { title: 'Detail pelatihan' }

const course = courses[0]
const courseSessions = sessions.filter((s) => s.slug === course.slug)

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line-subtle py-8">
      <h2 className="text-h3 text-navy-950">{title}</h2>
      <div className="mt-3 text-body text-navy-800">{children}</div>
    </section>
  )
}

function Lines({ n }: { n: number }) {
  return (
    <ul className="list-disc space-y-1 pl-5">
      {Array.from({ length: n }, (_, i) => (
        <li key={i}>Poin konten {i + 1}</li>
      ))}
    </ul>
  )
}

// PRD §6 Course detail; session panel and mobile CTA bar per design.md §8.
export default function DetailWireframe() {
  return (
    <WfPage title="Detail pelatihan">
      <div className="container-page pt-8 pb-28 lg:pb-8">
        <p className="text-meta text-slate-600">Beranda / Pelatihan / Safety / {course.title}</p>

        {/* Above the fold */}
        <header className="mt-6 max-w-3xl">
          <p className="eyebrow text-slate-600">{course.category}</p>
          <h1 className="mt-2 text-h1 text-navy-950">{course.title}</h1>
          <p className="mt-2 text-meta text-slate-600">{course.acronym}</p>
          <p className="mt-4 text-intro text-navy-800">{course.outcome}</p>
          <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-ui">
            <div>
              <dt className="text-meta text-slate-600">Durasi</dt>
              <dd className="font-semibold">{course.duration}</dd>
            </div>
            <div>
              <dt className="text-meta text-slate-600">Format</dt>
              <dd className="font-semibold">{course.formats.join(', ')}</dd>
            </div>
          </dl>
          <div className="mt-6">
            <Btn href="#jadwal-sesi">Pilih Jadwal</Btn>
          </div>
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Block title="Untuk siapa">
              <Lines n={3} />
            </Block>
            <Block title="Yang akan Anda kuasai">
              <Lines n={4} />
            </Block>
            <Block title="Silabus">
              {['Hari 1', 'Hari 2', 'Hari 3'].map((d) => (
                <details className="border-b border-line-subtle py-3" key={d}>
                  <summary className="flex min-h-11 cursor-pointer items-center text-ui font-semibold">
                    {d}
                  </summary>
                  <Lines n={3} />
                </details>
              ))}
            </Block>
            <Block title="Prasyarat">
              <p>Satu paragraf prasyarat, atau “Tidak ada prasyarat khusus.”</p>
            </Block>
            <Block title="Metode pembelajaran">
              <p>Ceramah, studi kasus, latihan. Jelaskan perbedaan tatap muka dan live online.</p>
            </Block>
            <Block title="Sertifikat">
              <p>Satu kalimat tentang sertifikat yang diterima peserta.</p>
              <Note refs="D-04">
                Pelacakan sertifikat ada di sistem lain, jadi tidak ada fitur cek sertifikat di
                sini. Perlu dikonfirmasi: apakah halaman ini menautkan ke sistem tersebut?
              </Note>
            </Block>
            <Block title="Pertanyaan umum">
              {[
                'Apakah ada pembayaran online?',
                'Bagaimana jika saya batal ikut?',
                'Apakah bisa untuk tim perusahaan?',
              ].map((q) => (
                <details className="border-b border-line-subtle py-3" key={q}>
                  <summary className="flex min-h-11 cursor-pointer items-center text-ui font-semibold">
                    {q}
                  </summary>
                  <p>Jawaban singkat.</p>
                </details>
              ))}
            </Block>
            <Block title="Pelatihan terkait">
              <ul className="grid gap-3 md:grid-cols-2">
                {courses.slice(1, 3).map((c) => (
                  <li
                    className="rounded-sm border border-line-subtle p-4 text-ui font-semibold"
                    key={c.slug}
                  >
                    {c.title}
                  </li>
                ))}
              </ul>
            </Block>
            <Note refs="D-11">
              Blok pengajar ditambahkan setelah bio pengajar disetujui (fast-follow).
            </Note>
          </div>

          {/* Session panel: sticky on wide screens */}
          <aside aria-labelledby="jadwal-sesi" className="lg:col-span-4">
            <div className="rounded-sm border border-line-control p-5 lg:sticky lg:top-6">
              <h2 className="text-h3 text-navy-950" id="jadwal-sesi">
                Jadwal tersedia
              </h2>
              <fieldset className="mt-4 space-y-3">
                <legend className="sr-only">Pilih sesi</legend>
                {courseSessions.map((s, i) => (
                  <label className="flex gap-3 rounded-sm border border-line-subtle p-3" key={s.id}>
                    <span
                      aria-hidden
                      className={`mt-1 h-6 w-6 shrink-0 rounded-full border border-line-control ${i === 0 ? 'bg-navy-800' : ''}`}
                    />
                    <span className="text-meta">
                      <span className="block font-semibold text-navy-950">{s.dates}</span>
                      <span className="block">{s.time}</span>
                      <span className="block">
                        {s.location} · {s.format}
                      </span>
                      <span className="block">
                        <FeeLabel fee={s.fee} />
                      </span>
                      <span className="block text-slate-600">{s.deadline}</span>
                      <span className="mt-1 block">
                        <StatusChip status={s.status} />
                      </span>
                    </span>
                  </label>
                ))}
              </fieldset>
              <Btn className="mt-4 w-full" href="/wireframes/pendaftaran?session=JDW-0312">
                Ajukan Pendaftaran
              </Btn>
              <p className="mt-3 text-meta text-slate-600">
                Ini permintaan, bukan pemesanan. Admin mengonfirmasi kursi lewat WhatsApp.
              </p>
            </div>

            <div className="mt-6 rounded-sm border border-dashed border-line-control p-5">
              <p className="eyebrow text-slate-600">State: belum ada jadwal</p>
              <p className="mt-2 text-ui font-semibold">Belum ada jadwal untuk pelatihan ini.</p>
              <Btn className="mt-3 w-full" variant="secondary">
                Tanyakan Jadwal
              </Btn>
            </div>
          </aside>
        </div>
      </div>

      {/* Compact sticky CTA bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-10 border-t border-line-control bg-white lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="container-page flex items-center justify-between gap-3 py-3">
          <span className="text-meta">
            <span className="block text-slate-600">Jadwal berikutnya</span>
            <span className="font-semibold">8 – 10 Mar 2027</span>
          </span>
          <Btn href="#jadwal-sesi">Pilih Jadwal</Btn>
        </div>
      </div>
    </WfPage>
  )
}
