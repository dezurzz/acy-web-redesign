/*
 * Analytics events (PRD §9, §8.6). Provider-neutral: the analytics provider is not chosen yet, so
 * events go onto a queue (window.bkiAnalytics) and a browser event ('bki:analytics'). A provider
 * adapter added later reads both; nothing else in the site has to change.
 *
 * Privacy by construction:
 *  - Only these ten events exist, each with fixed, non-personal fields (course slugs, session
 *    codes, filter values, counts). No free text, no form contents, no contact details.
 *  - course_search sends a result count and a has-results flag, never the search term.
 *  - Every string value is checked at runtime: anything that looks like an email, a phone number or
 *    free text is dropped (sanitizeProps), in case a future change passes the wrong thing.
 *  - corporate_enquiry_success is sent only after the server saved the request.
 *  - Each event carries `env`, so QA and staging traffic stay apart from production.
 */

export type AnalyticsEvent =
  | {
      name: 'course_search'
      resultCount: number
      hasResults: boolean
      page: 'pelatihan' | 'jadwal'
    }
  | {
      name: 'filter_apply'
      page: 'pelatihan' | 'jadwal'
      topik?: string
      format?: string
      bulan?: string
      lokasi?: string
      resultCount: number
    }
  | { name: 'course_view'; course: string }
  | { name: 'session_select'; course: string; session: string }
  | { name: 'registration_start'; session: string; course: string }
  | { name: 'whatsapp_registration_click'; session: string }
  | { name: 'corporate_enquiry_success' }
  | { name: 'portal_link_click'; destination: string }
  | { name: 'brochure_download'; course: string }
  | { name: 'contact_click'; channel: 'whatsapp' | 'phone' | 'email'; location: string }

export type AnalyticsEventName = AnalyticsEvent['name']

export const ANALYTICS_EVENT_NAMES: readonly AnalyticsEventName[] = [
  'course_search',
  'filter_apply',
  'course_view',
  'session_select',
  'registration_start',
  'whatsapp_registration_click',
  'corporate_enquiry_success',
  'portal_link_click',
  'brochure_download',
  'contact_click',
]

/** Which events may carry which fields; anything else is dropped (click events read data-* attributes). */
const ALLOWED_FIELDS: Record<AnalyticsEventName, readonly string[]> = {
  course_search: ['resultCount', 'hasResults', 'page'],
  filter_apply: ['page', 'topik', 'format', 'bulan', 'lokasi', 'resultCount'],
  course_view: ['course'],
  session_select: ['course', 'session'],
  registration_start: ['session', 'course'],
  whatsapp_registration_click: ['session'],
  corporate_enquiry_success: [],
  portal_link_click: ['destination'],
  brochure_download: ['course'],
  contact_click: ['channel', 'location'],
}

// Slugs, codes and filter lists only: lowercase letters, digits, - _ . , and at most 120 characters.
const SAFE_TEXT = /^[a-zA-Z0-9][a-zA-Z0-9_.,-]{0,119}$/
const LOOKS_LIKE_EMAIL = /@/
const LOOKS_LIKE_PHONE = /\d{7,}/

export type AnalyticsProps = Record<string, string | number | boolean>

/** Keeps only allowed, non-personal fields. Exported for tests. */
export function sanitizeProps(
  name: AnalyticsEventName,
  props: Record<string, unknown>,
): AnalyticsProps {
  const allowed = ALLOWED_FIELDS[name]
  const clean: AnalyticsProps = {}
  for (const [key, value] of Object.entries(props)) {
    if (key === 'name' || !allowed.includes(key)) continue
    if (typeof value === 'number' && Number.isFinite(value)) clean[key] = value
    else if (typeof value === 'boolean') clean[key] = value
    else if (
      typeof value === 'string' &&
      SAFE_TEXT.test(value) &&
      !LOOKS_LIKE_EMAIL.test(value) &&
      !LOOKS_LIKE_PHONE.test(value.replace(/[-_.,]/g, ''))
    ) {
      clean[key] = value
    }
  }
  return clean
}

export const isAnalyticsEventName = (value: string): value is AnalyticsEventName =>
  (ANALYTICS_EVENT_NAMES as readonly string[]).includes(value)

export type QueuedAnalyticsEvent = {
  name: AnalyticsEventName
  props: AnalyticsProps
  env: string
  at: string
}

declare global {
  interface Window {
    bkiAnalytics?: QueuedAnalyticsEvent[]
  }
}

/** Separates production from staging/QA/local traffic (PRD §9). Set per environment. */
const ANALYTICS_ENV = process.env.NEXT_PUBLIC_ANALYTICS_ENV ?? 'development'

/** Records one event. Browser only; does nothing on the server. */
export function track(event: AnalyticsEvent) {
  trackRaw(event.name, event)
}

/** Same as track(), for untyped sources such as data-* attributes. Unknown names are ignored. */
export function trackRaw(name: string, props: Record<string, unknown> = {}) {
  if (typeof window === 'undefined' || !isAnalyticsEventName(name)) return
  const queued: QueuedAnalyticsEvent = {
    name,
    props: sanitizeProps(name, props),
    env: ANALYTICS_ENV,
    at: new Date().toISOString(),
  }
  window.bkiAnalytics ??= []
  window.bkiAnalytics.push(queued)
  window.dispatchEvent(new CustomEvent('bki:analytics', { detail: queued }))
  if (ANALYTICS_ENV === 'development') console.debug('[analytics]', queued.name, queued.props)
}

/**
 * Search and filter events for a results page, built on the server from the current filters and
 * the number of results (PRD §9): course_search carries the count and a has-results flag, never
 * the search term; filter_apply carries the selected filter values.
 */
export function catalogueEvents(
  page: 'pelatihan' | 'jadwal',
  filters: { q: string; topik: string[]; format: string[]; bulan: string; lokasi: string[] },
  resultCount: number,
): AnalyticsEvent[] {
  const events: AnalyticsEvent[] = []
  if (filters.q) {
    events.push({ name: 'course_search', page, resultCount, hasResults: resultCount > 0 })
  }
  const join = (values: string[]) => (values.length ? values.join(',') : undefined)
  if (filters.topik.length || filters.format.length || filters.lokasi.length || filters.bulan) {
    events.push({
      name: 'filter_apply',
      page,
      topik: join(filters.topik),
      format: join(filters.format),
      lokasi: join(filters.lokasi),
      bulan: filters.bulan || undefined,
      resultCount,
    })
  }
  return events
}
