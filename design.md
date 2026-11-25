# BKI Academy — Design System

Version: 1.3 · 24 November 2026 · Proposed design specification

Companion: `PRD.md`. **This document is the authoritative source for styling, colour, typography, layout, and component presentation.** `PRD.md` defines product behaviour, data, and operations; where the two overlap on presentation, this document wins. Values below are proposed design tokens, not a claim that they are official BKI brand standards. Confirm official assets before launch.

## 1. Design intent

Swiss-inspired editorial design for professional maritime education: precise alignment, clear hierarchy, generous but purposeful space, confident typography, and authentic training imagery. The interface should feel credible, contemporary, and approachable.

Keep expressive composition in the homepage, campaign sections, and editorial stories. Keep schedules, course facts, filters, and forms predictable. Make the brand recognisable through deep navy, electric blue, cyan accents, and photographic depth.

Reference roles: EPFL for institutional clarity; Swissnex for contemporary communication; ECAL for expressive typography; Pentagram for editorial presentation; MIT for discovery. Do not copy their content, logos, or exact layouts.

## 2. Principles and guardrails

1. Align every element to a consistent grid; asymmetry must still have a reading order.
2. One dominant message and one primary action per section.
3. Use typography, spacing, and rules before adding decorative containers.
4. Real information takes priority over ornamental whitespace.
5. Represent actual learning: approved photos of instructors, participants, facilities, and maritime practice.
6. Preserve the identity of course names; do not split acronyms or long titles into arbitrary fragments to imitate a poster.
7. Make layouts work at mobile widths before adding desktop flourishes.

Avoid glassmorphism, neon glows around cards, decorative dashboard widgets, excessive pill shapes, gratuitous parallax, giant batch numbers, justified body text, and gradients behind dense information. Do not place essential text inside images.

**Visual direction (v1.3):** Swiss editorial typography on an atmospheric sky. Page openings use the atmosphere gradient (§4D) with film grain, large light-weight type, parenthetical labels such as `( Maritime Labour Convention )`, plain hairline grid lines (no crosshair mark), and key facts pinned to a corner, as in BKI Academy's own course posters. Dense information (schedules, prices, forms, filters) stays on solid white or paper.

## 3. Colour tokens

| Token | Value | Intended use |
|---|---|---|
| `navy-950` | `#0B1726` | Dark hero/footer; strongest dark surface |
| `navy-800` | `#1C2E3C` | Brand navy; headings and body text |
| `blue-700` | `#272CBB` | Indigo brand anchor; gradient transition |
| `blue-600` | `#174BFF` | Electric blue; primary buttons, active state, links |
| `blue-800` | `#143AC7` | Primary hover and pressed emphasis |
| `cyan-400` | `#0BCDE9` | Decorative highlight or navy-labelled accent surface |
| `blue-50` | `#EEF3FF` | Selected/filter backgrounds and quiet feature panels |
| `white` | `#FFFFFF` | Main surface, inverse text |
| `paper` | `#F6F8FB` | Alternate section background |
| `slate-600` | `#536274` | Secondary text |
| `line-subtle` | `#D8DFE8` | Decorative separators; not sole input boundary |
| `line-control` | `#7A8899` | Interactive control borders on white |
| `success` | `#176B45` | Success text/icon with `#EAF7EF` surface |
| `warning` | `#8A4B00` | Warning text/icon with `#FFF4DE` surface |
| `danger` | `#B42318` | Error text/icon with `#FFF0ED` surface |

Suggested visual balance: about 70% neutral surfaces, 20% navy/photography, 10% bright accents. This is a composition guide, not a per-page quota.

Text rules: navy on white/paper; white on navy; white on electric-blue buttons; navy on cyan. Do not use white small text on cyan. Do not use cyan as small body text on white. Links remain distinguishable by underline or another non-colour cue. Status always includes a label and, where useful, an icon.

Accessibility design targets: at least 4.5:1 for normal text, 3:1 for large text, and 3:1 for essential UI boundaries/focus indicators against adjacent colours. Validate final combinations, hover states, overlays, and imagery; token names are not evidence of compliance.

## 4. Gradients

### A. Signature electric blue

```css
--gradient-brand: linear-gradient(
  125deg,
  #0B1726 0%,
  #272CBB 44%,
  #174BFF 72%,
  #0BCDE9 100%
);
```

Use on a homepage feature or corporate-training banner. Keep white copy within the dark navy/indigo zone; do not let responsive changes move it over the cyan end. Use a solid navy text panel when contrast cannot be guaranteed. Limit each page to one dominant gradient area.

### B. Social-media-inspired photographic overlay

```css
--gradient-photo: linear-gradient(
  180deg,
  rgba(11, 23, 38, .96) 0%,
  rgba(39, 44, 187, .78) 28%,
  rgba(23, 75, 255, .30) 48%,
  rgba(23, 75, 255, 0) 68%
);
```

Use only for selected photographic campaign areas. Place white headline text near the top within a stable dark backing; the overlay alone is not a contrast guarantee. Keep faces and teaching activity unobscured. Use actual HTML text. On mobile, move copy above the photograph if the protected text zone becomes too small.

### D. Atmosphere (v1.3, page openings)

A vertical sky: deep navy at the top through electric blue to sky, fading into paper or white. Tokens: `--gradient-atmos-deep`, `--gradient-atmos-fade-white`, `--gradient-atmos-fade-paper`, and `--gradient-atmos-side` for full-width bands (deep blue on the text side, mist on the far side). Film grain (`.grain`) sits on top at about 20% opacity and fades out with the gradient.

Rules:

- Build it in two parts. All text and controls sit in the **deep part** (every stop gives white text at least 4.5:1). The **fade** below it carries no text and ends in exactly the next section's background, so there is no seam.
- Use it as the first element of a page (`Atmosphere`, `PageHero`). The fixed header then floats over it with white text and turns solid white after scrolling (§8 Header).
- The side variant is used only where text stays on the deep side; on screens under 1024 px use the vertical deep gradient instead. Anything placed on the light side sits on its own dark panel.
- Static: never animate the gradient (animations.md §5.10).
- Replaces photographs in page openings until permission-cleared photos exist (B-05); photos may return in content sections.
- **CTA bands** are photo bands: one big ship photo on the far side (about 72% of the width on desktop, the lower part on phones) that dissolves into the deep blue under the text through a veil gradient (`--gradient-atmos-veil`, `--gradient-atmos-veil-down` on phones), with grain on top. The veil is solid deep blue wherever text sits, so white text stays at 4.5:1 or better; the photo is decoration (empty alt). Text and button stay the focus: no graphics or patterns added on top.
- **Photography (temporary):** large ship, port and sea photographs without people (`src/lib/stock-photos.ts`, Unsplash License) until BKI's own permission-cleared photos arrive. Keep headlines clear of the subject with `object-position`.

### C. Quiet information surface

```css
--gradient-soft: linear-gradient(135deg, #F6F8FB 0%, #EEF3FF 100%);
```

Use for a restrained course-introduction panel. Text remains navy. Forms and schedule rows stay solid white. Optional grain is a decorative overlay at 2–3% opacity, used only in major brand imagery, never over controls or body copy. No continuously animated gradients.

## 5. Typography

Proposed primary family: **Inter**, with `Arial, Helvetica, sans-serif` fallback. Use a single family at launch. Verify approved font files/licensing, self-host WOFF2 where appropriate, load only required weights, and use `font-display: swap`. Do not assume Helvetica Neue licensing is available.

Headings: light and regular weights for large type (display and H1 at 300, H2 at 400, H3 at 500), left aligned, with tight tracking. Inter 300 is loaded for this (v1.3). Body: weight 400. Labels/buttons: 500–600. Use tabular numerals for dates, fees, and numerical metadata. Uppercase is limited to short eyebrow labels and selected short campaign headings.

| Role | Desktop size / line height | Mobile size / line height | Weight / tracking |
|---|---|---|---|
| Display, page openings | 88–104 / 0.98 | 44–48 / 0.98 | 300 / -0.045em |
| H1, interior page | 48–64 / 1.04 | 34–40 / 1.04 | 300 / -0.035em |
| H2 | 36–44 / 1.1 | 28–32 / 1.1 | 400 / -0.03em |
| H3 | 24–28 / 1.25 | 22–24 / 1.3 | 500 / -0.02em |
| Intro paragraph | 20 / 1.5 | 18 / 1.55 | 400 / normal |
| Body | 16–18 / 1.6 | 16 / 1.6 | 400 / normal |
| UI / button | 16 / 1.4 | 16 / 1.4 | 500–600 / normal |
| Metadata | 14 / 1.45 | 14 / 1.45 | 400–500 / normal |
| Eyebrow | 12 / 1.4 | 12 / 1.4 | 600 / 0.08em |

Body measure: approximately 60–72 characters. Keep labels/date metadata legible; 12 px is for nonessential eyebrows, not form instructions. Use `clamp()` for fluid headings, but permit wrapping and manual editorial breaks only when the mobile result remains natural. One H1 per page; semantic order is independent of visual size.

## 6. Layout, spacing, and responsive rules

Maximum content width: 1280 px. Desktop grid: 12 columns with 24 px gutters. Tablet: 8 columns, 24 px gutters. Mobile: 4 columns, 16 px gutters. Outer padding: 20 px mobile, 32 px tablet, 48 px desktop; below 360 px use 16 px. Centre the container above its maximum width.

Breakpoints: compact <768 px; medium 768–1023 px; wide ≥1024 px. These are starting rules; components may reflow earlier to avoid collisions. Test at 320, 390, 768, 1024, and 1440 px and at increased text size.

Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 128, 160 px. Section padding (v1.3, generous negative space): 160 px desktop, 128 px tablet, 96 px mobile; 160 px before the footer. Heading to content: 56–80 px. Session rows 28–32 px vertical padding; cards 24–32 px inner padding. Grid gutters stay 24 px. Card padding: 24 px desktop, 20 px mobile. Form label-to-input: 8 px; field-to-field: 24 px. Prioritise related-content proximity over equal spacing everywhere.

Hero desktop composition: text spans 7 columns; photograph spans 5. Course detail: content spans 8; session panel spans 4. Editorial sections may use a narrow 3-column label with a 9-column content area. Mobile reading order: heading → copy → actions → image → supporting facts. Avoid CSS visual reordering that differs from keyboard/DOM order.

Homepage hero should expose a hint of the upcoming-training section on a typical laptop. Do not force a 100vh hero. Let long course titles grow naturally. Responsive tables become labelled rows/cards where appropriate rather than shrinking type.

## 7. Shape, borders, icons, and motion

Buttons and fields: 4 px radius. Standard cards: 4 px. Large photographic frames: 0–8 px, used consistently. Status badges: 4 px; reserve rounded pills for removable filter chips if needed. No default shadow on every card. Use a thin border and spacing; overlay menus may use `0 8px 24px rgba(11,23,38,.12)`.

Icons: one consistent outline family, normally 20 px with consistent stroke; 16 px only beside metadata. Label unfamiliar icons. Decorative icons are hidden from assistive technology. Do not use emoji as interface icons.

Motion: defined in `animations.md` (source of truth); §7.1 maps it onto the BKI templates. Information first, motion second.

Focus rings by surface (required, not optional):

| Surface | Focus treatment |
|---|---|
| White, paper, blue-50 | 3 px `blue-600` outline, 3 px offset |
| Solid navy (`data-surface='dark'`) | 3 px `cyan-400` outline, 3 px offset |
| Brand gradient or photographic overlay (`data-surface='brand'` / `'photo'`) | Two-colour halo: 3 px navy-950 ring at the element edge plus 3 px white outline outside it, so the ring stays visible over every gradient stop, including cyan |

### 7.1. Motion

**`animations.md` is the source of truth for all motion**: purpose, intensity per page, tokens, component behaviour, reduced motion and the “Kurangi animasi” control, implementation, and QA checks (M-01 to M-12). This section only maps those rules onto the BKI templates from the Phase 1 wireframes. If anything here disagrees with `animations.md`, `animations.md` wins and this table gets corrected.

Information comes first: a visitor who never notices the motion must get the same information just as fast.

**Motion map per template** (each Phase 1 wireframe carries a matching “Gerak” note)

| Template | Intensity (animations.md §3) | Motion | Never |
|---|---|---|---|
| Header and footer (all pages) | Functional | Dropdown and mobile menu: fade + 8 px over 220 ms, close 140 ms (§5.3–5.4). Header keeps a constant size and never auto-hides (§5.8). Footer holds the “Kurangi animasi” control (§6) | Blurring the page behind menus |
| Beranda | Moderate, selective | Button arrow 3 px; editorial image 1.02 on hover (§5.1–5.2); one-time reveals for the Kategori, Mengapa BKI Academy and In-house groups only (§5.9) | Animating the hero heading, intro, CTAs or the first session rows |
| Pelatihan | Low | Card border/title emphasis 160 ms; filter selection immediate; “Memuat pelatihan…” while loading; optional 160 ms fade-in of new results; filter drawer 220 / 140 ms (§5.4–5.5) | Scroll reveals; items flying to new positions |
| Jadwal | Minimal | Selection feedback and loading/status changes only | Moving rows; any motion on dates, fees or status labels |
| Detail pelatihan | Low | Session option border/background 160 ms; FAQ 220 ms with chevron (§5.6); “Pilih Jadwal” scrolls to the session panel (instant under reduced motion); mobile CTA bar keeps a constant size and hides while the footer or an error summary is visible (§5.8) | Scroll reveals on course content |
| Pendaftaran (WhatsApp) | Functional only | Button press and step indicator only | Any “sent” or success animation: the site cannot know whether the WhatsApp message was sent (§5.7) |
| In-house | Low | One-time reveals for Pilihan pelatihan, process steps and Contoh kegiatan; form follows §5.7 (error summary immediate, success only after a confirmed save) | Motion inside the form beyond field feedback |
| Portal Peserta | Low | Card hover, FAQ accordions, optional one-time reveal of the service cards | — |

## 8. Components and states

| Component | Anatomy / behaviour | Required states |
|---|---|---|
| Header | BKI logo, primary links, contact action, secondary portal; mobile menu with labelled trigger. Fixed, 72 px. Over an atmosphere opening: transparent with white text and the two-colour focus halo; after scrolling: solid white (v1.3) | Default, over opening, scrolled, active page, menu open, keyboard focus |
| Primary button | Solid electric blue, white label, 48 px min height, 20 px horizontal padding | Hover dark blue, focus ring, pressed, loading, disabled |
| Secondary button | White/transparent surface, navy label, visible border | Hover light blue, focus, disabled |
| Text link | Clear label and underline; arrow optional | Hover, focus, visited where appropriate |
| Course card | Category, course title, concise outcome, duration/format, next-session cue, detail action | Default, hover/focus, no scheduled session |
| Session row | Date block, course, location/format, fee, labelled status, action | Not yet open, open, full, full with waitlist, closed, postponed, cancelled, completed (archive only) |
| Filter bar | Search, labelled selectors, result count, selected filters | Initial, active, loading, zero results, error |
| Input | Persistent label, optional helper, border, value | Empty, filled, focus, error, disabled |
| Error summary | Heading, linked errors, recovery instruction | Visible after invalid submit; focus moved here |
| Feedback panel | Status icon/label, concise explanation, next action | Saved, failed save, unavailable session |
| Accordion | Question button, icon, expandable answer | Collapsed, expanded, focused; proper expanded attribute |
| Breadcrumbs | Home → category → course | Current item is text; truncate carefully on mobile |
| Instructor card | Approved portrait, name, expertise, relevant courses | With photo; intentional initials fallback |
| Article card | Type, title, date, authentic image | Article/documentation; no misleading current-session CTA |
| Footer | Contact details, navigation, policies, approved affiliations | Mobile stacked, desktop grid |
| Skip link | First focusable element, “Lewati ke konten utama”, targets `<main>` | Hidden until focused, focused |
| Step indicator | Ordered list for the request flow: Jadwal → Data Pemohon → Tinjau → Selesai; current step uses `aria-current="step"`; text labels always visible | Upcoming, current, complete |
| Session panel | Course detail aside (4 of 12 columns); sticky on wide screens with top offset = header height + 24 px; releases before the footer and never covers content | Sessions available, session selected, no session (“Tanyakan Jadwal”) |
| Mobile CTA bar | Compact screens only: next session date + one primary action; fixed to bottom with `padding-bottom: env(safe-area-inset-bottom)`; page reserves equal bottom space; hides while the footer or an error summary is in view | Visible, hidden, no session |
| Choice controls | Radio group and checkbox inside a `fieldset` with visible legend; 24 px control within a 44 px target; select and textarea follow Input styling | Unchecked, checked, focus, error, disabled |
| Load more | “Tampilkan lebih banyak” button below results; announces how many items were added; preserves URL filter state | Default, loading, end of list |
| Error page | H1, plain explanation, links to Pelatihan, Jadwal, and Hubungi Kami; standard header/footer | 404, 500, maintenance |

Status label mapping (label text is always present; colour supports it):

| Session status | Text / surface |
|---|---|
| Open | `success` on `#EAF7EF` |
| Not yet open | `navy-800` on `blue-50` |
| Full, full with waitlist, closed | `slate-600` on `paper`, with `line-control` border |
| Postponed | `warning` on `#FFF4DE`, plus explanatory message |
| Cancelled | `danger` on `#FFF0ED` |
| Completed | `slate-600` text only; shown in archive, never in the default schedule |

Minimum interactive target goal: 44×44 px, including icon buttons. Loading must preserve button width and state what is happening. Disabled controls need an explanation when their unavailability is not obvious. Do not communicate errors through red borders alone.

Course cards are content-led, not poster thumbnails. Images are optional; date, title, and fee take precedence in the schedule. Avoid nested interactive elements inside a fully clickable card. Provide a semantic title link and clearly separated actions.

Mobile navigation: focus moves into the open menu, Escape closes it, focus returns to the trigger, background does not scroll behind a modal menu. Filter drawer follows the same rules. A “Terapkan Filter” action is acceptable on compact screens; show count and clear-all.

## 9. Photography and brand assets

Prefer authentic BKI classroom, instructor, port, vessel, and practical-training photographs. Use permission-cleared assets; never present generated people or stock classrooms as documented BKI events. Generated maritime imagery, if used for a campaign, must not imply a real client engagement.

Use consistent crops: landscape 3:2 or 16:9 for editorial images; 4:5 for selected portraits; wide desktop hero with a separate mobile crop when necessary. Preserve faces and contextual PPE; do not apply a strong blue wash over every image. Use warm, natural skin tones against the blue interface.

Alt text describes the relevant action/context, not decorative colour treatment. Decorative images use empty alt text. Specify width/height or aspect ratio to prevent layout shift, supply responsive sizes, and lazy-load below-the-fold imagery. Do not lazy-load the primary above-the-fold image.

Use official SVG/PNG logos without recreating them as text or stretching them. Confirm affiliation order and minimum sizes with the brand owner. A footer or compact institutional strip can carry secondary logos; mobile must not turn them into an illegible row.

## 10. Content and microcopy

Voice: professional, direct, helpful, and specific. Bahasa Indonesia is the primary interface language. Avoid vague “Learn More” repetition; name the action or destination. Expand acronyms once on detail pages. Batch numbers are supporting metadata.

| Situation | Proposed wording |
|---|---|
| Browse schedule | Lihat Jadwal |
| Course detail | Lihat Detail Pelatihan |
| Select session | Pilih Jadwal |
| Request registration | Ajukan Pendaftaran |
| Submit request | Kirim Permintaan Pendaftaran |
| Corporate enquiry | Ajukan Kebutuhan Pelatihan |
| No upcoming date | Jadwal berikutnya belum tersedia. Hubungi kami untuk informasi pelaksanaan. |
| No results | Belum ada pelatihan yang sesuai dengan filter Anda. Ubah filter atau lihat semua pelatihan. |
| Saved request | Permintaan pendaftaran Anda telah diterima. Simpan nomor referensi ini. Tim kami akan menghubungi Anda untuk konfirmasi. |
| Failed save | Permintaan belum berhasil dikirim. Data Anda tetap tersedia di formulir. Silakan coba lagi. |

Dates: `21–23 Oktober 2026` as formatting example only, not upcoming inventory. Time: `09.00–16.00 WIB`. Fees: Indonesian rupiah formatting with approved tax/inclusion note. Do not imply payment, seat confirmation, certification eligibility, or guaranteed availability before verification.

## 11. Starter CSS tokens

```css
:root {
  --color-navy-950: #0B1726;
  --color-navy-800: #1C2E3C;
  --color-blue-700: #272CBB;
  --color-blue-600: #174BFF;
  --color-blue-800: #143AC7;
  --color-cyan-400: #0BCDE9;
  --color-blue-50: #EEF3FF;
  --color-white: #FFFFFF;
  --color-paper: #F6F8FB;
  --color-slate-600: #536274;
  --color-line-subtle: #D8DFE8;
  --color-line-control: #7A8899;
  --color-success: #176B45;
  --color-warning: #8A4B00;
  --color-danger: #B42318;
  --color-success-surface: #EAF7EF;
  --color-warning-surface: #FFF4DE;
  --color-danger-surface: #FFF0ED;
  --surface: var(--color-white);
  --surface-alt: var(--color-paper);
  --text-primary: var(--color-navy-800);
  --text-secondary: var(--color-slate-600);
  --action-primary: var(--color-blue-600);
  --font-sans: 'Inter', Arial, Helvetica, sans-serif;
  --text-display: clamp(2.5rem, 1.2rem + 4vw, 5.5rem);
  --text-h1: clamp(2.125rem, 1.25rem + 3vw, 4rem);
  --text-h2: clamp(1.75rem, 1.25rem + 1.5vw, 2.75rem);
  --text-h3: clamp(1.375rem, 1.2rem + .5vw, 1.75rem);
  --text-intro: clamp(1.125rem, 1rem + .4vw, 1.25rem);
  --text-body: 1rem;
  --text-body-lg: 1.125rem;
  --text-meta: .875rem;
  --text-eyebrow: .75rem;
  --leading-display: 1.02;
  --leading-h1: 1.08;
  --leading-h2: 1.12;
  --leading-h3: 1.25;
  --leading-intro: 1.5;
  --leading-body: 1.6;
  --leading-meta: 1.45;
  --tracking-display: -0.04em;
  --tracking-h1: -0.03em;
  --tracking-h2: -0.025em;
  --tracking-h3: -0.015em;
  --tracking-eyebrow: 0.08em;
  --space-1: .25rem;
  --space-2: .5rem;
  --space-3: .75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  --space-32: 8rem;
  --radius-control: .25rem;
  --radius-card: .25rem;
  --radius-image: .5rem;
  --container-max: 80rem;
  /* Motion tokens: see animations.md §4 (source of truth). */
  --gradient-brand: linear-gradient(125deg,#0B1726 0%,#272CBB 44%,#174BFF 72%,#0BCDE9 100%);
  --gradient-photo: linear-gradient(180deg,rgba(11,23,38,.96) 0%,rgba(39,44,187,.78) 28%,rgba(23,75,255,.30) 48%,rgba(23,75,255,0) 68%);
  --gradient-soft: linear-gradient(135deg,#F6F8FB 0%,#EEF3FF 100%);
  --shadow-overlay: 0 8px 24px rgba(11,23,38,.12);
}

body { font-family: var(--font-sans); color: var(--text-primary); background: var(--surface); line-height: var(--leading-body); }
:focus-visible { outline: 3px solid var(--color-blue-600); outline-offset: 3px; }
[data-surface='dark'] :focus-visible { outline-color: var(--color-cyan-400); }
[data-surface='brand'] :focus-visible,
[data-surface='photo'] :focus-visible {
  outline: 3px solid var(--color-white);
  outline-offset: 3px;
  box-shadow: 0 0 0 3px var(--color-navy-950);
}
.numeric { font-variant-numeric: tabular-nums; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
}
```

Starter CSS is a design handoff, not a complete stylesheet. Check focus visibility against every actual component surface; introduce a two-colour focus halo where necessary. Keep future token changes central rather than overriding individual components with arbitrary values.

## 12. Tailwind CSS and shadcn/ui mapping

The implementation stack (see `PRD.md` §8.1) uses Tailwind CSS and shadcn/ui. Both must consume the tokens in §11; neither may introduce its own palette, radius, or type scale.

Tailwind (v4 CSS-first configuration):

- Declare the brand tokens from §11 inside `@theme` so Tailwind generates utilities from them (`bg-navy-950`, `text-slate-600`, `border-line-control`, `text-h2`, and so on).
- Clear Tailwind's default palette first with `--color-*: initial;`. Otherwise default shades such as `blue-500` remain available and drift from this system.
- Keep breakpoints at `md` = 768 px and `lg` = 1024 px (Tailwind defaults match §6). Add no others without updating §6.
- Container: max width `--container-max` (1280 px) with the outer padding in §6.
- Avoid arbitrary values (`text-[17px]`, `bg-[#1a2b3c]`). If a value is needed, add a token here first.

shadcn/ui semantic variables, set on `:root` and mapped through `@theme inline`:

| shadcn variable | Value |
|---|---|
| `--background` / `--foreground` | `white` / `navy-800` |
| `--card`, `--popover` / their `-foreground` | `white` / `navy-800` |
| `--primary` / `--primary-foreground` | `blue-600` / `white` |
| `--secondary` / `--secondary-foreground` | `white` / `navy-800` (secondary button also takes a `line-control` border, per §8) |
| `--muted` / `--muted-foreground` | `paper` / `slate-600` |
| `--accent` / `--accent-foreground` | `blue-50` / `navy-800` |
| `--destructive` | `danger` |
| `--border` | `line-subtle` |
| `--input` | `line-control` |
| `--ring` | `blue-600` |
| `--radius` | `--radius-control` (4 px) |

Required component overrides:

- Set `--radius-sm`, `--radius-md`, and `--radius-lg` explicitly to 4 px. Do not use shadcn's `calc(var(--radius) ± n)` derivation, which produces 0 px or 8 px.
- Primary/secondary buttons: minimum height 48 px, 20 px horizontal padding, 16 px text. shadcn's default `h-9` is too small.
- Inputs and selects: minimum height 44 px, 16 px text (prevents iOS zoom), `line-control` border.
- Remove default card and button shadows; use `--shadow-overlay` only on menus, popovers, and dialogs.
- Use one outline icon family (shadcn's default Lucide is acceptable) at 20 px, 16 px beside metadata.
- Do not ship shadcn's default dark theme. Dark presentation is limited to the navy, brand, and photo surfaces defined above.

## 13. Design handoff and review checklist

Deliver desktop/mobile designs for homepage, catalogue, schedule, course detail, request flow, and corporate enquiry before expanding to all editorial templates. Include a component sheet with hover/focus/loading/error/empty/disabled states and representative long Indonesian course titles.

- Every page communicates its purpose and next action within the first meaningful screen.
- At least one long course title and multiline date/location case is tested.
- Hero and content imagery retain their subjects at each breakpoint.
- Gradients do not weaken text contrast; cyan is not used as white-text button fill.
- Forms retain visible labels and errors; keyboard focus is never hidden.
- Upcoming sessions and historical documentation are visually distinct.
- No invented numbers, approvals, endorsements, availability, or production contacts.
- Screens at 320 px and enlarged text have no unintended horizontal page scrolling.
- Tokens and components are shared across every route; a new section does not introduce a new visual style.
- Brand owner approves colour/font/logo direction; content owner approves factual copy.

Read `PRD.md` for product behaviour, data, migration, integration, and launch criteria. When visual ambition conflicts with completing a core task, preserve legibility and the task flow.

## 14. Change log

- 1.3 · 24 November 2026 — Later the same day: larger section spacing (§6), nautical-chart pattern for CTA bands and temporary large photography (§4D).
- 1.3.1 · 25 November 2026 — Crosshair mark (circle with +) removed from hero hairlines at the project lead's request; the lines stay plain.
- 1.3 · 24 November 2026 — New visual direction chosen by the project lead: Swiss editorial type on an atmospheric sky (§2, §4D), following BKI Academy's own course posters. Light display weights (§5), atmosphere gradient with grain and a two-part build that keeps text off the light end, parenthetical labels, hairline crosshair, header floating over the opening and turning solid on scroll. Page openings no longer need photographs. Dense information stays on solid surfaces.
- 1.2 · 17 November 2026 — Made `animations.md` the source of truth for motion; §7 now points to it and §7.1 maps its rules onto the BKI templates. Motion tokens moved out of §11 (they live in animations.md §4 and `globals.css`). Brand approval tracked as decision B-06.
- 1.1 · 16 November 2026 — Declared this document the authoritative presentation source. Added all eight session statuses and a status label mapping; skip link, step indicator, session panel, mobile CTA bar, choice controls, load more, and error page components; required focus treatment per surface, including a two-colour halo on gradient/photo surfaces; full typography, status surface, `--gradient-photo`, and overlay shadow tokens; Tailwind/shadcn mapping (§12). Removed the filename note.
- 1.0 · 15 November 2026 — Initial proposed specification.
