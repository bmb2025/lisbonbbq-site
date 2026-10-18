const REPO_OWNER = "bmb2025";
const REPO_NAME = "lisbonbbq-content";
const CONTENT_PATH = "content/articles";
const API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${CONTENT_PATH}`;

export type CmsArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  publishedAt: string;
  isPublished: boolean;
};

export async function fetchArticles(): Promise<CmsArticle[]> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to list directory contents (${response.status})`);
    }

    const files = await response.json();
    
    // Filtramos apenas ficheiros .md (ignorando pastas ou outros ficheiros como index.json)
    const mdFiles = files.filter((f: any) => f.name.endsWith('.md') && f.type === 'file');

    const articles = await Promise.all(
      mdFiles.map(async (f: any) => {
        try {
          const res = await fetch(f.download_url);
          if (!res.ok) return null;
          const text = await res.text();
          return parseMarkdown(text);
        } catch (e) {
          console.error(`Error fetching article ${f.name}:`, e);
          return null;
        }
      })
    );

    // Removemos nulos (casos de erro), filtramos apenas publicados e ordenamos por data
    return (articles.filter(Boolean) as CmsArticle[])
      .filter((a) => a.isPublished)
      .sort((a, b) => (new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()));
  } catch (error) {
    console.error("CMS fetchArticles failed:", error);
    return [];
  }
}

export async function fetchArticleBySlug(
  slug: string
): Promise<CmsArticle | null> {
  const articles = await fetchArticles();
  return articles.find((a) => a.slug === slug) ?? null;
}

function parseMarkdown(md: string): CmsArticle {
  const parts = md.split("---");
  if (parts.length < 3) {
    throw new Error("Invalid markdown front-matter format. Ensure it is wrapped in ---");
  }

  const front = parts[1].trim();
  const body = parts.slice(2).join("---").trim();

  // Front-matter parser tolerant to the three shapes the CMS writes for long
  // values: YAML block scalars (`excerpt: >`, `>-`, `>+`, `|`), double-quoted
  // values spanning several lines, and plain values continued on indented lines.
  const meta: Record<string, string> = {};
  const lines = front.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s/.test(line)) continue; // continuation line, consumed below
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    if (!key) continue;
    let value = line.slice(idx + 1).trim();
    if (/^[>|][+-]?$/.test(value)) {
      const buf: string[] = [];
      while (i + 1 < lines.length && (/^\s/.test(lines[i + 1]) || lines[i + 1].trim() === "")) {
        buf.push(lines[++i].trim());
      }
      value = buf.filter(Boolean).join(" ");
    } else if (value.startsWith('"') && !(value.length > 1 && value.endsWith('"'))) {
      const buf = [value.slice(1)];
      while (++i < lines.length) {
        const end = lines[i].indexOf('"');
        if (end !== -1) { buf.push(lines[i].slice(0, end).trim()); break; }
        buf.push(lines[i].trim());
      }
      value = buf.join(" ");
    } else {
      while (value !== "" && i + 1 < lines.length && /^\s+\S/.test(lines[i + 1])) {
        value += " " + lines[++i].trim();
      }
      value = value.replace(/^["']|["']$/g, "");
    }
    meta[key] = value.replace(/\s+/g, " ").trim();
  }

  return {
    id: meta.id ?? Math.random().toString(36).substr(2, 9),
    slug: meta.slug ?? "",
    title: meta.title ?? "Sem Título",
    excerpt: meta.excerpt ?? "",
    content: body,
    coverImage: meta.coverImage ?? "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200",
    category: meta.category ?? "Artigo",
    author: meta.author ?? "LisbonBBQ",
    publishedAt: meta.publishedAt ?? new Date().toISOString(),
    isPublished: meta.isPublished === "true",
  };
}
