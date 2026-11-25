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
              className="relative inline-flex min-h-11 items-center px-3 text-ui whitespace-nowrap text-(--hdr-muted) transition-colors duration-(--motion-fast) ease-(--ease-standard) after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-(--motion-arrow) after:ease-(--ease-expo) hover:text-(--hdr-fg) hover:after:scale-x-100 aria-[current=page]:font-semibold aria-[current=page]:text-(--hdr-active) aria-[current=page]:after:scale-x-100"
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
