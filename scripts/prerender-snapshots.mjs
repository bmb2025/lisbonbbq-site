// Gera seo/body/<nome>.html: um snapshot do HTML final que o browser produz
// depois do React montar cada rota. scripts/prerender.mjs lê estes ficheiros
// e injeta-os no <div id="root"> do dist/<rota>/index.html em CADA build —
// sem precisar de correr um browser no build da Vercel (só string splicing).
//
// Corre isto manualmente sempre que o conteúdo destas rotas mudar
// (Header, Footer, HomePage, BlogList, QuemSomosView, FAQView,
// SmallEventsView, LegalView, VerBolaView, CorporateView):
//
//   npm run build && npm run prerender:snapshots
//
// Depois faz commit só dos ficheiros seo/body/*.html — o dist/ nunca vai
// para o git, é gerado outra vez em cada deploy a partir destes ficheiros.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const bodyDir = join(root, "seo/body");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};

function serveStatic() {
  return createServer((req, res) => {
    const urlPath = (req.url || "/").split("?")[0];
    let filePath = urlPath === "/" ? "/index.html" : urlPath;
    // Rota sem extensão (ex.: /corporate) → o seu index.html pré-renderizado.
    if (!extname(filePath)) filePath = join(filePath, "index.html");
    try {
      const data = readFileSync(join(dist, filePath));
      res.writeHead(200, { "Content-Type": MIME[extname(filePath)] || "application/octet-stream" });
      res.end(data);
    } catch {
      // Fallback SPA — qualquer coisa não encontrada cai no shell principal.
      const data = readFileSync(join(dist, "index.html"));
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(data);
    }
  });
}

// waitForSelector: um elemento que só existe depois do conteúdo da rota
// estar todo montado — evita capturar um estado a meio do loading.
// networkidle já cobre o fetch de artigos do /blog (services/gitCms), por
// isso "footer" chega como confirmação extra e barata nas rotas simples.
const ROUTES = [
  { path: "/", file: "home.html", waitForSelector: "footer" },
  // .group.cursor-pointer é a raiz de cada BlogCard — "footer" sozinho
  // montaria antes do fetchArticles() (GitHub CMS) resolver e capturaria o
  // estado vazio "Em breve, novos segredos do mestre...".
  { path: "/blog", file: "blog.html", waitForSelector: ".group.cursor-pointer" },
  { path: "/quem-somos", file: "quem-somos.html", waitForSelector: "footer" },
  { path: "/faqs", file: "faqs.html", waitForSelector: "footer" },
  { path: "/espaco-para-eventos-pequenos", file: "espaco-para-eventos-pequenos.html", waitForSelector: "footer" },
  { path: "/privacy", file: "privacy.html", waitForSelector: "footer" },
  { path: "/terms", file: "terms.html", waitForSelector: "footer" },
  { path: "/verbola", file: "verbola.html", waitForSelector: "footer" },
  // /corporate é gerado aqui também para deixar de haver dois scripts a fazer
  // a mesma coisa — substitui o antigo scripts/prerender-corporate.mjs.
  { path: "/corporate", file: "corporate.html", waitForSelector: "#proposta" },
];

async function snapshot(browser, port, route) {
  const page = await browser.newPage();
  try {
    // "load" em vez de "networkidle": analytics (PostHog/GTM) mantêm ligações
    // vivas que nunca deixam a rede ficar inactiva, o que faz "networkidle"
    // atingir timeout mesmo com a rota já pronta. waitForSelector a seguir é
    // que garante que o conteúdo específico da rota já montou.
    await page.goto(`http://localhost:${port}${route.path}`, { waitUntil: "load", timeout: 60000 });
    await page.waitForSelector(route.waitForSelector, { timeout: 30000 });
    await page.waitForTimeout(500);

    const bodyHtml = await page.$eval("#root", (el) => el.innerHTML);
    mkdirSync(bodyDir, { recursive: true });
    writeFileSync(
      join(bodyDir, route.file),
      `<!-- GERADO por scripts/prerender-snapshots.mjs — não editar à mão. -->\n${bodyHtml}\n`
    );
    console.log(`prerender-snapshots: ${route.path} → capturado ${bodyHtml.length} bytes → seo/body/${route.file}`);
  } finally {
    await page.close();
  }
}

async function main() {
  const server = serveStatic();
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  const browser = await chromium.launch();
  try {
    for (const route of ROUTES) {
      await snapshot(browser, port, route);
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error("prerender-snapshots falhou:", err);
  process.exit(1);
});
