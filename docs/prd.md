# PRD — cricketfansite.com

## Phase 1 — Tools MVP
- [x] Project scaffold (Vite + React JSX + pnpm + MUI + React Router)
- [x] IPL Points Table page from static JSON
- [x] Playoff Qualification Calculator (points, matches remaining, optional NRR)
- [x] Net Run Rate Calculator
- [x] Dynamic team pages at `/ipl/qualify/:team` with pre-filled calculator
- [x] Internal linking: table ↔ team pages ↔ calculators
- [x] Per-page `<title>` + meta description via `Head` component
- [x] Mobile-responsive MUI layout

## Phase 2 — Reach & polish
- [x] Static sitemap.xml + robots.txt
- [x] Pre-render / SSG pass for crawlability of `/ipl/qualify/:team`
      (`vite build --ssr` + `scripts/prerender.mjs`, 15 static pages)
- [x] More tools — required run rate + run rate, shipped as tabbed modes
      on `/ipl/nrr`
- [ ] More tools — head-to-head
- [ ] Per-team SEO copy (qualification scenarios in plain English).
      Partially done: team pages carry a final-result summary, but there
      is no prose scenario copy for a live season.
- [ ] Lighthouse pass (perf, a11y, SEO ≥ 95) — never measured; do not
      claim a score until it has been run

## Phase 3 — Off-season mode & multi-tournament groundwork
Shipped 2026-09-16 (`87f07bc`):
- [x] Single season switch — `src/config/season.json`
      (tournament, year, `live` / `complete` / `upcoming`)
- [x] Mock standings removed; results moved to
      `src/data/ipl/season-2026.json`, rendered only when `verified`
- [x] Real IPL 2026 final table filled and sourced
- [x] Season-aware headings, copy, titles and meta descriptions
- [x] Site-wide season banner, no hardcoded next-season date
- [x] Team pages keep their URLs and show a final-result summary
- [x] `/ipl/nrr` rebuilt as the main calculator page — three modes,
      worked examples, FAQ + FAQPage JSON-LD
- [x] Tournament-agnostic utils and components (format passed in)
- [x] Sitemap `changefreq` / `lastmod` reflect a finished season

Open:
- [ ] **Ship the missing `wrangler.jsonc`.** 32 sibling sites have one;
      this repo never has. Needed regardless of which option below wins,
      because right now nothing in the repo declares asset handling.
- [ ] **Decide how unmatched paths should behave** (soft-404 fix). Today
      an unknown URL returns HTTP 200 with the prerendered home page, so
      crawlers can see unlimited duplicate home-page URLs. Two options:

      1. `not_found_handling: "single-page-application"` — matches the
         other 32 sites. Keeps the 200 + home-page body, so it formalises
         current behaviour rather than fixing the soft 404. Lowest
         divergence, no SEO gain.
      2. `not_found_handling: "404-page"` + a prerendered `dist/404.html`
         — returns a real 404 with the `NotFoundPage` body. Fixes the
         soft 404. Diverges from the portfolio convention, and makes
         `/ipl/qualify/<bad-id>` a hard 404 instead of today's client-side
         redirect to the table (arguably more correct).

      Needs an operator decision; option 2 is the SEO-correct one, option 1
      is the consistent one.
- [ ] Delete `src/data/matches.json` — 8 fabricated matches, imported by
      nothing, contradicts the real season data
- [ ] Off-season content, once the shape is decided (the `playoffs` block
      in the season data file is filled but no page consumes it yet)

## Problem

<1-2 sentences: what is the user-facing problem this site solves?
Who has it? Why does it matter?>

## Users

<Who's the target user? What do they care about? Roughly how many
exist? What's their willingness to pay / engage?>
