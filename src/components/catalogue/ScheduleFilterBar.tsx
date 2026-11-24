'use client'

import { Search } from 'lucide-react'
import * as React from 'react'

import { useCatalogue } from '@/components/catalogue/CatalogueProvider'
import type { FilterOptions } from '@/components/catalogue/FilterForm'
import { Button } from '@/components/ui/button'
import { Input, Select } from '@/components/ui/field'
import { queryFromForm, toQuery, type CatalogueFilters, type Option } from '@/lib/catalogue-query'

/*
 * Jadwal filter bar (design.md §8 Filter bar, wireframe /wireframes/jadwal): search plus one
 * select per group, in a row on wide screens and stacked on phones, so session rows keep the
 * full page width. Selects apply on change; search applies on Enter or "Cari".
 * Like the catalogue form it is a real GET form and keeps focus when the URL changes.
 */
export function ScheduleFilterBar({
  filters,
  options,
}: {
  filters: CatalogueFilters
  options: FilterOptions
}) {
  const { navigate } = useCatalogue()
  const formRef = React.useRef<HTMLFormElement>(null)
  const urlKey = toQuery({ ...filters, tampil: 0 })

  // Keep fields in step with the URL (chips, "Hapus semua", back button) without re-creating them.
  React.useEffect(() => {
    const form = formRef.current
    if (!form) return
    for (const el of Array.from(form.elements)) {
      if (el instanceof HTMLSelectElement) {
        const value = filters[el.name as keyof CatalogueFilters]
        el.value = Array.isArray(value) ? (value[0] ?? '') : String(value ?? '')
      } else if (el instanceof HTMLInputElement && el.name === 'q') {
        el.value = filters.q
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlKey])

  const groups: {
    name: 'topik' | 'format' | 'bulan' | 'lokasi'
    label: string
    all: string
    options: Option[]
  }[] = [
    { name: 'bulan', label: 'Bulan', all: 'Semua bulan', options: options.bulan },
    { name: 'topik', label: 'Bidang', all: 'Semua bidang', options: options.topik },
    { name: 'format', label: 'Format', all: 'Semua format', options: options.format },
    { name: 'lokasi', label: 'Lokasi', all: 'Semua lokasi', options: options.lokasi },
  ]

  return (
    <form
      action="/id/jadwal"
      aria-label="Cari dan filter jadwal"
      className="grid gap-4 rounded-card border border-line-subtle bg-paper p-4 md:grid-cols-2 md:p-5 lg:grid-cols-6"
      method="get"
      onChange={(event) => {
        if ((event.target as unknown as HTMLElement).tagName === 'SELECT') {
          navigate(queryFromForm(event.currentTarget))
        }
      }}
      onSubmit={(event) => {
        event.preventDefault()
        navigate(queryFromForm(event.currentTarget))
      }}
      ref={formRef}
      role="search"
    >
      <div className="flex flex-col gap-2 md:col-span-2">
        <label className="text-meta font-semibold text-navy-800" htmlFor="jadwal-q">
          Cari pelatihan
        </label>
        <div className="flex gap-2">
          <Input
            autoComplete="off"
            defaultValue={filters.q}
            enterKeyHint="search"
            id="jadwal-q"
            name="q"
            placeholder="Contoh: ISM, SSO"
            type="search"
          />
          <Button className="min-h-11 shrink-0 px-4" type="submit" variant="secondary">
            <Search aria-hidden />
            <span className="sr-only">Cari</span>
          </Button>
        </div>
      </div>
      {groups.map((group) => (
        <div className="flex flex-col gap-2" key={group.name}>
          <label className="text-meta font-semibold text-navy-800" htmlFor={`jadwal-${group.name}`}>
            {group.label}
          </label>
          <Select
            defaultValue={group.name === 'bulan' ? filters.bulan : (filters[group.name][0] ?? '')}
            id={`jadwal-${group.name}`}
            name={group.name}
          >
            <option value="">{group.all}</option>
            {group.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      ))}
    </form>
  )
}
