# Prompt History

<!-- Append new prompts at the bottom, newest last. Format:
## YYYY-MM-DD
> <prompt text>
-->

## 2026-04-25
> Initialize a new project (React JSX + Vite + pnpm + MUI + React Router) per AI_AGENTS.md spec: tools-first IPL site with Points Table, Qualification Calculator, NRR Calculator, and dynamic team pages at `/ipl/qualify/:team`. No backend, no auth, no blog, no Tailwind, no Next.js. Scaffold at the repo root and write files to disk.

## 2026-04-27
> **Reusable prompt — scaffold a Cloudflare-Pages-ready tools-first SPA at `sites/<project>/`** (regenerate the IPL site, or adapt for a sister tool by changing the product details).
>
> **Stack & constraints**
> - React 18 (JSX only — no TypeScript), Vite 6+, pnpm, Material UI v6, React Router v6.
> - Forbidden: Tailwind, Next.js, WordPress, backend APIs, auth, blog features.
> - Tools-first pSEO product. Working MVP > completeness.
>
> **Folder layout** under `src/`: `components/`, `pages/`, `layouts/`, `routes/`, `data/`, `utils/`. Mock data in `src/data/*.json`.
>
> **Routes** (React Router): `/`, `/ipl`, `/ipl/table`, `/ipl/calculators`, `/ipl/nrr`, `/ipl/qualify/:team`. Each page sets `<title>` and meta description via a small `Head` component (`useEffect` + `document.title` / `meta[name=description]`) and renders one `<h1>`.
>
> **Core features (full implementations, not stubs):**
> 1. Static IPL points table from `src/data/teams.json` (10 teams, sorted by points then NRR, top-4 highlighted).
> 2. Playoff qualification calculator — inputs: current points, matches remaining, optional NRR, target points (default 16). Output: status (`qualified` / `in-contention` / `must-win-all` / `eliminated`) + wins required + max possible points.
> 3. NRR calculator with cricket-style overs ("19.5" = 19 overs + 5 balls) handled correctly.
> 4. Per-team page at `/ipl/qualify/:team` driven by `teams.json[id]`, pre-filling the qualification calculator from team stats.
>
> **Internal linking** (matters for pSEO): table rows ↔ team pages ↔ calculators ↔ table. Use MUI `Link` with `component={RouterLink}`, never raw `<a href>` for internal routes.
>
> **Standard project files** (create if missing, don't overwrite): `AI_AGENT.md`, `README.md`, `docs/prd.md`, `docs/Prompts.md`, `.gitignore`.
>
> **Build/test workflow — Docker + Makefile, NOT host pnpm.** All `pnpm install`/`build`/`test` runs inside the shared `sites1` Docker container, driven by the parent Makefile at `../Makefile`:
> ```
> # from sites/
> make buildsh                          # enter dev container
> make run  proj=<project>              # pnpm install + pnpm dev
> make test proj=<project>              # install + build + test (Docker-only; checks /.dockerenv)
> ```
> Document this in `AI_AGENT.md` under "How to run" and "Testing".
>
> **Cloudflare Pages gotchas — bake these in from day one:**
> 1. **Vite must be ≥ 6.0.0** (`@vitejs/plugin-react` ≥ 4.3.4). Cloudflare's Wrangler-based Pages deploy refuses lower versions: *"The version of Vite used in the project cannot be automatically configured."*
> 2. **`pnpm-lock.yaml` must match `package.json`.** Cloudflare runs `pnpm install --frozen-lockfile`; out-of-sync lockfiles fail the build with `ERR_PNPM_OUTDATED_LOCKFILE`. After every dependency change, regenerate inside the dev container — pnpm is at `/root/.volta/bin/pnpm` (not on PATH by default):
>    ```
>    docker exec -w /usr/src/app/<project> <sites1-container> \
>      bash -lc 'export PATH=/root/.volta/bin:$PATH && pnpm install'
>    ```
> 3. **No stray gitlinks.** If a sub-directory contains its own `.git/` (e.g. an experimental scaffold under `genai/`), `git add` records it as a submodule (mode 160000) without a matching `.gitmodules` entry — Cloudflare's recursive clone then aborts with *"error occurred while updating repository submodules"*. Either `git rm --cached <path>` to drop the gitlink, or add the directory to `.gitignore` before staging.
> 4. **Do NOT ship `public/_redirects` with `/* /index.html 200`** for SPA fallback. Cloudflare's new Workers Static Assets validator rejects it as an infinite-loop rule (code 10021) because the destination matches the source glob. Cloudflare's Vite preset already serves `index.html` for unmatched routes, so no `_redirects` is needed. If for some reason it isn't auto-handling, ship a `wrangler.jsonc` with `assets.not_found_handling = "single-page-application"` instead.
>
> **Output:** write all files to disk. Don't print contents in chat unless asked. Confirm `make run proj=<project>` and the Cloudflare deploy both succeed before declaring done.

## 2026-04-28 — Favicon
> Create a brand-consistent favicon for the project. Output three files in `public/`:
> - `favicon.svg` — vector primary. A recognisable mark on a brand-coloured rounded square so it reads as a logo at 16×16, not just an outline. Use the project's MUI theme primary as the background.
> - `favicon.ico` — multi-size legacy fallback. Generate from the SVG via ImageMagick: `convert -background none -density 1024 favicon.svg -define icon:auto-resize=64,48,32,16 favicon.ico`.
> - `apple-touch-icon.png` — 180×180 PNG for iOS home-screen. `convert -background none -density 1024 -resize 180x180 favicon.svg apple-touch-icon.png`.
>
> Wire all three into `index.html`:
> ```html
> <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
> <link rel="alternate icon" type="image/x-icon" href="/favicon.ico" />
> <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
> ```
> Vite copies `public/` to the deploy root, so no extra config is needed. Verify the rendered PNG visually before committing — favicons that look fine at large sizes can be unreadable at 16×16.

## 2026-04-28 — Sitemap, robots.txt, SEO baseline
> Add automatic sitemap generation, a static robots.txt, and the SEO essentials needed to submit the site to Google.
>
> 1. **`scripts/generate-sitemap.mjs`** (ESM, no deps) — reads the route list. Static routes are hardcoded; dynamic routes derived from `src/data/*.json` (e.g. one entry per team in `teams.json`). Writes `dist/sitemap.xml`. Each `<url>` includes `<loc>`, `<lastmod>` (today, ISO `YYYY-MM-DD`), `<changefreq>`, `<priority>`. Site URL configurable via `SITE_URL` env, defaulting to the production hostname (e.g. `https://cricketfansite.com`).
> 2. **`package.json`** — wire into the build script so every Cloudflare deploy regenerates with a fresh `lastmod`:
>    ```json
>    "build": "vite build && node scripts/generate-sitemap.mjs"
>    ```
> 3. **`public/robots.txt`** — static, three lines: `User-agent: *` / `Allow: /` / `Sitemap: https://<host>/sitemap.xml`.
> 4. **Do NOT** create `public/_redirects` with `/* /index.html 200` for SPA fallback — Cloudflare's Workers Static Assets validator rejects it (see scaffold prompt gotcha #4). The Vite preset handles SPA routing without it.
> 5. **Verify** with a Docker-driven build before pushing:
>    ```
>    docker exec -w /usr/src/app/<project> <sites1-container> \
>      bash -lc 'export PATH=/root/.volta/bin:$PATH && pnpm build'
>    head -20 dist/sitemap.xml; cat dist/robots.txt
>    ```
>
> **Beyond this baseline (roadmap, not implemented yet):**
> - Pre-rendering / SSG (`vite-react-ssg`, `vite-plugin-prerender`, or `react-snap`) — single highest-leverage SEO improvement for a React SPA, since Googlebot's JS execution is slower and less reliable than HTML.
> - Open Graph + Twitter Card meta tags in the `Head` component.
> - `<link rel="canonical">` per page (only meaningful with pre-rendering).
> - JSON-LD structured data: `WebSite` everywhere, `BreadcrumbList` on nested pages, `SportsTeam` per team page.
> - Google Search Console + Bing Webmaster Tools verification, then submit `/sitemap.xml` in both.
> - Analytics (GA4 / Cloudflare Web Analytics / Plausible) before promoting the site.

## 2026-09-16 — Off-season mode: de-stale the site, season-state switch
> Context: cricketfansite.com is a tools-first IPL site (points table, playoff
> qualification calculator, NRR calculator, /ipl/qualify/{team} pages). It's
> September 2026 and IPL 2026 finished months ago, but the site still shows
> every team at 10 played with "matches remaining" scenarios. That's stale and
> hurts trust/SEO. Goal of this session: fix the staleness and lay groundwork
> for off-season content. Small, safe updates only — no new page types yet.
>
> **Step 0 — Recon (report back before editing):**
> - Identify the stack, build/deploy process, and where standings data lives
>   (hardcoded, JSON, fetched?).
> - Tell me whether the current table data looks like real IPL 2026 data or
>   placeholder/mock data (all teams on exactly 10 played is suspicious).
> - List every route and its title/meta description.
>
> **Step 1 — Season state switch:**
> - Add a single config value (e.g. season status: "live" | "complete" |
>   "upcoming") plus season year, so the whole site changes mode from one place.
> - Set it to "complete" for IPL 2026.
> - DO NOT invent final standings, playoff results, or the champion. If real
>   final data isn't in the repo, add clearly marked TODO placeholders and a
>   data file I can fill in, and list exactly what fields you need from me.
>
> **Step 2 — Behavior when season is "complete":**
> - Home + /ipl/table: heading becomes "IPL 2026 Final Points Table"; hide
>   "matches remaining" and "top four advance" live language.
> - /ipl/qualify/{team}: replace live scenarios with a short final-result
>   summary (final position, points, NRR, playoffs yes/no from the data file)
>   and a note that the scenarios return when IPL 2027 starts. Keep the URLs
>   live (no 404s, no redirects) so existing indexing isn't lost.
> - Calculators (/ipl/calculators, /ipl/nrr): keep fully working; they're
>   evergreen. Remove any default inputs pulled from stale live standings.
> - Add a small site-wide banner: "IPL 2026 is complete — IPL 2027 tools
>   return before the season." (Don't hardcode an IPL 2027 date.)
>
> **Step 3 — Meta/SEO hygiene:**
> - Update titles and meta descriptions so none claim "live" or "current"
>   while season is complete (e.g. the RCB description currently says
>   "4 matches left").
> - Confirm sitemap.xml and robots.txt exist and are correct; add them if
>   missing. Add lastmod dates.
> - Add SportsEvent or basic WebApplication JSON-LD only where accurate;
>   skip anything that would state unverified facts.
>
> **Step 4 — Groundwork only (no content):**
> - Refactor so the points table, qualification logic, and NRR logic are
>   tournament-agnostic (tournament id, team list, playoff spots, points per
>   win passed in), with IPL as the first config. Future targets are World
>   Test Championship, BBL, SA20, MLC, and team head-to-head pages, so avoid
>   IPL-specific assumptions baked into the components.
> - Don't create those new routes yet.
>
> **Constraints:**
> - Keep diffs minimal and readable; no dependency additions unless required.
> - Run the build and any tests; fix what you break.
> - Finish with: summary of changes, files touched, the data I need to
>   supply, and anything you found that looks wrong.

**Outcome:** the standings in `src/data/teams.json` turned out to be mock data,
not real IPL 2026 results — `matches.json` described 8 matches while
`teams.json` implied 100, and each row's NRR disagreed with its own runs/overs
columns. They were deleted rather than relabelled "final". Season state moved to
`src/config/season.json`; results to `src/data/ipl/season-2026.json`, rendered
only when its `verified` flag is set.

## 2026-09-16 — Fill the real IPL 2026 data + expand /ipl/nrr
> go ahead and fill all the data and then do the following **Step 5 — /ipl/nrr
> page expansion** (it will become the site's main calculator page):
> - Keep URL. Add tabs/modes: Net Run Rate, Run Rate, Required Run Rate
>   (target, overs remaining; cricket overs notation).
> - Title: "Net Run Rate Calculator (NRR) — Run Rate & Required Run Rate"
> - H1 "Net Run Rate Calculator"; add H2 sections for run rate and required
>   run rate, a short worked example for each, and a brief FAQ (how NRR is
>   calculated, how all-out innings count toward overs). No filler text.
> - Make it tournament-agnostic in copy (not IPL-only); link it from the nav as
>   "NRR Calculator".
> - Add FAQPage JSON-LD only for the FAQ actually on the page.

**Note for future sessions:** "fill all the data" could not be answered from
model knowledge — the cutoff predates the end of the season, and inventing
standings was explicitly out of bounds. The real final table was sourced from
Wikipedia, cross-checked against independent reporting on the top six, and
validated arithmetically (69 W / 69 L, one abandoned match, every points total
= wins × 2 + no-results) before being written to the data file with its source
recorded. Do the same for IPL 2027: source it, check it, record where it came
from.

## 2026-09-16 — Follow-ups: branching, Wrangler, soft 404
> we will work on main as much as possible, that is this repo's convention
>
> are we using wrangler or CF? update all docs to say the right thing
>
> [on the soft-404 options] seo-correct

**Outcome:** branching convention recorded in `docs/CLAUDE.md § Conventions`.
The Wrangler question exposed a real gap — this repo had no `wrangler.jsonc`
while 32 sibling sites under `sites/` ship one, and an earlier commit had
wrongly documented that absence as the intended design. Both are in play:
Pages is the platform, Wrangler is its config layer. Shipping the config with
`not_found_handling: "404-page"` plus a prerendered `dist/404.html` fixed the
soft 404 (unmatched paths had been returning HTTP 200 with the homepage body).
The Astro siblings already on `404-page` mode get `dist/404.html` free from
`src/pages/404.astro`; this Vite + React site renders it at the end of
`scripts/prerender.mjs`.

## 2026-09-16 — Playoff results, playoff outcome per team, deploy check
> Small follow-up updates to cricketfansite.com:
>
> 1. Add IPL 2026 playoff results to /ipl/table, below the league table:
>    Qualifier 1, Eliminator, Qualifier 2, Final — teams, winner, margin.
>    Add a "Champions: Royal Challengers Bengaluru" line. Put the data in the
>    season data file, not hardcoded in the template. I will supply/verify all
>    results — leave clearly marked TODOs for anything not already in the repo.
>    Do NOT invent margins or results.
>
> 2. Team season pages (/ipl/qualify/{team}): replace the boolean "Playoffs:
>    Qualified" with a playoff outcome field: Champions / Runners-up /
>    Lost Qualifier 2 / Lost Eliminator / Did not qualify. Update each page's
>    meta description to include the outcome.
>
> 3. Confirm the homepage and /ipl/nrr are deployed with the season-complete
>    changes (homepage must not show 10-played standings or "can your team still
>    qualify"). Report what's actually being served in production; purge the
>    CDN cache if one is in use.
>
> 4. Add "Last updated" date to /ipl/table and team pages, from the data file.
>
> Run build and tests. Report files changed and the data I need to verify.

**Outcome:** production confirmed current; no CDN purge needed (HTML is served
`cf-cache-status: DYNAMIC`, `max-age=0, must-revalidate`). Playoff pairings were
derivable from the verified standings plus the standard four-team double-chance
bracket, and the winners were already in the repo, so only margins and three
dates/venues are outstanding — left `null` and rendered as an em dash. Team
outcome is derived from the data, not hardcoded: each playoff match carries an
`eliminationLabel` naming what its loser is called.

Also noted while probing production: `/ipl/table` and friends answer HTTP 308 to
the trailing-slash form before serving 200, while the sitemap lists the
non-slash URLs — so every sitemap entry costs a redirect hop. Not yet fixed; see
`docs/prd.md`.

