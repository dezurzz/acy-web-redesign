/*
 * Site settings (PRD §7). PLACEHOLDER values until the business owner confirms the real
 * contacts (decision D-05, deferred). Build Sprint 2 moves these into a Payload global so staff
 * can change the WhatsApp number without a code change (PRD §6: the number comes from Site settings).
 * The WhatsApp number below is a dummy and must never reach production.
 */
export const siteSettings = {
  /** International format, digits only (wa.me requires this). */
  whatsappNumber: '6280000000000',
  whatsappDisplay: '+62 800-0000-0000',
  email: 'academy@contoh.id',
  phone: '(021) 0000-0000',
  phoneHref: '+62210000000',
  serviceHours: 'Senin–Jumat, 08.00–16.00 WIB',
  isPlaceholder: true,
} as const
