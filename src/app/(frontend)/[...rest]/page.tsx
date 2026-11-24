import { notFound } from 'next/navigation'

// Any URL no other route matches lands here and gets the branded 404 inside the site layout,
// instead of Next.js's plain default page. Real routes always win over this catch-all.
// Old Odoo URLs get explicit 301 redirects in Build Sprint 4 (PRD §9); they must not fall through to here.
// Known dev-only noise: Next.js 16.4 dev overlay may report "cannot have a negative time stamp" on any
// page that calls notFound(). It comes from React's dev performance tracks, not from this code,
// and does not occur in production builds.
export default async function CatchAll() {
  notFound()
}
