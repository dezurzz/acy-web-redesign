'use client'

import * as React from 'react'

import { submitEnquiry, type EnquiryResult } from '@/app/(frontend)/id/in-house/actions'
import { Button } from '@/components/ui/button'
import { track } from '@/lib/analytics'
import { ErrorSummary } from '@/components/ui/error-summary'
import { FeedbackPanel } from '@/components/ui/feedback-panel'
import { Choice, ChoiceGroup, Field, Input, Textarea } from '@/components/ui/field'
import { TextLink } from '@/components/ui/text-link'
import {
  deliveryOptions,
  enquiryFields,
  fieldId,
  HONEYPOT_FIELD,
  LIMITS,
  participantOptions,
  readEnquiry,
  validateEnquiry,
  type EnquiryErrors,
} from '@/lib/enquiry'

type Props = {
  /** "gagal" makes the submit fail (development only), so the failure state can be reviewed. */
  simulate?: string
  whatsappHref: string
}

/*
 * Corporate enquiry form (PRD §6, design.md §8, animations.md §5.7).
 * - Rules are checked in the browser first, then again on the server.
 * - Invalid submit: error summary appears immediately and takes focus; every value stays.
 * - While sending: the button says "Mengirim…" and cannot be pressed twice.
 * - Success is shown only after the server has saved the request (PRD §8.3), with its reference.
 * - Failure keeps the form filled with a retry. One request key per filled-in form, reused on
 *   retries, so a double click or a retry after a lost answer never creates a second request.
 */
export function EnquiryForm({ simulate, whatsappHref }: Props) {
  const [errors, setErrors] = React.useState<EnquiryErrors>({})
  const [summaryKey, setSummaryKey] = React.useState(0)
  const [result, setResult] = React.useState<EnquiryResult | null>(null)
  const [pending, startTransition] = React.useTransition()
  const successRef = React.useRef<HTMLDivElement>(null)
  // Made on the first submit (not during render, so server and browser HTML match).
  const requestKey = React.useRef<string | null>(null)
  const trackedKey = React.useRef<string | null>(null)

  React.useEffect(() => {
    if (result?.status === 'saved') successRef.current?.focus()
  }, [result])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    const data = new FormData(event.currentTarget)
    const found = validateEnquiry(readEnquiry(data))
    setErrors(found)
    setResult(null)
    if (Object.keys(found).length > 0) {
      setSummaryKey((k) => k + 1) // re-mount so focus moves to the summary on every invalid submit
      return
    }
    requestKey.current ??= crypto.randomUUID()
    data.set('kunci', requestKey.current)
    startTransition(async () => {
      try {
        const response = await submitEnquiry(data)
        if (response.status === 'invalid') {
          setErrors(response.errors)
          setSummaryKey((k) => k + 1)
        }
        setResult(response)
        // Counted only after the server saved it (PRD §9), once per request even if retried.
        if (response.status === 'saved' && trackedKey.current !== requestKey.current) {
          trackedKey.current = requestKey.current
          track({ name: 'corporate_enquiry_success' })
        }
      } catch {
        setResult({ status: 'failed' })
      }
    })
  }

  if (result?.status === 'saved') {
    return (
      <div className="flex flex-col gap-4" ref={successRef} tabIndex={-1}>
        <FeedbackPanel
          action={
            <Button
              onClick={() => {
                requestKey.current = null // a new form fill is a new request
                setResult(null)
              }}
              variant="secondary"
            >
              Kirim permintaan lain
            </Button>
          }
          title="Kebutuhan pelatihan Anda sudah kami terima"
          tone="success"
        >
          <p>Simpan nomor referensi ini. Tim kami akan menghubungi Anda.</p>
          <p className="mt-3">
            Nomor referensi: <strong className="numeric">{result.reference}</strong> · Topik:{' '}
            {result.topic}
          </p>
        </FeedbackPanel>
      </div>
    )
  }

  const errorList = enquiryFields
    .filter((f) => errors[f])
    .map((f) => ({
      fieldId: f === 'peserta' || f === 'format' ? `${fieldId(f)}-0` : fieldId(f),
      message: errors[f]!,
    }))
  const fieldProps = (field: (typeof enquiryFields)[number]) => ({
    error: errors[field],
    id: fieldId(field),
  })

  return (
    <form className="flex flex-col gap-6" noValidate onSubmit={handleSubmit}>
      {errorList.length > 0 ? <ErrorSummary errors={errorList} key={summaryKey} /> : null}

      {result?.status === 'limited' ? (
        <FeedbackPanel title="Terlalu banyak permintaan dari perangkat ini" tone="error">
          Data Anda tetap tersedia di formulir. Coba kirim lagi dalam beberapa menit, atau hubungi
          kami lewat WhatsApp.
        </FeedbackPanel>
      ) : null}

      {result?.status === 'failed' ? (
        <FeedbackPanel
          action={
            <Button loading={pending} loadingText="Mengirim…" type="submit">
              Coba lagi
            </Button>
          }
          title="Permintaan belum berhasil dikirim"
          tone="error"
        >
          Data Anda tetap tersedia di formulir. Silakan coba lagi, atau hubungi kami lewat WhatsApp.
        </FeedbackPanel>
      ) : null}

      <p className="text-meta text-slate-600">
        Semua kolom wajib diisi, kecuali yang bertanda opsional.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Nama kontak" {...fieldProps('nama')}>
          {({ describedBy, invalid }) => (
            <Input
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              autoComplete="name"
              id={fieldId('nama')}
              maxLength={LIMITS.short}
              name="nama"
            />
          )}
        </Field>
        <Field helper="Contoh: nama@perusahaan.co.id" label="Email kantor" {...fieldProps('email')}>
          {({ describedBy, invalid }) => (
            <Input
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              autoComplete="email"
              id={fieldId('email')}
              inputMode="email"
              maxLength={LIMITS.short}
              name="email"
              type="email"
            />
          )}
        </Field>
        <Field label="Perusahaan" {...fieldProps('perusahaan')}>
          {({ describedBy, invalid }) => (
            <Input
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              autoComplete="organization"
              id={fieldId('perusahaan')}
              maxLength={LIMITS.short}
              name="perusahaan"
            />
          )}
        </Field>
        <Field
          helper="Contoh: 0812 3456 7890"
          label="Nomor telepon atau WhatsApp"
          {...fieldProps('telepon')}
        >
          {({ describedBy, invalid }) => (
            <Input
              aria-describedby={describedBy}
              aria-invalid={invalid || undefined}
              autoComplete="tel"
              id={fieldId('telepon')}
              inputMode="tel"
              maxLength={LIMITS.short}
              name="telepon"
              type="tel"
            />
          )}
        </Field>
      </div>

      <Field
        helper="Contoh: Internal Auditor ISM Code, stabilitas kapal"
        label="Topik pelatihan"
        {...fieldProps('topik')}
      >
        {({ describedBy, invalid }) => (
          <Input
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            id={fieldId('topik')}
            maxLength={LIMITS.short}
            name="topik"
          />
        )}
      </Field>

      <div className="grid gap-6 md:grid-cols-2">
        <ChoiceGroup
          error={errors.peserta}
          id={`${fieldId('peserta')}-grup`}
          legend="Perkiraan jumlah peserta"
        >
          {participantOptions.map((option, index) => (
            <Choice
              aria-invalid={errors.peserta ? true : undefined}
              id={`${fieldId('peserta')}-${index}`}
              key={option.value}
              label={option.label}
              name="peserta"
              type="radio"
              value={option.value}
            />
          ))}
        </ChoiceGroup>
        <ChoiceGroup
          error={errors.format}
          id={`${fieldId('format')}-grup`}
          legend="Lokasi atau format"
        >
          {deliveryOptions.map((option, index) => (
            <Choice
              aria-invalid={errors.format ? true : undefined}
              id={`${fieldId('format')}-${index}`}
              key={option.value}
              label={option.label}
              name="format"
              type="radio"
              value={option.value}
            />
          ))}
        </ChoiceGroup>
      </div>

      <Field
        helper="Contoh: Maret 2027, atau kuartal II 2027"
        label="Waktu yang diinginkan"
        {...fieldProps('waktu')}
      >
        {({ describedBy, invalid }) => (
          <Input
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            id={fieldId('waktu')}
            maxLength={LIMITS.short}
            name="waktu"
          />
        )}
      </Field>

      <Field
        helper="Misalnya jenis kapal, kebutuhan sertifikasi, atau bahasa pengantar. Jangan cantumkan data pribadi peserta."
        label="Kebutuhan lain"
        optional
        {...fieldProps('kebutuhan')}
      >
        {({ describedBy, invalid }) => (
          <Textarea
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            id={fieldId('kebutuhan')}
            maxLength={LIMITS.long}
            name="kebutuhan"
          />
        )}
      </Field>

      <ChoiceGroup error={errors.setuju} id={`${fieldId('setuju')}-grup`} legend="Persetujuan">
        <Choice
          aria-invalid={errors.setuju ? true : undefined}
          id={fieldId('setuju')}
          label="Saya telah membaca Kebijakan Privasi dan setuju data ini dipakai untuk menindaklanjuti permintaan saya."
          name="setuju"
          type="checkbox"
          value="ya"
        />
      </ChoiceGroup>
      <TextLink className="-mt-4 self-start text-meta" href="/id/kebijakan-privasi">
        Baca Kebijakan Privasi
      </TextLink>

      {simulate ? <input name="simulasi" type="hidden" value={simulate} /> : null}

      {/* Honeypot: off-screen and skipped by keyboard and screen readers; people never fill it. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={HONEYPOT_FIELD}>Jangan isi kolom ini</label>
        <input
          autoComplete="off"
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          tabIndex={-1}
          type="text"
        />
      </div>

      <div className="flex flex-col gap-4 border-t border-line-subtle pt-6 md:flex-row md:items-center md:gap-6">
        <Button
          className="w-full md:w-auto"
          loading={pending}
          loadingText="Mengirim…"
          type="submit"
        >
          Kirim Kebutuhan Pelatihan
        </Button>
        <TextLink
          data-analytics="contact_click"
          data-analytics-channel="whatsapp"
          data-analytics-location="in-house"
          href={whatsappHref}
          rel="noopener"
          target="_blank"
        >
          Atau chat lewat WhatsApp
          <span className="sr-only"> (membuka WhatsApp di jendela baru)</span>
        </TextLink>
      </div>
    </form>
  )
}
