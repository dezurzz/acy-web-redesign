import type React from 'react'

import { PageEnter } from '@/components/motion/PageEnter'

/*
 * Each new page gets the short "page-enter" fade (animations.md §5.8); PageEnter re-mounts it per
 * path. The first page of a visit skips it: the hero intro plays instead.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageEnter>{children}</PageEnter>
}
