/*
 * Site address and launch switches (PRD §7: drafts are not publicly indexable).
 * Set at launch (L-01) in the host's environment, not in code:
 *   NEXT_PUBLIC_SITE_URL  public address, e.g. https://<launch-domain> (decided with hosting, T-01) (sitemap, canonical URLs)
 *   SITE_INDEXABLE=true   lets search engines index the site (robots.txt and robots meta)
 * Until then every environment, staging included, asks search engines to stay away.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
)

export const SITE_INDEXABLE = process.env.SITE_INDEXABLE === 'true'

/** Public pages for the sitemap. Excludes pages that need a session (pendaftaran) and internal ones. */
export const SITEMAP_PAGES = [
  '/id',
  '/id/pelatihan',
  '/id/jadwal',
  '/id/in-house',
  '/id/tentang-kami',
  '/id/hubungi-kami',
  '/id/portal-peserta',
  '/id/mice',
  '/id/ketentuan-pendaftaran',
  '/id/kebijakan-privasi',
] as const
