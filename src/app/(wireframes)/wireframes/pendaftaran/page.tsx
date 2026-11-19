import type { Metadata } from 'next'
import Link from 'next/link'

import { dummyContact, sessions } from '../_data'
import { Btn, FeeLabel, Note, StatusChip, WfPage } from '../_kit'

export const metadata: Metadata = { title: 'Ajukan pendaftaran' }

const steps = ['Pilih jadwal', 'Ringkasan', 'Kirim di WhatsApp', 'Konfirmasi admin']

// Registration via WhatsApp (D-01, D-06). The website only prefills course + session in the
// message (PRD §6: never put private form fields in a URL); the applicant types their details in the chat.
export default async function PendaftaranWireframe({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>
}) {
  const { state } = await searchParams
  const closed = state === 'full'
  const s = closed ? sessions[0] : sessions[1]

  return (
    <WfPage
      motion="Hanya fungsional: tekan tombol dan penanda langkah. Tidak ada animasi “terkirim”, karena situs tidak tahu apakah pesan WhatsApp benar-benar dikirim."
      title="Ajukan pendaftaran"
    >
      <div className="container-page max-w-3xl py-10">
        <nav aria-label="Contoh state" className="mb-6 flex flex-wrap gap-4 text-meta">
          <span className="text-slate-600">Lihat state:</span>
          <Link className="underline underline-offset-4" href="/wireframes/pendaftaran">
            Sesi dibuka
          </Link>
          <Link className="underline underline-offset-4" href="/wireframes/pendaftaran?state=full">
            Sesi penuh / ditutup
          </Link>
        </nav>

        <ol className="flex flex-wrap gap-x-6 gap-y-2 border-b border-line-subtle pb-4 text-meta">
          {steps.map((label, i) => (
            <li
              aria-current={i === 1 ? 'step' : undefined}
              className={i === 1 ? 'font-semibold' : 'text-slate-600'}
              key={label}
            >
              {i + 1}. {label}
            </li>
          ))}
        </ol>

        <h1 className="mt-8 text-h1 text-navy-950">Ajukan pendaftaran</h1>

        {/* Selected session summary */}
        <section
          aria-labelledby="ringkasan"
          className="mt-6 rounded-sm border border-line-control p-5"
        >
          <h2 className="sr-only" id="ringkasan">
            Ringkasan jadwal
          </h2>
          <StatusChip status={s.status} />
          <p className="mt-2 text-h3 text-navy-950">{s.course}</p>
          <dl className="mt-3 grid gap-2 text-meta md:grid-cols-2">
            <div>
              <dt className="text-slate-600">Tanggal</dt>
              <dd>
                {s.dates}, {s.time}
              </dd>
            </div>
            <div>
              <dt className="text-slate-600">Lokasi dan format</dt>
              <dd>
                {s.location} · {s.format}
              </dd>
            </div>
            <div>
              <dt className="text-slate-600">Biaya</dt>
              <dd>
                <FeeLabel fee={s.fee} />
              </dd>
            </div>
            <div>
              <dt className="text-slate-600">Batas pendaftaran</dt>
              <dd>{s.deadline.replace('Daftar paling lambat ', '')}</dd>
            </div>
          </dl>
          <Btn className="mt-3" href="/wireframes/detail-pelatihan" variant="link">
            Ganti jadwal
          </Btn>
        </section>

        {closed ? (
          <section className="mt-8 rounded-sm border border-line-control bg-paper p-5">
            <h2 className="text-h3 text-navy-950">
              Pendaftaran untuk jadwal ini sudah tidak dibuka
            </h2>
            <p className="mt-2 text-body text-navy-800">
              Sesi ini penuh. Pilih jadwal lain atau tanyakan sesi berikutnya kepada kami.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Btn href="/wireframes/jadwal">Lihat Jadwal Lain</Btn>
              <Btn variant="secondary">Tanyakan Jadwal</Btn>
            </div>
            <Note refs="AC-04">
              Tombol WhatsApp pendaftaran tidak muncul untuk sesi yang tidak berstatus Dibuka.
            </Note>
          </section>
        ) : (
          <>
            <section className="mt-8 rounded-sm border-l-4 border-navy-800 bg-paper p-5">
              <h2 className="text-ui font-semibold text-navy-950">
                Ini permintaan pendaftaran, bukan pemesanan
              </h2>
              <p className="mt-1 text-body text-navy-800">
                Kursi Anda dikonfirmasi oleh admin BKI Academy lewat WhatsApp. Tidak ada pembayaran
                online.
              </p>
            </section>

            <section aria-labelledby="siapkan" className="mt-8">
              <h2 className="text-h3 text-navy-950" id="siapkan">
                Siapkan data berikut untuk dikirim di WhatsApp
              </h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-body">
                <li>Nama lengkap</li>
                <li>Email</li>
                <li>Nomor WhatsApp yang aktif</li>
                <li>Perusahaan (jika didaftarkan perusahaan)</li>
                <li>Biaya ditanggung pribadi atau perusahaan</li>
              </ul>
            </section>

            <section aria-labelledby="pesan" className="mt-8">
              <h2 className="text-ui font-semibold" id="pesan">
                Pesan yang akan terisi otomatis
              </h2>
              <p className="mt-2 rounded-sm border border-line-subtle bg-paper p-4 font-mono text-meta">
                Halo BKI Academy, saya ingin mendaftar {s.course}, {s.dates} ({s.location},{' '}
                {s.format}). Kode jadwal: {s.id}.
              </p>
              <Note refs="PRD §6, D-06">
                Hanya nama pelatihan, jadwal dan kode yang masuk ke tautan WhatsApp. Data pribadi
                diketik pemohon di chat, tidak pernah dimasukkan ke URL.
              </Note>
            </section>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Btn href="#whatsapp">Lanjutkan ke WhatsApp</Btn>
              <span className="text-meta text-slate-600">
                Membuka WhatsApp ke {dummyContact.whatsapp}
              </span>
            </div>
            <p className="mt-4 text-meta text-navy-800">
              Tidak bisa memakai WhatsApp? Email {dummyContact.email} atau telepon{' '}
              {dummyContact.phone}.
            </p>

            <section
              aria-labelledby="selanjutnya"
              className="mt-10 border-t border-line-subtle pt-8"
            >
              <h2 className="text-h3 text-navy-950" id="selanjutnya">
                Apa yang terjadi selanjutnya
              </h2>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-body">
                <li>Admin membalas di WhatsApp pada jam layanan ({dummyContact.hours}).</li>
                <li>Admin mengonfirmasi ketersediaan kursi dan mengirim informasi pembayaran.</li>
                <li>Perubahan atau pembatalan juga dikonfirmasi oleh admin.</li>
              </ol>
              <p className="mt-4 text-meta">
                Dengan melanjutkan, Anda menyetujui{' '}
                <Link className="underline underline-offset-4" href="#">
                  Ketentuan Pendaftaran
                </Link>{' '}
                dan{' '}
                <Link className="underline underline-offset-4" href="#">
                  Kebijakan Privasi
                </Link>
                .
              </p>
              <Note refs="D-03, D-06">
                Belum ada janji waktu balasan sampai pemilik operasional menyetujuinya. Alur
                formulir PRD (data pemohon, tinjau, nomor referensi) bisa menggantikan langkah 3
                nanti tanpa mengubah URL halaman ini.
              </Note>
            </section>
          </>
        )}
      </div>
    </WfPage>
  )
}
