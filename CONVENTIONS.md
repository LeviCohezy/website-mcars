# CONVENTIONS

Shared foundation for the MCARS site. Three page builds run in parallel
(`feat/home-a`, `feat/home-b`, `feat/home-c`); this document is the contract
that keeps them from diverging or colliding.

**Read this before writing any page code. The rules here are not suggestions.**

Stack: Next.js 16 (App Router) · React 19 · Tailwind CSS v4 (`@theme`, no
config file) · TypeScript. Copy is **Dutch**. Components are flat in
`src/components/`, kebab-case filenames, default exports.

> This is a patched Next.js (see `AGENTS.md`). Before using a Next API, read the
> matching guide in `node_modules/next/dist/docs/`.

---

## 1. Design tokens (single source of truth for colour)

Defined once in `src/app/globals.css` under `@theme`. They are semantic aliases
over the zinc scale the site already uses, so adopting them changes nothing
visually. Tailwind v4 exposes each `--color-*` as `bg-*`, `text-*`, `border-*`,
`ring-*`.

| Token           | Utility examples                | Value (was)        | Use for                              |
| --------------- | ------------------------------- | ------------------ | ------------------------------------ |
| `ink`           | `bg-ink` `text-ink`             | `#09090b` zinc-950 | Primary text, dark surfaces/panels   |
| `ink-soft`      | `bg-ink-soft` `hover:bg-ink-soft` | `#27272a` zinc-800 | Hover state on dark surfaces         |
| `surface`       | `bg-surface`                    | `#ffffff`          | Page background, light cards         |
| `surface-muted` | `bg-surface-muted`              | `#f4f4f5` zinc-100 | Inset light panels                   |
| `line`          | `border-line` `ring-line`       | `#e4e4e7` zinc-200 | Hairline borders on light            |
| `muted`         | `text-muted`                    | `#71717a` zinc-500 | Secondary text                       |
| `muted-soft`    | `text-muted-soft`               | `#a1a1aa` zinc-400 | Tertiary text, eyebrows, form labels |

**Rules**

- Prefer these names over raw `zinc-*` in **new** code. Do not mass-rewrite
  existing components — additive only.
- Never introduce a new colour. If you need one, add a token here first and
  say why in your PR — don't inline a hex or an off-palette `zinc-*`.
- On dark panels, translucent whites (`bg-white/5`, `ring-white/10`,
  `text-white`) remain the idiom — tokens are for opaque light contexts.

---

## 2. Spacing scale & vertical rhythm — use `<Section>`

Every content block is wrapped in `<Section>` (`src/components/section.tsx`).
**Do not hand-type `px-5 py-16 sm:px-8 sm:py-24`.** That is exactly the drift
this component exists to prevent.

```tsx
import Section from "@/components/section";

<Section>…</Section>                        // canonical py-16 sm:py-24
<Section space="tight">…</Section>          // py-12 sm:py-16
<Section space="loose">…</Section>          // py-20 sm:py-32
<Section space="flush-top">…</Section>      // pb only — block stacked under a hero/section
<Section space="flush-bottom">…</Section>   // pt only — last block before the footer
<Section container>…</Section>              // constrain content to max-w-6xl, centered
<Section id="offerte">…</Section>           // anchor target for in-page links
<Section bleed>…</Section>                  // drop horizontal padding (edge-to-edge media)
```

**Props:** `space` (`default` | `tight` | `loose` | `flush-top` | `flush-bottom`
| `none`), `container` (bool), `bleed` (bool), `id`, `as` (default `section`),
`className`.

- Horizontal padding is `px-5 sm:px-8`, applied automatically. Use `bleed` only
  for full-width media/panels.
- `<Section>` owns **spacing only** — it never paints a background. Colour goes
  on rounded inner panels (`rounded-3xl bg-ink`, `rounded-3xl bg-surface-muted`),
  which is the house style. Standard panel radii: `rounded-3xl`, `rounded-[2rem]`.

---

## 3. Type scale — use the heading primitives, don't retype sizes

The type scale lives inside components, not loose utility strings. Do not
hand-type heading sizes like `text-3xl … sm:text-4xl lg:text-5xl`.

| Level        | Component / source                     | Rendered size                          |
| ------------ | -------------------------------------- | -------------------------------------- |
| Page title   | `<PageHero title>` → `<h1>`            | `text-4xl sm:text-5xl lg:text-[4.25rem]` |
| Section head | `<SplitHeading lead trail>` → `<h2>`   | `text-3xl sm:text-4xl lg:text-5xl`     |
| Eyebrow      | `<Eyebrow>` (above a section head)     | `text-sm tracking-widest uppercase`    |
| Card / sub   | `<h3>` inside blocks                   | `text-lg` / `text-xl`                  |
| Body         | plain `<p>`                            | `text-base` / `text-sm`, `text-muted`  |

`SplitHeading`, `Eyebrow`, `ArrowButton`, `ArrowChip` all live in
`src/components/ui.tsx`. The display font (Bebas Neue) is
`font-[family-name:var(--font-display)]` — used for stat numbers and giant
wordmarks only.

### Heading-level rules

- **One `<h1>` per page**, and it comes from `<PageHero>`. Never write a second `<h1>`.
- Section headings are `<h2>` — use `<SplitHeading>`.
- Card / sub-section titles are `<h3>`. Do not skip levels (no `<h2>` → `<h4>`).
- `<Eyebrow>` is a `<p>`, not a heading — it does not consume a level.

---

## 4. Shared components & their props

Import from `@/components/*`. These are the building blocks — compose pages from
them; do not fork them.

### Layout & chrome

| Component        | Import                        | Props                                             | Notes |
| ---------------- | ----------------------------- | ------------------------------------------------- | ----- |
| `PageShell`      | `@/components/page-shell`     | `children`, `navTheme?`                            | Nav + content + dark footer. Frame for **interior** pages. |
| `PageHero`       | `@/components/page-hero`      | `title`, `eyebrow?`, `subtitle?`, `crumbs?`, `image?`, `video?`, `align?`, `size?`, `bigWord?`, `badges?`, `card?`, `scrollCue?`, `primaryCta?`, `secondaryCta?` | Cinematic interior hero. Renders the page `<h1>`. |
| `SiteNav`        | `@/components/site-nav`       | `theme?`                                           | Fixed floating nav. Reads `lib/site.ts`. |
| `SiteFooter`     | `@/components/site-footer`    | —                                                 | Dark footer. |
| `SiteFooterLight`| `@/components/site-footer-light` | —                                              | Light footer (home variants). |
| `Section`        | `@/components/section`        | see §2                                            | Vertical rhythm wrapper. |

### Conversion (primary)

| Component   | Import                     | Props                                | Notes |
| ----------- | -------------------------- | ------------------------------------ | ----- |
| `QuoteForm` | `@/components/quote-form`  | `variant?: "full" \| "inline"`, `className?` | **The** conversion element. Client-side validation + `mailto:` submit. `full` = dark panel with pitch; `inline` = compact 3-field CTA to embed mid-page. |
| `QuoteCta`  | `@/components/blocks`      | `title?`, `body?`                    | Dark band linking to `/offerte`. |

### UI primitives (`@/components/ui`)

`ArrowButton` (`href`, `children`, `variant?: "dark" \| "light"`, `className?`) ·
`ArrowChip` (`className?`) · `Eyebrow` (`children`, `className?`) ·
`SplitHeading` (`lead`, `trail?`, `className?`).

### Content blocks (`@/components/blocks`)

`HighlightGrid` (`items`, `accent?`) · `BenefitsList` (`items`) ·
`StatRow` (`items`, `dark?`) · `FaqAccordion` (`items`) ·
`ProcessTimeline` (`steps`, `dark?`) · `RibbonBand` (`items`, `className?`) ·
`MaskedHeading` (`text`, `image?`, `video?`, `className?`).

### Scroll / motion (`@/components/scroll`)

`Reveal` (`children`, `delay?`, `variant?`, `as?`, `className?`) · `Parallax` ·
`CountUp` · `Marquee` · `ScrollCue`.

### Content & config

- `@/lib/site` — `site` (name, contact, address, hours, reviews) and `nav`.
  All contact details and nav links come from here. Never hardcode them.
- `@/data/services`, `@/data/routes`, `@/data/europe-map` — page content data.
- `@/lib/variants` — the home-variant registry that powers `/overview` and
  `<VariantSwitcher>`. **Register your new home variant here** (see §6).

> **Quote components — heads up.** `quote-multistep.tsx` and `quote-contact.tsx`
> are large, page-specific legacy forms still used by `/offerte`, `/` and `/v3`.
> They are **not** the shared component. For new work use `<QuoteForm>`.

---

## 5. Files page-level work must NEVER modify

These are shared across all three parallel builds. Editing them in a page branch
causes merge collisions and cross-build regressions. **If you think one needs to
change, stop and raise it on `main` first — do not touch it in a page branch.**

```
src/app/globals.css              # design tokens & global CSS
src/app/layout.tsx               # root layout, fonts, providers
CONVENTIONS.md                   # this contract

src/components/section.tsx       # vertical rhythm
src/components/quote-form.tsx    # canonical conversion element
src/components/ui.tsx            # ArrowButton / Eyebrow / SplitHeading / ArrowChip
src/components/page-shell.tsx    # interior page frame
src/components/page-hero.tsx     # interior hero
src/components/site-nav.tsx      # nav
src/components/nav-pill.tsx      # nav dropdown pill
src/components/site-footer.tsx       # dark footer
src/components/site-footer-light.tsx # light footer
src/components/blocks.tsx        # shared content blocks
src/components/scroll.tsx        # motion primitives
src/components/icon.tsx          # icon set
src/components/intro-loader.tsx  # global intro
src/components/lenis-provider.tsx

src/lib/site.ts                  # site config & nav (edit copy via PR on main)
src/lib/variants.ts             # variant registry — APPEND your variant only (§6)
```

**Allowed** in a page branch: create new page-specific components and add your
route/section files. If a would-be-shared component emerges, land it on `main`
and update this file — don't copy-paste it into three branches.

---

## 6. Registering a home variant

Each build owns one home design. Wire it into the gallery so `/overview` and the
on-page `<VariantSwitcher>` pick it up:

1. Build your page (e.g. `src/app/home-a/page.tsx`).
2. **Append** a `Variant` to the `home` section's `variants` array in
   `src/lib/variants.ts` — append only, never edit siblings' entries.
3. Render `<VariantSwitcher sectionId="home" />` at the end of your page.

---

## 7. Definition of done (per page branch)

- Uses `<Section>` for every block — no hand-typed section padding.
- Colours are tokens or the documented dark-panel whites — no stray hex/off-palette.
- Exactly one `<h1>` (from `<PageHero>` on interior pages); heading levels don't skip.
- Conversion uses `<QuoteForm>` (or `<QuoteCta>`), not a bespoke form.
- Contact details/nav read from `@/lib/site` — nothing hardcoded.
- No file from §5 is modified.
- `npx tsc --noEmit` and `npx next build` both pass.
```
