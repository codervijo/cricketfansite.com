import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme.js';
import { HeadContext } from './head-context.js';
import App from './App.jsx';

// Build-time SSR entry. `scripts/prerender.mjs` imports this (from the
// `dist-ssr/` SSR bundle) and calls render(url) once per route, then injects
// the returned html + head into the static index.html template.
export function render(url) {
  const head = {};
  const html = renderToString(
    <HeadContext.Provider value={head}>
      <StaticRouter location={url}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </StaticRouter>
    </HeadContext.Provider>,
  );
  return { html, head };
}
