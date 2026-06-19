import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  ssr: {
    // MUI + emotion ship ESM with bundler-only directory imports
    // (e.g. `@mui/material/utils`) that Node's native ESM loader can't
    // resolve when the SSR bundle is executed by scripts/prerender.mjs.
    // Bundle them into the SSR output so resolution happens at build time.
    noExternal: [/@mui\//, '@emotion/react', '@emotion/styled'],
  },
});
