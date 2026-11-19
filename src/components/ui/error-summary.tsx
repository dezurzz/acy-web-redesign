'use client'

import { CircleAlert } from 'lucide-react'
import * as React from 'react'

export type FormError = { fieldId: string; message: string }

type ErrorSummaryProps = {
  errors: FormError[]
  /** Move focus here when it appears (true after an invalid submit; animations.md §5.7). */
  focusOnMount?: boolean
  title?: string
}

// design.md §8 Error summary: heading, linked errors, recovery instruction. Appears immediately, no motion.
export function ErrorSummary({
  errors,
  focusOnMount = true,
  title = 'Periksa kembali isian berikut',
}: ErrorSummaryProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (focusOnMount) ref.current?.focus()
  }, [focusOnMount])

  if (errors.length === 0) return null

  return (
    <div
      aria-labelledby="ringkasan-galat-judul"
      className="rounded-card border-2 border-danger bg-white p-5 md:p-6"
      data-error-summary
      ref={ref}
      role="alert"
      tabIndex={-1}
    >
      <h2
        className="flex items-center gap-2 text-ui font-semibold text-danger"
        id="ringkasan-galat-judul"
      >
        <CircleAlert aria-hidden className="size-5 shrink-0" />
        {title}
      </h2>
      <p className="mt-2 text-meta text-slate-600">
        Data yang sudah Anda isi tetap tersimpan di formulir.
      </p>
      <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5">
        {errors.map((error) => (
          <li key={error.fieldId}>
            <a
              className="text-meta font-medium text-danger underline underline-offset-4"
              href={`#${error.fieldId}`}
              onClick={(event) => {
                // Focus the control itself; a plain hash jump only scrolls.
                const target = document.getElementById(error.fieldId)
                if (target) {
                  event.preventDefault()
                  target.focus()
                  target.scrollIntoView({ block: 'center' })
                }
              }}
            >
              {error.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
