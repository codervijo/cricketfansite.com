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
>
> **Output:** write all files to disk. Don't print contents in chat unless asked. Confirm `make run proj=<project>` and the Cloudflare deploy both succeed before declaring done.
