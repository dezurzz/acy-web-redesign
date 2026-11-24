import type { CollectionConfig, Field } from 'payload'

import { onlyPublishersCanPublish } from '../access/publishing'
import { canEditContent, publishedOrContentStaff } from '../access/roles'
import { slugField } from '../fields/slug'
import { formatOptions } from '../lib/options'

/** A plain list of short points (one row per point), rendered as a bulleted list. */
const pointList = (name: string, label: string, description: string): Field => ({
  name,
  label,
  type: 'array',
  labels: { singular: 'Poin', plural: 'Poin' },
  admin: { description },
  fields: [{ name: 'text', label: 'Poin', type: 'text', required: true }],
})

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
            {
              name: 'summary',
              label: 'Ringkasan',
              type: 'textarea',
              required: true,
              maxLength: 320,
              admin: {
                description: 'Satu kalimat manfaat utama. Tampil di kartu dan di bawah judul.',
              },
            },
            pointList('audience', 'Untuk siapa', 'Satu kelompok peserta per baris.'),
            pointList('outcomes', 'Yang akan Anda kuasai', 'Satu hasil belajar per baris.'),
            {
              type: 'row',
              fields: [
                {
                  name: 'duration',
                  label: 'Durasi',
                  type: 'text',
                  admin: { description: 'Contoh: 3 hari' },
                },
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
            {
              name: 'syllabus',
              label: 'Silabus',
              type: 'array',
              labels: { singular: 'Bagian silabus', plural: 'Silabus' },
              admin: { description: 'Biasanya satu bagian per hari. Tampil sebagai akordeon.' },
              fields: [
                {
                  name: 'title',
                  label: 'Judul bagian',
                  type: 'text',
                  required: true,
                  admin: { description: 'Contoh: Hari 1: Dasar ISM Code' },
                },
                {
                  name: 'topics',
                  label: 'Topik',
                  type: 'textarea',
                  required: true,
                  admin: { description: 'Satu topik per baris.' },
                },
              ],
            },
            {
              name: 'prerequisites',
              label: 'Prasyarat',
              type: 'textarea',
              admin: { description: 'Kosongkan jika tidak ada prasyarat khusus.' },
            },
            { name: 'deliveryMethod', label: 'Metode pembelajaran', type: 'textarea' },
            {
              name: 'certificateWording',
              label: 'Keterangan sertifikat',
              type: 'textarea',
              admin: {
                description:
                  'Satu kalimat. Jangan menulis klaim pengakuan yang belum diverifikasi (D-04).',
              },
            },
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
