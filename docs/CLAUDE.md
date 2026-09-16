# CLAUDE.md — cricketfansite.com

Per-project orientation for Claude. Read this first when picking up
work on this site. Index of conventions, deferred decisions, and
non-features that aren't obvious from the code or git history.

## Project

<1-2 sentence description — fill in: what does this site do, who is
the user, what is the stack (cricketfansite.com runs on the sites/* workspace
shared infra: Vite or Astro + pnpm + Cloudflare Pages, with Makefile
forwarding to the central builder).>

## Commands

```bash
# Build / dev (forwards to the parent Makefile)
make deps           # install deps via the central builder
make dev            # local dev server
make build          # production build → dist/

# Test (per-stack — adjust as needed)
make test           # if a test suite is wired in

# Deploy
git push            # Cloudflare Pages auto-builds on push to main
```

## Conventions

  - Build path: this project's `Makefile` → `../Makefile` (parent
    workspace) → `~/work/projects/builder/` (central builder).
  - Stack: pnpm-only. No `package-lock.json` / `bun.lockb` / `yarn.lock`.
  - Deploy: Cloudflare Pages, built from `main`. Both Pages and Wrangler
    are in play: Pages is the platform, and a `wrangler.jsonc` at the repo
    root is how the portfolio declares the assets directory and not-found
    handling. Build output is `dist/`; the custom domain is set in the CF
    Pages dashboard.
  - `wrangler.jsonc` at the repo root declares the assets directory and
    not-found handling, matching the 32 sibling sites under `sites/`.
  - No `public/_redirects`: CF's Workers Static Assets validator rejects
    `/* /index.html 200` as an infinite-loop rule (see `docs/Prompts.md`).
  - Unmatched paths return a genuine HTTP 404 with `dist/404.html`
    (`not_found_handling: "404-page"`), not a 200 carrying the homepage.
    Because every route is prerendered to its own file there is no SPA
    fallback to preserve. `dist/404.html` is emitted at the end of
    `scripts/prerender.mjs` by rendering a path that matches no route; it
    carries `noindex` and is deliberately absent from `routes.mjs` so it
    never enters the sitemap. Don't add it there.

## Heading hygiene

**Before adding any section, subsection, or heading to a Markdown
file, output the file's current heading outline first:**

```bash
grep -nE '^#+ ' path/to/file.md
```

Then confirm — in the chat — that the planned new heading's:

1. **Depth** (`#`, `##`, `###`, …) is the intended depth, not
   accidentally one level too shallow.
2. **Label** doesn't collide with existing headings — no duplicate
   `## 1. <title>`, no `### N.X` subsection labels that look like
   `vN.X` phase identifiers.

Only after that confirmation, write.

Applies especially to long-lived docs: `docs/prd.md`, `AI_AGENTS.md`,
`docs/architecture.md`, `docs/CLAUDE.md`.

**Why:** structural drift is invisible in any single editing session
— it only becomes obvious in the aggregate, by which time the doc is
hard to fix. The pre-edit outline ritual catches collisions and depth
mistakes at the point of writing, not at quarterly cleanup time.

## Deferred decisions

<Things deliberately *not* shipped. Append entries with rationale so
future Claude sessions don't re-propose them.>
