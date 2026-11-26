# BKI Academy website

Public website and CMS for BKI Academy, rebuilt per [PRD.md](PRD.md), [design.md](design.md), and [TIMELINE.md](TIMELINE.md).

## Versions

Recorded at scaffold, 17 November 2026 (PRD §8.2). All are stable releases; Payload 3.93.0 supports Next.js 16.4 (`>=16.3.3 <17`).

| Component | Version |
|---|---|
| Node.js | 24.x LTS (`.nvmrc`), tested on 24.22.1 |
| pnpm | 10.34.9 (`packageManager` in package.json) |
| Next.js | 16.4.6 (App Router) |
| React / React DOM | 19.3.1 |
| Payload (+ `@payloadcms/*`) | 3.93.0 |
| PostgreSQL | 17 (local Docker image `postgres:17-alpine`) |
| Tailwind CSS | 4.3.5 (CSS-first config, `@tailwindcss/postcss`) |
| shadcn/ui | components copied into `src/components/ui`, configured in `components.json` |
| TypeScript | 5.9.3 (strict) |
| Vitest / Playwright | 4.0.18 / 1.63.0 |

Upgrade Payload packages together, and check Payload's Next.js peer range before upgrading Next.js. Never install with `--force`.

## Local setup

The website runs on your computer with two parts:

1. **The database (PostgreSQL)** runs inside **Docker**. Docker runs the same PostgreSQL 17 on every computer, so you never install PostgreSQL yourself.
2. **The website and CMS (Next.js + Payload)** run with `pnpm dev`.

Every page reads content from the CMS (courses, sessions, and the contacts in the footer), so the website needs the database running.

### What you need (once per computer)

| Tool | Check it | Install |
|---|---|---|
| Node.js 24 | `node --version` shows `v24.x` | [nodejs.org](https://nodejs.org) (LTS 24), or `nvm use` in this folder (`.nvmrc`) |
| pnpm 10 | `pnpm --version` shows `10.x` | `corepack enable pnpm` (comes with Node.js) |
| Docker Desktop | `docker --version` prints a version | [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/) |

### First-time setup

Run these from the project folder, one after another.

1. Create your local settings file:

   ```bash
   cp .env.example .env
   ```

2. Open `.env` and replace `change-me` with a random secret. Generate one with:

   ```bash
   openssl rand -hex 32
   ```

   `.env` holds secrets and is never committed (it is in `.gitignore`).

3. Install the packages:

   ```bash
   pnpm install
   ```

4. Start Docker Desktop (see "Running the database" below), then start the database:

   ```bash
   pnpm db:up
   ```

5. Load the sample courses, sessions and categories into the CMS (optional, but the site is empty without content):

   ```bash
   pnpm seed
   ```

   This creates 6 categories, 10 courses and 7 sessions, all published. It is safe to run again: it updates the same entries instead of adding copies. Never run it on production.

6. Start the website:

   ```bash
   pnpm dev
   ```

7. Open http://localhost:3000/admin and create the first account. **The first account automatically becomes an administrator.**

### Every day

| Step | Command |
|---|---|
| 1. Open **Docker Desktop** and wait until it says it is running | (from Applications) |
| 2. Start the database | `pnpm db:up` |
| 3. Start the website | `pnpm dev` |
| 4. Finish: stop the website | `Ctrl + C` in the terminal running `pnpm dev` |
| 5. Finish: stop the database (optional) | `pnpm db:down` |

Your data is kept when you stop the database. It lives in a Docker volume called `redesign-web_pgdata` and is still there the next time you run `pnpm db:up`.

### Addresses

| What | Address |
|---|---|
| Website | http://localhost:3000 (redirects to `/id`) |
| CMS admin | http://localhost:3000/admin |
| Styleguide (tokens and components) | http://localhost:3000/styleguide |
| Wireframes (Phase 1) | http://localhost:3000/wireframes |
| Database (for database tools) | `localhost:5432`, database `bki_academy`, user `bki`, password `bki` (local only) |

### Running the database (Docker)

**1. Start Docker Desktop.** Open **Docker Desktop** from Applications (or run `open -a Docker` in the terminal). The whale icon appears in the menu bar. Wait until Docker Desktop shows "Engine running". This can take up to a minute after the computer starts.

Check that Docker is ready:

```bash
docker info
```

If it prints a long list of details, Docker is running. If it says `Cannot connect to the Docker daemon`, Docker Desktop is not running yet: open it and wait.

**2. Start the database.**

```bash
pnpm db:up
```

This runs `docker compose up -d postgres`. It starts the `postgres` service from `docker-compose.yml` in the background (`-d`). The first time, Docker downloads the `postgres:17-alpine` image (about 100 MB), so it takes longer.

**3. Check that it is running.**

```bash
docker compose ps
```

You should see the `postgres` service with status `Up`.

**Useful database commands**

| Task | Command |
|---|---|
| Start the database | `pnpm db:up` |
| Stop the database (keeps the data) | `pnpm db:down` |
| See whether it is running | `docker compose ps` |
| Read the database log | `docker compose logs postgres` |
| Open a SQL prompt inside the database | `docker compose exec postgres psql -U bki -d bki_academy` (type `\q` to leave) |
| **Delete all local data and start fresh** | `pnpm db:down`, then `docker volume rm redesign-web_pgdata`, then `pnpm db:up` |

Deleting the volume removes every course, session and user you created locally, including your admin account. Create the first account again afterwards.

The volume name is the project folder name plus `_pgdata` (`redesign-web_pgdata` here). If you cloned the project into a folder with another name, find it with `docker volume ls`.

**How the schema gets created:** in development, Payload creates and updates the tables automatically when `pnpm dev` starts ("push mode"). You do not run migrations locally. Staging and production use reviewed migrations instead (see Conventions).

### Troubleshooting

| You see | Cause | Fix |
|---|---|---|
| `Cannot connect to the Docker daemon` | Docker Desktop is not running | Open Docker Desktop, wait for "Engine running", try again |
| `cannot connect to Postgres: connect ECONNREFUSED 127.0.0.1:5432` (in `pnpm dev` or tests, or `/admin` shows an error) | The database is not running | `pnpm db:up` |
| `port is already allocated` or `address already in use` on 5432 | Another PostgreSQL already uses port 5432 (for example one installed with Homebrew) | Find it with `brew services list`, stop it with `brew services stop <name>` (for example `postgresql@16`), then `pnpm db:up` again |
| `password authentication failed for user "bki"` | `.env` does not match `docker-compose.yml` | Copy `DATABASE_URL` from `.env.example` back into `.env` |
| `type "enum_…" already exists` | The local schema is in a mixed state after renaming fields | Delete all local data and start fresh (see the table above) |
| The admin looks broken after pulling new code | Collections changed | Stop `pnpm dev`, run `pnpm generate:types` and `pnpm generate:importmap`, start again |

### Running the checks locally

These are the same checks CI runs on every push:

```bash
pnpm lint && pnpm typecheck
```

```bash
pnpm test:int
```

`pnpm test:int` needs the database running (`pnpm db:up`). Some of its tests only check rules (catalogue, schedule, registration and form rules) and do not touch the database.

```bash
pnpm build
```

```bash
pnpm test:e2e
```

`pnpm test:e2e` opens a real browser. The first time on a new computer, install Playwright's browser once with `pnpm exec playwright install chromium`.

## Scripts

| Script | What it does |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm db:up` / `pnpm db:down` | Start / stop the local PostgreSQL in Docker |
| `pnpm seed` | Load the sample categories, courses and sessions into the local CMS (published) |
| `pnpm build` / `pnpm start` | Production build and server |
| `pnpm lint` / `pnpm typecheck` | ESLint and TypeScript |
| `pnpm test:int` | Vitest integration tests (needs the database) |
| `pnpm test:e2e` | Playwright tests (starts `pnpm dev` if nothing is running) |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` after changing collections |
| `pnpm generate:importmap` | Regenerate the admin import map after adding admin components |
| `pnpm payload migrate:create` | Create a migration for staging/production |

## Structure

```
src/
  app/(frontend)/     public site (Indonesian routes under /id), globals.css holds design tokens
  app/(payload)/      Payload admin and API (generated; avoid editing)
  app/(wireframes)/   Phase 1 low-fidelity wireframes at /wireframes
  access/             staff roles and access rules
  collections/        Payload collections (Courses, Sessions, Categories, Media, Users)
  globals/            Payload globals (Site settings: contacts and portal links)
  components/ui/      shadcn/ui components customised to design.md (buttons, fields, badges…)
  components/site/    header, footer, cards, page layouts and other site components
  components/catalogue/  search, filters and load more for Pelatihan and Jadwal
  components/course/  session panel and mobile CTA bar for the course page
  components/inhouse/ corporate enquiry form
  fields/             shared field definitions
  lib/                rules and helpers: catalogue, schedule, registration, enquiry, formatting
  lib/cms.ts          reads published content from Payload for the public pages
  lib/site-data.ts    the shape of that content (shared by CMS, sample data and tests)
  lib/sample-data.ts  SAMPLE content: test fixtures and the source for `pnpm seed`
  seed/seed.ts        the seed script
  lib/site-settings.ts  rules and placeholder defaults for Site settings
tests/int/            Vitest tests (rules, and Payload with the database)
tests/e2e/            Playwright tests
review/               screenshots for reviews (not in git)
```

## Conventions

- **Styling:** use only the tokens in `src/app/(frontend)/globals.css` (design.md §11–12). Tailwind's default palette, breakpoints, radii, shadows, and type scale are cleared on purpose. Need a new value? Add a token first.
- **Roles (PRD §7):** editors save drafts; publishers and admins publish; enquiry staff will see only submissions; admins manage users.
- **Public data:** anonymous visitors only see published documents. Server-side code that uses the Local API with `overrideAccess` must apply the same rules itself. All public pages read content through `loadSiteData()` in `src/lib/cms.ts`, which keeps only published categories and courses, and sessions whose course is published.
- **Where content comes from:** pages that show courses or sessions render on every request (`dynamic = 'force-dynamic'`), so a change published in `/admin` is on the site at the next page load. The rules for filters, the schedule and registration live in `src/lib/` as plain functions that take the content as input; tests run them on the sample data.
- **Course content fields:** "Untuk siapa" and "Yang akan Anda kuasai" are lists of short points; the syllabus is a list of parts (usually one per day) with one topic per line. Empty sections are hidden on the course page.
- **Site settings:** contacts (WhatsApp, phone, email, hours, address) and the Portal Peserta links are edited in the admin under **Pengaturan → Pengaturan situs**. Only admins and publishers can change them. The WhatsApp number may be typed as `0812…` and is saved as `62812…`; portal links must start with `https://`. Until **Kontak sudah dikonfirmasi** is ticked, the site shows a "kontak masih contoh" warning.
- **Session codes:** every session has a public code such as `JDW-0308`, used in links and the WhatsApp message. Leave it empty in the admin to get one automatically.
- **Sessions:** `registrationStatus` drives registration (only `open` accepts requests). Do not name a field `status`; it collides with Payload's `_status` draft enum in PostgreSQL.
- **Schema changes on staging/production:** create a migration with `pnpm payload migrate:create`, review it, take a backup, then run `pnpm payload migrate` as a release step (PRD §8.4). Never rely on push mode outside development.

## Branches

| Branch | Purpose | Gets changes from |
|---|---|---|
| `ui` | Day-to-day design and build work | Your commits |
| `staging` | Testing before release; will deploy to the staging site | Pull request from `ui` |
| `main` | Production-ready code only | Pull request from `staging` |

Changes always move `ui` → `staging` → `main` through pull requests, and CI must be green before merging. Never commit directly to `main`.

## Environments

| Environment | Status |
|---|---|
| Local | Docker PostgreSQL, `.env` |
| Staging | Not set up yet: waiting on hosting decision T-01 |
| Production | Created in Phase 5 |

Hosting, database, email, and domain accounts must belong to a BKI organisational account with a second BKI administrator (TIMELINE.md, Working alone).

### Launch switches

Set these in the production host's environment on launch day (L-01). Leave them unset everywhere else, staging included.

| Variable | Effect |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public address used in the sitemap and canonical links. |
| `SITE_INDEXABLE=true` | `robots.txt` and the robots meta tag let search engines index the site. Unset: crawlers are asked to stay away. |
| `REDIRECTS_PERMANENT=true` | Old Odoo URLs redirect permanently (308) instead of temporarily (307). Stand-in targets for Pengajar and Insight stay temporary. |
| `NEXT_PUBLIC_ANALYTICS_ENV` | Set to `production` on the live site and `staging` on staging, so QA traffic stays out of the real numbers (PRD §9). Defaults to `development`. |

Analytics: the ten PRD §9 events are recorded by `src/lib/analytics.ts` onto `window.bkiAnalytics` and a `bki:analytics` browser event, with non-personal fields only. No provider is connected yet; when one is chosen, add one small adapter that reads that queue. In development each event is also printed to the browser console as `[analytics]`.

Old Odoo URLs: the redirect map is `src/lib/redirects.ts`, built from the URL Inventory tab. Before launch, run `pnpm redirects:check` (database running): it lists redirects whose course or topic does not exist yet and the inventory rows still marked "Review".
