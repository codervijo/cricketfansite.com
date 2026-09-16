# AI Agent Context — cricketfansite.com

## What this project is
Tools-first IPL companion site. Ships a points table, a playoff qualification calculator, a net run rate calculator, and per-team qualification pages — no blog, no auth, no backend.

## Stack
- React 18 (JSX only — no TypeScript)
- Vite (dev server + build)
- pnpm (package manager)
- Material UI v6 (`@mui/material`, `@mui/icons-material`, `@emotion/*`)
- React Router v6 (client-side routing, including dynamic `/ipl/qualify/:team`)

## Project structure
- `src/components/` — reusable UI (PointsTable, QualificationCalculator, NRRCalculator, RunRateCalculator, RequiredRunRateCalculator, SeasonBanner, ResultsPending, FormatSummary, Navbar, Footer, Head)
- `src/pages/` — route components (Home, IPLHub, PointsTable, Calculators, NRR, Team, NotFound)
- `src/layouts/` — shared shells (MainLayout)
- `src/routes/` — router config (`index.jsx`)
- `src/config/` — `season.json` (THE season switch: tournament + year + `live`/`complete`/`upcoming`) and `tournaments.js` (per-tournament format: teams, matches per team, playoff spots, points per win)
- `src/data/<tournament>/` — static JSON per tournament: `teams.json` (identity only — id, name, short, colour) and `season-<year>.json` (results; rendered only when its `verified` flag is true)
- `src/utils/` — pure helpers (`nrr.js`, `qualification.js`, `season.js`)
- `docs/` — PRD and prompt history
- `genai/` — exploratory scaffolds from prior tooling (not part of the shipped app)

## How to run

All `pnpm` / `node` commands MUST be executed inside the shared Docker dev container, driven via the parent `Makefile` at `../Makefile` (i.e. `/home/vijo/work/projects/sites/Makefile`). Do not run `pnpm install` directly on the host — the host environment is intentionally minimal.

Workflow:

```
# from /home/vijo/work/projects/sites
make buildsh                          # build + enter the dev container (mounts sites/ at /usr/src/app)

# inside the container, working dir is /usr/src/app:
make deps                             # one-time: install pnpm globally inside the container
make run  proj=cricketfansite.com     # pnpm install + pnpm dev (Vite on http://localhost:5173)
```

Targets:
- `make buildsh` — build the `sites1` image and drop into bash inside the container
- `make deps` — install pnpm inside the container (idempotent)
- `make run proj=cricketfansite.com` — install deps + start the Vite dev server for this project
- `make new name=<x>` — scaffold a fresh Vite React project (not used here; project already exists)

## Testing

Tests and builds also run inside the Docker dev container, via the same `../Makefile`. The `test` target hard-fails outside Docker (it checks `/.dockerenv`), so always enter `make buildsh` first.

```
# from /home/vijo/work/projects/sites
make buildsh

# inside the container:
make test proj=cricketfansite.com
```

`make test proj=cricketfansite.com` does, in order:
1. `pnpm install` inside `cricketfansite.com/`
2. `pnpm build` (Vite production build → `dist/`)
3. `pnpm test` (tolerated to fail until a unit-test runner is added)
4. `pnpm test:seo` if a `test:seo` script is present in `package.json`

When adding tests:
- Unit tests: add a `"test"` script to `package.json` (e.g. Vitest). Place specs next to the file under test as `*.test.jsx`, or under `src/__tests__/`.
- SEO checks: add a `"test:seo"` script — the Makefile auto-runs it. Good candidates: per-route `<title>`, meta description presence, single `<h1>` per page.

Do not bypass the Makefile for CI-equivalent runs. If a step needs to happen outside Docker (rare), document the reason here.

## Key conventions
- JSX only; do not introduce TypeScript.
- Material UI components only — no Tailwind, no ad-hoc CSS frameworks.
- Each page sets its own `<Head title="…" description="…" />` and renders an `<h1>` for SEO.
- Internal links use React Router's `Link` (or MUI `Link` with `component={RouterLink}`), never raw `<a href>` for in-app routes.
- Pure logic (NRR formula, qualification math) lives in `src/utils/` and is imported by both generic and team-specific pages.
- Team pages are driven by `src/data/<tournament>/teams.json` keyed by `id` (lowercase short code, e.g. `csk`, `mi`).
- Season state is read from `src/config/season.json` and nowhere else. Pages branch on the helpers in `src/utils/season.js` (`isComplete`, `hasResults`), never on a hardcoded year or status.
- Results are rendered only when the season data file's `verified` flag is true. An unverified or unfilled season shows a labelled gap (`ResultsPending`), never placeholder numbers — the site must not assert a standing, a result or a champion it cannot source.
- Components and `src/utils/` take tournament config as input (format, team list, base path). Don't bake IPL assumptions into them; adding WTC / BBL / SA20 / MLC should mean a new config entry plus data files, not component edits.

## Out of scope / don't touch
-

## Versioning

This project follows the two-level versioning convention canonical
to the portfolio (see `sites/portfolio/AI_AGENTS.md` for the full
statement):

- **`vN`** — major capability tier (SemVer-MAJOR semantics).
- **`vN.X`** — phase letter within a tier (A, B, C, …) for
  internal slicing.
- **`vN.X.Y`** — numeric sub-phase for follow-up work that lands
  after `vN.X` shipped.

Track current phase + completed work in `docs/prd.md`.

## Building info

This project's `Makefile` forwards every target to `../Makefile`
(the sites/ workspace) which delegates per-stack work to the central
builder at `~/work/projects/builder/`. Common: `make deps`, `make dev`,
`make build`. Don't duplicate build logic per-site.

## Deployment info

Cloudflare Pages, built from `main`; build output is `dist/`. Pages is
the platform and Wrangler is its config layer — the portfolio declares
asset handling in a root `wrangler.jsonc`, which this repo now has.
Unmatched paths return a real HTTP 404 with `dist/404.html`, emitted by
`scripts/prerender.mjs`. Custom domain is set in the CF Pages dashboard.
See `docs/CLAUDE.md § Conventions` and `docs/prd.md § Phase 3`.

