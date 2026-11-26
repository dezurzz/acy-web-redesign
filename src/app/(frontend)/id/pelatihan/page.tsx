import { X } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { CatalogueLoadMore } from '@/components/catalogue/CatalogueLoadMore'
import { TrackView } from '@/components/analytics/Analytics'
import { CatalogueProvider, ResultsRegion } from '@/components/catalogue/CatalogueProvider'
import { FilterDrawer } from '@/components/catalogue/FilterDrawer'
import { FilterForm } from '@/components/catalogue/FilterForm'
import { CourseCard } from '@/components/site/CourseCard'
import { Paren } from '@/components/site/Atmosphere'
import { PageHero } from '@/components/site/PageHero'
import { Button } from '@/components/ui/button'
import { FeedbackPanel } from '@/components/ui/feedback-panel'
import { TextLink } from '@/components/ui/text-link'
import {
  activeFilterChips,
  filterOptions,
  parseFilters,
  searchCatalogue,
  toQuery,
} from '@/lib/catalogue'
import { loadSiteData } from '@/lib/cms'
import { catalogueEvents } from '@/lib/analytics'

// Reads live CMS content on every request, so published changes show immediately.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Pelatihan',
  description: 'Semua pelatihan BKI Academy. Cari berdasarkan bidang, format, bulan, dan lokasi.',
}

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

/*
 * Pelatihan catalogue (PRD §6 Catalogue, wireframe /wireframes/pelatihan).
 * Stable courses, not dated batches. Filters and search live in the URL (AC-03).
 * Motion (design.md §7.1): low. Card border/title 160 ms, filter drawer 220/140 ms, no reveals.
 * Content comes from the CMS (lib/cms.ts); the filter rules are in lib/catalogue.ts.
 */
export default async function CataloguePage({ searchParams }: PageProps) {
  const filters = parseFilters(await searchParams)
  const data = await loadSiteData()
  const options = filterOptions(data)
  const { items, total } = searchCatalogue(filters, data)
  const chips = activeFilterChips(filters, data)
  const filterCount =
    filters.topik.length + filters.format.length + filters.lokasi.length + (filters.bulan ? 1 : 0)
  const filterKey = toQuery({ ...filters, tampil: 0 })

  return (
    <CatalogueProvider>
      <PageHero
        aside={
          <>
            <p className="text-meta text-white/80">
              <Paren>Katalog</Paren>
            </p>
            <p className="numeric text-h1 text-white">{data.courses.length}</p>
            <p className="text-ui text-white/85">pelatihan dalam {data.categories.length} bidang</p>
          </>
        }
        breadcrumbs={[{ href: '/id', label: 'Beranda' }, { label: 'Pelatihan' }]}
        intro="Semua pelatihan BKI Academy. Pilih pelatihan untuk melihat detail dan jadwal yang tersedia."
        label="Pelatihan"
        title="Temukan pelatihan Anda"
      />
      <div className="container-page pt-8 pb-24 lg:pt-12 lg:pb-40">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-6">
          {/* Wide screens: filters in a sidebar, applied as soon as a box is ticked. */}
          <aside aria-label="Filter pelatihan" className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-[calc(var(--header-height)+1.5rem)]">
              <FilterForm autoApply filters={filters} idPrefix="samping" options={options} />
            </div>
          </aside>

          <div className="lg:col-span-9">
            {/* Compact screens: search stays visible, filters open in a drawer. */}
            <div className="mb-6 flex flex-col gap-4 lg:hidden">
              <FilterForm filters={filters} idPrefix="atas" options={options} parts="search" />
              <FilterDrawer activeCount={filterCount} filters={filters} options={options} />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-navy-800 pb-4">
              <p aria-live="polite" className="numeric text-ui font-semibold text-navy-950">
                {total} pelatihan
              </p>
              {chips.length > 0 ? (
                <>
                  <ul aria-label="Filter aktif" className="flex flex-wrap gap-2">
                    {chips.map((chip) => (
                      <li key={chip.key}>
                        <Link
                          className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line-control bg-blue-50 py-1 pr-2 pl-3 text-meta font-medium text-navy-800 transition-colors duration-(--motion-fast) hover:border-blue-600"
                          href={`/id/pelatihan${chip.href}`}
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
                  <TextLink
                    className="text-meta lg:ml-auto"
                    href="/id/pelatihan"
                    replace
                    scroll={false}
                  >
                    Hapus semua filter
                  </TextLink>
                </>
              ) : null}
            </div>

            <ResultsRegion>
              {catalogueEvents('pelatihan', filters, total).map((event) => (
                <TrackView event={event} key={event.name} />
              ))}
              <h2 className="sr-only">Daftar pelatihan</h2>
              {items.length > 0 ? (
                <>
                  <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:gap-6">
                    {items.map((course, index) => (
                      <li data-result-index={index} key={course.slug}>
                        <CourseCard
                          category={course.categoryName}
                          duration={course.duration}
                          formats={course.formats.join(' · ')}
                          href={`/id/pelatihan/${course.slug}`}
                          nextSession={course.nextSession}
                          outcome={course.outcome}
                          title={course.title}
                        />
                      </li>
                    ))}
                  </ul>
                  <CatalogueLoadMore
                    filters={filters}
                    key={filterKey}
                    shownCount={items.length}
                    totalCount={total}
                  />
                </>
              ) : (
                <FeedbackPanel
                  action={
                    <>
                      <Button asChild variant="secondary">
                        <Link href="/id/pelatihan" replace scroll={false}>
                          Hapus semua filter
                        </Link>
                      </Button>
                      <TextLink className="self-center" href="/id/hubungi-kami">
                        Tanyakan kepada kami
                      </TextLink>
                    </>
                  }
                  className="mt-6"
                  title="Belum ada pelatihan yang sesuai"
                  tone="info"
                >
                  Belum ada pelatihan yang sesuai dengan filter Anda. Ubah filter atau lihat semua
                  pelatihan.
                </FeedbackPanel>
              )}
            </ResultsRegion>
          </div>
        </div>
      </div>
    </CatalogueProvider>
  )
}
