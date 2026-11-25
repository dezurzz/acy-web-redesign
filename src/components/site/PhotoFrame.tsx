import { Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

import { cn } from '@/lib/utils'

type PhotoFrameProps = {
  /** Describe the action and context, not the colour treatment (design.md §9). */
  alt: string
  className?: string
  /** Shown in the placeholder until an approved photo exists. */
  placeholderLabel?: string
  /** true for the main above-the-fold image: loads eagerly (design.md §9). */
  priority?: boolean
  sizes?: string
  src?: string
}

/*
 * Photo with a fixed aspect ratio (set via className, e.g. aspect-4/3) so nothing shifts while it loads.
 * Hover: image scales to 1.04 over 700 ms inside a clipped frame (v1.2), fine pointers only (animations.md §5.2).
 * Scroll (animations.md §5.9–5.10, v1.3): inside a <Reveal> the photo opens from the bottom and
 * settles from a zoom when its card appears; it then drifts slightly slower than the page (parallax,
 * CSS scroll timeline). Three layers so the transforms never fight: unveil > parallax > hover scale.
 * Without `src` it renders an honest placeholder: photos need permission first (decision B-05),
 * and stock or generated people must never stand in for real BKI training (design.md §9).
 */
export function PhotoFrame({
  alt,
  className,
  placeholderLabel = 'Foto pelatihan BKI Academy menyusul',
  priority = false,
  sizes = '(min-width: 1024px) 40vw, 100vw',
  src,
}: PhotoFrameProps) {
  return (
    <div className={cn('group/photo relative overflow-hidden rounded-image bg-paper', className)}>
      {src ? (
        <div className="unveil absolute inset-0">
          <div className="parallax absolute inset-x-0 -inset-y-[7%]">
            <Image
              alt={alt}
              className="object-cover transition-transform duration-(--motion-image-hover) ease-(--ease-expo) pointer-fine:group-hover/photo:scale-(--scale-image)"
              fill
              priority={priority}
              sizes={sizes}
              src={src}
            />
          </div>
        </div>
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-(image:--gradient-soft) p-6 text-center"
          role="img"
          aria-label={`${alt} (gambar sementara)`}
        >
          <ImageIcon aria-hidden className="size-8 text-slate-600" />
          <p aria-hidden className="max-w-56 text-meta text-slate-600">
            {placeholderLabel}
          </p>
        </div>
      )}
    </div>
  )
}
