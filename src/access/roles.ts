import type { Access, FieldAccess, Where } from 'payload'

// Staff roles (PRD §7): editors draft, publishers approve public changes,
// enquiry staff see only submissions, administrators manage roles.
export const ROLES = ['admin', 'publisher', 'editor', 'enquiry'] as const
export type Role = (typeof ROLES)[number]

type MaybeUser = { roles?: Role[] | null } | null | undefined

export const hasRole = (user: MaybeUser, ...roles: Role[]): boolean =>
  Boolean(user?.roles?.some((role) => roles.includes(role)))

export const isAdmin: Access = ({ req: { user } }) => hasRole(user, 'admin')

export const isAdminField: FieldAccess = ({ req: { user } }) => hasRole(user, 'admin')

export const canEditContent: Access = ({ req: { user } }) =>
  hasRole(user, 'admin', 'publisher', 'editor')

// Anonymous visitors see published documents only; content staff also see drafts.
export const publishedOrContentStaff: Access = ({ req: { user } }) => {
  if (hasRole(user, 'admin', 'publisher', 'editor')) return true
  const published: Where = { _status: { equals: 'published' } }
  return published
}
