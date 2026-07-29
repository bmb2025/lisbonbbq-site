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
import { writeFileSync, mkdirSync } from "node:fs";
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
];

async function loadSource(source) {
  if (source.startsWith("http")) {
    const res = await fetch(source);
    if (!res.ok) throw new Error(`${source} → ${res.status}`);
    return Buffer.from(await res.arrayBuffer());
  }
  return source; // caminho local — sharp lê o ficheiro diretamente
}

async function main() {
  mkdirSync(outDir, { recursive: true });
  for (const { source, base } of SOURCES) {
    const input = await loadSource(source);
    for (const width of WIDTHS) {
      const outPath = join(outDir, `${base}-${width}.webp`);
      await sharp(input)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(outPath);
    }
    console.log(`generate-image-variants: ${base} → ${WIDTHS.map((w) => `${base}-${w}.webp`).join(", ")}`);
  }
}

main().catch((err) => {
  console.error("generate-image-variants falhou:", err);
  process.exit(1);
});
