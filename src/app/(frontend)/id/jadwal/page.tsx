import { X } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { CatalogueLoadMore } from '@/components/catalogue/CatalogueLoadMore'
import { TrackView } from '@/components/analytics/Analytics'
import { CatalogueProvider, ResultsRegion } from '@/components/catalogue/CatalogueProvider'
import { ScheduleFilterBar } from '@/components/catalogue/ScheduleFilterBar'
import { SessionRow } from '@/components/site/SessionRow'
import { Paren } from '@/components/site/Atmosphere'
import { PageHero } from '@/components/site/PageHero'
import { Button } from '@/components/ui/button'
import { FeedbackPanel } from '@/components/ui/feedback-panel'
import { TextLink } from '@/components/ui/text-link'
import { activeFilterChips, filterOptions, parseFilters, toQuery } from '@/lib/catalogue'
import { loadSiteData } from '@/lib/cms'
import { searchSchedule } from '@/lib/schedule'
import { catalogueEvents } from '@/lib/analytics'

// Reads live CMS content on every request, so published changes show immediately.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Jadwal',
  description: 'Jadwal pelatihan BKI Academy yang akan datang, diurutkan dari yang paling dekat.',
}

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

/*
 * Jadwal (PRD §6 Catalogue and schedule, wireframe /wireframes/jadwal).
 * Future published sessions only, soonest first in WIB, grouped by month. Stacked rows on
 * small screens, never a calendar grid that hides long titles.
 * Motion (design.md §7.1): minimal. Rows never move; dates, fees and status never animate.
 * Content comes from the CMS (lib/cms.ts); the filter rules are in lib/schedule.ts.
 */
export default async function SchedulePage({ searchParams }: PageProps) {
  const filters = parseFilters(await searchParams)
  const data = await loadSiteData()
  const options = filterOptions(data)
  const { groups, shown, total } = searchSchedule(filters, data)
  const chips = activeFilterChips(filters, data)
  const filterKey = toQuery({ ...filters, tampil: 0 })
  let index = 0

  return (
    <CatalogueProvider>
      <PageHero
        aside={
          <>
            <p className="text-meta text-white/80">
              <Paren>Waktu</Paren>
            </p>
            <p className="text-h3 text-white">Semua jadwal dalam WIB</p>
            <p className="text-ui text-white/85">Diurutkan dari yang paling dekat</p>
          </>
        }
        breadcrumbs={[{ href: '/id', label: 'Beranda' }, { label: 'Jadwal' }]}
        intro="Sesi pelatihan yang akan datang. Pilih jadwal, lalu ajukan pendaftaran lewat WhatsApp."
        label="Jadwal"
        title="Jadwal pelatihan"
      />
      <div className="container-page pt-8 pb-24 lg:pt-12 lg:pb-40">
        <div>
          <ScheduleFilterBar filters={filters} options={options} />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
          <p aria-live="polite" className="numeric text-ui font-semibold text-navy-950">
            {total} jadwal
          </p>
          {chips.length > 0 ? (
            <>
              <ul aria-label="Filter aktif" className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <li key={chip.key}>
                    <Link
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line-control bg-blue-50 py-1 pr-2 pl-3 text-meta font-medium text-navy-800 transition-colors duration-(--motion-fast) hover:border-blue-600"
                      href={`/id/jadwal${chip.href}`}
                      replace
                      scroll={false}
                    >
                      {chip.label}
                      <X aria-hidden className="size-4" />
                      <span className="sr-only">, hapus filter</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <TextLink className="text-meta md:ml-auto" href="/id/jadwal" replace scroll={false}>
                Hapus semua filter
              </TextLink>
            </>
          ) : null}
        </div>

        <ResultsRegion>
          {catalogueEvents('jadwal', filters, total).map((event) => (
            <TrackView event={event} key={event.name} />
          ))}
          {groups.length > 0 ? (
            <>
              {groups.map((group) => (
                <section aria-labelledby={`bulan-${group.key}`} className="mt-10" key={group.key}>
                  <h2
                    className="border-b-2 border-navy-950 pb-3 text-h3 text-navy-950"
                    id={`bulan-${group.key}`}
                  >
                    {group.label}
                    <span className="numeric ml-3 text-meta font-normal text-slate-600">
                      {group.sessions.length} jadwal
                    </span>
                  </h2>
                  <ul>
                    {group.sessions.map((session) => (
                      <li data-result-index={index++} key={session.id}>
                        <SessionRow
                          courseHref={`/id/pelatihan/${session.courseSlug}`}
                          courseTitle={session.courseTitle}
                          endDate={session.endDate}
                          fee={session.fee}
                          format={session.format}
                          postponementMessage={session.postponementMessage}
                          registerHref={`/id/pendaftaran?session=${session.id}`}
                          startDate={session.startDate}
                          status={session.status}
                          taxWording={session.taxWording}
                          time={session.time}
                          venue={session.venue}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
              <CatalogueLoadMore
                filters={filters}
                key={filterKey}
                noun="jadwal"
                shownCount={shown}
                totalCount={total}
              />
            </>
          ) : (
            <FeedbackPanel
              action={
                <>
                  <Button asChild variant="secondary">
                    <Link href="/id/jadwal" replace scroll={false}>
                      Hapus semua filter
                    </Link>
                  </Button>
                  <TextLink className="self-center" href="/id/hubungi-kami">
                    Tanyakan Jadwal
                  </TextLink>
                </>
              }
              className="mt-8"
              title="Belum ada jadwal yang sesuai"
              tone="info"
            >
              Belum ada jadwal yang sesuai dengan filter Anda. Ubah filter, atau tanyakan jadwal
              berikutnya kepada kami.
            </FeedbackPanel>
          )}
        </ResultsRegion>

        <p className="mt-10 max-w-[65ch] text-meta text-slate-600">
          Biaya dan keterangan pajak mengikuti ketentuan yang berlaku untuk setiap jadwal.
          Pendaftaran adalah permintaan; admin mengonfirmasi kursi lewat WhatsApp.
        </p>
      </div>
    </CatalogueProvider>
  )
}
