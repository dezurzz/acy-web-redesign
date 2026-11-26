import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type React from 'react'

import { TrackView } from '@/components/analytics/Analytics'
import { MobileCtaBar } from '@/components/course/MobileCtaBar'
import { SESSION_PANEL_ID, SessionPanel } from '@/components/course/SessionPanel'
import { Paren } from '@/components/site/Atmosphere'
import { CourseCard } from '@/components/site/CourseCard'
import { PhotoFrame } from '@/components/site/PhotoFrame'
import { PageHero } from '@/components/site/PageHero'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button, ButtonArrow } from '@/components/ui/button'
import { TextLink } from '@/components/ui/text-link'
import { toCatalogueItem } from '@/lib/catalogue'
import { loadCoursePhotos, loadSiteData } from '@/lib/cms'
import { getCourse } from '@/lib/course'
import { cn } from '@/lib/utils'

type PageProps = { params: Promise<{ slug: string }> }

// Reads live CMS content on every request, so session status and fees are always current (AC-02).
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = getCourse((await params).slug, await loadSiteData())
  if (!data) return { title: 'Pelatihan tidak ditemukan' }
  return { title: data.course.title, description: data.course.outcome }
}

/*
 * Course detail (PRD §6 Course detail, wireframe /wireframes/detail-pelatihan).
 * Above the fold: title, expanded acronym, category, outcome, duration, formats, "Pilih Jadwal".
 * Layout: content 8 columns, session panel 4 columns, sticky on wide screens (design.md §6, §8).
 * Motion (design.md §7.1): low. Session option 160 ms, FAQ 220 ms, no scroll reveals.
 * Certificate text stays short: certificate tracking lives in BKI's separate system (D-04).
 */
export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params
  const [site, coursePhotos] = await Promise.all([loadSiteData(), loadCoursePhotos(slug)])
  const data = getCourse(slug, site)
  if (!data) notFound()

  const { category, course, detail, sessions } = data
  const nextSession = sessions[0]?.dates ?? null
  const related = site.courses
    .filter((c) => detail.related.includes(c.slug))
    .map((c) => toCatalogueItem(c, site))

  return (
    <>
      {/* Poster-style hero, like BKI Academy's course posters: name large, full name in
          parentheses, next date and place pinned on the right (design.md §4D, v1.3). */}
      <TrackView event={{ name: 'course_view', course: course.slug }} />
      <PageHero
        actions={
          <Button asChild className="hidden lg:inline-flex" variant="secondary">
            <Link href={`#${SESSION_PANEL_ID}`}>
              {nextSession ? 'Pilih Jadwal' : 'Tanyakan Jadwal'}
              <ButtonArrow />
            </Link>
          </Button>
        }
        aside={
          <>
            <p className="text-meta text-white/80">
              <Paren>{nextSession ? 'Jadwal berikutnya' : 'Jadwal'}</Paren>
            </p>
            <p className="numeric text-h3 text-white">{nextSession ?? 'Belum tersedia'}</p>
            {sessions[0] ? (
              <p className="text-ui text-white/85">
                {sessions[0].format} · {sessions[0].venue}
              </p>
            ) : null}
            <dl className="mt-2 grid grid-cols-2 gap-4 border-t border-white/25 pt-4 text-meta">
              <div>
                <dt className="text-white/70">Durasi</dt>
                <dd className="mt-1 text-ui text-white">{course.duration || '—'}</dd>
              </div>
              <div>
                <dt className="text-white/70">Format</dt>
                <dd className="mt-1 text-ui text-white">{course.formats.join(' · ')}</dd>
              </div>
            </dl>
          </>
        }
        breadcrumbs={[
          { href: '/id', label: 'Beranda' },
          { href: '/id/pelatihan', label: 'Pelatihan' },
          { href: `/id/pelatihan?topik=${category.slug}`, label: category.name },
          { label: course.title },
        ]}
        intro={
          <>
            {course.acronym ? (
              <p className="text-ui text-white/85">
                <Paren>{course.acronym}</Paren>
              </p>
            ) : null}
            <p className={course.acronym ? 'mt-4' : undefined}>{course.outcome}</p>
          </>
        }
        label={category.name}
        title={course.title}
      />

      {/* pb-28 reserves room for the fixed mobile CTA bar. */}
      <div className="container-page pt-4 pb-28 lg:pb-24">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-8 lg:pr-10">
            {/* Sections without CMS content are left out rather than shown empty. */}
            {detail.audience.length > 0 ? (
              <Block title="Untuk siapa">
                <List items={detail.audience} />
              </Block>
            ) : null}
            {detail.outcomes.length > 0 ? (
              <Block title="Yang akan Anda kuasai">
                <List items={detail.outcomes} />
              </Block>
            ) : null}
            {detail.syllabus.length > 0 ? (
              <Block title="Silabus">
                <Accordion type="multiple">
                  {detail.syllabus.map((day) => (
                    <AccordionItem key={day.title} value={day.title}>
                      <AccordionTrigger>{day.title}</AccordionTrigger>
                      <AccordionContent>
                        <List items={day.items} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Block>
            ) : null}
            <Block title="Prasyarat">
              <p>{detail.prerequisites}</p>
            </Block>
            {detail.method ? (
              <Block title="Metode pembelajaran">
                <p>{detail.method}</p>
              </Block>
            ) : null}
            {/* Chosen photos from earlier runs of this course (CMS "Foto pelatihan"), only when
                published with permission (B-05). Not an archive: the full documentation is on Instagram. */}
            {coursePhotos ? (
              <Block title="Suasana kelas" wide>
                <ul className="grid grid-cols-2 gap-3 md:gap-4">
                  {coursePhotos.photos.map((photo, index) => (
                    <li
                      // The cover spans both columns, and so does a last photo left alone in its row.
                      className={
                        index === 0 || (index === coursePhotos.photos.length - 1 && index % 2 === 1)
                          ? 'col-span-2'
                          : undefined
                      }
                      key={photo.src}
                    >
                      <figure>
                        <PhotoFrame
                          alt={photo.alt}
                          className="aspect-3/2"
                          position={photo.position}
                          sizes={
                            index === 0
                              ? '(min-width: 1024px) 60vw, 100vw'
                              : '(min-width: 1024px) 30vw, 50vw'
                          }
                          src={photo.src}
                        />
                        {photo.caption ? (
                          <figcaption className="mt-2 text-meta text-slate-600">
                            {photo.caption}
                          </figcaption>
                        ) : null}
                      </figure>
                    </li>
                  ))}
                </ul>
              </Block>
            ) : null}
            {detail.certificate ? (
              <Block title="Sertifikat">
                <p>{detail.certificate}</p>
              </Block>
            ) : null}
            {detail.faqs.length > 0 ? (
              <Block title="Pertanyaan umum">
                <Accordion type="multiple">
                  {detail.faqs.map((faq) => (
                    <AccordionItem key={faq.question} value={faq.question}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Block>
            ) : null}
          </div>

          <aside aria-label="Jadwal dan pendaftaran" className="lg:col-span-4">
            {/* Sticky below the header (+24 px); scrolls inside itself if it is taller than the screen. */}
            <div className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:max-h-[calc(100dvh-var(--header-height)-3rem)] lg:overflow-y-auto">
              <SessionPanel course={course.slug} sessions={sessions} />
            </div>
          </aside>
        </div>

        {related.length > 0 ? (
          <section
            aria-labelledby="pelatihan-terkait"
            className="mt-24 lg:mt-32 border-t border-navy-800 pt-10"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-h2 text-navy-950" id="pelatihan-terkait">
                Pelatihan terkait
              </h2>
              <TextLink arrow href={`/id/pelatihan?topik=${category.slug}`}>
                Semua pelatihan {category.name}
              </TextLink>
            </div>
            <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {related.map((item) => (
                <li key={item.slug}>
                  <CourseCard
                    category={item.categoryName}
                    duration={item.duration}
                    formats={item.formats.join(' · ')}
                    href={`/id/pelatihan/${item.slug}`}
                    nextSession={item.nextSession}
                    outcome={item.outcome}
                    title={item.title}
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <MobileCtaBar nextSession={nextSession} />
    </>
  )
}

function Block({
  children,
  title,
  wide = false,
}: {
  children: React.ReactNode
  title: string
  /** Use the full column width (photos) instead of the 65-character reading measure. */
  wide?: boolean
}) {
  return (
    <section className="border-t border-line-subtle py-8 first:border-t-0 first:pt-0">
      <h2 className="text-h3 text-navy-950">{title}</h2>
      <div className={cn('mt-4 text-body text-navy-800', !wide && 'max-w-[65ch]')}>{children}</div>
    </section>
  )
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-blue-600">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}
