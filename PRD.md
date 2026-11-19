# BKI Academy — Website Rebuild PRD

Version: 1.3 · 17 November 2026 · Status: proposed implementation baseline

Companions: `design.md` (presentation) and `animations.md` (motion). Phase 0 decisions are recorded in the Phase 0 sheet (Decisions tab); IDs such as D-06 refer to it. This document defines product behaviour; the companion defines presentation. **`design.md` is the main source for all styling, colour, typography, layout, and component appearance.** Where this PRD mentions presentation (for example stacked rows, sticky panels, or imagery), it states the behavioural need only; follow `design.md` for how it looks, and treat `design.md` as authoritative if the two appear to conflict. Both are intended for designers, developers, content editors, and an AI coding assistant. They specify a new website implementation, not a theme-only refresh. No production changes are authorised by this document alone.

## 1. Project brief

Recreate BKI Academy’s public website as a credible, contemporary maritime training platform. Visitors must be able to identify an appropriate programme, inspect upcoming sessions, understand requirements and fees, and start a registration request (through WhatsApp at launch, decision D-06) or submit a corporate training enquiry. Connect the website visually with BKI Academy’s blue, typography-led social media through Swiss-inspired grids, restrained typography, and authentic photography.

Primary proposition: professional maritime learning presented with precision and practical clarity. Proposed Indonesian hero copy: “Kompetensi maritim untuk langkah profesional berikutnya.” Supporting copy must describe verified programme coverage without implying universal accreditation or guaranteed career outcomes.

Default audience language: Bahasa Indonesia. Preserve recognised English course names and explain acronyms on course pages. Launch scope is Indonesian only (D-08). Existing English URLs redirect one-to-one to their Indonesian equivalents; English content is a later release.

## 2. Evidence and interpretation

The preceding public-site review observed the following on 15 November 2026. These are a limited session snapshot, not a full technical audit:

| Observation | Product response |
|---|---|
| Generic welcome, long service copy, featured DPA section | Lead with training discovery and two clear audience routes |
| Schedule page primarily offers an annual download | Provide live session listings; retain a download as a secondary aid |
| Catalogue uses product terminology and lacks visible session details in listings | Use training terminology and structured course/session information |
| DPA detail request returned a 403 involving `rating_avg` | Require public course pages to work without authentication |
| Displayed footer phone numbers differ from the telephone-link destination | Verify every contact destination before launch |
| Safety description appears under a Security heading | Establish content ownership and review |
| Zeroed countdown and purple-led styling | Remove expired campaign UI and apply the new brand system |

Source: https://www.bki.academy/id and the public catalogue/schedule navigated from it. Attached ISPS #70 and MLC #18 social graphics inform visual direction, not current course availability. Do not copy their October 2026 dates into upcoming sessions.

## 3. Goals, audiences, and validation

| Audience hypothesis | Main job | Successful outcome |
|---|---|---|
| Individual maritime professional | Find a relevant class and understand eligibility | Start a registration request for a specific session (WhatsApp handoff at launch) |
| HR/training/procurement representative | Arrange training for a team | Submit a complete corporate brief |
| Technical manager | Evaluate expertise, content, and suitability | Obtain enough verified information to recommend a course |
| Returning participant | Reach existing learning/account services | Find the right existing system from the Portal Peserta page |

These hypotheses require validation with BKI staff and representative users. They are not demographic research findings.

Proposed prelaunch usability target: at least 4 of 5 representative testers complete each applicable core task without assistance. Tasks: find a relevant session, locate fees and prerequisites, start a test registration request (reach the WhatsApp handoff with the right session), and locate corporate training. Record completion, errors, and time; revise navigation based on observed issues.

Production measures: course-to-session selection, WhatsApp registration handoffs per session (contact intent), registrations confirmed by staff (recorded by admin outside the website), corporate enquiry completion, zero-result searches, and enquiry quality assessed by staff. Establish a baseline first; do not promise uplift percentages without data. Report WhatsApp clicks as contact intent, not completed registrations.

## 4. Scope and priorities

### P0 — launch requirements

- Responsive public website, course catalogue, schedule, course detail, corporate training, about, contact, Portal Peserta (D-07), MICE as a secondary page (D-09), and necessary policy pages. Instructors and Insights launch hidden (D-11).
- Instructors and Insights depend on approved bios, photo consent, and articles. If that content is not approved in time, these routes may launch hidden from navigation and the sitemap; they must not delay the catalogue, schedule, course detail, and registration journey.
- Structured content management for courses and sessions, including validation and draft/publish controls.
- Registration request through a WhatsApp handoff (D-06): a session summary page that opens WhatsApp with the course, session dates and session code prefilled. Staff confirm seats, payment and cancellations in WhatsApp. No registration data is stored by the website at launch.
- Corporate-enquiry form with persistent storage, reference numbers, staff access, and verified notification delivery, unless decision D-12 moves corporate enquiries to WhatsApp/email for launch.
- Search/filter state in the URL, accessible navigation, migration redirects, error handling, analytics, and production QA.
- Portal Peserta page that routes participants to existing systems (account/materials portal, certificate system, admin WhatsApp). Each destination is linked only after it is confirmed and tested. No new login on this website.

### P1 — after the core journey is validated

- Website registration-request form with persistence, reference numbers and staff queue (see §6 “Future registration form”), replacing or complementing the WhatsApp handoff.
- Full English translation, curated course comparisons, richer instructor pages, approved case studies, and downloadable brochures generated from maintained content.
- Group participant import and integration with CRM/ERP if operationally justified.

### Outside this release

New LMS, online exams, certificate issuance/verification/tracking (handled by BKI’s separate certificate system, D-04), payment gateway, user account system, automatic invoicing, AI course advisor, and automated eligibility decisions. Do not imply these features exist in marketing copy. MICE is an active but secondary service (D-09): one page, linked from the footer and the In-house page, never in primary navigation; it must not displace training discovery.

## 5. Proposed information architecture

All routes below are proposed new routes. Inventory existing URLs before implementation.

| Route | Purpose | Main action |
|---|---|---|
| `/id` | Homepage | Lihat Jadwal |
| `/id/pelatihan` | Course catalogue | Lihat Detail |
| `/id/pelatihan/[slug]` | Stable course details + available sessions | Pilih Jadwal |
| `/id/jadwal` | Upcoming sessions | Ajukan Pendaftaran |
| `/id/pendaftaran?session=[id]` | Session summary and WhatsApp handoff (D-06) | Lanjutkan ke WhatsApp |
| `/id/in-house` | Corporate training | Ajukan Kebutuhan Pelatihan |
| `/id/tentang-kami` | Institution and verified credibility | Jelajahi Pelatihan |
| `/id/pengajar` | Verified instructor expertise (hidden at launch, D-11) | View relevant courses |
| `/id/insight` and `/id/insight/[slug]` | Articles and activity documentation (hidden at launch, D-11) | View relevant training |
| `/id/mice` | MICE services (secondary, D-09) | Contact staff |
| `/id/portal-peserta` | Routes participants to existing systems (D-07) | Open the right system |
| `/id/hubungi-kami` | Contact and assistance | Send enquiry/contact staff |
| `/id/kebijakan-privasi` | Approved privacy information | Read policy |
| `/id/ketentuan-pendaftaran` | Approved registration terms | Read terms |

Header: Pelatihan, Jadwal, In-house Training, Tentang Kami (Insight is added when it goes live); secondary Portal Peserta and Hubungi Kami. No language switcher at launch. Place Pengajar within Tentang Kami navigation. Logo returns home. Avoid a crowded row of affiliation logos in the navigation.

## 6. Page requirements

### Homepage

Sequence: header → hero → upcoming sessions → academy categories → verified reasons to choose BKI → corporate training → learning experience/instructors → selected insights/documentation → contact footer. The instructors and insights sections are omitted until those pages go live (D-11).

Hero has one H1, concise supporting text, Lihat Jadwal primary CTA, and Pelatihan untuk Perusahaan secondary CTA. Use one authentic training or maritime image. Avoid autoplay carousels and countdowns. Upcoming section displays 3–6 published future sessions, sorted by start date, with a full-schedule link. When there are none, show an honest enquiry route.

Category names to verify: Safety, Security, Survey, Crewing, Environment, Ship Design. Use short differentiating descriptions and representative courses. Do not manufacture participant counts, client endorsements, ratings, approval badges, or instructor credentials.

### Catalogue and schedule

Catalogue represents stable courses; schedule represents dated sessions. Never model each batch as an unrelated course.

Search matches title, expanded acronym, and maintained aliases. Filters: topic, month, format, location. Combine filter groups with AND; multiple choices within one group use OR. Display result count, active filters, clear-all, and an accessible empty state. Preserve filters when returning from course details. Use URL query parameters so results can be shared.

Default schedule includes only future published sessions, sorted soonest first in Asia/Jakarta. Provide a separate archive if required. Format names: Tatap muka, Live online, Belajar mandiri; only show formats the course actually supports. Cards/list rows show course, date range, location/format, fee label, and registration state. On small screens use stacked rows; avoid a calendar grid that hides long titles.

Registration states: upcoming/not yet open, open, full, closed, postponed, cancelled, completed. Completed sessions appear only in the archive. State changes must update all views consistently; status labels and colours follow `design.md` §8. Full sessions may expose a waitlist only when staff can service it. Postponed sessions show an explicit message and do not silently retain an old date.

### Course detail

Above the fold: full title, acronym, category, concise outcome, duration, supported format, and session-selection action. Below: intended participants, outcomes, syllabus, prerequisites, delivery method, short certificate description (no certificate lookup or approval-scope claims at launch; certificate tracking lives in BKI’s separate system, D-04), instructor information once approved, FAQs, related courses, and available sessions.

Session panel shows dates/timezone, registration deadline, location, delivery format, fee and tax/inclusion wording, status, and next action. On desktop it may remain sticky without covering content. On mobile use a compact sticky CTA that accounts for safe-area insets and does not obscure the footer or errors. No session available → “Tanyakan Jadwal”, not a false registration button.

Brochures supplement HTML content. Essential information must remain readable without downloading a PDF. Use clear “Hubungi kami untuk biaya” if a price is unconfirmed; never display a placeholder zero price.

### Registration request (WhatsApp handoff at launch)

Baseline is a request for staff confirmation, not a paid booking or guaranteed seat (D-01). There is no online payment. Staff confirm the seat, payment details, changes and cancellations with the applicant in WhatsApp (D-03, D-06). State this before the handoff.

Page `/id/pendaftaran?session=[id]` shows: step indicator (Pilih jadwal → Ringkasan → Kirim di WhatsApp → Konfirmasi admin), selected-session summary (course, dates and timezone, location/format, fee wording, registration deadline, status), the “request, not booking” notice, the details the applicant should send (full name, email, WhatsApp number, company if applicable, funding type), a preview of the prefilled message, the **Lanjutkan ke WhatsApp** action, an email/phone alternative, realistic next steps, and links to Ketentuan Pendaftaran and Kebijakan Privasi.

Rules:

- The server checks the session status when rendering. Only `open` sessions show the WhatsApp action; full, closed, postponed and cancelled sessions show an explanation and alternatives (other sessions, “Tanyakan Jadwal”).
- The `wa.me` link may contain only the course title, session dates, location/format and the public session code. Never put personal data in the URL (the applicant types it in the chat).
- The site cannot know whether the message was sent, so it never shows a success state or reference number for registration.
- The WhatsApp number comes from Site settings, not from code.
- Do not promise a response time until the operations owner agrees one (D-06).

#### Future registration form (P1)

When BKI wants registrations captured on the website, replace the “Kirim di WhatsApp” step on the same route with: applicant details → review → persisted success. Fields: full name, email, phone/WhatsApp, company (optional for individuals), job role if necessary, funding type (individual/company), optional note, and acknowledgement of approved privacy/registration information. Do not request identity scans. Server validates session status and all fields; duplicate clicks or retries must not create duplicate requests; on persistence show a unique reference, session summary, contact destination and next steps; email failure must not discard a saved request or falsely claim delivery; a failed save keeps entered values and offers retry.

### Corporate training and contact

Corporate page covers training options, customisation, delivery process, permission-cleared examples, and a link to MICE. Form: contact name, work email, company, phone, topic, estimated participant range, preferred timing, preferred location/format, optional needs, policy acknowledgement. No public file upload at launch. Submission follows the persistence rules in §8.3 (validation, idempotency, reference number, failure states). If decision D-12 moves corporate enquiries to WhatsApp/email for launch, replace the form with a structured WhatsApp/email handoff that prefills only the topic.

Contact page shows confirmed business contacts, office address, service hours if supplied, and enquiry form. WhatsApp message may prefill course/session title only; never insert private form fields into a URL. Ensure phone, email, social, and portal destinations are tested.

### Portal Peserta and MICE

Portal Peserta (D-07) is one page with three routes: account and training materials (existing portal), certificates (BKI’s certificate system, D-04), and registration status (admin WhatsApp), plus short help answers. Links to other systems are labelled as leaving the site. The website has no participant login.

MICE (D-09) is one secondary page describing the service with a contact route. It is linked from the footer and the In-house page only.

### About, instructors, and editorial content

Separate organisational affiliation from course approval. Each credential requires issuer, scope, supporting evidence, and review date. Instructor bios require approved expertise and photo consent. Articles and training documentation have separate labels and filters. Documentation carries historical dates and links to the stable course page, not an expired registration form.

## 7. Content model and administration

| Entity | Required fields / rules |
|---|---|
| Category | ID, unique slug, name, short description, display order, representative course IDs, publish state |
| Course | ID, unique slug, title, acronym/aliases, category ID, summary, outcomes, audience, syllabus, prerequisites, duration, formats, delivery method description, certificate wording, linked credential IDs, linked instructor IDs, FAQs (question/answer list), related course IDs, optional brochure file, optional image with alt text, status, SEO metadata |
| Session | ID, public session code (used in the WhatsApp message), course ID, batch label, start/end with timezone, format, venue/online label, registration deadline, fee policy, fee if known, currency, tax/inclusion wording, status, waitlist enabled (only when staff can service it); capacity optional; when postponed: public postponement message and, once rescheduled, a link to the replacement session |
| Instructor | ID, name, approved bio, expertise, image/alt text, linked courses, publish state |
| Article/activity | ID, slug, type, title, date, author/reviewer, body, images/alt, linked courses, publish state |
| Credential | Issuer, exact scope, linked courses/institution, evidence reference, validity/review dates, approval to display |
| Enquiry | Corporate and contact enquiries at launch (registration requests only when the P1 form ships). Private ID/reference, idempotency key (unique database constraint), type, course/session IDs if relevant, submitted details, consent timestamp, accepted privacy/registration policy versions, created time, status, assigned staff, notification state |
| Site settings | Approved contacts, registration WhatsApp number, Portal Peserta destinations (account portal, certificate system), portal links, legal identity, social links, policies, affiliation logo order |

Admin roles: editor drafts content; publisher approves public changes; enquiry staff access only necessary submissions; administrator manages roles. Keep a change history for sessions, fees, and publication. Drafts are not publicly indexable. Validate end ≥ start, deadlines, required fee wording, unique slugs, and linked published course before publishing sessions.

One maintained source supplies homepage, catalogue, schedule, and details. Do not hardcode dates in multiple components. Assign an internal owner for updates and enquiry handling; do not publish a response-time promise until agreed.

## 8. Technical direction and operational requirements

### 8.1. Required implementation stack

Use **Next.js App Router + React + TypeScript**, **Tailwind CSS + shadcn/ui**, **Payload CMS**, and **PostgreSQL** as the default rebuild stack. This replaces the earlier open-ended framework recommendation. The selection is intended to suit a content-rich training website with an editorial team and operational enquiries; newer technology alone is not a reason to add another service.

| Layer | Selected technology | Implementation purpose |
|---|---|---|
| Web application | Next.js, latest stable supported release compatible with Payload; App Router | Public pages, routing, server rendering, metadata, and server endpoints |
| UI runtime and language | React version supported by the selected Next.js/Payload releases; TypeScript with strict mode | Typed components, domain models, and maintainable client/server boundaries |
| Styling | Tailwind CSS, latest stable compatible release, plus CSS custom properties | Implement the tokens in design.md §11 through the Tailwind mapping in design.md §12; no palette, spacing, or type values outside design.md |
| UI components | shadcn/ui, customised to design.md | Accessible interaction primitives for forms, menus, dialogs, and accordions; apply the variable mapping and overrides in design.md §12; do not ship an unmodified default visual theme |
| Content and administration | Payload CMS with its Next.js integration and PostgreSQL adapter | Course/session content, media, draft/publish, staff access, and private enquiry management |
| Database | PostgreSQL on a supported managed release | Relational course/session/request records, integrity constraints, durable storage, and backups |
| Forms and validation | React Hook Form + Zod | Interactive form state and shared input schemas; repeat validation on the server |
| Database access | Payload APIs and its PostgreSQL adapter | One schema/migration owner; do not add a second ORM over Payload-managed tables |
| Runtime and package manager | Supported Node.js LTS satisfying all package requirements; pnpm | Reproducible installs, scripts, and CI |
| Testing | Vitest + Playwright | Domain/validation tests and real-browser tests for critical user journeys |
| Assets | Next.js image/font facilities and durable object storage | Responsive media, stable font loading, and uploads that survive redeployments |

### 8.2. Version and compatibility policy

“Latest” means the newest **stable, mutually compatible, security-patched** versions verified when the project is scaffolded. Exclude canary, beta, and release-candidate dependencies from production. Do not independently install every package's latest release without checking peer dependencies. Next.js recommends supported production releases rather than its canary channel; Payload publishes explicit Next.js and Node.js requirements.

At kickoff, record exact Next.js, React, Payload, Tailwind, Node.js, and PostgreSQL versions in the repository README. Commit pnpm-lock.yaml, pin the package-manager/runtime versions, and use frozen-lockfile installs in CI. Keep Payload packages aligned to the same compatible release. If the newest Next.js release is not yet supported by Payload, use the newest supported stable pairing and document the reason. Do not suppress dependency errors with force flags. Verify patch availability again before launch and schedule security maintenance.

Exact patch numbers are intentionally resolved at installation time rather than frozen in this planning document. No packages have been installed or integration-tested as part of this PRD update.

### 8.3. Application architecture

- Use Server Components by default for public course, schedule, and editorial pages. Limit Client Components to interactive filters, menus, form state, and similar browser-dependent behaviour.
- Keep public frontend and Payload administration in one Next.js codebase with separate route groups. Public pages must never expose private enquiry collections or administrative credentials.
- Fetch through a server-only data-access layer. Explicitly enforce publication and access rules, including when using server-side CMS APIs; do not assume local API calls apply the same checks as public endpoints.
- Use server endpoints/actions for validated submissions (corporate and contact enquiries at launch; registration requests when the P1 form ships). Persist each request and its notification job before reporting success. Use a unique idempotency key and database constraint to prevent duplicate requests.
- Use a durable notification queue/outbox with a scheduled worker and bounded retries. Do not rely on an unawaited email call after returning a response. The mail provider and worker host remain operational deployment choices.
- Cache public editorial content selectively and invalidate affected views after publishing or session changes. Always revalidate session eligibility during submission. Private request/admin responses must not enter shared public caches.
- Start with database-backed search over titles, acronyms, and aliases. Add a separate search service only if measured catalogue scale or relevance needs justify it.
- Use local React state and URL query parameters for launch needs. Introduce additional state/query libraries only for a demonstrated requirement.
- Follow `animations.md` for all motion: CSS first; add a JavaScript animation library only when necessary.

### 8.4. Hosting, integration, and delivery

Deploy to managed Next.js-compatible hosting or an approved Node.js/container environment that supports the selected Payload runtime, database connections, uploads, and background work. Select the provider after checking organisational ownership, region, budget, backups, and operational support. Use managed PostgreSQL with connection pooling and tested restore procedures; use durable object storage instead of application-local upload folders.

Configure separate development, staging, and production environments. Staff authentication uses Payload's supported authentication and explicit role rules; verify any organisational SSO/MFA requirements before deployment. Public browsing and initial enquiries remain account-free. Use an approved transactional email provider, monitored delivery failures, and error reporting with personal data redacted. The operational analytics provider must support the events in section 9 without collecting form contents.

Default source of truth for a standalone rebuild: Payload/PostgreSQL for public course/session data and registration requests. Confirm whether Odoo remains an operational system before migration. If it does, explicitly assign ownership for each entity, sync identifiers, and reconciliation behaviour; do not create competing editable copies. A separate Express/FastAPI backend, new LMS, or payments service is not required for this release.

CI must run linting, TypeScript checks, focused tests, and a production build. End-to-end coverage must include anonymous course access, filter persistence, the WhatsApp handoff link (open sessions only, no personal data), successful corporate enquiry, duplicate submissions, and staff permissions. Run schema migrations through a reviewed release step with a backup/rollback strategy; never apply destructive automatic schema changes to production.

### 8.5. Official implementation references

Reviewed 16 November 2026. Check again when scaffolding because compatibility and supported versions change.

- Next.js production version policy: https://nextjs.org/support-policy
- Payload installation and compatibility: https://payloadcms.com/docs/getting-started/installation
- Payload database architecture: https://payloadcms.com/docs/database/overview
- Tailwind CSS installation: https://tailwindcss.com/docs/installation/using-postcss
- shadcn/ui with Next.js: https://ui.shadcn.com/docs/installation/next
- React Hook Form: https://react-hook-form.com/
- Zod validation: https://zod.dev/
- Playwright: https://playwright.dev/
- Vitest: https://vitest.dev/

### 8.6. Operational and quality requirements

If an integration is unavailable, store submissions in the approved backend and provide authenticated staff access plus a monitored notification channel. A static prototype may simulate submissions only if visibly labelled and isolated from production. Production must never show fake success.

Security: validate inputs server-side, rate-limit public forms, minimise collected data, restrict staff permissions, protect secrets, secure sessions, and exclude personal details from analytics/log URLs. Agree retention/deletion rules with the data owner. Privacy text requires organisational review; this PRD is not legal advice.

Accessibility acceptance baseline: keyboard-complete core flows, visible focus, labelled controls, semantic headings, accessible validation, reduced motion, text alternatives, readable contrast, and reflow at 320 CSS px. Use design.md for explicit design targets; conduct implementation checks before claiming standards compliance.

Proposed performance budgets: LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 at the 75th percentile when field data is available. Prelaunch use representative mobile lab tests, explicitly labelled as lab results. Optimise responsive images and fonts; avoid heavy hero video, unnecessary animation libraries, and render-blocking embeds.

## 9. SEO, migration, and analytics

Before cutover, inventory published URLs, files, course IDs, current portal routes, forms, language pages, and external links. Preserve valuable slugs or implement explicit one-to-one permanent redirects. Do not redirect every removed page to the homepage. Retired courses retain useful information or show an appropriate removal response. Protect private document links from accidental public migration.

Provide unique titles/descriptions, canonical URLs, sitemap, robots configuration, social previews, and descriptive internal links. Index only intended canonical listings; control duplicate filter URLs. Add structured data only when accurate and applicable. English hreflang requires real translated counterparts.

Analytics events: course_search, filter_apply, course_view, session_select, registration_start (handoff page viewed), whatsapp_registration_click, corporate_enquiry_success, portal_link_click, brochure_download, contact_click. There is no registration_success event while registration runs through WhatsApp. Include non-personal course/session IDs and relevant filter values; exclude free text and contact details. `course_search` sends a result count and a has-results flag, not the search term, so zero-result searches can be measured without sending typed text to analytics. If staff need to review the actual zero-result terms, store them server-side only, strip email- and phone-like patterns before saving, and apply the agreed retention period (see section 11). Count success after persistence, not after a button click. Separate production traffic from QA.

## 10. Delivery sequence and definition of done

1. Confirm ownership, source systems, content, operational workflow, and migration inventory.
2. Design catalogue, schedule, course detail, and enquiry flow on desktop/mobile using design.md.
3. Test core tasks; refine prototypes and approve templates.
4. Implement tokens/components, content model, backend requests, and admin workflows.
5. Migrate verified content; test accessibility, responsive states, links, SEO, and end-to-end request handling.
6. Prepare staging sign-off, backup, rollback plan, redirect map, and launch owner; deploy only through the authorised release process.
7. Monitor errors, submissions, and enquiries after launch; review usability and conversion after a baseline period.

| Acceptance ID | Pass condition |
|---|---|
| AC-01 | All published course pages load anonymously without permission errors |
| AC-02 | A changed session date/status/fee appears consistently across every relevant view |
| AC-03 | Search, filters, back navigation, and shared filtered URLs retain expected results |
| AC-04 | Full/closed/postponed/cancelled sessions show no WhatsApp registration action |
| AC-05 | A valid corporate enquiry persists once, produces a reference, and appears in the staff queue (if D-12 keeps the form) |
| AC-06 | Save failure, duplicate submit, and notification failure follow specified behaviour |
| AC-07 | Primary journeys work at 320, 390, 768, 1024, and 1440 CSS px without page overflow |
| AC-08 | Keyboard users can navigate, filter, select, submit, and recover from errors |
| AC-09 | Contacts, approvals, fees, policies, dates, and brand assets have named internal approval |
| AC-10 | Migrated high-value URLs resolve correctly; private/admin content remains protected |
| AC-11 | Analytics record successful outcomes without capturing personal data |
| AC-12 | Staff can publish a session and process a test enquiry without developer intervention |
| AC-13 | The WhatsApp handoff link contains only course, session dates, location/format and session code; no personal data appears in any URL |

## 11. Decisions to confirm before production

Status 17 November 2026: answers for D-01 to D-09, D-11 and B-01 to B-05 are recorded in the Phase 0 sheet and applied in this version; they still need sign-off by the named BKI owner. New: D-12, whether corporate enquiries use the website form (default) or WhatsApp/email at launch.

Business owner: registration is request-only or instant booking; fees/tax wording; cancellation rules; certificate wording and approval scope; current contacts; enquiry owner; portal destination; language scope; MICE relevance; privacy retention policy, including whether zero-result search terms are stored and for how long; whether Instructors and Insights launch visible or hidden.

Technical owner: hosting/provider approval, confirmation that the selected stack meets organisational constraints, Odoo/CRM integration, source of truth, email provider/worker, staff authentication requirements, backups, monitoring, and rollback responsibility.

Brand/content owner: official logo files and affiliation hierarchy; font licensing; photo permissions; programme taxonomy; approved Indonesian copy. Unconfirmed data stays labelled in staging and must never be silently invented for launch.

## 12. Reference direction

- Current site: https://www.bki.academy/id
- EPFL — structured institutional information: https://www.epfl.ch/en/
- Swissnex — contemporary institutional communication: https://swissnex.org/
- ECAL — expressive educational typography and photography: https://ecal.ch/en/
- Pentagram — editorial project presentation: https://www.pentagram.com/
- MIT — discovery and technical storytelling: https://www.mit.edu/

These are inspiration references, not templates to copy or claims of endorsement. BKI’s course discovery and registration needs determine the final structure.

## 13. Change log

- 1.3 · 17 November 2026 — Applied Phase 0 decisions: registration through a WhatsApp handoff at launch (D-06), with the website form moved to P1; Portal Peserta page (D-07); MICE as a secondary page (D-09); Indonesian only (D-08); Instructors and Insights hidden at launch (D-11); certificate tracking stays in BKI’s separate system (D-04). Updated routes, header, audience outcomes, content model (session code, site settings), analytics events, AC-04/AC-05, and added AC-13. Added open decision D-12 on corporate enquiries. Motion now follows animations.md.

- 1.2 · 16 November 2026 — Made `design.md` the main source for styling, colour, typography, and layout. Added Category entity; added FAQs, related courses, delivery method, brochure, credential/instructor links to Course; added tax wording, waitlist flag, and postponement fields to Session; added idempotency key and consent/policy-version fields to Enquiry. Allowed Instructors and Insights to launch hidden. Resolved zero-result search measurement versus the no-free-text analytics rule. Pointed styling and component rows to design.md §11–12.
- 1.1 · 16 November 2026 — Selected the Next.js, Payload, PostgreSQL, Tailwind, and shadcn/ui stack.
- 1.0 · 15 November 2026 — Initial proposed baseline.
