/*
 * Catalogue URL state (PRD §6, AC-03). No data imports, so client components can use it
 * without pulling sample data into the browser bundle. Rules are documented in catalogue.ts.
 */
export const PAGE_SIZE = 8

export type Option = { value: string; label: string }

export const formatFilterOptions: Option[] = [
  { value: 'tatap-muka', label: 'Tatap muka' },
  { value: 'live-online', label: 'Live online' },
  { value: 'belajar-mandiri', label: 'Belajar mandiri' },
]

export type CatalogueFilters = {
  q: string
  topik: string[]
  format: string[]
  bulan: string
  lokasi: string[]
  tampil: number
}

type RawParams = Record<string, string | string[] | undefined>

const list = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value : value ? [value] : []).filter(Boolean)

const first = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? ''

export function parseFilters(params: RawParams): CatalogueFilters {
  const tampil = Number.parseInt(first(params.tampil), 10)
  return {
    q: first(params.q).trim().slice(0, 100),
    topik: list(params.topik),
    format: list(params.format),
    bulan: /^\d{4}-\d{2}$/.test(first(params.bulan)) ? first(params.bulan) : '',
    lokasi: list(params.lokasi),
    tampil: Number.isFinite(tampil) && tampil > PAGE_SIZE ? Math.min(tampil, 200) : PAGE_SIZE,
  }
}

/** Builds a query string; drops empty values and the default page size. */
export function toQuery(filters: Partial<CatalogueFilters>): string {
  const params = new URLSearchParams()
  if (filters.q) params.set('q', filters.q)
  filters.topik?.forEach((v) => params.append('topik', v))
  filters.format?.forEach((v) => params.append('format', v))
  if (filters.bulan) params.set('bulan', filters.bulan)
  filters.lokasi?.forEach((v) => params.append('lokasi', v))
  if (filters.tampil && filters.tampil > PAGE_SIZE) params.set('tampil', String(filters.tampil))
  const query = params.toString()
  return query ? `?${query}` : ''
}

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** Reads the filter form. Paging resets to the first page whenever filters change. */
export function queryFromForm(form: HTMLFormElement): string {
  const data = new FormData(form)
  const values = (name: string) => data.getAll(name).map(String).filter(Boolean)
  return toQuery({
    q: String(data.get('q') ?? '').trim(),
    topik: values('topik'),
    format: values('format'),
    bulan: String(data.get('bulan') ?? ''),
    lokasi: values('lokasi'),
  })
}
