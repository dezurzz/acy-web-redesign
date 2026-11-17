import type { Metadata } from 'next'

import { Btn, ImageBox, Note, SectionTitle, WfPage } from '../_kit'

export const metadata: Metadata = { title: 'In-house training' }

function Field({ label, hint, optional }: { label: string; hint?: string; optional?: boolean }) {
  return (
    <label className="block">
      <span className="text-ui font-semibold">
        {label}
        {optional ? <span className="font-normal text-slate-600"> (opsional)</span> : null}
      </span>
      {hint ? <span className="block text-meta text-slate-600">{hint}</span> : null}
      <span className="mt-1 block min-h-12 rounded-control border border-line-control" />
    </label>
  )
}

function Choice({ legend, options }: { legend: string; options: string[] }) {
  return (
    <fieldset>
      <legend className="text-ui font-semibold">{legend}</legend>
      <ul className="mt-1">
        {options.map((o) => (
          <li className="flex min-h-11 items-center gap-3 text-ui" key={o}>
            <span aria-hidden className="h-6 w-6 rounded-full border border-line-control" /> {o}
          </li>
        ))}
      </ul>
    </fieldset>
  )
}

// PRD §6 Corporate training: options, customisation, process, examples, enquiry form.
export default function InHouseWireframe() {
  return (
    <WfPage title="In-house training">
      <section className="container-page grid gap-8 py-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-meta text-slate-600">Beranda / In-house Training</p>
          <h1 className="mt-2 text-h1 text-navy-950">Pelatihan in-house untuk perusahaan</h1>
          <p className="mt-4 text-intro text-navy-800">
            Materi pelatihan BKI Academy yang disesuaikan untuk tim Anda, di lokasi Anda atau secara
            online.
          </p>
          <div className="mt-8">
            <Btn href="#formulir">Ajukan Kebutuhan Pelatihan</Btn>
          </div>
        </div>
        <ImageBox className="aspect-4/3" label="Foto kegiatan in-house (izin foto, B-05)" />
      </section>

      <section aria-labelledby="h-pilihan" className="container-page py-10">
        <SectionTitle id="h-pilihan" title="Pilihan pelatihan" />
        <ul className="grid gap-4 md:grid-cols-3">
          {['Di lokasi perusahaan', 'Di fasilitas BKI', 'Live online'].map((t) => (
            <li className="rounded-sm border border-line-subtle p-5" key={t}>
              <h3 className="text-ui font-semibold text-navy-950">{t}</h3>
              <p className="mt-2 text-meta text-navy-800">Dua kalimat: kapan pilihan ini cocok.</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="h-proses" className="bg-paper py-10">
        <div className="container-page">
          <SectionTitle id="h-proses" title="Bagaimana prosesnya" />
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {['Kirim kebutuhan', 'Diskusi dan analisis', 'Penawaran dan materi', 'Pelaksanaan'].map(
              (t, i) => (
                <li className="border-t border-navy-800 pt-4" key={t}>
                  <p className="numeric text-h3 text-navy-950">{i + 1}</p>
                  <p className="mt-1 text-ui font-semibold">{t}</p>
                  <p className="mt-1 text-meta text-navy-800">Satu kalimat.</p>
                </li>
              ),
            )}
          </ol>
        </div>
      </section>

      <section aria-labelledby="h-contoh" className="container-page py-10">
        <SectionTitle id="h-contoh" title="Contoh kegiatan" />
        <ul className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <li key={n}>
              <ImageBox className="aspect-video" label="Foto dengan izin" />
              <p className="mt-2 text-ui font-semibold">Nama kegiatan, tahun</p>
            </li>
          ))}
        </ul>
        <div className="mt-8 rounded-sm border border-line-subtle p-5">
          <p className="text-ui font-semibold">Butuh penyelenggaraan acara (MICE)?</p>
          <Btn className="mt-2" variant="link">
            Lihat layanan MICE
          </Btn>
          <Note refs="D-09">
            MICE masih aktif tapi bukan prioritas: halaman sekunder, tidak di navigasi utama.
          </Note>
        </div>
      </section>

      <section aria-labelledby="formulir" className="bg-paper py-12">
        <div className="container-page max-w-3xl">
          <SectionTitle id="formulir" title="Ajukan kebutuhan pelatihan" />
          <p className="text-meta text-slate-600">
            Semua kolom wajib kecuali yang ditandai opsional.
          </p>
          <form className="mt-6 space-y-5 rounded-sm border border-line-subtle bg-white p-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Nama kontak" />
              <Field label="Email kantor" />
              <Field label="Perusahaan" />
              <Field label="Nomor telepon / WhatsApp" />
            </div>
            <Field hint="Contoh: ISM Code, stabilitas kapal" label="Topik pelatihan" />
            <Choice
              legend="Perkiraan jumlah peserta"
              options={['1 – 10', '11 – 25', '26 – 50', 'Lebih dari 50']}
            />
            <Field hint="Contoh: Maret 2027" label="Waktu yang diinginkan" />
            <Choice
              legend="Lokasi / format"
              options={['Di lokasi perusahaan', 'Di fasilitas BKI', 'Live online']}
            />
            <Field label="Kebutuhan lain" optional />
            <label className="flex items-start gap-3 text-ui">
              <span
                aria-hidden
                className="mt-0.5 h-6 w-6 shrink-0 rounded-sm border border-line-control"
              />
              Saya telah membaca Kebijakan Privasi.
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <Btn>Kirim Kebutuhan Pelatihan</Btn>
              <Btn variant="link">Atau chat lewat WhatsApp</Btn>
            </div>
          </form>
          <Note refs="D-06, T-04">
            Perlu diputuskan: formulir ini dikirim ke email/antrean staf (butuh penyedia email T-04,
            Sprint 3) atau sementara diganti tombol WhatsApp seperti pendaftaran. Tanpa unggah file
            saat launch.
          </Note>
          <section className="mt-6 rounded-sm border border-line-control bg-white p-5">
            <p className="eyebrow text-slate-600">State: terkirim</p>
            <p className="mt-2 text-ui font-semibold">
              Terima kasih, kebutuhan Anda sudah kami terima.
            </p>
            <p className="mt-1 text-meta">Nomor referensi, ringkasan, dan langkah selanjutnya.</p>
          </section>
        </div>
      </section>
    </WfPage>
  )
}
