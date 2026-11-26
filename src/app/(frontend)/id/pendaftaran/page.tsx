import { Mail, MessageCircle, Phone } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import type React from 'react'

import { TrackView } from '@/components/analytics/Analytics'
import { PageHero } from '@/components/site/PageHero'
import { Button, ButtonArrow } from '@/components/ui/button'
import { FeedbackPanel } from '@/components/ui/feedback-panel'
import { StatusBadge } from '@/components/ui/status-badge'
import { StepIndicator } from '@/components/ui/step-indicator'
import { TextLink } from '@/components/ui/text-link'
import { FEE_ON_REQUEST, formatDateRange, formatRupiah } from '@/lib/format'
import {
  alternativeSessions,
  getRegistrationSession,
  handoffKind,
  whatsappMessage,
  whatsappUrl,
  type RegistrationSession,
} from '@/lib/registration'
import { loadSiteData, loadSiteSettings } from '@/lib/cms'
import type { SiteSession } from '@/lib/site-data'
import type { SiteSettings } from '@/lib/site-settings'

// Reads live CMS data on every request: the status check (AC-04) must use the latest session state.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Ajukan Pendaftaran',
  // A per-session utility page; it should never appear in search results.
  robots: { index: false, follow: true },
}

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

const STEPS = ['Pilih jadwal', 'Ringkasan', 'Kirim di WhatsApp', 'Konfirmasi admin']

/*
 * Ajukan Pendaftaran: WhatsApp handoff (PRD §6 Registration request, D-01, D-06, wireframe
 * /wireframes/pendaftaran). The server checks the session status on every render (AC-04).
 * The site stores nothing and cannot know whether the message was sent, so there is no
 * success state and no reference number (animations.md §5.7). Motion: functional only.
 */
export default async function RegistrationPage({ searchParams }: PageProps) {
  const params = await searchParams
  const id = Array.isArray(params.session) ? params.session[0] : params.session
  const [{ sessions }, siteSettings] = await Promise.all([loadSiteData(), loadSiteSettings()])
  const session = getRegistrationSession(id, sessions)

  return (
    <>
      <PageHero
        breadcrumbs={[
          { href: '/id', label: 'Beranda' },
          { href: '/id/jadwal', label: 'Jadwal' },
          { label: 'Ajukan Pendaftaran' },
        ]}
        intro="Pendaftaran dilanjutkan lewat WhatsApp. Admin mengonfirmasi kursi Anda."
        label="Pendaftaran"
        title="Ajukan pendaftaran"
      />
      <div className="container-page pt-8 pb-24 lg:pt-12 lg:pb-40">
        <div className="max-w-4xl">
          <StepIndicator current={1} steps={STEPS} />
          {session ? (
            <Handoff session={session} sessions={sessions} settings={siteSettings} />
          ) : (
            <NoSession hadId={Boolean(id)} />
          )}
        </div>
      </div>
    </>
  )
}

function NoSession({ hadId }: { hadId: boolean }) {
  return (
    <FeedbackPanel
      action={
        <>
          <Button asChild>
            <Link href="/id/jadwal">Lihat Jadwal</Link>
          </Button>
          <TextLink className="self-center" href="/id/pelatihan">
            Cari pelatihan
          </TextLink>
        </>
      }
      className="mt-8"
      title={hadId ? 'Jadwal tidak ditemukan' : 'Pilih jadwal terlebih dahulu'}
      tone="warning"
    >
      {hadId
        ? 'Kode jadwal pada tautan ini tidak dikenali. Jadwal mungkin sudah dihapus. Pilih jadwal dari daftar jadwal.'
        : 'Pendaftaran selalu untuk satu jadwal tertentu. Pilih jadwal dari halaman Jadwal atau halaman pelatihan.'}
    </FeedbackPanel>
  )
}

function Handoff({
  session,
  sessions,
  settings,
}: {
  session: RegistrationSession
  sessions: SiteSession[]
  settings: SiteSettings
}) {
  const kind = handoffKind(session)

  return (
    <>
      {/* registration_start = handoff page viewed for a session that can be requested (PRD §9). */}
      {kind === 'none' ? null : (
        <TrackView
          event={{ name: 'registration_start', session: session.id, course: session.courseSlug }}
        />
      )}
      <SessionSummary session={session} />
      {kind === 'none' ? (
        <NotAvailable session={session} sessions={sessions} />
      ) : (
        <WhatsAppStep kind={kind} session={session} settings={settings} />
      )}
    </>
  )
}

function SessionSummary({ session }: { session: RegistrationSession }) {
  return (
    <section
      aria-labelledby="ringkasan-jadwal"
      className="mt-8 rounded-card border border-line-control bg-white p-5 md:p-6"
    >
      <h2 className="sr-only" id="ringkasan-jadwal">
        Ringkasan jadwal
      </h2>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <StatusBadge status={session.status} />
        <TextLink className="text-meta" href={`/id/pelatihan/${session.courseSlug}#jadwal-sesi`}>
          Ganti jadwal
        </TextLink>
      </div>
      <p className="mt-4 text-h3 text-navy-950">
        <Link
          className="underline-offset-4 hover:text-blue-600 hover:underline"
          href={`/id/pelatihan/${session.courseSlug}`}
        >
          {session.courseTitle}
        </Link>
      </p>
      <dl className="mt-5 grid gap-x-8 gap-y-4 border-t border-line-subtle pt-5 text-meta md:grid-cols-2">
        <Item label="Tanggal">
          {session.dates}
          <br />
          {session.time}
        </Item>
        <Item label="Lokasi dan format">
          {session.format} · {session.venue}
        </Item>
        <Item label="Biaya">
          {session.fee ? (
            <>
              <span className="numeric text-ui font-semibold text-navy-950">
                {formatRupiah(session.fee)}
              </span>
              {session.taxWording ? (
                <span className="block text-slate-600">{session.taxWording}</span>
              ) : null}
            </>
          ) : (
            FEE_ON_REQUEST
          )}
        </Item>
        {session.deadline ? <Item label="Batas pendaftaran">{session.deadline}</Item> : null}
        <Item label="Kode jadwal">
          <span className="numeric">{session.id}</span>
        </Item>
      </dl>
    </section>
  )
}

function Item({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div>
      <dt className="text-slate-600">{label}</dt>
      <dd className="numeric mt-1 text-ui text-navy-950">{children}</dd>
    </div>
  )
}

function WhatsAppStep({
  kind,
  session,
  settings: siteSettings,
}: {
  kind: 'register' | 'waitlist'
  session: RegistrationSession
  settings: SiteSettings
}) {
  const message = whatsappMessage(session, kind)
  const href = whatsappUrl(siteSettings.whatsappNumber, message)
  const isWaitlist = kind === 'waitlist'

  return (
    <>
      <section
        className="mt-8 border-l-4 border-navy-800 bg-paper p-5 md:p-6"
        aria-labelledby="bukan-pemesanan"
      >
        <h2 className="text-ui font-semibold text-navy-950" id="bukan-pemesanan">
          {isWaitlist
            ? 'Jadwal ini penuh. Anda bisa minta masuk daftar tunggu.'
            : 'Ini permintaan pendaftaran, bukan pemesanan'}
        </h2>
        <p className="mt-2 text-body text-navy-800">
          {isWaitlist
            ? 'Admin menghubungi Anda lewat WhatsApp jika ada kursi kosong. Masuk daftar tunggu belum menjamin kursi.'
            : 'Kursi Anda dikonfirmasi oleh admin BKI Academy lewat WhatsApp. Tidak ada pembayaran online di situs ini.'}
        </p>
      </section>

      <section aria-labelledby="siapkan-data" className="mt-10">
        <h2 className="text-h3 text-navy-950" id="siapkan-data">
          Siapkan data berikut untuk dikirim di WhatsApp
        </h2>
        <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-body text-navy-800 marker:text-blue-600">
          <li>Nama lengkap</li>
          <li>Email</li>
          <li>Nomor WhatsApp yang aktif</li>
          <li>Perusahaan, jika didaftarkan oleh perusahaan</li>
          <li>Biaya ditanggung pribadi atau perusahaan</li>
        </ul>
        <p className="mt-3 text-meta text-slate-600">
          Data ini Anda ketik sendiri di WhatsApp. Situs ini tidak menyimpan data pendaftaran.
        </p>
      </section>

      <section aria-labelledby="pratinjau-pesan" className="mt-10">
        <h2 className="text-h3 text-navy-950" id="pratinjau-pesan">
          Pesan yang terisi otomatis
        </h2>
        <p className="mt-4 rounded-card border border-line-subtle bg-paper p-4 text-meta whitespace-pre-line text-navy-800">
          {message}
        </p>
      </section>

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
        <Button asChild className="w-full md:w-auto">
          <a
            data-analytics="whatsapp_registration_click"
            data-analytics-session={session.id}
            href={href}
            rel="noopener"
            target="_blank"
          >
            <MessageCircle aria-hidden />
            {isWaitlist ? 'Minta Masuk Daftar Tunggu' : 'Lanjutkan ke WhatsApp'}
            <span className="sr-only"> (membuka WhatsApp di jendela baru)</span>
            <ButtonArrow />
          </a>
        </Button>
        <p className="text-meta text-slate-600">
          Membuka WhatsApp ke <span className="numeric">{siteSettings.whatsappDisplay}</span>
        </p>
      </div>

      <section aria-labelledby="alternatif" className="mt-8">
        <h2 className="text-ui font-semibold text-navy-950" id="alternatif">
          Tidak bisa memakai WhatsApp?
        </h2>
        <ul className="mt-3 flex flex-col gap-2 text-body md:flex-row md:gap-6">
          <li className="flex items-center gap-2">
            <Mail aria-hidden className="size-5 text-slate-600" />
            <TextLink
              data-analytics="contact_click"
              data-analytics-channel="email"
              data-analytics-location="pendaftaran"
              href={`mailto:${siteSettings.email}?subject=${encodeURIComponent(`Pendaftaran ${session.id}`)}`}
            >
              {siteSettings.email}
            </TextLink>
          </li>
          <li className="flex items-center gap-2">
            <Phone aria-hidden className="size-5 text-slate-600" />
            <TextLink
              data-analytics="contact_click"
              data-analytics-channel="phone"
              data-analytics-location="pendaftaran"
              href={`tel:${siteSettings.phoneHref}`}
            >
              {siteSettings.phone}
            </TextLink>
          </li>
        </ul>
        <p className="mt-2 text-meta text-slate-600">
          Sebutkan kode jadwal <span className="numeric font-medium">{session.id}</span>.
        </p>
      </section>

      <section aria-labelledby="selanjutnya" className="mt-12 border-t border-line-subtle pt-8">
        <h2 className="text-h3 text-navy-950" id="selanjutnya">
          Apa yang terjadi selanjutnya
        </h2>
        <ol className="mt-4 flex list-decimal flex-col gap-2 pl-5 text-body text-navy-800 marker:font-semibold">
          <li>Kirim pesan di WhatsApp dan lengkapi data Anda.</li>
          <li>Admin membalas pada jam layanan ({siteSettings.serviceHours}).</li>
          <li>Admin mengonfirmasi ketersediaan kursi dan mengirim informasi pembayaran.</li>
          <li>Perubahan atau pembatalan juga dikonfirmasi oleh admin.</li>
        </ol>
        <p className="mt-6 text-meta text-slate-600">
          Dengan melanjutkan, Anda menyetujui{' '}
          <TextLink href="/id/ketentuan-pendaftaran">Ketentuan Pendaftaran</TextLink> dan{' '}
          <TextLink href="/id/kebijakan-privasi">Kebijakan Privasi</TextLink>.
        </p>
      </section>
    </>
  )
}

function NotAvailable({
  session,
  sessions,
}: {
  session: RegistrationSession
  sessions: SiteSession[]
}) {
  const alternatives = alternativeSessions(session, sessions)
  const reason = session.hasStarted
    ? 'Jadwal ini sudah dimulai atau sudah lewat.'
    : session.status === 'not-open'
      ? 'Pendaftaran untuk jadwal ini belum dibuka.'
      : session.status === 'postponed'
        ? (session.postponementMessage ?? 'Jadwal ini ditunda.')
        : session.status === 'cancelled'
          ? 'Jadwal ini dibatalkan.'
          : session.status === 'full'
            ? 'Kursi untuk jadwal ini sudah penuh.'
            : 'Pendaftaran untuk jadwal ini sudah ditutup.'

  return (
    <section aria-labelledby="tidak-tersedia" className="mt-8">
      <FeedbackPanel
        action={
          <>
            <Button asChild>
              <Link href={`/id/pelatihan/${session.courseSlug}#jadwal-sesi`}>
                Lihat Jadwal Lain
              </Link>
            </Button>
            <TextLink className="self-center" href="/id/hubungi-kami">
              Tanyakan Jadwal
            </TextLink>
          </>
        }
        title="Pendaftaran untuk jadwal ini tidak tersedia"
        tone="warning"
      >
        <span id="tidak-tersedia">{reason}</span>
      </FeedbackPanel>

      {alternatives.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-h3 text-navy-950">Jadwal lain yang dibuka</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {alternatives.map((alt) => (
              <li key={alt.id}>
                <Link
                  className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-line-subtle p-4 transition-colors duration-(--motion-fast) hover:border-blue-600"
                  href={`/id/pendaftaran?session=${alt.id}`}
                >
                  <span className="numeric text-ui font-semibold text-navy-950">
                    {formatDateRange(alt.startDate, alt.endDate)}
                  </span>
                  <span className="text-meta text-navy-800">
                    {alt.format} · {alt.venue}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
