'use client'

import { Button } from '@/components/ui/button'
import { FeedbackPanel } from '@/components/ui/feedback-panel'
import { TextLink } from '@/components/ui/text-link'

// Filter bar "error" state (design.md §8): a failed load is never shown as "no results" (animations.md §5.5).
export default function ScheduleError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-page py-16">
      <h1 className="text-h1 text-navy-950">Jadwal pelatihan</h1>
      <FeedbackPanel
        action={
          <>
            <Button onClick={reset}>Coba lagi</Button>
            <TextLink className="self-center" href="/id/pelatihan">
              Lihat Pelatihan
            </TextLink>
          </>
        }
        className="mt-8 max-w-2xl"
        title="Jadwal gagal dimuat"
        tone="error"
      >
        Terjadi gangguan saat memuat jadwal. Filter Anda tetap tersimpan di alamat halaman. Silakan
        coba lagi.
      </FeedbackPanel>
    </div>
  )
}
