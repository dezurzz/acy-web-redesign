import {
  Building2,
  CalendarDays,
  Clock,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import type React from 'react'

import { Paren } from '@/components/site/Atmosphere'
import { PageHero } from '@/components/site/PageHero'
import { Button } from '@/components/ui/button'
import { FeedbackPanel } from '@/components/ui/feedback-panel'
import { whatsappUrl } from '@/lib/registration'
import { loadSiteSettings } from '@/lib/cms'

export const metadata: Metadata = {
  title: 'Hubungi Kami',
  description: 'Kontak BKI Academy: WhatsApp, telepon, email, alamat, dan jam layanan.',
}

const routes = [
  {
    icon: CalendarDays,
    title: 'Mendaftar pelatihan',
    text: 'Pilih jadwal, lalu ajukan pendaftaran lewat WhatsApp.',
    href: '/id/jadwal',
    action: 'Lihat Jadwal',
  },
  {
    icon: Building2,
    title: 'Pelatihan untuk perusahaan',
    text: 'Ceritakan kebutuhan tim Anda lewat formulir In-house.',
    href: '/id/in-house#formulir-judul',
    action: 'Ajukan Kebutuhan Pelatihan',
  },
  {
    icon: GraduationCap,
    title: 'Sudah menjadi peserta',
    text: 'Materi, sertifikat, dan status pendaftaran ada di Portal Peserta.',
    href: '/id/portal-peserta',
    action: 'Buka Portal Peserta',
  },
]

/*
 * Hubungi Kami (PRD §6 Contact). Confirmed contacts, address and service hours from Site settings
 * (placeholders until D-05). Visitors are first routed to the right place, so common requests
 * do not start as general messages. Corporate briefs use the In-house form (one form, not two).
 * Email and phone are shown as readable text as well as links: tel:/mailto: links do not work everywhere.
 */
export default async function ContactPage() {
  const siteSettings = await loadSiteSettings()
  const whatsappHref = whatsappUrl(
    siteSettings.whatsappNumber,
    'Halo BKI Academy, saya ingin bertanya.',
  )

  return (
    <>
      <PageHero
        breadcrumbs={[{ href: '/id', label: 'Beranda' }, { label: 'Hubungi Kami' }]}
        intro="Pilih keperluan Anda agar kami bisa membantu lebih cepat, atau hubungi kami langsung."
        label="Kontak"
        title="Hubungi Kami"
        aside={
          <>
            <p className="text-meta text-white/80">
              <Paren>Jam layanan</Paren>
            </p>
            <p className="text-h3 text-white">{siteSettings.serviceHours}</p>
            <p className="numeric text-ui text-white/85">WhatsApp {siteSettings.whatsappDisplay}</p>
          </>
        }
      />
      <div className="container-page pt-8 pb-24 lg:pt-12 lg:pb-40">
        <section aria-labelledby="keperluan">
          <h2 className="text-h3 text-navy-950" id="keperluan">
            Apa keperluan Anda?
          </h2>
          <ul className="mt-6 grid gap-6 md:grid-cols-3 lg:gap-6">
            {routes.map(({ action, href, icon: Icon, text, title }) => (
              <li
                className="flex flex-col gap-3 rounded-card border border-line-subtle p-5 md:p-6"
                key={title}
              >
                <Icon aria-hidden className="size-6 text-blue-600" />
                <h3 className="text-ui font-semibold text-navy-950">{title}</h3>
                <p className="text-body text-navy-800">{text}</p>
                <Link
                  className="mt-auto inline-flex min-h-11 items-center text-ui font-semibold text-blue-600 underline underline-offset-4 hover:text-blue-800"
                  href={href}
                >
                  {action}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="kontak-langsung"
          className="mt-24 lg:mt-32 grid gap-10 lg:grid-cols-12 lg:gap-6"
        >
          <div className="lg:col-span-5">
            <h2 className="text-h2 text-navy-950" id="kontak-langsung">
              Kontak langsung
            </h2>
            <p className="mt-4 text-body text-navy-800">
              Pertanyaan lain tentang pelatihan, biaya, atau jadwal. Sebutkan nama pelatihan atau
              kode jadwal bila ada.
            </p>
            <div className="mt-6">
              <Button asChild>
                <a
                  data-analytics="contact_click"
                  data-analytics-channel="whatsapp"
                  data-analytics-location="hubungi-kami"
                  href={whatsappHref}
                  rel="noopener"
                  target="_blank"
                >
                  <MessageCircle aria-hidden />
                  Chat lewat WhatsApp
                  <span className="sr-only"> (membuka WhatsApp di jendela baru)</span>
                </a>
              </Button>
            </div>
            {siteSettings.isPlaceholder ? (
              <FeedbackPanel className="mt-8" title="Kontak masih contoh" tone="warning">
                Nomor, email, dan alamat di halaman ini belum resmi dan belum dapat dihubungi.
              </FeedbackPanel>
            ) : null}
          </div>

          <dl className="grid gap-px overflow-hidden rounded-card border border-line-subtle bg-line-subtle md:grid-cols-2 lg:col-span-7">
            <Contact icon={MessageCircle} label="WhatsApp">
              <span className="numeric">{siteSettings.whatsappDisplay}</span>
            </Contact>
            <Contact icon={Phone} label="Telepon">
              <a
                className="numeric underline underline-offset-4 hover:text-blue-600"
                data-analytics="contact_click"
                data-analytics-channel="phone"
                data-analytics-location="hubungi-kami"
                href={`tel:${siteSettings.phoneHref}`}
              >
                {siteSettings.phone}
              </a>
            </Contact>
            <Contact icon={Mail} label="Email">
              <a
                className="break-all underline underline-offset-4 hover:text-blue-600"
                data-analytics="contact_click"
                data-analytics-channel="email"
                data-analytics-location="hubungi-kami"
                href={`mailto:${siteSettings.email}`}
              >
                {siteSettings.email}
              </a>
            </Contact>
            <Contact icon={Clock} label="Jam layanan">
              {siteSettings.serviceHours}
            </Contact>
            <Contact className="md:col-span-2" icon={MapPin} label="Alamat">
              <address className="not-italic">
                {siteSettings.address.map((line) => (
                  <span className="block" key={line}>
                    {line}
                  </span>
                ))}
              </address>
            </Contact>
          </dl>
        </section>
      </div>
    </>
  )
}

function Contact({
  children,
  className,
  icon: Icon,
  label,
}: {
  children: React.ReactNode
  className?: string
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
  label: string
}) {
  return (
    <div className={`flex gap-3 bg-white p-5 ${className ?? ''}`}>
      <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-blue-600" />
      <div className="min-w-0">
        <dt className="text-meta text-slate-600">{label}</dt>
        <dd className="mt-1 text-ui text-navy-950">{children}</dd>
      </div>
    </div>
  )
}
