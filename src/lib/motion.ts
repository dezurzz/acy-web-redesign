// "Kurangi animasi" preference (animations.md §6).
export const MOTION_STORAGE_KEY = 'bki-kurangi-animasi'
/** Fired on window when the visitor flips "Kurangi animasi". */
export const MOTION_CHANGE_EVENT = 'bki-motion-change'

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

/** Calls `onChange` whenever the effective setting may have changed (OS or site toggle). */
export function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', onChange)
  window.addEventListener(MOTION_CHANGE_EVENT, onChange)
  return () => {
    query.removeEventListener('change', onChange)
    window.removeEventListener(MOTION_CHANGE_EVENT, onChange)
  }
}
