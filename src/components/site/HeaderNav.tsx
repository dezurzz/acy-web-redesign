'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { isActive, primaryNav } from '@/components/site/navigation'

// Desktop primary navigation (wide screens only). Active page: aria-current="page",
// blue text and a 2 px underline, so it never depends on colour alone (design.md §3, §8).
export function HeaderNav() {
  const pathname = usePathname()

  return (
    <nav aria-label="Navigasi utama" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {primaryNav.map((link) => (
          <li key={link.href}>
            <Link
              aria-current={isActive(pathname, link.href) ? 'page' : undefined}
              className="inline-flex min-h-11 items-center px-3 text-ui whitespace-nowrap text-(--hdr-muted) decoration-2 underline-offset-8 transition-colors duration-(--motion-fast) ease-(--ease-standard) hover:text-(--hdr-fg) aria-[current=page]:font-semibold aria-[current=page]:text-(--hdr-active) aria-[current=page]:underline"
              href={link.href}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
