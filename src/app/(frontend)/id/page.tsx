import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { Atmosphere, Hairline, introStep, Paren } from '@/components/site/Atmosphere'
import { PhotoFrame } from '@/components/site/PhotoFrame'
import { Reveal } from '@/components/site/Reveal'
import { SessionRow } from '@/components/site/SessionRow'
import { Button, ButtonArrow } from '@/components/ui/button'
import { FeedbackPanel } from '@/components/ui/feedback-panel'
import { TextLink } from '@/components/ui/text-link'
import { loadFeaturedCoursePhotos, loadSiteData } from '@/lib/cms'
import { formatDateRange } from '@/lib/format'
import { categoryPhotos, stockPhotos } from '@/lib/stock-photos'
import {
  upcomingSessions,
  type SiteCategory,
  type SiteSession,
  type SiteCoursePhotos,
} from '@/lib/site-data'
import { cn } from '@/lib/utils'

// Reads live CMS content on every request, so published changes show immediately.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: { absolute: 'BKI Academy | Pelatihan Maritim Profesional' },
  description:
    'Jadwal dan detail pelatihan maritim BKI Academy: keselamatan, keamanan, survei, awak kapal, lingkungan, dan desain kapal.',
}

/*
 * Beranda (PRD §6 Homepage, wireframe /wireframes/beranda).
 * Order: hero → upcoming sessions → photo band → categories → reasons → in class (training photos)
 * → corporate training → footer.
 * Pengajar and Insight sections are left out until those pages go live (decision D-11).
 * Motion (design.md §7.1): hero, CTAs and session rows never animate; one-time reveals only for
 * the Kategori, Mengapa BKI Academy and In-house groups.
 * Copy is DRAFT and needs content-owner approval before launch (AC-09). Sessions and categories come from the CMS.
 */
export default async function HomePage() {
  const [data, coursePhotos] = await Promise.all([loadSiteData(), loadFeaturedCoursePhotos()])
  const sessions = upcomingSessions(data.sessions, 5)

  return (
    <>
      <Hero next={sessions.find((session) => session.status === 'open') ?? sessions[0]} />
      <UpcomingSessions sessions={sessions} />
      <PhotoBand />
      <Categories categories={data.categories} />
      <Reasons />
      <InClass items={coursePhotos} />
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
      <p className="text-ui text-slate-600">
        <Paren>{eyebrow}</Paren>
      </p>
      <h2 className="mt-5 text-h2 text-navy-950 md:text-h1" id={id}>
        {title}
      </h2>
      {intro ? <p className="mt-6 text-intro text-slate-600">{intro}</p> : null}
    </div>
  )
}

/*
 * Hero in the style of BKI Academy's own course posters (design.md §4D, v1.3): a large light
 * headline on the atmosphere gradient, a hairline, and the next session pinned to the
 * right like "Public Training - Jakarta / 21-23 Oktober 2026". Nothing here animates.
 */
function Hero({ next }: { next: SiteSession | undefined }) {
  return (
    <Atmosphere fadeHeight="lg" fadeTo="white" label="Pembuka">
      <div className="container-page pt-16 pb-20 md:pt-24 lg:pb-28">
        <div
          className="flex flex-wrap items-baseline justify-between gap-4 text-ui text-white/85"
          {...introStep(0, 'fade')}
        >
          <Paren>BKI Academy</Paren>
          <span className="hidden md:inline">
            <Paren>Divisi pelatihan PT Biro Klasifikasi Indonesia</Paren>
          </span>
        </div>

        <h1
          className="mt-12 max-w-[17ch] text-display text-white md:mt-20"
          id="beranda-judul"
          {...introStep(1)}
        >
          Kompetensi maritim untuk langkah profesional berikutnya.
        </h1>

        <Hairline className="mt-16 md:mt-24" intro={3} />

        <div className="grid gap-12 pt-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-7" {...introStep(4)}>
            <p className="max-w-[52ch] text-intro text-white/90">
              Pelatihan keselamatan, keamanan, survei, dan pengelolaan kapal untuk profesional
              maritim dan tim perusahaan.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button asChild variant="secondary">
                <Link href="/id/jadwal">
                  Lihat Jadwal
                  <ButtonArrow />
                </Link>
              </Button>
              <TextLink href="/id/in-house" inverse>
                Pelatihan untuk Perusahaan
              </TextLink>
            </div>
          </div>

          {next ? (
            <div
              className="flex flex-col gap-2 border-t border-white/25 pt-6 lg:col-span-4 lg:col-start-9 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6"
              {...introStep(5)}
            >
              <p className="text-meta text-white/80">
                <Paren>Jadwal terdekat</Paren>
              </p>
              <p className="text-h3 text-white">
                <Link
                  className="underline-offset-4 hover:underline"
                  href={`/id/pelatihan/${next.courseSlug}`}
                >
                  {next.courseTitle}
                </Link>
              </p>
              <p className="numeric text-ui text-white/90">
                {formatDateRange(next.startDate, next.endDate)}
              </p>
              <p className="text-meta text-white/80">
                {next.format} · {next.venue}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </Atmosphere>
  )
}

function UpcomingSessions({ sessions }: { sessions: SiteSession[] }) {
  return (
    <section
      aria-labelledby="beranda-jadwal"
      className="container-page pt-20 pb-24 md:pt-24 lg:pb-40"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-navy-800 pb-10">
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

/*
 * Full-width photograph between the schedule and the categories: gives the page scale and a
 * maritime feel. Headline in white over the photo overlay (design.md §4B), kept near the top on a
 * dark backing. TEMPORARY stock photo (lib/stock-photos.ts) until BKI photos arrive (B-05).
 */
function PhotoBand() {
  return (
    <section
      aria-labelledby="beranda-foto"
      className="relative isolate overflow-hidden bg-navy-950 text-white"
      data-surface="photo"
    >
      <div className="relative aspect-4/5 w-full md:aspect-video lg:aspect-21/9">
        {/* Drifts slower than the page while the band crosses the screen (parallax). */}
        <div className="parallax absolute inset-x-0 -inset-y-[7%]">
          <Image
            alt={stockPhotos.band.alt}
            // Show the upper part of the photo so the ship sits low, clear of the headline.
            className="object-cover object-[50%_8%]"
            fill
            sizes="100vw"
            src={stockPhotos.band.src}
          />
        </div>
        <div aria-hidden className="absolute inset-0 bg-(image:--gradient-photo)" />
        <div aria-hidden className="grain pointer-events-none absolute inset-0" />
        <div className="container-page relative pt-16 md:pt-24 lg:pt-28">
          <p className="text-ui text-white/85">
            <Paren>Dari kelas ke kapal</Paren>
          </p>
          <h2 className="mt-4 max-w-[18ch] text-h1 text-white md:text-display" id="beranda-foto">
            Ilmu yang dipakai di laut, bukan hanya di kelas.
          </h2>
        </div>
      </div>
    </section>
  )
}

function Categories({ categories }: { categories: SiteCategory[] }) {
  return (
    <section aria-labelledby="beranda-kategori" className="bg-paper py-24 md:py-32 lg:py-40">
      <div className="container-page">
        <SectionHeading
          eyebrow="Bidang pelatihan"
          id="beranda-kategori"
          intro="Pilih bidang untuk melihat semua pelatihan dan jadwalnya."
          title="Enam bidang, satu standar"
        />
        <Reveal className="mt-14 lg:mt-20">
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {categories.map((category) => (
              <li key={category.slug}>
                <article className="group/cat flex h-full flex-col gap-3 overflow-hidden rounded-card border border-line-subtle bg-white transition-colors duration-(--motion-fast) ease-(--ease-standard) focus-within:border-blue-600 hover:border-blue-600">
                  {categoryPhotos[category.slug] ? (
                    <PhotoFrame
                      alt={categoryPhotos[category.slug]!.alt}
                      className="aspect-3/2 rounded-none"
                      sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                      src={categoryPhotos[category.slug]!.src}
                    />
                  ) : null}
                  <div className="flex flex-1 flex-col gap-3 p-5 pt-2 md:p-6 md:pt-3">
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
                  </div>
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

/*
 * Sticky heading (v1.4, project lead's choice): on wide screens the heading stays in place on the
 * left while the three reasons scroll past on the right and build one by one with the scroll
 * (animations.md §5.9.1). Each reason gets generous room so the list is clearly taller than the
 * heading; otherwise the heading would barely stick. Stacked, nothing sticky, on small screens.
 */
function Reasons() {
  return (
    <section aria-labelledby="beranda-alasan" className="container-page py-24 md:py-32 lg:py-40">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
        <div className="lg:sticky lg:top-[calc(var(--header-height)+3rem)] lg:col-span-5 lg:self-start">
          <SectionHeading
            eyebrow="Mengapa BKI Academy"
            id="beranda-alasan"
            title="Belajar dari badan klasifikasi"
          />
        </div>
        {/* Scroll-linked, one item at a time (animations.md §5.9.1): each step's line draws,
            its number lights up and its text rises as that step moves up the screen. */}
        <ol className="lg:col-span-6 lg:col-start-7">
          {reasons.map((reason, index) => (
            <li className="scroll-step relative pt-8 pb-14 md:pb-20" key={reason.title}>
              <span aria-hidden className="scroll-step-line" />
              <span
                aria-hidden
                className="scroll-step-number numeric block text-display text-blue-600"
              >
                0{index + 1}
              </span>
              <div className="scroll-step-text mt-6 md:mt-8">
                <h3 className="text-h3 text-navy-950">{reason.title}</h3>
                <p className="mt-3 max-w-[48ch] text-intro text-slate-600">{reason.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/*
 * "Dalam Kelas": cover photos from earlier runs of three courses (CMS "Foto pelatihan", Tampilkan di
 * Beranda). A portfolio, not an archive: course names only, no batches or dates; the full
 * documentation lives on Instagram. Real BKI photos only, with photo permission (B-05): with nothing
 * published the section is left out rather than filled with placeholders.
 * One big photo and two beside it on wide screens.
 */
function InClass({ items }: { items: SiteCoursePhotos[] }) {
  if (!items.length) return null
  const single = items.length === 1

  return (
    <section aria-labelledby="beranda-kelas" className="bg-paper py-24 md:py-32 lg:py-40">
      <div className="container-page">
        <SectionHeading
          eyebrow="Dalam kelas"
          id="beranda-kelas"
          intro="Foto dari kelas dan laboratorium pelatihan BKI Academy sebelumnya."
          title="Suasana pelatihan"
        />
        <Reveal className="mt-14 md:mt-20">
          {/* kelas-grid / kelas-drift: split-speed parallax on wide screens (animations.md §5.10.1):
              the two photos on the right move a little faster than the large one. */}
          <ul className="kelas-grid grid gap-x-6 gap-y-12 lg:grid-cols-12">
            {items.map((item, index) => {
              const lead = index === 0
              const stretch = lead && !single
              const photo = item.photos[0]!
              return (
                <li
                  className={
                    single
                      ? 'lg:col-span-8'
                      : lead
                        ? // Fills the height of the two items beside it: the photo takes the slack.
                          'lg:col-span-7 lg:row-span-2 lg:flex lg:flex-col'
                        : 'lg:col-span-5'
                  }
                  key={item.id}
                >
                  <Link
                    className={cn(
                      'group block',
                      stretch && 'lg:flex lg:flex-1 lg:flex-col',
                      !lead && 'kelas-drift',
                    )}
                    href={`/id/pelatihan/${item.courseSlug}`}
                  >
                    <PhotoFrame
                      alt={photo.alt}
                      className={cn(
                        'aspect-3/2',
                        stretch && 'lg:aspect-auto lg:min-h-80 lg:flex-1',
                      )}
                      position={photo.position}
                      sizes={
                        lead ? '(min-width: 1024px) 56vw, 100vw' : '(min-width: 1024px) 40vw, 100vw'
                      }
                      src={photo.src}
                    />
                    <div className="mt-5 border-t border-navy-950 pt-4">
                      <h3 className="text-ui font-semibold text-navy-950 underline-offset-4 group-hover:underline">
                        {item.courseTitle}
                      </h3>
                      {photo.caption ? (
                        <p className="mt-1 text-meta text-slate-600">{photo.caption}</p>
                      ) : null}
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

function Corporate() {
  const photo = stockPhotos.cta
  return (
    // Photo band (design.md §4D): a big ship photo dissolving into the deep blue. The veil is
    // solid deep blue under the text (white text >= 4.5:1), so only the far side shows the photo.
    <section
      aria-labelledby="beranda-inhouse"
      className="relative isolate overflow-hidden bg-[#0c1a45] text-white"
      data-surface="brand"
    >
      <div aria-hidden className="absolute inset-0 -z-10 lg:left-auto lg:w-[72%]">
        <div className="parallax absolute inset-x-0 -inset-y-[7%]">
          <Image
            alt=""
            className="object-cover object-[50%_70%] lg:object-[50%_40%]"
            fill
            sizes="(min-width: 1024px) 72vw, 100vw"
            src={photo.src}
          />
        </div>
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-(image:--gradient-atmos-veil-down) lg:bg-(image:--gradient-atmos-veil)"
      />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10" />
      <div className="container-page relative pt-28 pb-72 md:pt-36 md:pb-80 lg:py-44">
        <Reveal className="grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-6">
            <p className="text-ui text-white/85">
              <Paren>Untuk perusahaan</Paren>
            </p>
            <h2 className="mt-5 text-h1 md:text-display" id="beranda-inhouse">
              In-house untuk tim Anda
            </h2>
            <p className="mt-6 max-w-[48ch] text-intro text-white/90">
              Materi disesuaikan dengan armada, prosedur, dan jadwal perusahaan Anda. Di lokasi Anda
              atau secara online.
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
        </Reveal>
      </div>
    </section>
  )
}
