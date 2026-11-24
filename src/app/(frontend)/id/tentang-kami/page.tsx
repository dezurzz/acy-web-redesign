import { ShieldCheck } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { PageIntro } from '@/components/site/PageIntro'
import { PhotoFrame } from '@/components/site/PhotoFrame'
import { Reveal } from '@/components/site/Reveal'
import { Button, ButtonArrow } from '@/components/ui/button'
import { TextLink } from '@/components/ui/text-link'
import { sampleCategories } from '@/lib/sample-data'

export const metadata: Metadata = {
  title: 'Tentang Kami',
  description: 'BKI Academy adalah divisi pelatihan PT Biro Klasifikasi Indonesia (Persero).',
}

const ways = [
  { title: 'Tatap muka', text: 'Kelas di fasilitas BKI Academy dengan latihan dan diskusi kasus.' },
  {
    title: 'Live online',
    text: 'Kelas langsung lewat konferensi video untuk peserta di mana saja.',
  },
  {
    title: 'In-house',
    text: 'Pelatihan yang disesuaikan, di lokasi perusahaan atau secara online.',
  },
]

/*
 * Tentang Kami (PRD §6 About). Organisational affiliation is stated plainly; course approvals and
 * credentials are a separate block that stays empty until each item has an issuer, scope, evidence
 * and review date (PRD §6, AC-09). No participant counts, ratings or logos until verified.
 * Pengajar sits under Tentang Kami once it goes live (D-11, hidden at launch).
 * Motion: low. Image hover, one reveal for the training areas. Copy is DRAFT (AC-09).
 */
export default function AboutPage() {
  return (
    <div className="pt-8 pb-16 lg:pb-24">
      <div className="container-page grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-6">
        <div className="lg:col-span-7">
          <PageIntro
            eyebrow="Tentang BKI Academy"
            intro="BKI Academy adalah divisi pelatihan PT Biro Klasifikasi Indonesia (Persero). Kami menyelenggarakan pelatihan maritim untuk profesional di kapal, di galangan, dan di kantor perusahaan pelayaran."
            title="Tentang Kami"
          />
        </div>
        <PhotoFrame
          alt="Kegiatan pelatihan BKI Academy"
          className="aspect-4/3 lg:col-span-5"
          placeholderLabel="Foto kegiatan BKI Academy menyusul (B-05)"
          priority
        />
      </div>

      <section
        aria-labelledby="bagian-bki"
        className="container-page mt-16 grid gap-8 border-t border-navy-800 pt-10 lg:grid-cols-12 lg:gap-6"
      >
        <h2 className="text-h2 text-navy-950 lg:col-span-4" id="bagian-bki">
          Bagian dari BKI
        </h2>
        <div className="flex max-w-[65ch] flex-col gap-4 text-body text-navy-800 lg:col-span-8">
          <p>
            PT Biro Klasifikasi Indonesia (Persero) adalah badan klasifikasi kapal nasional.
            Pekerjaan sehari-harinya meliputi klasifikasi, survei, dan sertifikasi kapal serta
            bangunan lepas pantai.
          </p>
          <p>
            BKI Academy membawa pengalaman itu ke ruang kelas: materi disusun dari pekerjaan
            klasifikasi dan survei, bukan hanya dari buku teks.
          </p>
        </div>
      </section>

      <section aria-labelledby="bidang" className="mt-16 bg-paper py-16 lg:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-h2 text-navy-950" id="bidang">
              Bidang pelatihan
            </h2>
            <TextLink arrow href="/id/pelatihan">
              Semua pelatihan
            </TextLink>
          </div>
          <Reveal className="mt-8">
            <ul className="grid gap-x-6 gap-y-2 md:grid-cols-2 lg:grid-cols-3">
              {sampleCategories.map((category) => (
                <li className="border-t border-line-control py-4" key={category.slug}>
                  <Link
                    className="text-ui font-semibold text-navy-950 underline-offset-4 hover:text-blue-600 hover:underline"
                    href={`/id/pelatihan?topik=${category.slug}`}
                  >
                    {category.name}
                  </Link>
                  <p className="mt-1 text-meta text-slate-600">{category.description}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="cara-belajar" className="container-page mt-16">
        <h2 className="text-h2 text-navy-950" id="cara-belajar">
          Cara belajar
        </h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-3">
          {ways.map((way) => (
            <li className="border-t-2 border-navy-950 pt-4" key={way.title}>
              <h3 className="text-ui font-semibold text-navy-950">{way.title}</h3>
              <p className="mt-2 text-body text-navy-800">{way.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="pengakuan" className="container-page mt-16">
        <div className="rounded-card border border-dashed border-line-control p-6 md:p-8">
          <div className="flex items-start gap-3">
            <ShieldCheck aria-hidden className="mt-1 size-6 shrink-0 text-slate-600" />
            <div>
              <h2 className="text-h3 text-navy-950" id="pengakuan">
                Pengakuan dan persetujuan pelatihan
              </h2>
              <p className="mt-2 max-w-[65ch] text-body text-navy-800">
                Daftar pengakuan ditampilkan setelah setiap item diverifikasi: siapa yang
                menerbitkan, untuk pelatihan apa, buktinya, dan kapan terakhir ditinjau.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page mt-16 flex flex-col items-start gap-4 border-t border-line-subtle pt-10 md:flex-row md:items-center md:justify-between">
        <p className="text-h3 text-navy-950">Siap mencari pelatihan yang sesuai?</p>
        <Button asChild>
          <Link href="/id/pelatihan">
            Jelajahi Pelatihan
            <ButtonArrow />
          </Link>
        </Button>
      </section>
    </div>
  )
}
