'use client'

import { Button } from '@/components/ui/button'
import { FeedbackPanel } from '@/components/ui/feedback-panel'
import { TextLink } from '@/components/ui/text-link'

// Filter bar "error" state (design.md §8): a failed load is never shown as "no results" (animations.md §5.5).
export default function CatalogueError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-page py-16">
      <h1 className="text-h1 text-navy-950">Pelatihan</h1>
      <FeedbackPanel
        action={
          <>
            <Button onClick={reset}>Coba lagi</Button>
            <TextLink className="self-center" href="/id/jadwal">
              Lihat Jadwal
            </TextLink>
          </>
        }
        className="mt-8 max-w-2xl"
        title="Daftar pelatihan gagal dimuat"
        tone="error"
      >
        Terjadi gangguan saat memuat pelatihan. Filter Anda tetap tersimpan di alamat halaman.
        Silakan coba lagi.
      </FeedbackPanel>
    </div>
  )
}
