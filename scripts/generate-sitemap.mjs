import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { routes } from './routes.mjs';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'dist');
const SITE = (process.env.SITE_URL || 'https://cricketfansite.com').replace(/\/$/, '');

const today = new Date().toISOString().split('T')[0];
const all = routes;

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
