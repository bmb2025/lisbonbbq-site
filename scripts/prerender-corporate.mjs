// Gera seo/corporate-body.html: um snapshot do HTML final que o browser produz
// depois do React montar /corporate. O scripts/prerender.mjs lê este ficheiro e
// injeta-o no <div id="root"> do dist/corporate/index.html em CADA build — sem
// precisar de correr um browser no build da Vercel (só string splicing).
//
// Corre isto manualmente sempre que o conteúdo de /corporate mudar
// (components/CorporateView.tsx, Header, Footer):
//
//   npm run build && npm run prerender:corporate
//
// Depois faz commit do dist/corporate/index.html atualizado... na verdade não:
// faz commit só do seo/corporate-body.html — o dist/ nunca vai para o git, é
// gerado outra vez em cada deploy a partir deste ficheiro.
import { readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

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

async function main() {
  const server = serveStatic();
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${port}/corporate`, { waitUntil: "networkidle" });
    // #proposta é a última secção do CorporateView (contém o formulário) — só
    // existe depois de Header + conteúdo + Footer estarem todos montados.
    await page.waitForSelector("#proposta", { timeout: 15000 });
    await page.waitForTimeout(300);

    const bodyHtml = await page.$eval("#root", (el) => el.innerHTML);
    writeFileSync(
      join(root, "seo/corporate-body.html"),
      `<!-- GERADO por scripts/prerender-corporate.mjs — não editar à mão. -->\n${bodyHtml}\n`
    );
    console.log(`prerender-corporate: capturado ${bodyHtml.length} bytes → seo/corporate-body.html`);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error("prerender-corporate falhou:", err);
  process.exit(1);
});
