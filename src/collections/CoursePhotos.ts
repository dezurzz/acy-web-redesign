import type { CollectionBeforeValidateHook, CollectionConfig } from 'payload'
import { ValidationError } from 'payload'

import { onlyPublishersCanPublish } from '../access/publishing'
import { canEditContent, publishedOrContentStaff } from '../access/roles'

/*
 * Training photos: a few chosen photos per course, from earlier runs of that course. A portfolio,
 * not an archive: no batch numbers or dates, and the full documentation stays on Instagram.
 * Feeds the homepage "Dalam Kelas" section now, and later the course pages.
 * Photos of identifiable people need permission (decision B-05, UU PDP 27/2022), so an entry can
 * only be published once staff confirm it and note who gave it.
 */
const requirePermission: CollectionBeforeValidateHook = ({ data, originalDoc }) => {
  const merged = { ...originalDoc, ...data }
  const errors: { path: string; message: string }[] = []

  if (data?._status === 'published') {
    if (!merged.photoPermission) {
      errors.push({
        path: 'photoPermission',
        message: 'Foto hanya dapat diterbitkan setelah izin publikasi dikonfirmasi (B-05).',
      })
    } else if (!merged.permissionNote?.trim()) {
      errors.push({ path: 'permissionNote', message: 'Catat siapa yang memberi izin dan kapan.' })
    }
  }

  if (errors.length) throw new ValidationError({ collection: 'course-photos', errors })
  return data
}

export const CoursePhotos: CollectionConfig = {
  slug: 'course-photos',
  labels: { singular: 'Foto pelatihan', plural: 'Foto pelatihan' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'featured', 'homeOrder', 'updatedAt', '_status'],
    group: 'Pelatihan',
    description:
      'Beberapa foto terbaik per pelatihan, dari kelas sebelumnya. Dokumentasi lengkap cukup di Instagram.',
  },
  defaultSort: '-updatedAt',
  versions: { drafts: true, maxPerDoc: 50 },
  access: {
    read: publishedOrContentStaff,
    create: canEditContent,
    update: canEditContent,
    delete: canEditContent,
  },
  hooks: {
    beforeValidate: [requirePermission],
    beforeChange: [
      onlyPublishersCanPublish,
      // Admin list title: the course name, so staff find entries by course.
      async ({ data, req }) => {
        const id = typeof data.course === 'object' ? data.course?.id : data.course
        if (id) {
          const course = await req.payload.findByID({
            collection: 'courses',
            id,
            depth: 0,
            draft: true,
            overrideAccess: true,
            req,
          })
          data.title = course?.title
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'course',
      label: 'Pelatihan',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Satu entri per pelatihan.' },
    },
    {
      name: 'title',
      type: 'text',
      admin: { hidden: true },
    },
    {
      name: 'photos',
      label: 'Foto',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 6,
      labels: { singular: 'Foto', plural: 'Foto' },
      admin: {
        description:
          'Pilih foto terbaik saja (maksimal 6), foto asli dari kamera, bukan desain unggahan media sosial. Foto pertama jadi sampul. Hindari foto dengan nama atau logo klien yang terbaca.',
      },
      fields: [
        { name: 'image', label: 'Gambar', type: 'upload', relationTo: 'media', required: true },
        {
          name: 'caption',
          label: 'Keterangan',
          type: 'text',
          admin: { description: 'Opsional. Contoh: Praktik pengukuran di laboratorium.' },
        },
      ],
    },
    {
      name: 'featured',
      label: 'Tampilkan di Beranda',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Beranda menampilkan sampul dari tiga pelatihan yang dicentang.',
      },
    },
    {
      name: 'homeOrder',
      label: 'Urutan di Beranda',
      type: 'number',
      min: 1,
      max: 3,
      admin: {
        position: 'sidebar',
        description: '1 = foto besar, 2 dan 3 di sampingnya. Kosong = setelah yang bernomor.',
        condition: (_, sibling) => Boolean(sibling?.featured),
      },
    },
    {
      name: 'photoPermission',
      label: 'Izin publikasi foto sudah ada',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Wajib sebelum terbit: peserta yang terlihat jelas sudah setuju fotonya dipublikasikan (B-05).',
      },
    },
    {
      name: 'permissionNote',
      label: 'Catatan izin (internal)',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description: 'Siapa yang memberi izin, kapan, dan bagaimana. Tidak tampil di situs.',
      },
    },
  ],
}
