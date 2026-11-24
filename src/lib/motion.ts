// "Kurangi animasi" preference (animations.md §6).
export const MOTION_STORAGE_KEY = 'bki-kurangi-animasi'

/** The visitor's saved choice; false when storage is blocked. */
export function readStoredReduction() {
  try {
    return window.localStorage.getItem(MOTION_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * Effective reduction = OS setting OR the visitor's choice (on <html data-motion> or in storage).
 * Browser only. Checks storage directly so components that run before the footer toggle
 * has applied the choice (e.g. Reveal) still respect it.
 */
export function isMotionReduced() {
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.dataset.motion === 'reduced' ||
    readStoredReduction()
  )
}
