import type { Metadata } from 'next'

import { CourseCard } from '@/components/site/CourseCard'
import { SessionRow, type SessionRowProps } from '@/components/site/SessionRow'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Breadcrumbs } from '@/components/ui/breadcrumbs'
import { Button, ButtonArrow } from '@/components/ui/button'
import { Choice, ChoiceGroup, Field, Input, Select, Textarea } from '@/components/ui/field'
import { FeedbackPanel } from '@/components/ui/feedback-panel'
import { StatusBadge, type SessionDisplayStatus } from '@/components/ui/status-badge'
import { StepIndicator } from '@/components/ui/step-indicator'
import { TextLink } from '@/components/ui/text-link'

import { ErrorSummaryDemo, LoadMoreDemo } from './demos'

export const metadata: Metadata = { title: 'Styleguide' }

const colours = [
  ['navy-950', 'bg-navy-950'],
  ['navy-800', 'bg-navy-800'],
  ['blue-700', 'bg-blue-700'],
  ['blue-600', 'bg-blue-600'],
  ['blue-800', 'bg-blue-800'],
  ['cyan-400', 'bg-cyan-400'],
  ['blue-50', 'bg-blue-50'],
  ['paper', 'bg-paper'],
  ['slate-600', 'bg-slate-600'],
  ['line-subtle', 'bg-line-subtle'],
  ['line-control', 'bg-line-control'],
] as const

const allStatuses: SessionDisplayStatus[] = [
  'open',
  'not-open',
  'full',
  'full-waitlist',
  'closed',
  'postponed',
  'cancelled',
  'completed',
]

// Sample data for the styleguide only. Not real inventory (design.md §10).
const longTitle =
  'IMO Model Course 3.25 Security Awareness Training for All Port Facility Personnel with Designated Security Duties'

const sessionBase: Omit<SessionRowProps, 'status'> = {
  courseHref: '/id/pelatihan/contoh',
  courseTitle: 'Ship Security Officer (SSO)',
  endDate: '2026-10-23T09:00:00+07:00',
  fee: 9500000,
  format: 'Tatap muka',
  registerHref: '/id/pendaftaran?session=contoh',
  startDate: '2026-10-21T09:00:00+07:00',
  taxWording: 'Belum termasuk PPN 11%',
  time: '09.00–16.00 WIB',
  venue: 'BKI Academy, Jakarta Utara',
}

function Section({
  children,
  id,
  title,
}: {
  children: React.ReactNode
  id: string
  title: string
}) {
  return (
    <section aria-labelledby={id} className="scroll-mt-8 border-t border-line-subtle pt-10">
      <h2 className="text-h2 text-navy-950" id={id}>
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow mb-3 text-slate-600">{children}</p>
}

// Living component sheet (replaces the separate design file, TIMELINE.md Phase 2).
// Each component shows its required states from design.md §8.
export default function StyleguidePage() {
  return (
    <div className="container-page space-y-16 py-16">
      <header className="max-w-3xl">
        <p className="eyebrow text-slate-600">Fase 2 · Prototipe</p>
        <h1 className="mt-3 text-h1 text-navy-950">Styleguide</h1>
        <p className="mt-4 text-intro text-slate-600">
          Token dan komponen BKI Academy beserta semua status yang dibutuhkan (design.md §8). Data
          di halaman ini hanya contoh.
        </p>
      </header>

      <Section id="sg-colour" title="Warna">
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {colours.map(([name, bg]) => (
            <li key={name}>
              <div className={`h-16 rounded-card border border-line-subtle ${bg}`} />
              <p className="mt-2 text-meta">{name}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 h-24 rounded-image bg-(image:--gradient-brand)" />
      </Section>

      <Section id="sg-type" title="Tipografi">
        <div className="space-y-4">
          <p className="text-display">Display</p>
          <p className="text-h1">Heading 1</p>
          <p className="text-h2">Heading 2</p>
          <p className="text-h3">Heading 3</p>
          <p className="text-intro text-slate-600">Paragraf pembuka untuk ringkasan halaman.</p>
          <p className="max-w-[65ch] text-body">
            {longTitle}. Judul panjang harus tetap terbaca utuh di layar kecil.
          </p>
          <p className="numeric text-meta text-slate-600">
            21–23 Oktober 2026 · 09.00–16.00 WIB · Rp9.500.000
          </p>
          <p className="eyebrow text-slate-600">Eyebrow</p>
        </div>
      </Section>

      <Section id="sg-buttons" title="Tombol dan tautan">
        <Label>Primer: default, panah, memuat, nonaktif</Label>
        <div className="flex flex-wrap gap-4">
          <Button>Ajukan Pendaftaran</Button>
          <Button>
            Lihat Jadwal
            <ButtonArrow />
          </Button>
          <Button loading loadingText="Mengirim…">
            Kirim Permintaan Pendaftaran
          </Button>
          <Button disabled>Pendaftaran ditutup</Button>
        </div>
        <Label>
          <span className="mt-8 block">Sekunder: default, nonaktif</span>
        </Label>
        <div className="flex flex-wrap gap-4">
          <Button variant="secondary">Lihat Detail Pelatihan</Button>
          <Button disabled variant="secondary">
            Tidak tersedia
          </Button>
        </div>
        <Label>
          <span className="mt-8 block">Tautan teks</span>
        </Label>
        <div className="flex flex-wrap gap-6">
          <TextLink href="/id/jadwal">Lihat Jadwal</TextLink>
          <TextLink arrow href="/id/pelatihan">
            Lihat semua pelatihan
          </TextLink>
        </div>
        <Label>
          <span className="mt-8 block">Fokus per permukaan (tekan Tab)</span>
        </Label>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col items-start gap-4 border border-line-subtle bg-white p-6">
            <Button>Putih</Button>
          </div>
          <div
            className="flex flex-col items-start gap-4 bg-navy-950 p-6 text-white"
            data-surface="dark"
          >
            <Button>Navy</Button>
            <TextLink href="/id" inverse>
              Tautan di navy
            </TextLink>
          </div>
          <div
            className="flex flex-col items-start gap-4 bg-(image:--gradient-brand) p-6"
            data-surface="brand"
          >
            <Button variant="secondary">Gradien</Button>
          </div>
        </div>
      </Section>

      <Section id="sg-status" title="Status jadwal">
        <ul className="flex flex-wrap gap-3">
          {allStatuses.map((status) => (
            <li key={status}>
              <StatusBadge status={status} />
            </li>
          ))}
        </ul>
      </Section>

      <Section id="sg-course-card" title="Kartu pelatihan">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CourseCard
            category="Security"
            duration="3 hari"
            formats="Tatap muka · Live online"
            href="/id/pelatihan/contoh"
            nextSession="21–23 Oktober 2026"
            outcome="Memahami tugas dan tanggung jawab Ship Security Officer sesuai ISPS Code."
            title="Ship Security Officer (SSO)"
          />
          <CourseCard
            category="Security"
            duration="1 hari"
            formats="Tatap muka"
            href="/id/pelatihan/contoh-panjang"
            nextSession="30 Oktober – 2 November 2026"
            outcome="Contoh judul panjang yang tetap utuh tanpa dipotong."
            title={longTitle}
          />
          <CourseCard
            category="Survey"
            duration="2 hari"
            formats="Live online"
            href="/id/pelatihan/contoh-kosong"
            nextSession={null}
            outcome="Kartu tanpa jadwal: tetap menampilkan detail pelatihan."
            title="Hull Inspection Fundamentals"
          />
        </div>
      </Section>

      <Section id="sg-session-row" title="Baris jadwal">
        <p className="mb-6 max-w-[65ch] text-meta text-slate-600">
          Semua delapan status. &quot;Selesai&quot; hanya muncul di arsip, tidak di jadwal utama.
        </p>
        <div className="border-t border-line-subtle">
          {allStatuses.map((status) => (
            <SessionRow
              key={status}
              {...sessionBase}
              courseTitle={status === 'not-open' ? longTitle : sessionBase.courseTitle}
              endDate={status === 'closed' ? '2026-11-02T16:00:00+07:00' : sessionBase.endDate}
              fee={status === 'not-open' ? null : sessionBase.fee}
              postponementMessage={
                status === 'postponed'
                  ? 'Ditunda karena jumlah peserta belum memenuhi. Jadwal pengganti diumumkan segera.'
                  : undefined
              }
              startDate={status === 'closed' ? '2026-10-30T09:00:00+07:00' : sessionBase.startDate}
              status={status}
            />
          ))}
        </div>
      </Section>

      <Section id="sg-form" title="Formulir">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <Field id="sg-nama" label="Nama lengkap">
              {({ describedBy, invalid }) => (
                <Input
                  aria-describedby={describedBy}
                  aria-invalid={invalid || undefined}
                  autoComplete="name"
                  id="sg-nama"
                />
              )}
            </Field>
            <Field helper="Contoh: nama@perusahaan.co.id" id="sg-email" label="Email kantor">
              {({ describedBy }) => (
                <Input
                  aria-describedby={describedBy}
                  defaultValue="rina@pelayaran.co.id"
                  id="sg-email"
                  type="email"
                />
              )}
            </Field>
            <Field
              error="Masukkan nomor WhatsApp yang aktif, contoh 0812 3456 7890."
              id="sg-wa"
              label="Nomor WhatsApp"
            >
              {({ describedBy, invalid }) => (
                <Input
                  aria-describedby={describedBy}
                  aria-invalid={invalid || undefined}
                  defaultValue="0812"
                  id="sg-wa"
                  inputMode="tel"
                />
              )}
            </Field>
            <Field id="sg-perusahaan" label="Perusahaan">
              {() => <Input defaultValue="Diisi otomatis dari akun" disabled id="sg-perusahaan" />}
            </Field>
            <Field id="sg-kategori" label="Kategori pelatihan">
              {({ describedBy }) => (
                <Select aria-describedby={describedBy} defaultValue="" id="sg-kategori">
                  <option value="">Pilih kategori</option>
                  <option>Safety</option>
                  <option>Security</option>
                  <option>Survey</option>
                </Select>
              )}
            </Field>
            <Field id="sg-kebutuhan" label="Kebutuhan pelatihan" optional>
              {({ describedBy }) => <Textarea aria-describedby={describedBy} id="sg-kebutuhan" />}
            </Field>
          </div>
          <div className="flex flex-col gap-8">
            <ChoiceGroup id="sg-format" legend="Format yang diinginkan">
              <Choice
                defaultChecked
                id="sg-format-1"
                label="Tatap muka"
                name="sg-format"
                type="radio"
              />
              <Choice
                hint="Melalui Zoom"
                id="sg-format-2"
                label="Live online"
                name="sg-format"
                type="radio"
              />
              <Choice
                disabled
                hint="Belum tersedia untuk pelatihan ini"
                id="sg-format-3"
                label="Belajar mandiri"
                name="sg-format"
                type="radio"
              />
            </ChoiceGroup>
            <ChoiceGroup
              error="Centang persetujuan untuk melanjutkan."
              id="sg-setuju"
              legend="Persetujuan"
            >
              <Choice
                aria-invalid
                id="sg-setuju-1"
                label="Saya menyetujui pemrosesan data sesuai Kebijakan Privasi."
                type="checkbox"
              />
            </ChoiceGroup>
            <div>
              <Label>Ringkasan galat (muncul setelah kirim tidak valid)</Label>
              <ErrorSummaryDemo />
            </div>
          </div>
        </div>
      </Section>

      <Section id="sg-feedback" title="Panel umpan balik">
        <div className="grid gap-6 lg:grid-cols-3">
          <FeedbackPanel
            action={<Button variant="secondary">Kembali ke Beranda</Button>}
            title="Permintaan diterima"
            tone="success"
          >
            Simpan nomor referensi <strong className="numeric">INH-2026-0142</strong>. Tim kami akan
            menghubungi Anda.
          </FeedbackPanel>
          <FeedbackPanel
            action={<Button>Coba lagi</Button>}
            title="Permintaan belum berhasil dikirim"
            tone="error"
          >
            Data Anda tetap tersedia di formulir. Silakan coba lagi.
          </FeedbackPanel>
          <FeedbackPanel
            action={<TextLink href="/id/jadwal">Lihat jadwal lain</TextLink>}
            title="Jadwal ini tidak lagi tersedia"
            tone="warning"
          >
            Pendaftaran untuk jadwal ini sudah ditutup.
          </FeedbackPanel>
        </div>
      </Section>

      <Section id="sg-nav" title="Navigasi">
        <Label>Breadcrumb (layar kecil: hanya tautan induk)</Label>
        <Breadcrumbs
          items={[
            { href: '/id', label: 'Beranda' },
            { href: '/id/pelatihan', label: 'Pelatihan' },
            { href: '/id/pelatihan?kategori=security', label: 'Security' },
            { label: longTitle },
          ]}
        />
        <div className="mt-10 grid gap-10">
          <div>
            <Label>Indikator langkah: awal</Label>
            <StepIndicator current={0} steps={['Jadwal', 'Data Pemohon', 'Tinjau', 'Selesai']} />
          </div>
          <div>
            <Label>Indikator langkah: langkah ketiga</Label>
            <StepIndicator current={2} steps={['Jadwal', 'Data Pemohon', 'Tinjau', 'Selesai']} />
          </div>
        </div>
      </Section>

      <Section id="sg-accordion" title="Akordeon (FAQ)">
        <Accordion className="max-w-3xl" type="multiple">
          <AccordionItem value="1">
            <AccordionTrigger>Apakah sertifikat diakui secara internasional?</AccordionTrigger>
            <AccordionContent>
              Lingkup pengakuan sertifikat dijelaskan di setiap halaman pelatihan setelah
              diverifikasi oleh BKI.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="2">
            <AccordionTrigger>Bagaimana cara mendaftar untuk satu perusahaan?</AccordionTrigger>
            <AccordionContent>
              Gunakan formulir In-house Training. Tim kami akan menyusun jadwal dan materi sesuai
              kebutuhan perusahaan Anda.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section id="sg-load-more" title="Tampilkan lebih banyak">
        <LoadMoreDemo />
      </Section>
    </div>
  )
}
