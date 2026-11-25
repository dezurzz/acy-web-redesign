import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

export type InstructorCardProps = {
  className?: string
  /** Approved expertise only (PRD §6: bios need approval). */
  expertise: string
  name: string
  /** Approved portrait with photo consent; without it the card shows initials. */
  photo?: { src: string; alt: string }
  role?: string
  courses: { href: string; title: string }[]
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('')

/*
 * Instructor card (design.md §8): approved portrait (4:5), name, expertise, relevant courses.
 * No photo consent → an intentional initials block on solid navy (a page of cards must not
 * repeat the brand gradient, design.md §4), never a stock face (design.md §9).
 * Pengajar launches hidden as a fast-follow (D-11); the card is ready for it.
 */
export function InstructorCard({
  className,
  courses,
  expertise,
  name,
  photo,
  role,
}: InstructorCardProps) {
  return (
    <article className={cn('flex flex-col gap-4', className)}>
      <div className="group/photo relative aspect-4/5 overflow-hidden rounded-image bg-navy-950">
        {photo ? (
          <Image
            alt={photo.alt}
            className="object-cover transition-transform duration-(--motion-image) ease-(--ease-standard) pointer-fine:group-hover/photo:scale-[1.02]"
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
            src={photo.src}
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 flex items-end border-b-4 border-blue-600 bg-navy-950 p-5"
          >
            <span className="text-display leading-none text-white">{initials(name)}</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-h3 text-navy-950">{name}</h3>
        {role ? <p className="mt-1 text-meta text-slate-600">{role}</p> : null}
        <p className="mt-3 text-body text-navy-800">{expertise}</p>
      </div>
      {courses.length > 0 ? (
        <div className="border-t border-line-subtle pt-3">
          <p className="eyebrow text-slate-600">Mengajar</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {courses.map((course) => (
              <li key={course.href}>
                <Link
                  className="text-meta font-medium text-blue-600 underline underline-offset-4 hover:text-blue-800"
                  href={course.href}
                >
                  {course.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  )
}
