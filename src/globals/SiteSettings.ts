import type { GlobalConfig } from 'payload'

import { hasRole } from '../access/roles'
import {
  defaultSettings,
  isSafeExternalUrl,
  isValidWhatsApp,
  normaliseWhatsApp,
} from '../lib/site-settings'

/*
 * "Pengaturan situs" (PRD §6, §7): contacts and links shown across the public site.
 * Everyone can read it (it is public contact information). Only admins and publishers can change
 * it, because a wrong WhatsApp number breaks every registration request.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Pengaturan situs',
  admin: { group: 'Pengaturan' },
  access: {
    read: () => true,
    update: ({ req: { user } }) => hasRole(user, 'admin', 'publisher'),
  },
  fields: [
    {
      name: 'contactsConfirmed',
      label: 'Kontak sudah dikonfirmasi',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Centang setelah setiap nomor, email, dan alamat diuji (D-05). Selama belum dicentang, situs menampilkan peringatan bahwa kontak masih contoh.',
      },
    },
    {
      type: 'collapsible',
      label: 'Kontak',
      fields: [
        {
          name: 'whatsappNumber',
          label: 'Nomor WhatsApp admin',
          type: 'text',
          required: true,
          defaultValue: defaultSettings.whatsappNumber,
          admin: {
            description:
              'Nomor untuk pendaftaran dan pertanyaan. Boleh ditulis 0812… atau +62 812…; disimpan sebagai 62812….',
          },
          hooks: {
            beforeValidate: [
              ({ value }) => (typeof value === 'string' ? normaliseWhatsApp(value) : value),
            ],
          },
          validate: (value: string | null | undefined) =>
            value && isValidWhatsApp(value)
              ? true
              : 'Masukkan nomor WhatsApp yang lengkap, contoh 0812 3456 7890.',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'phone',
              label: 'Telepon kantor',
              type: 'text',
              required: true,
              defaultValue: defaultSettings.phone,
              admin: {
                description: 'Tulis seperti yang dibaca pengunjung, contoh (021) 1234-5678.',
              },
            },
            {
              name: 'email',
              label: 'Email',
              type: 'email',
              required: true,
              defaultValue: defaultSettings.email,
            },
          ],
        },
        {
          name: 'serviceHours',
          label: 'Jam layanan',
          type: 'text',
          required: true,
          defaultValue: defaultSettings.serviceHours,
          admin: { description: 'Contoh: Senin–Jumat, 08.00–16.00 WIB' },
        },
        {
          name: 'address',
          label: 'Alamat',
          type: 'textarea',
          required: true,
          defaultValue: defaultSettings.address,
          admin: { description: 'Satu baris alamat per baris.' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Portal Peserta',
      admin: {
        description:
          'Isi hanya setelah alamat sistem dikonfirmasi dan diuji (D-07). Selama kosong, Portal Peserta menulis “Tautan menyusul”.',
      },
      fields: [
        {
          name: 'portalUrl',
          label: 'Alamat portal akun dan materi',
          type: 'text',
          validate: (value: string | null | undefined) =>
            !value || isSafeExternalUrl(value)
              ? true
              : 'Gunakan alamat lengkap yang diawali https://',
        },
        {
          name: 'certificateUrl',
          label: 'Alamat sistem sertifikat',
          type: 'text',
          validate: (value: string | null | undefined) =>
            !value || isSafeExternalUrl(value)
              ? true
              : 'Gunakan alamat lengkap yang diawali https://',
        },
      ],
    },
  ],
}
