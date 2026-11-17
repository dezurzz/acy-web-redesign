import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Categories } from './collections/Categories'
import { Courses } from './collections/Courses'
import { Media } from './collections/Media'
import { Sessions } from './collections/Sessions'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' | BKI Academy CMS' },
    timezones: {
      supportedTimezones: [
        { label: 'WIB (Asia/Jakarta)', value: 'Asia/Jakarta' },
        { label: 'WITA (Asia/Makassar)', value: 'Asia/Makassar' },
        { label: 'WIT (Asia/Jayapura)', value: 'Asia/Jayapura' },
      ],
      defaultTimezone: 'Asia/Jakarta',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Courses, Sessions, Categories, Media, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    // Dev pushes schema changes automatically; staging and production run reviewed migrations (PRD §8.4).
    migrationDir: path.resolve(dirname, 'migrations'),
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
