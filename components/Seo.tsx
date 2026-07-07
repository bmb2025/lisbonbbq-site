import React from 'react';
import seoData from '../seo/seo-data.json';

const SITE = 'https://lisbonbbq.pt';

interface SeoProps {
  title: string;
  description: string;
  /** Path starting with "/", e.g. "/corporate". */
  path: string;
}

/**
 * Per-page meta that varies by route: title, description, canonical and the
 * URL/title/description Open Graph tags. React 19 hoists <title>/<meta>/<link>
 * rendered anywhere in the tree into <head>, so no helmet library is needed.
 * og:type and og:image stay static in index.html (single brand baseline).
 */
export const Seo: React.FC<SeoProps> = ({ title, description, path }) => {
  const canonical = path === '/' ? `${SITE}/` : `${SITE}${path}`;
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
    </>
  );
};

/**
 * Seo alimentado por seo/seo-data.json — a mesma fonte usada pelo
 * scripts/prerender.mjs para gerar o <head> estático de cada rota.
 */
export const SeoFor: React.FC<{ path: string }> = ({ path }) => {
  const route = seoData.routes.find((r) => r.path === path);
  if (!route) return null;
  return <Seo path={route.path} title={route.title} description={route.description} />;
};
