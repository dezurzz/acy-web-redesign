import type { CollectionBeforeChangeHook } from 'payload'
import { APIError } from 'payload'

import { hasRole } from './roles'

// Only publishers and admins may publish (PRD §7). Editors save drafts.
// Requests without a user are server-side scripts (seeds, migrations) and already bypass access control.
export const onlyPublishersCanPublish: CollectionBeforeChangeHook = ({ data, req }) => {
  if (data?._status === 'published' && req.user && !hasRole(req.user, 'admin', 'publisher')) {
    throw new APIError('Hanya publisher yang dapat menerbitkan perubahan.', 403)
  }
  return data
}
