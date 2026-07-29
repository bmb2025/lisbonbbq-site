// Pós-build: gera dist/<rota>/index.html com <head> próprio por página
// (title, description, canonical, OG e JSON-LD), a partir do dist/index.html
// produzido pelo Vite. A Vercel serve estes ficheiros estáticos antes do
// rewrite catch-all para /index.html, por isso o Google recebe os metadados
// no HTML inicial sem depender de JavaScript. As tags injetadas levam
// data-ssg e são removidas no arranque da SPA (App.tsx), quando o componente
// Seo assume via React 19.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const bodyDir = join(root, "seo/body");
const SITE = "https://lisbonbbq.pt";

const { routes } = JSON.parse(readFileSync(join(root, "seo/seo-data.json"), "utf8"));
const faqs = JSON.parse(readFileSync(join(root, "seo/faqs.json"), "utf8"));
const template = readFileSync(join(dist, "index.html"), "utf8");

// Algumas rotas têm o conteúdo do <body> pré-renderizado (não só o <head>) —
// importa para o AdsBot/Google verem a página cheia sem depender de JS. Os
// snapshots são gerados à parte (npm run build && npm run prerender:snapshots,
// que usa um browser real) porque correr um browser no build da Vercel seria
// frágil; aqui é só string splicing, sem dependências novas no build de
// produção. Ficheiros em seo/body/<nome>.html, um por rota — ver
// scripts/prerender-snapshots.mjs para o mapeamento rota → ficheiro.
const BODY_SNAPSHOT_FILE = {
  "/": "home.html",
  "/blog": "blog.html",
  "/quem-somos": "quem-somos.html",
  "/faqs": "faqs.html",
  "/espaco-para-eventos-pequenos": "espaco-para-eventos-pequenos.html",
  "/privacy": "privacy.html",
  "/terms": "terms.html",
  "/verbola": "verbola.html",
  "/corporate": "corporate.html",
  "/__prerender-404-check__": "not-found.html",
};

function readBodySnapshot(routePath) {
  const file = BODY_SNAPSHOT_FILE[routePath];
  if (!file) return null;
  const filePath = join(bodyDir, file);
  if (!existsSync(filePath)) {
    console.warn(`prerender: seo/body/${file} não encontrado — ${routePath} fica só com <head> pré-renderizado. Corre \`npm run build && npm run prerender:snapshots\` para gerar.`);
    return null;
  }
  return readFileSync(filePath, "utf8");
}

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const ld = (obj) =>
  `<script type="application/ld+json" data-ssg>${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE}/#website`,
  name: "LisbonBBQ",
  alternateName: "Lisbon Barbecue & Churrasco",
  url: `${SITE}/`,
  inLanguage: "pt-PT",
  publisher: { "@id": `${SITE}/#business` },
};

const breadcrumbs = (route) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Início", item: `${SITE}/` },
    { "@type": "ListItem", position: 2, name: route.breadcrumb, item: `${SITE}${route.path}` },
  ],
});

const faqPage = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q.pt.replace(/^\d+\.\s*/, ""),
    acceptedAnswer: { "@type": "Answer", text: f.a.pt },
  })),
};

const corporateService = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Eventos corporativos com churrasco — chave na mão",
  serviceType: "Organização de eventos de empresa, team building e festas de equipa com churrasco",
  provider: { "@id": `${SITE}/#business` },
  areaServed: { "@type": "City", name: "Lisboa" },
  url: `${SITE}/corporate`,
  offers: {
    "@type": "Offer",
    url: `${SITE}/corporate`,
    priceCurrency: "EUR",
    price: "35",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: 35,
      priceCurrency: "EUR",
      unitText: "por pessoa",
    },
    description:
      "Pacote corporate chave na mão desde 35€/pessoa: espaço privado em Lisboa, grelhador, carvão, comida, bebida e logística incluídos.",
  },
};

for (const route of routes) {
  const canonical = route.path === "/" ? `${SITE}/` : `${SITE}${route.path}`;
  const blocks = [
    `<title data-ssg>${esc(route.title)}</title>`,
    `<meta data-ssg name="description" content="${esc(route.description)}" />`,
    `<link data-ssg rel="canonical" href="${esc(canonical)}" />`,
    `<meta data-ssg property="og:title" content="${esc(route.title)}" />`,
    `<meta data-ssg property="og:description" content="${esc(route.description)}" />`,
    `<meta data-ssg property="og:url" content="${esc(canonical)}" />`,
  ];
  if (route.path === "/") blocks.push(ld(website));
  else blocks.push(ld(breadcrumbs(route)));
  if (route.path === "/faqs") blocks.push(ld(faqPage));
  if (route.path === "/corporate") blocks.push(ld(corporateService));
  // Preload do elemento LCP da homepage — só aqui, para não desperdiçar
  // largura de banda nas outras rotas.
  if (route.path === "/") {
    blocks.push(
      `<link data-ssg rel="preload" as="image" href="/images/hero-1920.webp" imagesrcset="/images/hero-640.webp 640w, /images/hero-1024.webp 1024w, /images/hero-1600.webp 1600w, /images/hero-1920.webp 1920w, /images/hero-2560.webp 2560w" imagesizes="100vw" />`
    );
  }

  let html = template.replace("</head>", `    ${blocks.join("\n    ")}\n</head>`);
  const bodySnapshot = readBodySnapshot(route.path);
  if (bodySnapshot) {
    html = html.replace('<div id="root"></div>', `<div id="root">${bodySnapshot}</div>`);
  }
  const outDir = route.path === "/" ? dist : join(dist, route.path.slice(1));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html);
  console.log(`prerender: ${route.path} → ${outDir.replace(root + "/", "")}/index.html`);
}

// dist/404.html (não dist/404/index.html): a Vercel serve este ficheiro com
// status 404 real para qualquer pedido que não corresponda a nenhum rewrite
// nem ficheiro estático (ver vercel.json — já não há um catch-all a devolver
// sempre /index.html). O corpo vem do mesmo mecanismo de snapshot das outras
// rotas (Route path="*" → NotFoundView), só que marcado noindex.
{
  const notFoundBlocks = [
    `<title data-ssg>Página não encontrada | LisbonBBQ</title>`,
    `<meta data-ssg name="robots" content="noindex" />`,
  ];
  let html = template.replace("</head>", `    ${notFoundBlocks.join("\n    ")}\n</head>`);
  const bodySnapshot = readBodySnapshot("/__prerender-404-check__");
  if (bodySnapshot) {
    html = html.replace('<div id="root"></div>', `<div id="root">${bodySnapshot}</div>`);
  }
  writeFileSync(join(dist, "404.html"), html);
  console.log(`prerender: 404 → dist/404.html`);
}
