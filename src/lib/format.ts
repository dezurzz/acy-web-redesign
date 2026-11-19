// Indonesian formatting for dates and fees (design.md §10). All session dates are shown in WIB.
const TIME_ZONE = 'Asia/Jakarta'

const dayMonthYear = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: TIME_ZONE,
})

function parts(date: Date) {
  const p = Object.fromEntries(dayMonthYear.formatToParts(date).map((x) => [x.type, x.value]))
  return { day: p.day!, month: p.month!, year: p.year! }
}

/** "21–23 Oktober 2026", "30 Oktober – 2 November 2026", or "21 Oktober 2026" for a one-day session. */
export function formatDateRange(start: Date | string, end?: Date | string | null): string {
  const s = parts(new Date(start))
  if (!end) return `${s.day} ${s.month} ${s.year}`
  const e = parts(new Date(end))

  if (s.year !== e.year) return `${s.day} ${s.month} ${s.year} – ${e.day} ${e.month} ${e.year}`
  if (s.month !== e.month) return `${s.day} ${s.month} – ${e.day} ${e.month} ${e.year}`
  if (s.day !== e.day) return `${s.day}–${e.day} ${s.month} ${s.year}`
  return `${s.day} ${s.month} ${s.year}`
}

const shortMonth = new Intl.DateTimeFormat('id-ID', { month: 'short', timeZone: TIME_ZONE })

/**
 * Two-line date block for session rows (visual only; pair it with formatDateRange for screen readers).
 * Same month: { top: "21–23", bottom: "Okt 2026" }. Across months: { top: "30–2", bottom: "Okt–Nov 2026" }.
 * Across years the bottom line carries both years: "Des 2026–Jan 2027".
 */
export function dateBlock(start: Date | string, end?: Date | string | null) {
  const startDate = new Date(start)
  const endDate = end ? new Date(end) : startDate
  const s = parts(startDate)
  const e = parts(endDate)
  const sm = shortMonth.format(startDate).replace('.', '')
  const em = shortMonth.format(endDate).replace('.', '')

  if (s.month === e.month && s.year === e.year) {
    return { top: s.day === e.day ? s.day : `${s.day}–${e.day}`, bottom: `${sm} ${s.year}` }
  }
  const bottom = s.year === e.year ? `${sm}–${em} ${e.year}` : `${sm} ${s.year}–${em} ${e.year}`
  return { top: `${s.day}–${e.day}`, bottom }
}

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

/** "Rp9.500.000". Never call this for an unconfirmed fee; show the contact wording instead (decision D-02). */
export function formatRupiah(amount: number): string {
  return rupiah.format(amount).replace(/\s/g, '')
}

export const FEE_ON_REQUEST = 'Hubungi kami untuk biaya'
