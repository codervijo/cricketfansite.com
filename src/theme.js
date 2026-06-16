import { createTheme } from '@mui/material';

// Shared MUI theme — imported by both the client entry (main.jsx) and the
// SSR/prerender entry (entry-server.jsx) so the two render with an identical
// theme (no hydration drift).
export const theme = createTheme({
  palette: {
    primary: { main: '#0b3d91' },
    secondary: { main: '#ff6f00' },
    background: { default: '#fafafa' },
  },
  typography: {
    fontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: '1.4rem', fontWeight: 600, lineHeight: 1.3 },
  },
  shape: { borderRadius: 8 },
});
