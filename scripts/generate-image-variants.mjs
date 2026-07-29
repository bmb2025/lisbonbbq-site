// Gera variantes responsivas (WebP, larguras 400/800/1200) para as ~12
// imagens que a auditoria de performance identificou como as mais
// sobredimensionadas (fotos de capa dos espaços + algumas imagens da
// homepage), servidas a partir de public/images/ em vez do Supabase
// Storage — resolve ao mesmo tempo a falta de srcset e a latência de
// 2-4.5s que o Supabase Storage tinha sem CDN à frente.
//
// Corre isto manualmente sempre que uma destas imagens de origem mudar:
//
//   node scripts/generate-image-variants.mjs
//
// Depois faz commit dos ficheiros gerados em public/images/.
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public/images");
const WIDTHS = [400, 800, 1200];
const IMG = "https://mlqdpjiolbyewcumvajn.supabase.co/storage/v1/object/public/lisbonbbq-media";

// source: URL remota ou caminho local (já em public/images/) da imagem
// original. base: prefixo dos ficheiros gerados (public/images/<base>-<w>.webp).
const SOURCES = [
  { source: `${IMG}/Fotos/Locais/Alcantara/Alcantara1.webp`, base: "alcantara1" },
  { source: `${IMG}/Fotos/Locais/Expo/Expo1_A.webp`, base: "expo1-a" },
  { source: `${IMG}/Fotos/Locais/Marvila/Marvila2.webp`, base: "marvila2" },
  { source: `${IMG}/Fotos/Locais/Tapadinha/Tapa1.webp`, base: "tapa1" },
  { source: `${IMG}/Fotos/Locais/Carnide/Carnide4.jpeg`, base: "carnide4" },
  { source: `${IMG}/Fotos/Locais/Benfica/Benfica3.webp`, base: "benfica3" },
  { source: `${IMG}/Fotos/Locais/Alvito/Alvito1.png`, base: "alvito1" },
  { source: `${IMG}/Fotos/Locais/Restelo/restelo3.webp`, base: "restelo3" },
  { source: `${IMG}/Fotos/Churrasco%20People.png`, base: "churrasco-people" },
  { source: `${IMG}/Fotos/grill.webp`, base: "grill" },
  { source: `${IMG}/Fotos/Carrinho%20de%20mao%20gelo.webp`, base: "carrinho-de-mao-gelo" },
  // Não há original em maior resolução para esta — a fonte é o próprio
  // maior ficheiro já gerado (o antigo public/images/mesa-churrasco.webp,
  // sem variantes, foi removido por estar duplicado).
  { source: join(outDir, "mesa-churrasco-1200.webp"), base: "mesa-churrasco" },
  // Hero.webp é o único caso onde o original (824x448) é MENOR do que o
  // que a homepage mostra (full-bleed, até 750px de altura) — daí o
  // upscaling visível reportado na auditoria. Não existe um original maior
  // disponível; em vez de deixar o browser esticar a imagem por CSS
  // (bilinear, mais desfocado), gera-se aqui uma vez com Lanczos3 (melhor
  // filtro de reamostragem do sharp) + leve sharpen, e o resultado fica
  // fixo nestas larguras — não corre em cada build.
  {
    source: `${IMG}/Fotos/Hero.webp`,
    base: "hero",
    widths: [640, 1024, 1600, 1920, 2560],
    allowEnlargement: true,
    sharpen: true,
  },
];

async function loadSource(source) {
  if (source.startsWith("http")) {
    const res = await fetch(source);
    if (!res.ok) throw new Error(`${source} → ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  }
  // Lido para memória (não passado como caminho) — evita o erro do sharp
  // quando a mesma variante já gerada serve de fonte para si própria.
  return readFileSync(source);
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  for (const { source, base, widths = WIDTHS, allowEnlargement = false, sharpen = false } of SOURCES) {
    const input = await loadSource(source);
    for (const width of widths) {
      const outPath = join(outDir, `${base}-${width}.webp`);
      let pipeline = sharp(input).resize({
        width,
        withoutEnlargement: !allowEnlargement,
        kernel: sharp.kernel.lanczos3,
      });
      if (sharpen) pipeline = pipeline.sharpen();
      await pipeline.webp({ quality: 78 }).toFile(outPath);
    }
    console.log(`generate-image-variants: ${base} → ${widths.map((w) => `${base}-${w}.webp`).join(", ")}`);
  }
}

main().catch((err) => {
  console.error("generate-image-variants falhou:", err);
  process.exit(1);
});
