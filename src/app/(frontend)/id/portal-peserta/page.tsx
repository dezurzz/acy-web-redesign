import { Award, BookOpen, ExternalLink, MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'

import { PageHero } from '@/components/site/PageHero'
import { Reveal } from '@/components/site/Reveal'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { TextLink } from '@/components/ui/text-link'
import { whatsappUrl } from '@/lib/registration'
import { loadSiteSettings } from '@/lib/cms'

export const metadata: Metadata = {
  title: 'Portal Peserta',
  description: 'Akses materi, sertifikat, dan status pendaftaran untuk peserta BKI Academy.',
}

const help = [
  {
    q: 'Saya lupa kata sandi portal materi',
    a: 'Gunakan tautan “Lupa kata sandi” di halaman masuk portal. Jika email Anda tidak dikenali, hubungi admin lewat WhatsApp dan sebutkan nama pelatihan yang Anda ikuti.',
  },
  {
    q: 'Nama di sertifikat saya salah',
    a: 'Kirim nama yang benar dan nomor sertifikat ke admin lewat WhatsApp. Perbaikan dilakukan di sistem sertifikat BKI.',
  },
  {
    q: 'Saya belum menerima konfirmasi pendaftaran',
    a: 'Admin membalas pada jam layanan. Jika belum ada balasan setelah satu hari kerja, kirim ulang pesan dengan kode jadwal Anda.',
  },
]

/*
 * Portal Peserta (PRD §6, D-07): one page that routes participants to the systems that already
 * exist. This site has no participant login. Links to other systems are labelled as leaving
 * the site, and appear only once the destination is confirmed and tested (Site settings).
 * Motion: card hover, FAQ accordion, one optional reveal for the service cards.
 */
export default async function PortalPage() {
  const siteSettings = await loadSiteSettings()
  const whatsappHref = whatsappUrl(
    siteSettings.whatsappNumber,
    'Halo BKI Academy, saya peserta dan ingin menanyakan status pendaftaran saya. Kode jadwal: ',
  )

  const services = [
    {
      icon: BookOpen,
      title: 'Akun dan materi pelatihan',
      text: 'Masuk ke portal untuk membuka materi dan jadwal kelas Anda.',
      action: 'Buka portal materi',
      href: siteSettings.portalUrl,
    },
    {
      icon: Award,
      title: 'Sertifikat',
      text: 'Lihat dan unduh sertifikat pelatihan di sistem sertifikat BKI.',
      action: 'Buka sistem sertifikat',
      href: siteSettings.certificateUrl,
    },
    {
      icon: MessageCircle,
      title: 'Status pendaftaran',
      text: 'Tanyakan status pendaftaran, pembayaran, atau perubahan jadwal kepada admin.',
      action: 'Chat admin lewat WhatsApp',
      href: whatsappHref,
    },
  ]

  return (
    <>
      <PageHero
        breadcrumbs={[{ href: '/id', label: 'Beranda' }, { label: 'Portal Peserta' }]}
        intro="Layanan untuk peserta yang sudah terdaftar: materi, sertifikat, dan status pendaftaran."
        label="Untuk peserta"
        title="Portal Peserta"
      />
      <div className="container-page pt-8 pb-24 lg:pt-12 lg:pb-40">
        <Reveal>
          <ul className="grid gap-6 md:grid-cols-3 lg:gap-6">
            {services.map(({ action, href, icon: Icon, text, title }) => (
              <li
                className="flex flex-col gap-3 rounded-card border border-line-subtle p-5 transition-colors duration-(--motion-fast) focus-within:border-blue-600 hover:border-blue-600 md:p-6"
                key={title}
              >
                <Icon aria-hidden className="size-6 text-blue-600" />
                <h2 className="text-h3 text-navy-950">{title}</h2>
                <p className="text-body text-navy-800">{text}</p>
                <div className="mt-auto pt-3">
                  {href ? (
                    <>
                      <Button
                        asChild
                        className="w-full text-center whitespace-normal"
                        variant="secondary"
                      >
                        <a href={href} rel="noopener" target="_blank">
                          {action}
                          <ExternalLink aria-hidden />
                          <span className="sr-only"> (membuka situs lain di jendela baru)</span>
                        </a>
                      </Button>
                      <p className="mt-2 text-meta text-slate-600">
                        Anda akan meninggalkan situs BKI Academy.
                      </p>
                    </>
                  ) : (
                    <p className="rounded-card bg-paper p-3 text-meta text-slate-600">
                      Tautan menyusul setelah alamat sistem ini dikonfirmasi.
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <section
          aria-labelledby="bantuan"
          className="mt-24 lg:mt-32 grid gap-8 lg:grid-cols-12 lg:gap-6"
        >
          <div className="lg:col-span-4">
            <h2 className="text-h2 text-navy-950" id="bantuan">
              Butuh bantuan?
            </h2>
            <p className="mt-4 text-body text-navy-800">
              Masih ada pertanyaan? Hubungi admin pada jam layanan ({siteSettings.serviceHours}).
            </p>
            <TextLink arrow className="mt-4" href="/id/hubungi-kami">
              Hubungi Kami
            </TextLink>
          </div>
          <Accordion className="lg:col-span-8" type="multiple">
            {help.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger headingLevel={3}>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </>
  )
}
