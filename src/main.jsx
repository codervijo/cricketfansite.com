import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme.js';
import { HeadContext } from './head-context.js';
import App from './App.jsx';

const app = (
  <React.StrictMode>
    <HeadContext.Provider value={{}}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </HeadContext.Provider>
  </React.StrictMode>
);

// Prerendered routes ship server-rendered markup in #root → hydrate it.
// In dev (and the SPA fallback for non-prerendered routes) #root is empty →
// plain client render.
const rootEl = document.getElementById('root');
if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, app);
} else {
  createRoot(rootEl).render(app);
}
