import { Building2, Landmark, MonitorPlay } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { EnquiryForm } from '@/components/inhouse/EnquiryForm'
import { PhotoFrame } from '@/components/site/PhotoFrame'
import { Reveal } from '@/components/site/Reveal'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Button, ButtonArrow } from '@/components/ui/button'
import { TextLink } from '@/components/ui/text-link'
import { whatsappUrl } from '@/lib/registration'
import { siteSettings } from '@/lib/site-settings'

export const metadata: Metadata = {
  title: 'In-house Training',
  description:
    'Pelatihan maritim BKI Academy yang disesuaikan untuk tim perusahaan Anda, di lokasi Anda, di fasilitas BKI, atau secara online.',
}

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

const options = [
  {
    icon: Building2,
    title: 'Di lokasi perusahaan',
    text: 'Instruktur datang ke kantor, galangan, atau kapal Anda. Cocok bila latihan perlu memakai peralatan dan prosedur Anda sendiri.',
  },
  {
    icon: Landmark,
    title: 'Di fasilitas BKI',
    text: 'Tim Anda belajar di kelas BKI Academy. Cocok bila peserta datang dari beberapa lokasi.',
  },
  {
    icon: MonitorPlay,
    title: 'Live online',
    text: 'Kelas langsung lewat konferensi video. Cocok untuk awak yang tersebar atau jadwal yang padat.',
  },
]

const adjustments = [
  'Studi kasus dari jenis kapal dan operasi perusahaan Anda',
  'Urutan dan durasi materi sesuai jadwal kerja tim',
  'Contoh dokumen dan prosedur internal perusahaan',
  'Bahasa pengantar Indonesia atau Inggris',
]

const steps = [
  {
    title: 'Kirim kebutuhan',
    text: 'Isi formulir di halaman ini atau hubungi kami lewat WhatsApp.',
  },
  {
    title: 'Diskusi kebutuhan',
    text: 'Tim kami menghubungi Anda untuk memahami peserta dan tujuan pelatihan.',
  },
  { title: 'Penawaran dan materi', text: 'Anda menerima usulan materi, jadwal, dan biaya.' },
  { title: 'Pelaksanaan', text: 'Pelatihan berjalan sesuai jadwal yang disepakati.' },
]

/*
 * In-house Training (PRD §6 Corporate training, wireframe /wireframes/in-house).
 * Sections: hero → options → what can be adjusted → process → examples → MICE → enquiry form.
 * Motion (design.md §7.1): low. One-time reveals for options, process and examples only; the form is
 * functional only. Copy is DRAFT and needs content-owner approval (AC-09). Examples need photo permission (B-05).
 * D-12 keeps the website form at launch; if it changes, the form becomes a WhatsApp/email handoff.
 */
export default async function InHousePage({ searchParams }: PageProps) {
  const simulasi = (await searchParams).simulasi
  const whatsappHref = whatsappUrl(
    siteSettings.whatsappNumber,
    'Halo BKI Academy, saya ingin bertanya tentang pelatihan in-house untuk perusahaan kami.',
  )

  return (
    <>
      <section aria-labelledby="inhouse-judul" className="container-page pt-8 pb-16">
        <Breadcrumbs items={[{ href: '/id', label: 'Beranda' }, { label: 'In-house Training' }]} />
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-6">
          <div className="lg:col-span-7 lg:pr-8">
            <p className="eyebrow text-blue-600">Untuk perusahaan</p>
            <h1 className="mt-3 text-h1 text-navy-950" id="inhouse-judul">
              Pelatihan in-house untuk tim Anda
            </h1>
            <p className="mt-5 max-w-[60ch] text-intro text-navy-800">
              Materi pelatihan BKI Academy yang disesuaikan dengan armada, prosedur, dan jadwal
              perusahaan Anda.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="#formulir-judul">
                  Ajukan Kebutuhan Pelatihan
                  <ButtonArrow />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/id/pelatihan">Lihat Daftar Pelatihan</Link>
              </Button>
            </div>
          </div>
          <PhotoFrame
            alt="Instruktur BKI Academy melatih tim perusahaan di lokasi kerja"
            className="aspect-4/3 lg:col-span-5"
            placeholderLabel="Foto kegiatan in-house menyusul setelah izin foto (B-05)"
            priority
          />
        </div>
      </section>

      <section aria-labelledby="pilihan" className="border-t border-line-subtle py-16 lg:py-24">
        <div className="container-page">
          <h2 className="text-h2 text-navy-950" id="pilihan">
            Pilihan pelaksanaan
          </h2>
          <Reveal className="mt-10">
            <ul className="grid gap-4 md:grid-cols-3 lg:gap-6">
              {options.map(({ icon: Icon, text, title }) => (
                <li
                  className="flex flex-col gap-3 rounded-card border border-line-subtle p-5 md:p-6"
                  key={title}
                >
                  <Icon aria-hidden className="size-6 text-blue-600" />
                  <h3 className="text-h3 text-navy-950">{title}</h3>
                  <p className="text-body text-navy-800">{text}</p>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="mt-16 grid gap-6 lg:grid-cols-12">
            <h2 className="text-h3 text-navy-950 lg:col-span-4">Yang bisa disesuaikan</h2>
            <ul className="grid gap-x-6 gap-y-3 md:grid-cols-2 lg:col-span-8">
              {adjustments.map((item) => (
                <li className="border-t border-line-subtle pt-3 text-body text-navy-800" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="proses" className="bg-paper py-16 lg:py-24">
        <div className="container-page">
          <h2 className="text-h2 text-navy-950" id="proses">
            Bagaimana prosesnya
          </h2>
          <Reveal className="mt-10">
            <ol className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {steps.map((step, index) => (
                <li className="border-t-2 border-navy-950 pt-5" key={step.title}>
                  <p aria-hidden className="numeric text-h3 text-blue-600">
                    {index + 1}
                  </p>
                  <h3 className="mt-2 text-ui font-semibold text-navy-950">{step.title}</h3>
                  <p className="mt-2 text-body text-navy-800">{step.text}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="contoh" className="container-page py-16 lg:py-24">
        <h2 className="text-h2 text-navy-950" id="contoh">
          Contoh kegiatan
        </h2>
        <p className="mt-4 max-w-[60ch] text-body text-slate-600">
          Dokumentasi kegiatan in-house ditampilkan setelah perusahaan peserta dan orang dalam foto
          memberi izin.
        </p>
        <Reveal className="mt-10">
          <ul className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <li key={n}>
                <PhotoFrame
                  alt={`Contoh kegiatan in-house ${n}`}
                  className="aspect-video"
                  placeholderLabel="Foto kegiatan menyusul (B-05)"
                />
              </li>
            ))}
          </ul>
        </Reveal>
        <div className="mt-12 flex flex-col gap-2 border-l-4 border-blue-600 pl-5">
          <p className="text-ui font-semibold text-navy-950">
            Butuh penyelenggaraan acara atau seminar?
          </p>
          <TextLink arrow className="self-start" href="/id/mice">
            Lihat layanan MICE
          </TextLink>
        </div>
      </section>

      <section aria-labelledby="formulir-judul" className="bg-paper py-16 lg:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-4">
            <h2
              className="scroll-mt-[calc(var(--header-height)+1.5rem)] text-h2 text-navy-950"
              id="formulir-judul"
            >
              Ajukan kebutuhan pelatihan
            </h2>
            <p className="mt-4 text-body text-navy-800">
              Ceritakan kebutuhan tim Anda. Kami menghubungi Anda untuk membahas materi, jadwal, dan
              biaya.
            </p>
          </div>
          <div className="rounded-card border border-line-subtle bg-white p-5 md:p-8 lg:col-span-8">
            <EnquiryForm
              simulate={typeof simulasi === 'string' ? simulasi : undefined}
              whatsappHref={whatsappHref}
            />
          </div>
        </div>
      </section>
    </>
  )
}
