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
