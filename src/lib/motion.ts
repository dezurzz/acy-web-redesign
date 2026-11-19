// Shared by the root layout's inline script and the client MotionToggle (animations.md §6).
// Kept out of the 'use client' file: a server component importing a constant from it would get a client reference, not the string.
export const MOTION_STORAGE_KEY = 'bki-kurangi-animasi'
