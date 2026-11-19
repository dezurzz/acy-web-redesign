import { CircleAlert } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

/*
 * Form controls (design.md §8 Input and Choice controls, §12 overrides).
 * Persistent visible label, optional helper, error text with an icon (never a red border alone),
 * 44 px minimum height and 16 px text so iOS does not zoom.
 */

const controlBase =
  'w-full rounded-control border border-line-control bg-white px-3 text-ui text-navy-800 transition-colors duration-(--motion-fast) ease-(--ease-standard) placeholder:text-slate-600 hover:border-navy-800 focus-visible:border-blue-600 disabled:cursor-not-allowed disabled:border-line-subtle disabled:bg-paper disabled:text-slate-600 aria-invalid:border-danger aria-invalid:border-2'

type FieldProps = {
  children: (ids: { describedBy: string | undefined; invalid: boolean }) => React.ReactNode
  className?: string
  error?: string
  helper?: string
  id: string
  label: string
  optional?: boolean
}

/** Wires label, helper and error to a single control via render props. */
export function Field({
  children,
  className,
  error,
  helper,
  id,
  label,
  optional = false,
}: FieldProps) {
  const helperId = helper ? `${id}-bantuan` : undefined
  const errorId = error ? `${id}-galat` : undefined
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label className="text-ui font-medium text-navy-800" htmlFor={id}>
        {label}
        {optional ? <span className="font-normal text-slate-600"> (opsional)</span> : null}
      </label>
      {helper ? (
        <p className="-mt-1 text-meta text-slate-600" id={helperId}>
          {helper}
        </p>
      ) : null}
      {error ? <FieldError id={errorId!}>{error}</FieldError> : null}
      {children({ describedBy, invalid: Boolean(error) })}
    </div>
  )
}

export function FieldError({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <p className="flex items-start gap-1.5 text-meta font-medium text-danger" id={id}>
      <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </p>
  )
}

export function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return <input className={cn(controlBase, 'min-h-11', className)} {...props} />
}

export function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return <textarea className={cn(controlBase, 'min-h-32 py-2.5', className)} {...props} />
}

export function Select({ className, ...props }: React.ComponentProps<'select'>) {
  return (
    <select
      className={cn(
        controlBase,
        'min-h-11 appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%231c2e3c%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")] bg-size-[1.25rem] bg-position-[right_0.75rem_center] bg-no-repeat pr-10',
        className,
      )}
      {...props}
    />
  )
}

type ChoiceGroupProps = {
  children: React.ReactNode
  className?: string
  error?: string
  helper?: string
  id: string
  legend: string
}

/** Radio groups and checkbox lists sit in a fieldset with a visible legend. */
export function ChoiceGroup({ children, className, error, helper, id, legend }: ChoiceGroupProps) {
  const helperId = helper ? `${id}-bantuan` : undefined
  const errorId = error ? `${id}-galat` : undefined

  return (
    <fieldset
      aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
      aria-invalid={error ? true : undefined}
      className={cn('flex flex-col gap-2', className)}
      id={id}
    >
      <legend className="text-ui font-medium text-navy-800">{legend}</legend>
      {helper ? (
        <p className="text-meta text-slate-600" id={helperId}>
          {helper}
        </p>
      ) : null}
      {error ? <FieldError id={errorId!}>{error}</FieldError> : null}
      <div className="flex flex-col">{children}</div>
    </fieldset>
  )
}

type ChoiceProps = Omit<React.ComponentProps<'input'>, 'type'> & {
  hint?: string
  label: string
  type: 'radio' | 'checkbox'
}

/** 24 px control inside a 44 px tall target; the whole row is the label. */
export function Choice({ className, hint, id, label, type, ...props }: ChoiceProps) {
  return (
    <label
      className={cn(
        'flex min-h-11 cursor-pointer items-start gap-3 py-2.5 has-disabled:cursor-not-allowed has-disabled:text-slate-600',
        className,
      )}
      htmlFor={id}
    >
      <input
        className="mt-px size-6 shrink-0 cursor-[inherit] accent-blue-600"
        id={id}
        type={type}
        {...props}
      />
      <span className="flex flex-col">
        <span className="text-ui">{label}</span>
        {hint ? <span className="text-meta text-slate-600">{hint}</span> : null}
      </span>
    </label>
  )
}
