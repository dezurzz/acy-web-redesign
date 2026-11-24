import { Clock, Monitor, Tag } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type React from 'react'

import { MobileCtaBar } from '@/components/course/MobileCtaBar'
import { SESSION_PANEL_ID, SessionPanel } from '@/components/course/SessionPanel'
import { CourseCard } from '@/components/site/CourseCard'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Button, ButtonArrow } from '@/components/ui/button'
import { TextLink } from '@/components/ui/text-link'
import { toCatalogueItem } from '@/lib/catalogue'
import { loadSiteData } from '@/lib/cms'
import { getCourse } from '@/lib/course'

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
  const site = await loadSiteData()
  const data = getCourse((await params).slug, site)
  if (!data) notFound()

  const { category, course, detail, sessions } = data
  const nextSession = sessions[0]?.dates ?? null
  const related = site.courses
    .filter((c) => detail.related.includes(c.slug))
    .map((c) => toCatalogueItem(c, site))

  return (
    <>
      {/* pb-28 reserves room for the fixed mobile CTA bar. */}
      <div className="container-page pt-8 pb-28 lg:pb-24">
        <Breadcrumbs
          items={[
            { href: '/id', label: 'Beranda' },
            { href: '/id/pelatihan', label: 'Pelatihan' },
            { href: `/id/pelatihan?topik=${category.slug}`, label: category.name },
            { label: course.title },
          ]}
        />

        <header className="mt-6 max-w-4xl">
          <p className="eyebrow text-blue-600">{category.name}</p>
          <h1 className="mt-3 text-h1 text-navy-950">{course.title}</h1>
          {course.acronym ? <p className="mt-3 text-ui text-slate-600">{course.acronym}</p> : null}
          <p className="mt-5 max-w-[60ch] text-intro text-navy-800">{course.outcome}</p>

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
            <Fact
              icon={<Clock aria-hidden className="size-5" />}
              label="Durasi"
              value={course.duration}
            />
            <Fact
              icon={<Monitor aria-hidden className="size-5" />}
              label="Format"
              value={course.formats.join(' · ')}
            />
            <Fact
              icon={<Tag aria-hidden className="size-5" />}
              label="Jadwal berikutnya"
              value={nextSession ?? 'Belum tersedia'}
            />
          </dl>

          <div className="mt-8 hidden lg:block">
            <Button asChild>
              <Link href={`#${SESSION_PANEL_ID}`}>
                {nextSession ? 'Pilih Jadwal' : 'Tanyakan Jadwal'}
                <ButtonArrow />
              </Link>
            </Button>
          </div>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-6">
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
              <SessionPanel sessions={sessions} />
            </div>
          </aside>
        </div>

        {related.length > 0 ? (
          <section
            aria-labelledby="pelatihan-terkait"
            className="mt-16 border-t border-navy-800 pt-10"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="text-h2 text-navy-950" id="pelatihan-terkait">
                Pelatihan terkait
              </h2>
              <TextLink arrow href={`/id/pelatihan?topik=${category.slug}`}>
                Semua pelatihan {category.name}
              </TextLink>
            </div>
            <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
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

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-blue-600">{icon}</span>
      <div>
        <dt className="text-meta text-slate-600">{label}</dt>
        <dd className="numeric text-ui font-semibold text-navy-950">{value}</dd>
      </div>
    </div>
  )
}

function Block({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section className="border-t border-line-subtle py-8 first:border-t-0 first:pt-0">
      <h2 className="text-h3 text-navy-950">{title}</h2>
      <div className="mt-4 max-w-[65ch] text-body text-navy-800">{children}</div>
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
