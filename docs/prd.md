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
- [x] Ship the missing `wrangler.jsonc` (2026-09-16). Matches the sibling
      shape; 32 other sites under `sites/` already had one.
- [x] Soft-404 fixed — `not_found_handling: "404-page"` plus a
      `dist/404.html` emitted by `scripts/prerender.mjs`. Unmatched paths
      now return a genuine HTTP 404 with the `NotFoundPage` body instead
      of a 200 carrying the homepage. The 404 page is marked `noindex`
      and deliberately kept out of `routes.mjs` so it never reaches the
      sitemap.

      Note on precedent: 5 sibling sites already use `404-page` mode, so
      this is not a divergence — but they are all Astro, where
      `src/pages/404.astro` compiles to `dist/404.html` for free. This is
      a Vite + React site with a custom prerenderer, so the file is
      rendered explicitly from a path that matches no route.

      Side effect to watch: `/ipl/qualify/<bad-id>` is now a hard 404
      rather than a client-side bounce to the table. That is the correct
      status for a URL that was never valid, but it is a behaviour change.

- [ ] Trailing-slash canonicalisation: `/ipl/table` answers HTTP 308 to
      `/ipl/table/` before serving 200, but the sitemap lists the non-slash
      form, so every sitemap URL costs a redirect hop. Fix by either
      emitting trailing slashes in the sitemap, or setting
      `html_handling: "drop-trailing-slash"` in `wrangler.jsonc` so the
      non-slash form (what the app's own links use) is served directly.
      The second matches the app; needs an operator call.
- [ ] Delete `src/data/matches.json` — 8 fabricated matches, imported by
      nothing, contradicts the real season data
- [x] Playoff results on `/ipl/table` (2026-09-16) — Q1 / Eliminator /
      Q2 / Final with teams, winner and margin, plus a "Champions" line,
      all driven by the `playoffs` block in the season data file. Team
      pages replaced the boolean "Playoffs: Qualified" with a derived
      outcome (Champions / Runners-up / Lost Qualifier 2 / Lost
      Eliminator / Did not qualify), which also appears in each page's
      meta description. "Last updated" added to the table and team pages.
- [x] Playoff margins, dates and venues filled from search (2026-09-16):
      Q1 RCB by 92 runs (26 May, Dharamsala); Eliminator RR by 47 runs
      (27 May, New Chandigarh); Q2 GT by 7 wickets (29 May, New
      Chandigarh); Final RCB by 5 wickets (31 May, Ahmedabad). From the
      ESPNcricinfo IPL 2026 match pages; provenance in `playoffs._source`.
      See `## Needs operator verification` below — still unverified.
- [ ] Off-season content, once the shape is decided

## Needs operator verification

Everything in `src/data/ipl/season-2026.json` is **search-sourced, not
operator-supplied**. The file's `verified: true` flag only gates rendering —
it means "sourced and internally consistent", not "a human has checked it".
The same warning sits in the file's `_verify` key; delete that key when this
section is cleared.

- [ ] League standings — all 10 rows (position, P/W/L/NR, points, NRR).
      Source: Wikipedia `2026_Indian_Premier_League`. Cross-checked against
      independent reporting on the top six, and arithmetically self-consistent
      (69 W / 69 L, one abandoned match, every points total = wins x 2 +
      no-results).
- [ ] Playoff margins, dates and venues. Source: ESPNcricinfo match pages,
      series 1510719. Highest-risk items: `qualifier1.margin` ("92 runs") and
      the New Chandigarh venue naming (ESPNcricinfo "New Chandigarh" vs
      Wikipedia "Maharaja Yadavindra Singh Stadium" vs "Mullanpur").
- [ ] Champion / runner-up and the four match winners. Cross-checked across
      two sources; lowest risk of the three.

## Problem

<1-2 sentences: what is the user-facing problem this site solves?
Who has it? Why does it matter?>

## Users

<Who's the target user? What do they care about? Roughly how many
exist? What's their willingness to pay / engage?>
