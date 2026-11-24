import type { Metadata } from 'next'
import Link from 'next/link'

import { PhotoFrame } from '@/components/site/PhotoFrame'
import { Reveal } from '@/components/site/Reveal'
import { SessionRow } from '@/components/site/SessionRow'
import { Button, ButtonArrow } from '@/components/ui/button'
import { FeedbackPanel } from '@/components/ui/feedback-panel'
import { TextLink } from '@/components/ui/text-link'
import { sampleCategories, upcomingSessions } from '@/lib/sample-data'

export const metadata: Metadata = {
  title: { absolute: 'BKI Academy | Pelatihan Maritim Profesional' },
  description:
    'Jadwal dan detail pelatihan maritim BKI Academy: keselamatan, keamanan, survei, awak kapal, lingkungan, dan desain kapal.',
}

/*
 * Beranda (PRD §6 Homepage, wireframe /wireframes/beranda).
 * Order: hero → upcoming sessions → categories → reasons → corporate training → footer.
 * Pengajar and Insight sections are left out until those pages go live (decision D-11).
 * Motion (design.md §7.1): hero, CTAs and session rows never animate; one-time reveals only for
 * the Kategori, Mengapa BKI Academy and In-house groups.
 * Copy is DRAFT and needs content-owner approval before launch (AC-09). Sessions are sample data.
 */
export default function HomePage() {
  const sessions = upcomingSessions(5)

  return (
    <>
      <Hero />
      <UpcomingSessions sessions={sessions} />
      <Categories />
      <Reasons />
      <Corporate />
    </>
  )
}

function SectionHeading({
  eyebrow,
  id,
  intro,
  title,
}: {
  eyebrow: string
  id: string
  intro?: string
  title: string
}) {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow text-slate-600">{eyebrow}</p>
      <h2 className="mt-3 text-h2 text-navy-950" id={id}>
        {title}
      </h2>
      {intro ? <p className="mt-4 text-intro text-slate-600">{intro}</p> : null}
    </div>
  )
}

function Hero() {
  return (
    <section aria-labelledby="beranda-judul" className="container-page py-12">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-6">
        <div className="lg:col-span-7 lg:pr-8">
          <p className="eyebrow text-blue-600">BKI Academy</p>
          <h1 className="mt-4 text-display text-navy-950" id="beranda-judul">
            Kompetensi maritim untuk langkah profesional berikutnya.
          </h1>
          <p className="mt-6 max-w-[60ch] text-intro text-navy-800">
            Pelatihan keselamatan, keamanan, survei, dan pengelolaan kapal dari divisi pelatihan PT
            Biro Klasifikasi Indonesia (Persero), untuk profesional maritim dan tim perusahaan.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/id/jadwal">
                Lihat Jadwal
                <ButtonArrow />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/id/in-house">Pelatihan untuk Perusahaan</Link>
            </Button>
          </div>
        </div>
        <PhotoFrame
          alt="Instruktur BKI Academy memandu peserta pelatihan di kelas"
          className="aspect-4/3 lg:col-span-5 lg:aspect-4/5"
          placeholderLabel="Satu foto pelatihan asli BKI Academy menyusul setelah izin foto (B-05)"
          priority
        />
      </div>
    </section>
  )
}

function UpcomingSessions({ sessions }: { sessions: ReturnType<typeof upcomingSessions> }) {
  return (
    <section aria-labelledby="beranda-jadwal" className="container-page pt-8 pb-16 lg:pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-navy-800 pb-6">
        <SectionHeading
          eyebrow="Jadwal terdekat"
          id="beranda-jadwal"
          title="Sesi yang akan datang"
        />
        <TextLink arrow href="/id/jadwal">
          Lihat semua jadwal
        </TextLink>
      </div>

      {sessions.length > 0 ? (
        <div>
          {sessions.map((session) => (
            <SessionRow
              courseHref={`/id/pelatihan/${session.courseSlug}`}
              courseTitle={session.courseTitle}
              endDate={session.endDate}
              fee={session.fee}
              format={session.format}
              key={session.id}
              postponementMessage={session.postponementMessage}
              registerHref={`/id/pendaftaran?session=${session.id}`}
              startDate={session.startDate}
              status={session.status}
              taxWording={session.taxWording}
              time={session.time}
              venue={session.venue}
            />
          ))}
        </div>
      ) : (
        <FeedbackPanel
          action={
            <Button asChild variant="secondary">
              <Link href="/id/hubungi-kami">Tanyakan Jadwal</Link>
            </Button>
          }
          className="mt-8"
          title="Belum ada jadwal terbuka"
          tone="info"
        >
          Jadwal berikutnya belum tersedia. Hubungi kami untuk informasi pelaksanaan.
        </FeedbackPanel>
      )}
    </section>
  )
}

function Categories() {
  return (
    <section aria-labelledby="beranda-kategori" className="bg-paper py-16 lg:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Bidang pelatihan"
          id="beranda-kategori"
          intro="Pilih bidang untuk melihat semua pelatihan dan jadwalnya."
          title="Enam bidang, satu standar"
        />
        <Reveal className="mt-10">
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {sampleCategories.map((category) => (
              <li key={category.slug}>
                <article className="group/cat flex h-full flex-col gap-3 rounded-card border border-line-subtle bg-white p-5 transition-colors duration-(--motion-fast) ease-(--ease-standard) focus-within:border-blue-600 hover:border-blue-600 md:p-6">
                  <h3 className="text-h3 text-navy-950">
                    <Link
                      className="inline-flex items-center gap-2 decoration-2 underline-offset-4 transition-colors duration-(--motion-fast) group-hover/cat:text-blue-600 hover:underline"
                      href={`/id/pelatihan?topik=${category.slug}`}
                    >
                      {category.name}
                    </Link>
                  </h3>
                  <p className="text-body text-navy-800">{category.description}</p>
                  <p className="mt-auto border-t border-line-subtle pt-3 text-meta text-slate-600">
                    <span className="font-medium text-navy-800">Contoh: </span>
                    {category.examples.join(' · ')}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

// Only claims that can be verified (PRD §6): no participant counts, ratings or approval badges.
const reasons = [
  {
    title: 'Bagian dari BKI',
    text: 'BKI Academy adalah divisi pelatihan PT Biro Klasifikasi Indonesia (Persero), badan klasifikasi kapal nasional.',
  },
  {
    title: 'Berangkat dari praktik',
    text: 'Materi disusun dari pekerjaan klasifikasi, survei, dan sertifikasi yang dijalankan BKI setiap hari.',
  },
  {
    title: 'Format yang fleksibel',
    text: 'Ikuti pelatihan tatap muka, live online, atau undang kami ke perusahaan Anda.',
  },
]

function Reasons() {
  return (
    <section aria-labelledby="beranda-alasan" className="container-page py-16 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-4">
          <SectionHeading
            eyebrow="Mengapa BKI Academy"
            id="beranda-alasan"
            title="Belajar dari badan klasifikasi"
          />
        </div>
        <Reveal className="lg:col-span-8">
          <ol className="grid gap-8 md:grid-cols-3 md:gap-6">
            {reasons.map((reason, index) => (
              <li className="border-t-2 border-navy-950 pt-5" key={reason.title}>
                <p aria-hidden className="numeric text-meta font-semibold text-blue-600">
                  0{index + 1}
                </p>
                <h3 className="mt-3 text-ui font-semibold text-navy-950">{reason.title}</h3>
                <p className="mt-2 text-body text-navy-800">{reason.text}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}

function Corporate() {
  return (
    // Solid navy on compact screens so white text never lands on the cyan end of the gradient
    // (design.md §4A); the brand gradient appears from 1024 px, with copy kept in the navy half.
    <section
      aria-labelledby="beranda-inhouse"
      className="bg-navy-950 text-white lg:bg-(image:--gradient-brand)"
      data-surface="brand"
    >
      <div className="container-page py-16 lg:py-24">
        <Reveal className="grid gap-10 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-6">
            <p className="eyebrow text-cyan-400">Untuk perusahaan</p>
            <h2 className="mt-3 text-h2" id="beranda-inhouse">
              Pelatihan in-house untuk tim Anda
            </h2>
            <p className="mt-4 max-w-[55ch] text-intro text-line-subtle">
              Materi disesuaikan dengan armada, prosedur, dan jadwal perusahaan Anda. Dilaksanakan
              di lokasi Anda atau secara online.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button asChild variant="secondary">
                <Link href="/id/in-house">
                  Ajukan Kebutuhan Pelatihan
                  <ButtonArrow />
                </Link>
              </Button>
              <TextLink href="/id/mice" inverse>
                Layanan MICE
              </TextLink>
            </div>
          </div>
          <ol className="flex flex-col gap-4 self-end lg:col-span-5 lg:col-start-8">
            {[
              'Sampaikan kebutuhan pelatihan',
              'Kami susun materi dan jadwal',
              'Pelatihan berjalan di tempat Anda',
            ].map((step, index) => (
              <li
                className="flex items-center gap-4 rounded-card bg-navy-950/70 p-4 text-ui font-medium"
                key={step}
              >
                <span
                  aria-hidden
                  className="numeric flex size-8 shrink-0 items-center justify-center rounded-full border border-cyan-400 text-meta text-cyan-400"
                >
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
