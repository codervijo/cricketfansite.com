import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'dist');
const SITE = (process.env.SITE_URL || 'https://cricketfansite.com').replace(/\/$/, '');

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

const today = new Date().toISOString().split('T')[0];
const all = [...staticRoutes, ...teamRoutes];

const body = all
  .map(
    (r) => `  <url>
    <loc>${SITE}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

if (!fs.existsSync(OUT_DIR)) {
  console.error(`[sitemap] ${OUT_DIR} does not exist; run 'vite build' first.`);
  process.exit(1);
}

fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), xml);
console.log(`[sitemap] wrote ${all.length} urls to dist/sitemap.xml (site=${SITE})`);
