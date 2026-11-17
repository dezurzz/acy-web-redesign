import type { CollectionConfig } from 'payload'

import { onlyPublishersCanPublish } from '../access/publishing'
import { canEditContent, publishedOrContentStaff } from '../access/roles'
import { slugField } from '../fields/slug'

// PRD §7 Category.
export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Kategori', plural: 'Kategori' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'displayOrder', '_status'],
    group: 'Pelatihan',
  },
  defaultSort: 'displayOrder',
  versions: { drafts: true },
  access: {
    read: publishedOrContentStaff,
    create: canEditContent,
    update: canEditContent,
    delete: canEditContent,
  },
  hooks: { beforeChange: [onlyPublishersCanPublish] },
  fields: [
    { name: 'name', label: 'Nama', type: 'text', required: true },
    slugField('name'),
    {
      name: 'shortDescription',
      label: 'Deskripsi singkat',
      type: 'textarea',
      maxLength: 240,
    },
    {
      name: 'displayOrder',
      label: 'Urutan tampil',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'representativeCourses',
      label: 'Pelatihan unggulan',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
      maxRows: 4,
    },
  ],
}
