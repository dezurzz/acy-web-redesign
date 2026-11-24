'use client'

import { Search } from 'lucide-react'
import * as React from 'react'

import { useCatalogue } from '@/components/catalogue/CatalogueProvider'
import { Button } from '@/components/ui/button'
import { Choice, ChoiceGroup, Field, Input, Select } from '@/components/ui/field'
import { queryFromForm, toQuery, type CatalogueFilters, type Option } from '@/lib/catalogue-query'

export type FilterOptions = {
  topik: Option[]
  format: Option[]
  bulan: Option[]
  lokasi: Option[]
}

type FilterFormProps = {
  /** Apply checkbox/select changes straight away (wide screens). The drawer applies on submit. */
  autoApply?: boolean
  children?: React.ReactNode
  filters: CatalogueFilters
  /** Prefix keeps ids unique when the sidebar and drawer forms exist at the same time. */
  idPrefix: string
  onApplied?: () => void
  options: FilterOptions
  /** Which parts to render; hidden inputs keep the rest in the URL. */
  parts?: 'all' | 'search' | 'filters'
}

/*
 * The catalogue filter form (design.md §8 Filter bar). It is a real GET form, so it also works
 * before JavaScript loads. With JavaScript, it navigates in place via the CatalogueProvider.
 * Search text applies on Enter or "Cari", not on every keystroke.
 */
export function FilterForm({
  autoApply = false,
  children,
  filters,
  idPrefix,
  onApplied,
  options,
  parts = 'all',
}: FilterFormProps) {
  const { navigate } = useCatalogue()
  const formRef = React.useRef<HTMLFormElement>(null)
  const showSearch = parts !== 'filters'
  const showFilters = parts !== 'search'
  const urlKey = toQuery({ ...filters, tampil: 0 })

  // When the URL changes from outside this form (chip removed, "Hapus semua", back button),
  // update the fields in place. Re-creating them instead would drop keyboard focus (AC-08).
  React.useEffect(() => {
    const form = formRef.current
    if (!form) return
    for (const el of Array.from(form.elements)) {
      if (el instanceof HTMLInputElement && el.type === 'checkbox') {
        const group = filters[el.name as 'topik' | 'format' | 'lokasi']
        el.checked = Array.isArray(group) && group.includes(el.value)
      } else if (el instanceof HTMLSelectElement && el.name === 'bulan') {
        el.value = filters.bulan
      } else if (el instanceof HTMLInputElement && el.type === 'search') {
        el.value = filters.q
      }
    }
    // urlKey captures every filter value; `filters` itself is a new object on each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKey])

  const apply = (form: HTMLFormElement) => {
    navigate(queryFromForm(form))
    onApplied?.()
  }

  return (
    <form
      ref={formRef}
      action="/id/pelatihan"
      className="flex flex-col gap-6"
      method="get"
      onChange={(event) => {
        const target = event.target as unknown as HTMLInputElement
        if (autoApply && target.type !== 'search') apply(event.currentTarget)
      }}
      onSubmit={(event) => {
        event.preventDefault()
        apply(event.currentTarget)
      }}
      role="search"
      aria-label={showFilters ? 'Cari dan filter pelatihan' : 'Cari pelatihan'}
    >
      {showSearch ? (
        <Field
          helper="Judul, singkatan, atau kata kunci. Contoh: ISM, auditor, stabilitas."
          id={`${idPrefix}-q`}
          label="Cari pelatihan"
        >
          {({ describedBy }) => (
            <div className="flex gap-2">
              <Input
                aria-describedby={describedBy}
                autoComplete="off"
                defaultValue={filters.q}
                enterKeyHint="search"
                id={`${idPrefix}-q`}
                name="q"
                type="search"
              />
              <Button className="min-h-11 shrink-0 px-4" type="submit" variant="secondary">
                <Search aria-hidden />
                <span className="sr-only md:not-sr-only">Cari</span>
              </Button>
            </div>
          )}
        </Field>
      ) : (
        <input name="q" type="hidden" value={filters.q} />
      )}

      {showFilters ? (
        <>
          <CheckboxGroup
            idPrefix={idPrefix}
            legend="Bidang"
            name="topik"
            options={options.topik}
            selected={filters.topik}
          />
          <CheckboxGroup
            idPrefix={idPrefix}
            legend="Format"
            name="format"
            options={options.format}
            selected={filters.format}
          />
          <Field id={`${idPrefix}-bulan`} label="Bulan pelaksanaan">
            {() => (
              <Select defaultValue={filters.bulan} id={`${idPrefix}-bulan`} name="bulan">
                <option value="">Semua bulan</option>
                {options.bulan.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            )}
          </Field>
          <CheckboxGroup
            idPrefix={idPrefix}
            legend="Lokasi"
            name="lokasi"
            options={options.lokasi}
            selected={filters.lokasi}
          />
        </>
      ) : (
        <HiddenFilters filters={filters} />
      )}

      {children}
    </form>
  )
}

function CheckboxGroup({
  idPrefix,
  legend,
  name,
  options,
  selected,
}: {
  idPrefix: string
  legend: string
  name: string
  options: Option[]
  selected: string[]
}) {
  return (
    <ChoiceGroup id={`${idPrefix}-${name}`} legend={legend}>
      {options.map((option) => (
        <Choice
          defaultChecked={selected.includes(option.value)}
          id={`${idPrefix}-${name}-${option.value}`}
          key={option.value}
          label={option.label}
          name={name}
          type="checkbox"
          value={option.value}
        />
      ))}
    </ChoiceGroup>
  )
}

function HiddenFilters({ filters }: { filters: CatalogueFilters }) {
  return (
    <>
      {filters.topik.map((v) => (
        <input key={`t-${v}`} name="topik" type="hidden" value={v} />
      ))}
      {filters.format.map((v) => (
        <input key={`f-${v}`} name="format" type="hidden" value={v} />
      ))}
      {filters.bulan ? <input name="bulan" type="hidden" value={filters.bulan} /> : null}
      {filters.lokasi.map((v) => (
        <input key={`l-${v}`} name="lokasi" type="hidden" value={v} />
      ))}
    </>
  )
}
