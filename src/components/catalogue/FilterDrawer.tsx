'use client'

import { SlidersHorizontal, X } from 'lucide-react'
import Link from 'next/link'
import { Dialog } from 'radix-ui'
import * as React from 'react'

import { FilterForm, type FilterOptions } from '@/components/catalogue/FilterForm'
import { Button } from '@/components/ui/button'
import type { CatalogueFilters } from '@/lib/catalogue-query'

/*
 * Compact-screen filter drawer (design.md §8, animations.md §5.4). Same focus rules as the
 * mobile menu (Radix Dialog). Choices apply only on "Terapkan Filter", so the page does not
 * reload behind the drawer on every tap.
 */
export function FilterDrawer({
  activeCount,
  filters,
  options,
}: {
  activeCount: number
  filters: CatalogueFilters
  options: FilterOptions
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog.Root onOpenChange={setOpen} open={open}>
      <Dialog.Trigger asChild>
        <Button className="w-full lg:hidden" variant="secondary">
          <SlidersHorizontal aria-hidden />
          Filter{activeCount ? ` (${activeCount} aktif)` : ''}
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-navy-950/40 data-[state=closed]:animate-overlay-out data-[state=open]:animate-overlay-in lg:hidden" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-50 flex flex-col bg-white data-[state=closed]:animate-menu-out data-[state=open]:animate-menu-in lg:hidden"
        >
          <div className="container-page flex min-h-18 shrink-0 items-center justify-between gap-4 border-b border-line-subtle">
            <Dialog.Title className="text-h3 text-navy-950">Filter pelatihan</Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="inline-flex min-h-11 items-center gap-2 rounded-control border border-line-control px-4 text-ui font-semibold text-navy-950 hover:bg-blue-50"
                type="button"
              >
                <X aria-hidden className="size-5" />
                Tutup
              </button>
            </Dialog.Close>
          </div>

          <div className="container-page flex-1 overflow-y-auto pt-6">
            <FilterForm
              filters={filters}
              idPrefix="laci"
              onApplied={() => setOpen(false)}
              options={options}
              parts="filters"
            >
              <div className="sticky bottom-0 flex items-center gap-4 border-t border-line-subtle bg-white py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <Button className="flex-1" type="submit">
                  Terapkan Filter
                </Button>
                <Dialog.Close asChild>
                  <Link
                    className="inline-flex min-h-11 items-center text-ui font-medium text-blue-600 underline underline-offset-4"
                    href={filters.q ? `?q=${encodeURIComponent(filters.q)}` : '/id/pelatihan'}
                    replace
                    scroll={false}
                  >
                    Hapus semua
                  </Link>
                </Dialog.Close>
              </div>
            </FilterForm>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
