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

Requirements: Node.js 24, Docker Desktop, and corepack (`corepack enable pnpm`).

```bash
cp .env.example .env          # then set PAYLOAD_SECRET (openssl rand -hex 32)
pnpm install
pnpm db:up                    # starts PostgreSQL in Docker on port 5432
pnpm dev                      # http://localhost:3000
```

- Website: http://localhost:3000 (redirects to `/id`)
- Styleguide (tokens and components): http://localhost:3000/styleguide
- CMS: http://localhost:3000/admin. The first account you create becomes an administrator.

In development Payload pushes schema changes to the local database automatically. To start over: `pnpm db:down && docker volume rm redesign-web_pgdata && pnpm db:up`.

## Scripts

| Script | What it does |
|---|---|
| `pnpm dev` | Dev server |
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
  access/             staff roles and access rules
  collections/        Payload collections (Courses, Sessions, Categories, Media, Users)
  components/ui/      shadcn/ui components customised to design.md
  components/site/    header, footer, and other site components
  fields/             shared field definitions
  lib/                utilities and shared option lists
tests/int/            Vitest integration tests
tests/e2e/            Playwright tests
```

## Conventions

- **Styling:** use only the tokens in `src/app/(frontend)/globals.css` (design.md §11–12). Tailwind's default palette, breakpoints, radii, shadows, and type scale are cleared on purpose. Need a new value? Add a token first.
- **Roles (PRD §7):** editors save drafts; publishers and admins publish; enquiry staff will see only submissions; admins manage users.
- **Public data:** anonymous visitors only see published documents. Server-side code that uses the Local API with `overrideAccess` must apply the same rules itself.
- **Sessions:** `registrationStatus` drives registration (only `open` accepts requests). Do not name a field `status`; it collides with Payload's `_status` draft enum in PostgreSQL.
- **Schema changes on staging/production:** create a migration with `pnpm payload migrate:create`, review it, take a backup, then run `pnpm payload migrate` as a release step (PRD §8.4). Never rely on push mode outside development.

## Environments

| Environment | Status |
|---|---|
| Local | Docker PostgreSQL, `.env` |
| Staging | Not set up yet: waiting on hosting decision T-01 |
| Production | Created in Phase 5 |

Hosting, database, email, and domain accounts must belong to a BKI organisational account with a second BKI administrator (TIMELINE.md, Working alone).
