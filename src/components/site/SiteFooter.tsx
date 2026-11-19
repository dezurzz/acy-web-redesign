import { MotionToggle } from '@/components/site/MotionToggle'

// Contact details use placeholders until the business owner sends the real ones (decision D-05, deferred).
export function SiteFooter() {
  return (
    <footer className="bg-navy-950 text-white" data-surface="dark">
      <div className="container-page flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-ui font-semibold">BKI Academy</p>
          <p className="mt-2 text-meta text-line-subtle">PT Biro Klasifikasi Indonesia (Persero)</p>
        </div>
        <MotionToggle />
      </div>
    </footer>
  )
}
