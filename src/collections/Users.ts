import type { CollectionConfig } from 'payload'

import { hasRole, isAdmin, isAdminField, ROLES } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  auth: true,
  hooks: {
    beforeChange: [
      // The very first account becomes an administrator so roles can be assigned.
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true })
        if (totalDocs === 0) return { ...data, roles: ['admin'] }
        return data
      },
    ],
  },
  access: {
    admin: ({ req: { user } }) => Boolean(user),
    create: isAdmin,
    delete: isAdmin,
    read: ({ req: { user } }) => {
      if (hasRole(user, 'admin')) return true
      if (!user) return false
      return { id: { equals: user.id } }
    },
    update: ({ req: { user } }) => {
      if (hasRole(user, 'admin')) return true
      if (!user) return false
      return { id: { equals: user.id } }
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Publisher', value: 'publisher' },
        { label: 'Editor', value: 'editor' },
        { label: 'Enquiry staff', value: 'enquiry' },
      ] satisfies { label: string; value: (typeof ROLES)[number] }[],
      access: {
        create: isAdminField,
        update: isAdminField,
      },
      saveToJWT: true,
    },
  ],
}
