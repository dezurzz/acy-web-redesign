import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'
import { ValidationError } from 'payload'

import { onlyPublishersCanPublish } from '../access/publishing'
import { canEditContent, publishedOrContentStaff } from '../access/roles'
import { formatOptions, sessionStatusOptions } from '../lib/options'

const relationId = (value: unknown): number | string | undefined => {
  if (value && typeof value === 'object' && 'id' in value) return (value as { id: number | string }).id
  if (typeof value === 'number' || typeof value === 'string') return value
  return undefined
}

// PRD §7 publishing rules for sessions.
const validateSession: CollectionBeforeValidateHook = async ({ data, req, originalDoc }) => {
  const merged = { ...originalDoc, ...data }
  const errors: { path: string; message: string }[] = []

  const start = merged.startDate ? new Date(merged.startDate) : undefined
  const end = merged.endDate ? new Date(merged.endDate) : undefined
  const deadline = merged.registrationDeadline ? new Date(merged.registrationDeadline) : undefined

  if (start && end && end < start) {
    errors.push({ path: 'endDate', message: 'Tanggal selesai tidak boleh sebelum tanggal mulai.' })
  }
  if (start && deadline && deadline > start) {
    errors.push({
      path: 'registrationDeadline',
      message: 'Batas pendaftaran harus sebelum tanggal mulai.',
    })
  }
  if (merged.feePolicy === 'fixed' && (merged.fee === undefined || merged.fee === null || merged.fee <= 0)) {
    errors.push({ path: 'fee', message: 'Isi biaya, atau pilih “Hubungi kami untuk biaya”.' })
  }
  if (merged.registrationStatus === 'postponed' && !merged.postponementMessage) {
    errors.push({
      path: 'postponementMessage',
      message: 'Jadwal yang ditunda wajib memiliki pesan untuk publik.',
    })
  }

  if (data?._status === 'published') {
    const courseId = relationId(merged.course)
    if (courseId !== undefined) {
      const course = await req.payload.findByID({
        collection: 'courses',
        id: courseId,
        draft: false,
        overrideAccess: true,
        req,
      })
      if (course?._status !== 'published') {
        errors.push({
          path: 'course',
          message: 'Terbitkan pelatihan terlebih dahulu sebelum menerbitkan jadwalnya.',
        })
      }
    }
  }

  if (errors.length) throw new ValidationError({ collection: 'sessions', errors })
  return data
}

// PRD §7 Session: one dated run of a course.
export const Sessions: CollectionConfig = {
  slug: 'sessions',
  labels: { singular: 'Jadwal', plural: 'Jadwal' },
  admin: {
    useAsTitle: 'batchLabel',
    defaultColumns: ['batchLabel', 'course', 'startDate', 'registrationStatus', '_status'],
    group: 'Pelatihan',
  },
  defaultSort: 'startDate',
  versions: { drafts: true, maxPerDoc: 100 },
  access: {
    read: publishedOrContentStaff,
    create: canEditContent,
    update: canEditContent,
    delete: canEditContent,
  },
  hooks: {
    beforeValidate: [validateSession],
    beforeChange: [onlyPublishersCanPublish],
  },
  fields: [
    {
      name: 'course',
      label: 'Pelatihan',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      index: true,
    },
    {
      name: 'batchLabel',
      label: 'Label batch',
      type: 'text',
      required: true,
      admin: { description: 'Contoh: ISPS Batch 70. Hanya metadata pendukung.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          label: 'Mulai',
          type: 'date',
          required: true,
          index: true,
          timezone: true,
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
        {
          name: 'endDate',
          label: 'Selesai',
          type: 'date',
          required: true,
          timezone: true,
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
        {
          name: 'registrationDeadline',
          label: 'Batas pendaftaran',
          type: 'date',
          timezone: true,
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'format', label: 'Format', type: 'select', required: true, options: [...formatOptions] },
        {
          name: 'venue',
          label: 'Lokasi / platform',
          type: 'text',
          required: true,
          admin: { description: 'Contoh: Graha BKI, Jakarta atau Zoom' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'feePolicy',
          label: 'Kebijakan biaya',
          type: 'radio',
          required: true,
          defaultValue: 'contact',
          options: [
            { label: 'Biaya tetap', value: 'fixed' },
            { label: 'Hubungi kami untuk biaya', value: 'contact' },
          ],
        },
        {
          name: 'fee',
          label: 'Biaya',
          type: 'number',
          min: 0,
          admin: { condition: (_, sibling) => sibling?.feePolicy === 'fixed' },
        },
        {
          name: 'currency',
          label: 'Mata uang',
          type: 'select',
          defaultValue: 'IDR',
          options: [{ label: 'Rupiah (IDR)', value: 'IDR' }],
          admin: { condition: (_, sibling) => sibling?.feePolicy === 'fixed' },
        },
      ],
    },
    {
      name: 'taxWording',
      label: 'Keterangan pajak / termasuk',
      type: 'text',
      admin: { description: 'Teks yang disetujui, contoh: Belum termasuk PPN 11%.' },
    },
    {
      name: 'registrationStatus',
      label: 'Status pendaftaran',
      type: 'select',
      required: true,
      defaultValue: 'not-open',
      index: true,
      options: [...sessionStatusOptions],
      admin: { position: 'sidebar' },
    },
    {
      name: 'waitlistEnabled',
      label: 'Daftar tunggu aktif',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Aktifkan hanya jika staf dapat melayani daftar tunggu.',
        condition: (_, sibling) => sibling?.registrationStatus === 'full',
      },
    },
    {
      name: 'capacity',
      label: 'Kapasitas',
      type: 'number',
      min: 1,
      admin: { position: 'sidebar' },
    },
    {
      name: 'postponementMessage',
      label: 'Pesan penundaan',
      type: 'textarea',
      admin: { condition: (_, sibling) => sibling?.registrationStatus === 'postponed' },
    },
    {
      name: 'replacementSession',
      label: 'Jadwal pengganti',
      type: 'relationship',
      relationTo: 'sessions',
      admin: { condition: (_, sibling) => sibling?.registrationStatus === 'postponed' },
    },
  ],
}
