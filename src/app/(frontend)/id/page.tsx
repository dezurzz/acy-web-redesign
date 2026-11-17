import Link from 'next/link'

import { Button } from '@/components/ui/button'

// Staging shell for Phase 1b. Hero copy is the proposed line from PRD §1, pending content approval.
export default function HomePage() {
  return (
    <section className="container-page py-16 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow text-slate-600">BKI Academy</p>
          <h1 className="mt-4 text-display text-navy-950">
            Kompetensi maritim untuk langkah profesional berikutnya.
          </h1>
          <p className="mt-6 max-w-[65ch] text-intro text-slate-600">
            Situs baru BKI Academy sedang dibangun. Halaman ini adalah kerangka awal untuk staging.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/id/jadwal">Lihat Jadwal</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/id/in-house">Pelatihan untuk Perusahaan</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
