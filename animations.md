# BKI Academy — Animation & Micro-interaction Specification

Version: 1.4 · 25 November 2026 · Status: implementation specification

Companions: `PRD.md` and `design.md`.

## 1. Direction and purpose

Motion personality: **calm, precise, responsive**.

Combine the Swiss-inspired grid and typography with BKI’s navy/electric-blue identity and restrained motion inspired by https://microsoft.design/. The reference provides a creative direction, not source code or numerical animation specifications. All timings, distances, and easing curves below are proposed specifically for BKI Academy.

In the reference review, site-wide motion controls and individual animated-media pause controls were visible. Adopt the principle of user control. Do not reproduce Microsoft’s decorative content or assume every effect on its site suits a professional training website.

Motion has four jobs:

1. Confirm an action: a button responds to hover, focus, or press.
2. Explain change: a menu opens, a filter updates results, or an accordion expands.
3. Preserve orientation: users understand which panel or form step they are viewing.
4. Add restrained character to editorial imagery and selected marketing sections.

Motion must never delay registration, hide essential information, or imply a request succeeded before it was saved.

## 2. Relationship to the other specifications

`PRD.md` governs functionality and data state. `design.md` governs colour, typography, grids, shapes, and static component styling. This file is the detailed source of truth for animation behaviour and motion tokens. Where a general motion range in design.md differs from a component-specific value here, use this file. Product correctness and accessibility take priority over decorative effects.

Implement ordinary interactions with CSS first. Since v1.2 the site uses one motion dependency, Lenis (smooth wheel scrolling, §7). Any new library must satisfy the PRD’s stable-version and compatibility policy.

## 3. Motion intensity by page

| Surface | Intensity | Appropriate movement |
|---|---|---|
| Homepage | Moderate, selective | Image emphasis, a few one-time editorial reveals, responsive controls |
| About/instructors | Low | Portrait/image hover, restrained section reveals |
| Insights/documentation | Low–moderate | Editorial image hover and optional nonessential entrance effects |
| Course catalogue | Low | Hover/focus states and brief result updates |
| Schedule | Minimal | Selection feedback and loading/status changes |
| Course details | Low | Session selection, FAQs, responsive action states |
| Registration/contact forms | Functional only | Field feedback, step changes, submission state |
| Registration via WhatsApp (`/id/pendaftaran`) | Functional only | Button press and step indicator; no success or “sent” state, because the site cannot know whether the WhatsApp message was sent |
| In-house training | Low | Option/process/example groups may use one-time editorial reveals; the enquiry form follows Registration/contact forms |
| MICE | Low | Image hover and restrained section reveals, as About |
| Portal Peserta | Low | Card hover/focus, FAQ accordions, optional one-time reveal of the service cards; links to other systems never animate away before navigating |
| Staff administration | Functional only | Use consistent admin feedback; no marketing entrance sequences |

Hero heading, main explanation, navigation, prices, dates, and primary CTA are in the server HTML. The only entrance allowed on them is the first-load hero intro (§5.11), which is pure CSS, finishes within 1.6 s and never blocks input. Pages reached through the site's own links fade in over 320 ms (§5.8). Do not animate an entire page in from opacity zero in any other way.

## 4. Motion tokens

Use a small shared set. Values are defaults; any exception must be documented with its purpose.

| Token | Value | Use |
|---|---|---|
| `--motion-press` | `100ms` | Immediate pressed feedback |
| `--motion-fast` | `160ms` | Colour, border, underline, field state |
| `--motion-standard` | `220ms` | Menus, FAQ panels, small transitions |
| `--motion-image` | `280ms` | Restrained image emphasis |
| `--motion-reveal` | `360ms` | Optional editorial entrance |
| `--motion-exit` | `140ms` | Closing overlays |
| `--motion-stagger` | `40ms` | Small editorial groups only |
| `--ease-standard` | `cubic-bezier(.2, 0, 0, 1)` | State changes and expansion |
| `--ease-enter` | `cubic-bezier(.16, 1, .3, 1)` | Gentle deceleration on entry |
| `--ease-exit` | `cubic-bezier(.4, 0, 1, 1)` | Fast, unobtrusive departure |
| `--move-icon` | `3px` | Decorative directional arrow |
| `--move-panel` | `8px` | Menu/panel entry |
| `--move-reveal` | `12px` | Maximum editorial reveal distance |
| `--scale-image` | `1.04` | Image hover enlargement (v1.2; portraits stay at 1.02) |
| `--motion-image-hover` | `700ms` | Image hover zoom (v1.2) |
| `--motion-arrow` | `420ms` | Button arrow swap, nav underline draw (v1.2) |
| `--motion-intro` | `1300ms` | Hero intro step (v1.3) |
| `--motion-intro-step` | `130ms` | Delay between hero intro steps (v1.3) |
| `--motion-reveal-lg` | `1400ms` | Editorial scroll reveal (v1.3) |
| `--motion-page` | `450ms` | Page fade after in-site navigation (v1.3) |
| `--ease-expo` | `cubic-bezier(.19, 1, .22, 1)` | Long, soft deceleration for intro, reveals, arrows, image hover (v1.2) |
| `--move-intro` | `40px` | Hero intro rise (v1.3) |
| `--move-reveal-lg` | `56px` | Editorial reveal rise (v1.3) |
| `--motion-unveil` | `1500ms` | Photo wipe inside a reveal (v1.3) |
| `--ease-reveal` | `cubic-bezier(.33, 1, .68, 1)` | Reveals and hero intro: ease-out cubic, movement spread over the duration (v1.3) |
| `--ease-unveil` | `cubic-bezier(.76, 0, .24, 1)` | Photo wipe: in-out (v1.3) |

No bounce, elastic easing, overshoot, or repeated pulsing. Colour and state feedback completes within 160–280 ms. Since v1.2, decorative movement uses longer curves: arrow swap and image zoom 420–700 ms expo-out; reveals and the hero intro 1.3–1.5 s on ease-out cubic (v1.3, because expo-out finished most of the movement in the first 150 ms and read as a snap). Items in a reveal follow each other 160 ms apart; hero intro steps 130 ms apart. Do not stagger every item in a long catalogue.

## 5. Component interaction specifications

### 5.1 Buttons and text links

- Hover: transition background/border/text colours over 160 ms. Follow the exact colour roles in design.md.
- Optional arrow on buttons (v1.2): on hover the arrow slides out to the right and a second arrow slides in from the left inside a clipped icon-sized box, 420 ms expo-out. Text-link arrows move 3 px. Move the icon only, not the label or hit area.
- Text links (v1.2): the underline stays; on hover it drops 2 px further from the text over 220 ms.
- Desktop navigation (v1.2): a 2 px underline draws in from the left on hover (420 ms expo-out); the current page keeps it drawn.
- Press: use a darker fill over 100 ms. Do not shrink the entire button or move surrounding content.
- Keyboard focus: show a clearly contrasting focus ring immediately. Never delay it for an entrance effect.
- Loading: preserve width and label clarity; replace the action text with an explicit state such as “Mengirim…”. Prevent duplicate activation while a request is pending.
- Disabled: no hover animation; explain the reason where needed.
- Touch: meaningful feedback must occur on activation. No information or action is available only on hover.

### 5.2 Course cards and editorial images

Course card hover/focus-within changes the border or title emphasis in 160 ms. Keep the card aligned to the grid; no card lift, tilt, or floating shadow. If the card contains an image, it may scale from 1 to 1.04 over 700 ms (expo-out) inside an overflow-clipped frame (v1.2; instructor portraits stay at 1.02 over 280 ms so faces are not cropped). Text, prices, and dates stay still.

Do not animate a schedule row’s position. Do not enlarge an image if doing so crops important faces or instructional details. On touch devices use the default static image. A title link remains a real link; decorative animation never becomes a substitute for an accessible interactive element.

### 5.3 Desktop navigation and search

Open a dropdown with opacity 0 → 1 and translateY 8 px → 0 over 220 ms. Close over 140 ms. The trigger state changes immediately. Opening must work by click/keyboard; hover can supplement it but cannot be the only method.

Keep pointer travel between trigger and menu safe. Escape closes the menu and restores focus appropriately. Hidden panels must not remain keyboard-focusable. Do not blur the full page behind ordinary dropdown navigation.

Search uses the same restrained opening behaviour. Move focus to the field after opening, without waiting for a long sequence. Closing returns focus to the trigger.

### 5.4 Mobile menu and filter drawer

Use an overlay fade and a small 8 px panel movement over 220 ms. Avoid a full-screen panel travelling the entire viewport width. Close over 140 ms, prevent background scrolling, contain focus while modal, and restore focus on close. Closing logic must work even when animations are disabled.

Synchronise visual state with accessibility attributes. If the modal primitive handles focus and dismissal, preserve that behaviour rather than rebuilding it around animation callbacks.

### 5.5 Catalogue filters and result updates

Selected-filter feedback is immediate. Fetch/update results according to the PRD’s URL-state rules. While loading, keep a stable layout and indicate “Memuat pelatihan…”; do not fade usable content to an unreadable opacity.

Once fresh results arrive, a 160 ms fade-in is optional. Never delay the update to allow an exit animation to finish. Do not animate items flying into new positions. Cancel or ignore stale responses so older results cannot overwrite the newest filter selection.

Keep focus on the filter control. Announce the updated result count politely; do not announce individual animation frames. Zero-results and failed-load messages appear clearly with useful recovery actions. Do not turn a failed request into an empty-results state.

### 5.6 FAQ accordions

Expand/collapse over 220 ms and rotate the chevron consistently. Use the selected component primitive’s supported height animation or a tested measured-height approach. Avoid a large arbitrary max-height that produces uneven durations.

The question is a button with correct expanded/control relationships. Collapsed content cannot receive focus. Opening a panel must not unexpectedly scroll the page. With reduced motion, expansion is immediate. Correctness must not depend on transitionend firing.

### 5.7 Forms and registration steps

- Focus border changes over 160 ms; focus ring appears immediately.
- Validation appears when appropriate to the form flow; use text and icon cues, never a shaking field.
- On invalid submission, show an error summary and move focus to it. Preserve all entered values.
- After a valid “Next” action, switch the step immediately; an optional 160 ms opacity transition may soften the incoming panel.
- Set focus to the incoming step heading and announce the step number. Keep only the active step in the interactive focus order.
- Respect reduced motion for any programmatic scroll. Avoid smooth scrolling when it would conceal the new focused element.
- Submit feedback follows real server state. Show success only after durable persistence, with a reference number and next steps.
- Failed saves retain the form and offer retry. Do not show success animation on a button click alone.
- No confetti, celebratory bounce, or checkmark-drawing sequence is required.

### 5.8 Page navigation and sticky elements

Use ordinary navigation. No route-wide exit animation, and no curtain between pages (the only curtain is the first-visit one in §5.12). Since v1.2 the new page fades in over 450 ms (v1.3) (opacity and an 8 px rise, `src/components/motion/PageEnter.tsx`, keyed by path so every new path fades, filter-only changes do not) after in-site navigation only; the first page of a visit gets the hero intro instead. Nothing waits for the fade, and with reduced motion it does not run. A new page always opens at the top, without gliding there.

Sticky header/action areas retain constant dimensions. A subtle border/background transition can signal the sticky state; do not continuously resize the header or hide navigation based on small scroll changes. Sticky actions must not cover form errors or keyboard focus.

### 5.9 Editorial scroll reveals

Optional only for nonessential editorial groups below the fold (v1.3): each item (the `<li>`s of a list directly inside, otherwise the group's direct children) is watched on its own and, once it is 12% inside the screen, rises 56 px from transparent over 1.4 s on `--ease-reveal` (ease-out cubic, so the movement is spread out and can be seen). Items that arrive together, such as a row of cards, follow each other 160 ms apart. A photo inside an item wipes open from the bottom over 1.5 s (`--ease-unveil`, in-out) while settling from a 1.18 zoom. The end clip must be an explicit `inset(0 0 0 0)`: clip-path cannot animate to `none`. Reveal once per page visit. Limit to a few selected groups; never apply a blanket reveal wrapper to all content.

Progressive enhancement is mandatory: content is visible in server HTML and remains visible if JavaScript fails. If an observer is used, only arm an offscreen group after the observer has been successfully installed; never hide content already visible or focused. If support is missing, show the final state. Do not repeat the effect while scrolling up and down.

Interactive or focused content must never remain transparent. During rapid scrolling, show the final state rather than queueing many delayed animations.

### 5.9.1 Scroll-linked steps (v1.4)

One exception to "reveal once": the numbered list in *Mengapa BKI Academy* on the homepage builds one item at a time, tied to the scroll position, and reverses when the visitor scrolls back up (project lead's request, 25 Nov 2026). Each `<li class="scroll-step">` is its own view timeline (`view-timeline: --step`); its parts use staggered ranges of that timeline: the top hairline draws in from the left (`cover 0%–25%`), the number goes from faint grey to BKI blue (`cover 15%–32%`), then the title and text rise 24 px from transparent (`cover 20%–40%`, `--ease-reveal`). Every item is complete by about the middle of the screen, so nobody reads half-faded text. Pure CSS scroll-driven animation, no JavaScript; without `animation-timeline` support or with reduced motion the list is shown as is, with static hairlines. No pinning or scroll-jacking. Layout (v1.4, project lead's choice): no photo; on wide screens the heading (`SectionHeading`, 5 columns) is `position: sticky` below the header (+48 px) while the list (6 columns, from column 7) scrolls past. Each reason has a display-size light number, an H3 title and intro-size text, so the list (~1020 px) is far taller than the heading (~175 px) and the heading stays in place for about 845 px of scrolling. On small screens everything stacks and nothing is sticky. A sticky photo was tried first and dropped: at 599 px against a 675 px column it would have stayed put for only about 76 px. Files: `Reasons` in `src/app/(frontend)/id/page.tsx`, globals.css "Scroll-linked steps".

### 5.10 Gradients and media

The electric-blue gradients in design.md remain static. Do not animate gradient position, add pointer-following lights, or use an always-moving background behind text.

Scroll-linked photos (v1.2): photographs drift slightly slower than the page (parallax, ±6% of the image height), using CSS scroll-driven animations (`animation-timeline: view()`), no JavaScript; browsers without support show the still photo. (v1.3: the scroll-linked unveil was replaced by the time-based photo wipe in §5.9, because tying it to scroll made it finish instantly on a fast scroll.) Off with reduced motion. Never on text.

Prefer static photographs for launch. If decorative video is added later, it must have an accessible pause control, a still-image fallback, and no audio autoplay. Pause it when offscreen or the document is hidden. With reduced motion or site motion off, display the poster and do not start decorative playback. Training videos explicitly played by the user are a separate content experience.

### 5.11 Hero intro (first load, v1.2)

On the first page of a visit, the hero builds in once: the header fades in, the gradient settles from a 1.06 zoom (2.2 s, background layer only), then the hero steps rise 40 px from transparent one after another (1.3 s each on `--ease-reveal`, 130 ms apart, starting at 80 ms; v1.3): label row, heading, hairline (draws in from the left), intro and actions, side facts. All of it is CSS on server HTML (`data-intro` steps, `introStep()` in `Atmosphere.tsx`), so the content is there without JavaScript and the page can be used during the intro. After 2.4 s `IntroState` sets `<html data-intro-done>`, so pages reached through in-site links do not replay it (M-10); a full reload plays it again. With reduced motion it does not run.

### 5.12 First-visit curtain (v1.4)

At the project lead's request (25 Nov 2026), the first page of a browser session opens behind a short curtain: a deep navy panel (`--color-navy-950`) with the parenthetical "Divisi pelatihan PT Biro Klasifikasi Indonesia" and "BKI Academy" in display type rising in (600 ms, `--ease-reveal`), a hairline drawing across (700 ms from 200 ms, `--ease-expo`), then the panel lifting away upward (550 ms from 800 ms, `--ease-unveil`). It is gone after about 1.35 s. The hero intro (§5.11) is pushed back by `--intro-offset: 1000ms`, so it starts while the panel lifts, and `IntroState` waits that much longer before setting `data-intro-done`.

Rules: it never waits for loading (the page is already in the server HTML beneath it, and the timing is fixed CSS, so it also runs and ends without JavaScript); it plays once per browser session (`IntroCurtain` sets a sessionStorage flag and marks later loads `<html data-curtain-seen>` before the first paint); it never plays with the OS reduced-motion setting or a saved "Kurangi animasi" (the same early script applies that saved choice to `<html data-motion>` before React loads, so the hero intro no longer flashes for those visitors either). It is decorative and `aria-hidden`; screen-reader users get the page immediately. Files: `src/components/motion/IntroCurtain.tsx`, globals.css "First-visit curtain".

## 6. Reduced motion and user preference

Support both the operating system preference and a site control labelled **“Kurangi animasi”** with an accessible pressed/checked state.

Default follows the OS. Store a user's explicit reduction preference locally if storage is available; storage failure must not prevent use. The effective reduced setting is OS reduce OR explicit user reduce. An OS reduce setting always wins; turning the site reduction off must not override it. Listen for OS changes during the session.

Apply preference before enabling decorative motion. Without JavaScript, all content remains usable and the OS CSS preference still applies. If the OS mandates reduction, explain why motion remains reduced instead of presenting a misleading toggle state.

In reduced mode:

- Remove translation, image scaling, stagger, scroll reveals, and decorative autoplay.
- Open menus/accordions and switch steps immediately.
- Preserve visible focus, selected-state colours, labels, and success/error messages.
- Use static loading text rather than a moving spinner or shimmering skeleton.
- Do not rely on animation completion events for focus, saving, navigation, or cleanup.

For normal mode, loading should still be restrained. Prefer static skeletons or text; if a spinner is used, accompany it with an accessible status and stop it once the request resolves.

## 7. Implementation approach

Use CSS for hover, focus, colour transitions, image transforms, and primitive-supported panels. Use small client components only for stateful controls, preferences, or optional viewport observation. Keep public content server-rendered. Do not turn the entire Next.js page into a client component solely to animate a section.

A JavaScript animation library is optional. Introduce one only for an approved coordinated interaction that CSS cannot maintain cleanly. Keep it within the smallest necessary component boundary and verify framework compatibility at installation time.

**Smooth scrolling (v1.2): Lenis 1.3.27**, mounted once in the public layout (`src/components/motion/SmoothScroll.tsx`, styles from `lenis/dist/lenis.css`). Wheel and trackpad scrolling follow the input with `lerp: 0.12` (each frame closes 12% of the remaining distance; v1.3, replacing a fixed 1.1 s duration that made the page trail behind the wheel and feel heavy); native scrolling stays underneath, so the scrollbar, keyboard scrolling, find-in-page and focus scrolling keep working. Rules:
- Off whenever motion is reduced (OS setting or “Kurangi animasi”), switching live when either changes.
- Touch devices keep native scrolling.
- Stops while a modal locks the page (Radix sets `data-scroll-locked` on `<body>`); scroll areas marked `data-lenis-prevent` scroll natively.
- Anchor links are left to the browser, so the skip link still moves focus.
- No GSAP: CSS (keyframes and scroll-driven animations) covers the intro, reveals and parallax.

Suggested organisation:

| Proposed path | Responsibility |
|---|---|
| `src/styles/motion.css` | Tokens, reusable interaction classes, reduced-motion rules |
| `src/components/motion/MotionPreferences.tsx` | Site preference, OS changes, storage fallback |
| `src/components/motion/MotionToggle.tsx` | Accessible reduction control |
| `src/components/motion/Reveal.tsx` | Optional, progressive editorial reveal |
| `src/components/ui/` | Buttons, menus, accordions, and form feedback |

These are proposed repository paths, not existing files.

### Starter CSS

```css
:root {
  --motion-press: 100ms;
  --motion-fast: 160ms;
  --motion-standard: 220ms;
  --motion-image: 280ms;
  --motion-reveal: 360ms;
  --motion-exit: 140ms;
  --motion-stagger: 40ms;
  --ease-standard: cubic-bezier(.2, 0, 0, 1);
  --ease-enter: cubic-bezier(.16, 1, .3, 1);
  --ease-exit: cubic-bezier(.4, 0, 1, 1);
}

.button {
  transition: background-color var(--motion-fast) var(--ease-standard),
              border-color var(--motion-fast) var(--ease-standard),
              color var(--motion-fast) var(--ease-standard);
}
.button__arrow {
  transition: transform var(--motion-fast) var(--ease-standard);
}
.media-frame { overflow: hidden; }
.media-frame img {
  transition: transform var(--motion-image) var(--ease-standard);
}

@media (hover: hover) and (pointer: fine) {
  .button:hover .button__arrow { transform: translateX(3px); }
  .course-card:hover .media-frame img { transform: scale(1.02); }
}

/* Decorative transform is optional; keyboard focus uses a visible ring. */
:root[data-motion='reduced'] .button,
:root[data-motion='reduced'] .button__arrow,
:root[data-motion='reduced'] .media-frame img {
  transition: none;
}
:root[data-motion='reduced'] .button__arrow,
:root[data-motion='reduced'] .media-frame img {
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .button, .button__arrow, .media-frame img { transition: none; }
  .button:hover .button__arrow,
  .course-card:hover .media-frame img { transform: none; }
  html { scroll-behavior: auto; }
}
```

This snippet illustrates only button/image behaviour; it is not a complete preference controller or component implementation. Apply reduced-motion handling to every animated component, including any third-party primitive. Do not disable functionality when transitions are removed.

## 8. Performance and resilience

- Prefer transform and opacity for movement. Do not animate layout dimensions except bounded panels such as accordions where the interaction requires it.
- Avoid `transition: all`; list properties explicitly.
- Reserve image/media dimensions to prevent layout shift.
- Do not animate blur, large shadows, or filters across large screen regions.
- Do not apply will-change to every element; use it sparingly and only when profiling justifies it.
- Do not use per-frame React state updates for decorative movement.
- Clean up observers and event listeners; avoid duplicate effects after navigation.
- New input interrupts/reverses movement naturally. Rapid open/close actions must leave the UI in its latest requested state.
- Animation must not wait for font loading or delay the primary image/CTA.
- Test on representative mobile hardware and under slow network/CPU conditions; preserve the PRD's performance budgets.

## 9. QA acceptance checklist

| ID | Pass condition |
|---|---|
| M-01 | Hero text, main CTA, dates, and prices are in the server HTML; the first-load intro finishes within 2.4 s and never blocks input |
| M-02 | Keyboard users can operate every animated control and see focus throughout |
| M-03 | Touch users have every action available without hover |
| M-04 | OS reduced motion and site reduction both suppress decorative movement, including smooth scrolling, the hero intro, page fade, and parallax |
| M-05 | Site preference survives reload where storage is available; denial degrades safely |
| M-06 | Menus restore focus; closed panels contain no focusable hidden content |
| M-07 | Rapid toggling and filter changes resolve to the latest requested state |
| M-08 | Form loading, failure, retry, and success accurately reflect server results |
| M-09 | Content is visible with JavaScript disabled or a reveal observer unavailable |
| M-10 | Back navigation and rapid scrolling do not replay distracting sequences |
| M-11 | No animation introduces page overflow, image layout shift, or covered focus |
| M-12 | Decorative media has working pause/still behaviour when present |

Test representative desktop/mobile viewports, keyboard-only navigation, reduced-motion emulation, storage failure, slow requests, and repeated actions. Use automated browser tests for state/focus/preferences and manual visual review for easing and overall restraint. Timing values alone do not establish usability or accessibility compliance.

## 10. Build order

1. Implement static, usable components and correct state transitions.
2. Add shared motion tokens and reduction handling.
3. Apply button, link, card, menu, and accordion feedback.
4. Validate registration and filter behaviour under success/failure conditions.
5. Add optional editorial reveals only after the core flows pass.
6. Review the whole website for cumulative motion; remove effects that compete with reading or completing tasks.

The final experience should feel gently responsive, with motion supporting the information rather than demanding attention.

## 11. Change log

- 1.4 · 25 November 2026 — Scroll-linked steps for the Mengapa BKI Academy list (§5.9.1). First-visit curtain (§5.12) at the project lead's request: once per session, about 1.35 s, never tied to loading, off with reduced motion; the hero intro follows it. A saved "Kurangi animasi" now applies before the first paint. §5.8 updated.

- 1.3.1 · 25 November 2026 — Fixes: the first page no longer blinks white when the hero intro ends (it is exempt from the page fade), and the page fade (§5.8) now plays on every new path, including course list to course page, by keying the wrapper on the path.

- 1.3 · 24 November 2026 — The user found the motion too fast to notice and the scrolling heavy. Lenis switched from a 1.1 s duration to `lerp: 0.12`; reveals now watch each item, rise 56 px over 1.4 s on ease-out cubic, 160 ms apart, with a photo wipe; hero intro slowed (1.3 s steps, 130 ms apart). Scroll-linked unveil removed in favour of the time-based wipe.

- 1.2 · 24 November 2026 — Richer motion at the user's request: Lenis smooth scrolling (§7), first-load hero intro (§5.11), page fade after in-site navigation (§5.8), larger staggered reveals (§5.9), scroll-linked photo parallax and unveil (§5.10), button arrow swap, nav underline draw and text-link underline shift (§5.1), longer image hover zoom (§5.2). New tokens in §4; M-01 and M-04 updated.

- 1.1 · 17 November 2026 — Added In-house training, MICE, Portal Peserta, and registration via WhatsApp (decisions D-06, D-07, D-09) to the intensity table in §3.
- 1.0 · 17 November 2026 — Initial specification.
