import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

// Single source of truth for the route list — consumed by BOTH
// generate-sitemap.mjs and prerender.mjs so the sitemap and the set of
// prerendered HTML files can never drift apart.
//
// Reads the same JSON the app bundle reads (src/config/season.json,
// src/data/<tournament>/teams.json) via fs, because this runs under plain
// Node where `import x from './x.json'` needs import attributes.
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const readJson = (...p) => JSON.parse(fs.readFileSync(path.join(ROOT, ...p), 'utf8'));

export const season = readJson('src', 'config', 'season.json');

const tournamentId = season.tournamentId;
const basePath = `/${tournamentId}`;
const teams = readJson('src', 'data', tournamentId, 'teams.json');

// Season results file — `lastUpdated` feeds the sitemap's <lastmod> for the
// standings-derived routes so a finished season stops claiming a fresh date
// on every deploy.
export const seasonData = readJson(
  'src',
  'data',
  tournamentId,
  `season-${season.year}.json`,
);

// A finished season's pages stop changing — tell crawlers so instead of
// claiming daily updates that never come.
const live = season.status === 'live';
const tableFreq = live ? 'daily' : 'monthly';
const teamFreq = live ? 'daily' : 'monthly';

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: basePath, priority: '0.9', changefreq: 'weekly' },
  { path: `${basePath}/table`, priority: '0.9', changefreq: tableFreq, standings: true },
  { path: `${basePath}/calculators`, priority: '0.8', changefreq: 'monthly' },
  // Main calculator page — evergreen and the strongest non-seasonal target.
  { path: `${basePath}/nrr`, priority: '0.9', changefreq: 'monthly' },
];

const teamRoutes = teams.map((t) => ({
  path: `${basePath}/qualify/${t.id}`,
  priority: '0.7',
  changefreq: teamFreq,
  standings: true,
}));

export const routes = [...staticRoutes, ...teamRoutes];
