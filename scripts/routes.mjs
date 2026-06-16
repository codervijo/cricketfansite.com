import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

// Single source of truth for the route list — consumed by BOTH
// generate-sitemap.mjs and prerender.mjs so the sitemap and the set of
// prerendered HTML files can never drift apart.
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const teams = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'src', 'data', 'teams.json'), 'utf8'),
);

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/ipl', priority: '0.9', changefreq: 'weekly' },
  { path: '/ipl/table', priority: '0.9', changefreq: 'daily' },
  { path: '/ipl/calculators', priority: '0.8', changefreq: 'monthly' },
  { path: '/ipl/nrr', priority: '0.8', changefreq: 'monthly' },
];

const teamRoutes = teams.map((t) => ({
  path: `/ipl/qualify/${t.id}`,
  priority: '0.7',
  changefreq: 'daily',
}));

export const routes = [...staticRoutes, ...teamRoutes];
