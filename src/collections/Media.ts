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
  // Camera originals are 6000 px and ~10 MB. Shrink and convert on upload so the stored file is
  // already web-sized; next/image then makes the smaller sizes per screen (design.md §9).
  upload: {
    mimeTypes: ['image/*'],
    resizeOptions: { width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true },
    formatOptions: { format: 'webp', options: { quality: 82 } },
    focalPoint: true,
  },
}
