import { MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'

import { PageHero } from '@/components/site/PageHero'
import { Reveal } from '@/components/site/Reveal'
import { Button } from '@/components/ui/button'
import { TextLink } from '@/components/ui/text-link'
import { whatsappUrl } from '@/lib/registration'
import { loadSiteSettings } from '@/lib/cms'

export const metadata: Metadata = {
  title: 'Layanan MICE',
  description: 'Penyelenggaraan seminar, lokakarya, dan pertemuan maritim bersama BKI Academy.',
}

const services = [
  {
    title: 'Seminar dan konferensi',
    text: 'Acara berbagi pengetahuan maritim untuk industri dan pemangku kepentingan.',
  },
  {
    title: 'Lokakarya teknis',
    text: 'Sesi praktik untuk topik tertentu, dipandu tenaga ahli BKI.',
  },
  {
    title: 'Pertemuan dan rapat',
    text: 'Dukungan penyelenggaraan pertemuan perusahaan dengan materi teknis.',
  },
]

/*
 * MICE (PRD §6, D-09): active but secondary. One page, linked from the footer and the In-house page
 * only, never from the main navigation. Describes the service and offers a contact route.
 * Copy is DRAFT and needs the business owner's confirmation of what MICE covers (AC-09).
 */
export default async function MicePage() {
  const siteSettings = await loadSiteSettings()
  const whatsappHref = whatsappUrl(
    siteSettings.whatsappNumber,
    'Halo BKI Academy, saya ingin bertanya tentang layanan MICE.',
  )

  return (
    <>
      <PageHero
        breadcrumbs={[{ href: '/id', label: 'Beranda' }, { label: 'Layanan MICE' }]}
        intro="BKI Academy membantu menyelenggarakan seminar, lokakarya, dan pertemuan bertema maritim, dengan materi dan pembicara dari lingkungan BKI."
        label="Meetings, incentives, conferences, exhibitions"
        title="Layanan MICE"
      />

      <section aria-labelledby="layanan" className="container-page mt-16">
        <h2 className="text-h2 text-navy-950" id="layanan">
          Yang bisa kami bantu
        </h2>
        <Reveal className="mt-8">
          <ul className="grid gap-6 md:grid-cols-3 lg:gap-6">
            {services.map((service) => (
              <li className="rounded-card border border-line-subtle p-5 md:p-6" key={service.title}>
                <h3 className="text-h3 text-navy-950">{service.title}</h3>
                <p className="mt-2 text-body text-navy-800">{service.text}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section aria-labelledby="diskusi" className="container-page mt-16">
        <div className="flex flex-col gap-6 rounded-card bg-paper p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <h2 className="text-h3 text-navy-950" id="diskusi">
              Diskusikan acara Anda
            </h2>
            <p className="mt-2 max-w-[55ch] text-body text-navy-800">
              Sampaikan tema, perkiraan jumlah peserta, dan tanggal yang diinginkan. Tim kami akan
              menghubungi Anda.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3">
            <Button asChild>
              <a
                data-analytics="contact_click"
                data-analytics-channel="whatsapp"
                data-analytics-location="mice"
                href={whatsappHref}
                rel="noopener"
                target="_blank"
              >
                <MessageCircle aria-hidden />
                Chat lewat WhatsApp
                <span className="sr-only"> (membuka WhatsApp di jendela baru)</span>
              </a>
            </Button>
            <TextLink href="/id/hubungi-kami">Kontak lainnya</TextLink>
          </div>
        </div>
        <p className="mt-6 text-meta text-slate-600">
          Mencari pelatihan untuk tim Anda? Lihat{' '}
          <TextLink href="/id/in-house">In-house Training</TextLink>.
        </p>
      </section>
      <div aria-hidden className="h-16 lg:h-24" />
    </>
  )
}
