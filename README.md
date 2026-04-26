# cricketfansite.com

Tools-first IPL companion: points table, playoff qualification calculator, net run rate calculator, and per-team qualification pages.

## Run

All `pnpm` commands run inside the shared Docker dev container, via the Makefile at `../Makefile`:

```
# from /home/vijo/work/projects/sites
make buildsh                          # enter the dev container
make run  proj=cricketfansite.com     # install + start Vite dev server
make test proj=cricketfansite.com     # install + build + tests (Docker-only)
```

See [`AI_AGENT.md`](./AI_AGENT.md) for the full workflow (stack, conventions, testing) and [`docs/prd.md`](./docs/prd.md) for scope.
