/*
 * TEMPORARY stock photography (24 Nov 2026), until BKI's own permission-cleared photos arrive (B-05).
 * All from Unsplash under the Unsplash License (free to use, no permission or attribution needed),
 * none of them Unsplash+. Ships, ports and the sea only: no people, so nothing can be mistaken for a
 * documented BKI training or client engagement (design.md §9).
 * Images are hotlinked from images.unsplash.com (next.config.ts remotePatterns), nothing is stored here.
 * To switch to BKI photos: upload them to Media in the CMS and replace the entries below.
 */
export type StockPhoto = { src: string; alt: string; source: string }

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=2400`

export const stockPhotos = {
  band: {
    src: unsplash('photo-1613690399151-65ea69478674'),
    alt: 'Kapal kontainer berlayar di laut biru, dilihat dari udara',
    source: 'https://unsplash.com/photos/aerial-view-of-boat-on-water-1cqIcrWFQBI',
  },
  cta: {
    src: unsplash('photo-1579698543074-a18d65bff58f'),
    alt: 'Haluan kapal dengan jangkar, dilihat dari depan',
    source: 'https://unsplash.com/photos/white-and-red-ship-on-sea-during-daytime-Gtr_O7xa6tY',
  },
} satisfies Record<string, StockPhoto>

/** One photo per category slug (decision B-04 categories). */
export const categoryPhotos: Record<string, StockPhoto> = {
  safety: {
    src: unsplash('photo-1663674672961-bb3fcdbccd60'),
    alt: 'Haluan kapal dengan jangkar di galangan',
    source: 'https://unsplash.com/photos/a-large-boat-on-a-beach-loBrxtoECjw',
  },
  security: {
    src: unsplash('photo-1598203637341-69d7580a1507'),
    alt: 'Derek kontainer pelabuhan di bawah langit biru',
    source:
      'https://unsplash.com/photos/white-and-red-crane-under-blue-sky-during-daytime-HB_0cWSuHR4',
  },
  survey: {
    src: unsplash('photo-1771156878997-5939a54ee10f'),
    alt: 'Lambung haluan kapal di dok kering',
    source: 'https://unsplash.com/photos/bow-of-a-large-brown-ship-against-blue-sky-1tTVEElSyds',
  },
  crewing: {
    src: unsplash('photo-1598625802173-8ff2d54dde02'),
    alt: 'Kapal tanker di laut lepas',
    source:
      'https://unsplash.com/photos/red-and-black-ship-on-sea-under-blue-sky-during-daytime-Q0_KJ8Cp_Y4',
  },
  environment: {
    src: unsplash('photo-1699589080655-f00497141852'),
    alt: 'Jejak ombak kapal di laut lepas, dilihat dari udara',
    source:
      'https://unsplash.com/photos/a-large-boat-traveling-across-a-large-body-of-water-R-0xfZt_yc8',
  },
  'ship-design': {
    src: unsplash('photo-1526755112365-59c64ed18f45'),
    alt: 'Haluan kapal dengan tanda sarat air',
    source: 'https://unsplash.com/photos/red-and-blue-cruise-ship-86y-PYL1eIs',
  },
}
