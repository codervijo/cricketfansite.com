import { createContext } from 'react';

// SSR head sink. During prerender, <Head> records its title/description into
// the object provided here so the prerenderer can inject them into the static
// HTML <head> (useEffect — the client path — never runs under renderToString).
// On the client the provider value is a throwaway object; <Head> still sets
// document.title via useEffect as before.
export const HeadContext = createContext(null);
