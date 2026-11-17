import type { CollectionConfig } from 'payload'

import { onlyPublishersCanPublish } from '../access/publishing'
import { canEditContent, publishedOrContentStaff } from '../access/roles'
import { slugField } from '../fields/slug'
import { formatOptions } from '../lib/options'

// PRD §7 Course: a stable course, never a single dated batch.
export const Courses: CollectionConfig = {
  slug: 'courses',
  labels: { singular: 'Pelatihan', plural: 'Pelatihan' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'acronym', 'category', '_status', 'updatedAt'],
    group: 'Pelatihan',
  },
  versions: { drafts: true, maxPerDoc: 50 },
  access: {
    read: publishedOrContentStaff,
    create: canEditContent,
    update: canEditContent,
    delete: canEditContent,
  },
  hooks: { beforeChange: [onlyPublishersCanPublish] },
  fields: [
    { name: 'title', label: 'Judul lengkap', type: 'text', required: true },
    slugField('title'),
    {
      type: 'row',
      fields: [
        { name: 'acronym', label: 'Akronim', type: 'text' },
        {
          name: 'aliases',
          label: 'Alias pencarian',
          type: 'text',
          hasMany: true,
          admin: { description: 'Nama lain atau ejaan yang dicari peserta.' },
        },
      ],
    },
    {
      name: 'category',
      label: 'Kategori',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'legacyOdooId',
      label: 'ID produk Odoo lama',
      type: 'text',
      admin: { position: 'sidebar', description: 'Untuk peta redirect dari situs lama.' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Ringkasan',
          fields: [
            { name: 'summary', label: 'Ringkasan', type: 'textarea', required: true, maxLength: 320 },
            { name: 'outcomes', label: 'Hasil pembelajaran', type: 'richText' },
            { name: 'audience', label: 'Peserta yang dituju', type: 'richText' },
            {
              type: 'row',
              fields: [
                { name: 'duration', label: 'Durasi', type: 'text', admin: { description: 'Contoh: 3 hari' } },
                {
                  name: 'formats',
                  label: 'Format',
                  type: 'select',
                  hasMany: true,
                  required: true,
                  options: [...formatOptions],
                },
              ],
            },
          ],
        },
        {
          label: 'Materi',
          fields: [
            { name: 'syllabus', label: 'Silabus', type: 'richText' },
            { name: 'prerequisites', label: 'Prasyarat', type: 'richText' },
            { name: 'deliveryMethod', label: 'Metode pelaksanaan', type: 'richText' },
            { name: 'certificateWording', label: 'Keterangan sertifikat', type: 'textarea' },
          ],
        },
        {
          label: 'FAQ & terkait',
          fields: [
            {
              name: 'faqs',
              label: 'FAQ',
              type: 'array',
              fields: [
                { name: 'question', label: 'Pertanyaan', type: 'text', required: true },
                { name: 'answer', label: 'Jawaban', type: 'textarea', required: true },
              ],
            },
            {
              name: 'relatedCourses',
              label: 'Pelatihan terkait',
              type: 'relationship',
              relationTo: 'courses',
              hasMany: true,
              maxRows: 4,
            },
          ],
        },
        {
          label: 'Media',
          fields: [
            { name: 'image', label: 'Gambar', type: 'upload', relationTo: 'media' },
            { name: 'brochure', label: 'Brosur (PDF)', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
  ],
}
