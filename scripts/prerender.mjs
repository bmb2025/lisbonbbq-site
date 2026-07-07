// Pós-build: gera dist/<rota>/index.html com <head> próprio por página
// (title, description, canonical, OG e JSON-LD), a partir do dist/index.html
// produzido pelo Vite. A Vercel serve estes ficheiros estáticos antes do
// rewrite catch-all para /index.html, por isso o Google recebe os metadados
// no HTML inicial sem depender de JavaScript. As tags injetadas levam
// data-ssg e são removidas no arranque da SPA (App.tsx), quando o componente
// Seo assume via React 19.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const SITE = "https://lisbonbbq.pt";

const { routes } = JSON.parse(readFileSync(join(root, "seo/seo-data.json"), "utf8"));
const faqs = JSON.parse(readFileSync(join(root, "seo/faqs.json"), "utf8"));
const template = readFileSync(join(dist, "index.html"), "utf8");

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

  const html = template.replace("</head>", `    ${blocks.join("\n    ")}\n</head>`);
  const outDir = route.path === "/" ? dist : join(dist, route.path.slice(1));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html);
  console.log(`prerender: ${route.path} → ${outDir.replace(root + "/", "")}/index.html`);
}
