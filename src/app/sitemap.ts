import type { MetadataRoute } from 'next'

import { loadSiteData } from '@/lib/cms'
import { SITE_URL, SITEMAP_PAGES } from '@/lib/site'

// /sitemap.xml: the fixed public pages plus every published course, read live from the CMS.
// Hidden routes (Pengajar, Insight, D-11) are not listed until they launch.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { courses } = await loadSiteData()
  return [
    ...SITEMAP_PAGES.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...courses.map((course) => ({ url: `${SITE_URL}/id/pelatihan/${course.slug}` })),
  ]
}
