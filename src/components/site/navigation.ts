// Site navigation (PRD §5). Insight is added when it goes live (decision D-11);
// Pengajar sits under Tentang Kami. No language switcher at launch (D-08).
export type NavLink = { href: string; label: string }

export const primaryNav: NavLink[] = [
  { href: '/id/pelatihan', label: 'Pelatihan' },
  { href: '/id/jadwal', label: 'Jadwal' },
  { href: '/id/in-house', label: 'In-house Training' },
  { href: '/id/tentang-kami', label: 'Tentang Kami' },
]

export const portalLink: NavLink = { href: '/id/portal-peserta', label: 'Portal Peserta' }
export const contactLink: NavLink = { href: '/id/hubungi-kami', label: 'Hubungi Kami' }

/** A link is active on its own page and on pages below it (e.g. /id/pelatihan/sso). */
export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}
