/*
 * Launch redirect map: old Odoo URLs → new pages (PRD §4 P0 "migration redirects", §9).
 * Source of truth: the "URL Inventory" tab of the Phase 0 sheet (rows marked "Redirect").
 * Rows marked "Review" or "Retire" have no rule here on purpose; they fall through to the
 * site's not-found page until someone decides (listed in REVIEW_PATHS for the check script).
 *
 * Every old path also existed with an /id prefix (the Indonesian version), so each rule is added
 * twice. Course pages are matched by the Odoo product number at the end (…-386), so English and
 * Indonesian slugs, and the category-prefixed form, all land on the same new page.
 *
 * `final: false` marks a stand-in target (the real page launches later, D-11): it stays a
 * temporary redirect even after launch. Everything else becomes permanent (308) when
 * REDIRECTS_PERMANENT=true is set at launch (L-01); until then all redirects are temporary,
 * so nothing gets cached in browsers while the map can still change.
 */
type Rule = { source: string; destination: string; final?: boolean }

/** Odoo category number → new catalogue topic (B-04 slugs). */
const CATEGORY_TOPICS: Record<string, string> = {
  '199': 'safety',
  '200': 'security',
  '201': 'survey',
  '202': 'crewing',
  '203': 'environment',
  '204': 'ship-design',
}

/**
 * Odoo product number → new course slug. Uses the slug the new CMS has where the course already
 * exists (three differ from the inventory's proposal); the rest follow the inventory and must be
 * created with exactly these slugs, or updated here (`pnpm redirects:check` lists any missing).
 */
export const COURSE_SLUGS: Record<string, string> = {
  '372': 'internal-auditor-ism-code',
  '373': 'dpa-ism-code',
  '374': 'risk-assessment-ism-code',
  '375': 'accident-investigation', // inventory proposed marine-accident-and-investigation
  '377': 'jetty-and-loading-master',
  '378': 'internal-auditor-isps-code',
  '379': 'cso-isps-code',
  '380': 'pfso-isps-code',
  '381': 'marine-surveyor',
  '382': 'marine-superintendent',
  '384': 'container-surveyor',
  '385': 'maritime-labour-convention',
  '386': 'ballast-water-management',
  '387': 'ship-intact-stability', // inventory proposed the full 60-character name
  '388': 'ship-design-engineering-review-workshop',
  '395': 'welding-inspector',
  '408': 'maritime-cyber-security',
  '464': 'new-building-supervision',
  '480': 'imo-model-course-3-24', // inventory suggested a shorter slug
  '482': 'imo-model-course-3-25',
  '530': 'ship-welding-inspector',
}

const pages: Rule[] = [
  { source: '/about', destination: '/id/tentang-kami' },
  { source: '/contactus', destination: '/id/hubungi-kami' },
  { source: '/schedule', destination: '/id/jadwal' },
  { source: '/shop', destination: '/id/pelatihan' },
  { source: '/shop/page/:page(\\d+)', destination: '/id/pelatihan' },
  { source: '/privacy-policy', destination: '/id/kebijakan-privasi' },
  // Empty Odoo customer-reference page and its ~60 filter URLs.
  { source: '/customers', destination: '/id/tentang-kami' },
  { source: '/customers/:path*', destination: '/id/tentang-kami' },
  // A page Odoo created from a mistyped WhatsApp link.
  { source: '/https/api-whatsapp-com/send-phone-6285111201132', destination: '/id/hubungi-kami' },
  // Stand-ins until Pengajar and Insight launch (D-11): then point to /id/pengajar and /id/insight.
  { source: '/trainer', destination: '/id/tentang-kami', final: false },
  { source: '/blog', destination: '/id', final: false },
  { source: '/blog/:path*', destination: '/id', final: false },
]

const categories: Rule[] = Object.entries(CATEGORY_TOPICS).flatMap(([id, topic]) => [
  { source: `/shop/category/:name([a-z0-9-]+)-${id}`, destination: `/id/pelatihan?topik=${topic}` },
  {
    source: `/shop/category/:name([a-z0-9-]+)-${id}/page/:page(\\d+)`,
    destination: `/id/pelatihan?topik=${topic}`,
  },
])

const courses: Rule[] = Object.entries(COURSE_SLUGS).flatMap(([id, slug]) => [
  { source: `/shop/:name([a-z0-9-]+)-${id}`, destination: `/id/pelatihan/${slug}` },
  // Same course reached through a category: /shop/<category>-<n>/<course>-<id>
  {
    source: `/shop/:category([a-z0-9-]+-\\d+)/:name([a-z0-9-]+)-${id}`,
    destination: `/id/pelatihan/${slug}`,
  },
])

/** Inventory rows still marked "Review": no redirect until someone decides. */
export const REVIEW_PATHS = [
  '/shop/category/lainnya-195 (certificate reissue category)',
  '/shop/penerbitan-kembali-sertifikat-469 (certificate reissue service)',
  '/cookie-policy',
  '/disclaimer',
  '/terms-of-use',
  '/register-account-access-portal (+ -company) (D-07)',
  '/slides, /slides/all (Odoo eLearning, D-07)',
  '/profile/ranks_badges, /profile/users',
  '/forum and /forum/help-1/*',
  '/document/share/1581/… and /documents/content/… (Marketing.zip)',
  '/my/home (Odoo portal login: keep reachable, D-07)',
]

export function launchRedirects(permanentAtLaunch = process.env.REDIRECTS_PERMANENT === 'true') {
  const rules = [...pages, ...categories, ...courses].flatMap((rule) => [
    rule,
    { ...rule, source: `/id${rule.source}` },
  ])
  return [
    // Indonesian-first (D-08): the root opens the Indonesian homepage.
    { source: '/', destination: '/id', permanent: permanentAtLaunch },
    ...rules.map(({ source, destination, final = true }) => ({
      source,
      destination,
      permanent: permanentAtLaunch && final,
    })),
  ]
}
