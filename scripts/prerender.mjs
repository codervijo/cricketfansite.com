import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { routes } from './routes.mjs';

// Build-time prerender: render each route with the SSR bundle and write a real
// static HTML file (content + per-route <title>/<meta>) so crawlers see a full
// page instead of an empty CSR shell. Runs AFTER `vite build` (client) and
// `vite build --ssr` (server bundle). Order in package.json:
//   vite build && vite build --ssr ... && node scripts/prerender.mjs && node scripts/generate-sitemap.mjs
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SSR_ENTRY = path.join(ROOT, 'dist-ssr', 'entry-server.js');

const templatePath = path.join(DIST, 'index.html');
if (!fs.existsSync(templatePath)) {
  console.error("[prerender] dist/index.html missing — run 'vite build' first.");
  process.exit(1);
}
if (!fs.existsSync(SSR_ENTRY)) {
  console.error(
    "[prerender] dist-ssr/entry-server.js missing — run " +
      "'vite build --ssr src/entry-server.jsx --outDir dist-ssr' first.",
  );
  process.exit(1);
}

const template = fs.readFileSync(templatePath, 'utf8');
const { render } = await import(url.pathToFileURL(SSR_ENTRY).href);

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

let count = 0;
for (const r of routes) {
  const { html, head } = render(r.path);

  let page = template.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  if (html.indexOf('id="root"') === -1 && page === template) {
    // Guard against a template whose root div was minified/renamed.
    console.error(`[prerender] could not find <div id="root"></div> in template — aborting.`);
    process.exit(1);
  }
  if (head.title) {
    page = page.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(head.title)}</title>`);
  }
  if (head.description) {
    page = page.replace(
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${esc(head.description)}" />`,
    );
  }

  const outDir = r.path === '/' ? DIST : path.join(DIST, r.path);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), page);
  count += 1;
  console.log(`  ✓ ${r.path}${head.title ? ` — ${head.title}` : ' (no title captured)'}`);
}

console.log(`[prerender] wrote ${count} static pages to dist/<route>/index.html`);
