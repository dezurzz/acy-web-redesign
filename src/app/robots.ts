import type { MetadataRoute } from 'next'

import { SITE_INDEXABLE, SITE_URL } from '@/lib/site'

// /robots.txt. Before launch (SITE_INDEXABLE unset) it asks every crawler to stay away.
export default function robots(): MetadataRoute.Robots {
  if (!SITE_INDEXABLE) return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/styleguide', '/id/pendaftaran'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
