import type { Access, CollectionConfig } from 'payload'

import { hasRole } from '../access/roles'
import { deliveryOptions, participantOptions } from '../lib/enquiry'

/*
 * Corporate enquiries: the staff queue for the In-house form (PRD §6 Corporate training, §7 Enquiry,
 * §8.3, AC-05; decision D-12 default). Requests are created only by the server action
 * (src/app/(frontend)/id/in-house/actions.ts) with overrideAccess, never through the public API.
 * Personal data: only administrators and enquiry staff can read or work on it (PRD §7 roles);
 * what the customer sent is read-only, so the record stays what they submitted.
 * Retention is not decided yet (D-10): nothing is deleted automatically.
 */
const enquiryStaff: Access = ({ req: { user } }) => hasRole(user, 'admin', 'enquiry')

export const enquiryStatusOptions = [
  { label: 'Baru', value: 'baru' },
  { label: 'Sudah dihubungi', value: 'dihubungi' },
  { label: 'Penawaran dikirim', value: 'penawaran' },
  { label: 'Selesai', value: 'selesai' },
  { label: 'Batal / tidak lanjut', value: 'batal' },
] as const

const fromCustomer = { readOnly: true }

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  labels: { singular: 'Permintaan in-house', plural: 'Permintaan in-house' },
  admin: {
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'company', 'topic', 'status', 'assignedTo', 'createdAt'],
    group: 'Permintaan',
    description:
      'Permintaan pelatihan in-house dari formulir situs. Ubah status saat ditindaklanjuti; data dari pelanggan tidak dapat diubah.',
    listSearchableFields: ['reference', 'company', 'contactName', 'email', 'topic'],
  },
  defaultSort: '-createdAt',
  timestamps: true,
  access: {
    read: enquiryStaff,
    update: enquiryStaff,
    // Only the website's server action creates requests (it bypasses access control).
    create: () => false,
    delete: ({ req: { user } }) => hasRole(user, 'admin'),
  },
  fields: [
    {
      name: 'reference',
      label: 'Nomor referensi',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { readOnly: true, description: 'Nomor yang dilihat pelanggan, contoh INH-7K3P2Q.' },
    },
    {
      name: 'type',
      label: 'Jenis',
      type: 'select',
      required: true,
      defaultValue: 'corporate',
      options: [{ label: 'Pelatihan in-house', value: 'corporate' }],
      admin: { readOnly: true, position: 'sidebar' },
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      defaultValue: 'baru',
      index: true,
      options: [...enquiryStatusOptions],
      admin: { position: 'sidebar' },
    },
    {
      name: 'assignedTo',
      label: 'Ditangani oleh',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar' },
    },
    {
      name: 'internalNotes',
      label: 'Catatan internal',
      type: 'textarea',
      admin: { position: 'sidebar', description: 'Hanya untuk staf. Tidak dikirim ke pelanggan.' },
    },
    {
      name: 'notificationStatus',
      label: 'Notifikasi email',
      type: 'select',
      required: true,
      defaultValue: 'menunggu',
      options: [
        { label: 'Menunggu (penyedia email belum dipilih, T-04)', value: 'menunggu' },
        { label: 'Terkirim', value: 'terkirim' },
        { label: 'Gagal', value: 'gagal' },
      ],
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Diisi oleh pengirim notifikasi setelah penyedia email tersedia (PRD §8.3).',
      },
    },
    {
      type: 'collapsible',
      label: 'Data dari pelanggan',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'contactName',
              label: 'Nama kontak',
              type: 'text',
              required: true,
              admin: fromCustomer,
            },
            {
              name: 'company',
              label: 'Perusahaan',
              type: 'text',
              required: true,
              admin: fromCustomer,
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'email', label: 'Email', type: 'email', required: true, admin: fromCustomer },
            {
              name: 'phone',
              label: 'Telepon / WhatsApp',
              type: 'text',
              required: true,
              admin: fromCustomer,
            },
          ],
        },
        {
          name: 'topic',
          label: 'Topik pelatihan',
          type: 'text',
          required: true,
          admin: fromCustomer,
        },
        {
          type: 'row',
          fields: [
            {
              name: 'participants',
              label: 'Perkiraan peserta',
              type: 'select',
              required: true,
              options: participantOptions.map((o) => ({ label: o.label, value: o.value })),
              admin: fromCustomer,
            },
            {
              name: 'deliveryFormat',
              label: 'Lokasi / format',
              type: 'select',
              required: true,
              options: deliveryOptions.map((o) => ({ label: o.label, value: o.value })),
              admin: fromCustomer,
            },
            {
              name: 'timing',
              label: 'Perkiraan waktu',
              type: 'text',
              required: true,
              admin: fromCustomer,
            },
          ],
        },
        { name: 'needs', label: 'Kebutuhan lain', type: 'textarea', admin: fromCustomer },
        {
          type: 'row',
          fields: [
            {
              name: 'consentAt',
              label: 'Persetujuan privasi',
              type: 'date',
              required: true,
              admin: { ...fromCustomer, date: { pickerAppearance: 'dayAndTime' } },
            },
            {
              name: 'policyVersion',
              label: 'Versi Kebijakan Privasi',
              type: 'text',
              required: true,
              admin: fromCustomer,
            },
          ],
        },
      ],
    },
    // Duplicate protection (PRD §8.3): one request per form fill, enforced by the database.
    {
      name: 'idempotencyKey',
      type: 'text',
      // Never returned by the API; only the server (overrideAccess) reads it.
      access: { read: () => false, update: () => false },
      required: true,
      unique: true,
      index: true,
      admin: { hidden: true },
    },
    // Spam rate limit: a keyed hash of the sender's IP address, never the address itself.
    {
      name: 'sourceHash',
      type: 'text',
      // Never returned by the API; only the server (overrideAccess) reads it.
      access: { read: () => false, update: () => false },
      index: true,
      admin: { hidden: true },
    },
  ],
}
