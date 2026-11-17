import type { CollectionConfig } from 'payload'

import { canEditContent } from '../access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Konten' },
  access: {
    read: () => true,
    create: canEditContent,
    update: canEditContent,
    delete: canEditContent,
  },
  fields: [
    {
      name: 'alt',
      label: 'Teks alternatif',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
