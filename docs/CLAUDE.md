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
  - **This repo is missing its `wrangler.jsonc`** — 32 sibling sites under
    `sites/` ship one, this one never has. The portfolio shape is:

    ```jsonc
    {
      "$schema": "node_modules/wrangler/config-schema.json",
      "name": "<site-slug>",
      "compatibility_date": "<YYYY-MM-DD>",
      "assets": { "directory": "./dist", "not_found_handling": "..." }
    }
    ```

  - No `public/_redirects`: CF's Workers Static Assets validator rejects
    `/* /index.html 200` as an infinite-loop rule (see `docs/Prompts.md`).
  - Soft 404: with no config, unmatched paths are served the root
    `index.html`. Verified against production — an unknown URL returns
    HTTP 200 with the prerendered home page, and `NotFoundPage` appears
    only once the client router takes over. Note that the sibling
    convention (`not_found_handling: "single-page-application"`) has the
    same characteristic, so adopting it formalises current behaviour
    rather than fixing it. See `docs/prd.md § Phase 3` for the open
    decision.

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
