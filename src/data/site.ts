// Every company fact the site states lives here, so it can be checked and corrected in one place.
// Fields set to null are not rendered. Nothing here may be guessed: leave it null until confirmed.

export const site = {
  brand: 'Coverd',
  legalName: 'Coverd AG',
  url: 'https://coverd.ch',
  city: 'Olten',
  founded: 2026,

  email: 'info@coverd.ch',
  whatsapp: { href: 'https://wa.me/41782489121', label: '+41 78 248 91 21' },

  // TODO before launch: fill in from the commercial register. Coverd AG was not findable in Zefix
  // on 2026-10-30, so none of this could be sourced.
  phone: null as { href: string; label: string } | null,
  address: null as { street: string; zip: string; city: string } | null,
  uid: null as string | null,
  registerOffice: null as string | null,
  boardMembers: null as string[] | null,

  // Regulatory status. `registered: true` switches on every "FINMA-registriert" statement on the
  // site (home trust block, footer, legal notice).
  // Switched on while the site is behind its password, ahead of the registration. On 2026-10-30 the
  // public register returned nothing for "Coverd" or "Krapl". Launch only once the entry is visible:
  // https://www.finma.ch/de/ueberwachung/versicherungsvermittler/registersuche/ (see docs/go-live.md)
  finma: {
    registered: true,
    number: null as string | null,
  },
  ombudsman: null as string | null,

  booking: {
    general: 'https://calendar.app.google/DXkmpuPdzdHy3rFJ9',
    // One Google Calendar appointment schedule per topic puts the topic in the booking title.
    // An empty value falls back to the general link.
    versicherungen: '',
    vorsorge: '',
    bvg: '',
    steuern: '',
    unternehmen: '',
    privat: '',
  },

  partner: { name: 'Z83 AG', href: 'https://www.z83.ch' },
};

export type BookingTopic = Exclude<keyof typeof site.booking, 'general'>;

export function bookingUrl(topic?: BookingTopic): string {
  return (topic && site.booking[topic]) || site.booking.general;
}
