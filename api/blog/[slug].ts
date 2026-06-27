const REPO_OWNER = "lisbonbbq";
const REPO_NAME = "lisbonbbq-content";
const CONTENT_PATH = "content/articles";

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderBodyAsHtml(content = "") {
  return content
    .split("\n")
    .map((line) => {
      const t = line.trim();
      if (!t) return `<div style="height:16px"></div>`;
      if (t.startsWith("### ")) return `<h3 class="h3">${escapeHtml(t.slice(4))}</h3>`;
      if (t.startsWith("## ")) return `<h2 class="h2">${escapeHtml(t.slice(3))}</h2>`;
      if (t.startsWith("# ")) return `<h1 class="h1">${escapeHtml(t.slice(2))}</h1>`;
      return `<p class="p">${escapeHtml(t)}</p>`;
    })
    .join("");
}

function htmlShell({
  title,
  description,
  canonical,
  coverImage,
  bodyHtml,
}: {
  title: string;
  description: string;
  canonical: string;
  coverImage: string | null;
  bodyHtml: string;
}) {
  const ogImage = coverImage ? escapeHtml(coverImage) : "https://lisbonbbq.pt/og-image.jpg";
  return `<!doctype html>
<html lang="pt">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${escapeHtml(canonical)}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${escapeHtml(canonical)}" />
  <meta property="og:image" content="${ogImage}" />
  <style>
    :root{--r:#D91A2A;--y:#F4B41A;--b:#1A1A1A;--c:#F9F7F2}
    body{margin:0;background:var(--c);color:var(--b);font-family:system-ui,sans-serif}
    .wrap{max-width:900px;margin:0 auto;padding:28px 18px 64px}
    .back a{color:var(--b);font-weight:800;text-decoration:none;text-transform:uppercase}
    .card{background:#fff;border:4px solid var(--b);padding:24px;margin-top:20px}
    .h1{margin:18px 0 14px;font-size:40px;font-weight:900;text-transform:uppercase;color:var(--r);line-height:1.1}
    .h2{margin:24px 0 10px;font-size:28px;font-weight:900;text-transform:uppercase}
    .h3{margin:16px 0 8px;font-size:20px;font-weight:900;border-left:8px solid var(--y);padding-left:10px}
    .p{margin:0 0 12px;font-size:15px;line-height:1.6;color:#444}
    img.hero{width:100%;border:4px solid var(--b);margin:12px 0}
    .cta{margin-top:24px}
    .cta a{display:inline-block;background:var(--b);color:#fff;padding:12px 24px;text-decoration:none;font-weight:900;text-transform:uppercase}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="back"><a href="/blog">← Blog LisbonBBQ</a></div>
    <div class="card">
      ${coverImage ? `<img src="${escapeHtml(coverImage)}" alt="${escapeHtml(title)}" class="hero" />` : ""}
      ${bodyHtml}
      <div class="cta"><a href="/">Reservar Churrasco</a></div>
    </div>
  </div>
</body>
</html>`;
}

export default async function handler(req: any, res: any) {
  const slug =
    req.query?.slug ||
    (req.url || "").split("/").filter(Boolean).pop();

  try {
    const apiUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${CONTENT_PATH}/${slug}.json`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Article not found");
    const article = await response.json();

    const html = htmlShell({
      title: article.title,
      description: article.excerpt,
      canonical: `https://lisbonbbq.pt/blog/${slug}`,
      coverImage: article.coverImage || null,
      bodyHtml: `<h1 class="h1">${escapeHtml(article.title)}</h1><div>${renderBodyAsHtml(article.content)}</div>`,
    });

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(html);
  } catch (_) {
    return res.redirect("/blog");
  }
}
