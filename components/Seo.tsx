import React from 'react';

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
