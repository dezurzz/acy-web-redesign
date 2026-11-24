/*
 * Site settings (PRD §7). PLACEHOLDER values until the business owner confirms the real
 * contacts (decision D-05, deferred). Build Sprint 2 moves these into a Payload global so staff
 * can change them without a code change (PRD §6: the WhatsApp number comes from Site settings).
 * Nothing here may reach production unchanged; `isPlaceholder` makes the site say so on screen.
 */
export const siteSettings = {
  /** International format, digits only (wa.me requires this). */
  whatsappNumber: '6280000000000',
  whatsappDisplay: '+62 800-0000-0000',
  email: 'academy@contoh.id',
  phone: '(021) 0000-0000',
  phoneHref: '+62210000000',
  serviceHours: 'Senin–Jumat, 08.00–16.00 WIB',
  address: ['Alamat kantor menunggu konfirmasi', 'Jakarta'],
  /**
   * Existing participant systems (D-07). null = not confirmed and tested yet, so the site shows
   * the service without a link (PRD §4: link only after the destination is confirmed).
   */
  portalUrl: null as string | null,
  certificateUrl: null as string | null,
  isPlaceholder: true,
} as const
