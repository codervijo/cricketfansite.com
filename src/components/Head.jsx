import { useEffect, useContext } from 'react';
import { HeadContext } from '../head-context.js';

export default function Head({ title, description, jsonLd }) {
  // SSR capture: record into the prerender sink during render. useEffect does
  // not run under renderToString, so this is the only way the static HTML gets
  // a per-route <title>/<meta>/JSON-LD. On the client the sink is a throwaway
  // object; the document.title path below still drives the live tab title.
  const sink = useContext(HeadContext);
  if (sink) {
    if (title) sink.title = title;
    if (description) sink.description = description;
    if (jsonLd) sink.jsonLd = jsonLd;
  }

  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }
  }, [title, description]);

  useEffect(() => {
    // Reuse the prerendered node so client navigation swaps the payload
    // instead of stacking duplicate ld+json blocks.
    let script = document.getElementById('route-jsonld');
    if (!jsonLd) {
      if (script) script.remove();
      return;
    }
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'route-jsonld';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);
  }, [jsonLd]);

  return null;
}
