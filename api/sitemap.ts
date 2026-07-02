const REPO_OWNER = "lisbonbbq";
const REPO_NAME = "lisbonbbq-content";
const CONTENT_PATH = "content/articles";
const API_DIR = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CONTENT_PATH}`;
const SITE = "https://lisbonbbq.pt";

// Static, indexable routes of the SPA (besides the home + blog list).
const STATIC_ROUTES = ["/corporate", "/espaco-para-eventos-pequenos", "/quem-somos", "/faqs"];

function frontMatter(md: string): Record<string, string> {
  const parts = md.split("---");
  const front = parts.length >= 3 ? parts[1].trim() : "";
  const meta: Record<string, string> = {};
  front.split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    if (key) meta[key] = value;
  });
  return meta;
}

function urlEntry(loc: string, lastmod?: string) {
  return `  <url><loc>${loc}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`;
}

export default async function handler(_req: any, res: any) {
  const urls: string[] = [
    urlEntry(`${SITE}/`),
    urlEntry(`${SITE}/blog`),
    ...STATIC_ROUTES.map((r) => urlEntry(`${SITE}${r}`)),
  ];

  try {
    const listRes = await fetch(API_DIR, { headers: { "User-Agent": "lisbonbbq-site" } });
    if (listRes.ok) {
      const files = await listRes.json();
      const mdFiles = (Array.isArray(files) ? files : []).filter(
        (f: any) => f?.type === "file" && typeof f?.name === "string" && f.name.endsWith(".md")
      );
      const articles = await Promise.all(
        mdFiles.map(async (f: any) => {
          try {
            const r = await fetch(f.download_url);
            if (!r.ok) return null;
            return frontMatter(await r.text());
          } catch (_) {
            return null;
          }
        })
      );
      for (const meta of articles) {
        if (!meta || meta.isPublished !== "true" || !meta.slug) continue;
        const lastmod = meta.publishedAt
          ? new Date(meta.publishedAt).toISOString().split("T")[0]
          : undefined;
        urls.push(urlEntry(`${SITE}/blog/${meta.slug}`, lastmod));
      }
    }
  } catch (_) {
    // On failure still return the static URLs rather than an empty sitemap.
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  return res.send(xml);
}
