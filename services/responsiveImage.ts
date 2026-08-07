// Mapeia URLs de imagens conhecidas (Supabase Storage ou public/images/) para
// as variantes responsivas WebP geradas por scripts/generate-image-variants.mjs
// e servidas do próprio domínio (public/images/). Imagens fora deste mapa
// continuam a ser servidas tal e qual — ver esse script para gerar mais.
const IMG = "https://mlqdpjiolbyewcumvajn.supabase.co/storage/v1/object/public/lisbonbbq-media";
const DEFAULT_WIDTHS = [400, 800, 1200];

const LOCAL_VARIANTS: Record<string, { base: string; widths?: number[] }> = {
  [`${IMG}/Fotos/Locais/Alcantara/AlcantaraN6.webp`]: { base: "alcantara1" },
  [`${IMG}/Fotos/Locais/Expo/Expo1_A.webp`]: { base: "expo1-a" },
  [`${IMG}/Fotos/Locais/Marvila/Marvila2.webp`]: { base: "marvila2" },
  [`${IMG}/Fotos/Locais/Tapadinha/Tapa1.webp`]: { base: "tapa1" },
  [`${IMG}/Fotos/Locais/Carnide/Carnide4.jpeg`]: { base: "carnide4" },
  [`${IMG}/Fotos/Locais/Benfica/Benfica3.webp`]: { base: "benfica3" },
  [`${IMG}/Fotos/Locais/Alvito/Alvito1.png`]: { base: "alvito1" },
  [`${IMG}/Fotos/Locais/Restelo/restelo3.webp`]: { base: "restelo3" },
  [`${IMG}/Fotos/Churrasco%20People.png`]: { base: "churrasco-people" },
  [`${IMG}/Fotos/grill.webp`]: { base: "grill" },
  [`${IMG}/Fotos/Carrinho%20de%20mao%20gelo.webp`]: { base: "carrinho-de-mao-gelo" },
  "/images/mesa-churrasco.webp": { base: "mesa-churrasco" },
  // Hero.webp (824x448) é menor do que o full-bleed que a homepage mostra —
  // larguras próprias, maiores, geradas com upscaling controlado (Lanczos3 +
  // sharpen). Ver scripts/generate-image-variants.mjs.
  [`${IMG}/Fotos/Hero.webp`]: { base: "hero", widths: [640, 1024, 1600, 1920, 2560] },
};

export type ResponsiveImage = { src: string; srcSet?: string };

export function responsiveImage(src: string): ResponsiveImage {
  const variant = LOCAL_VARIANTS[src];
  if (!variant) return { src };
  const widths = variant.widths ?? DEFAULT_WIDTHS;
  const largest = widths[widths.length - 1];
  return {
    src: `/images/${variant.base}-${largest}.webp`,
    srcSet: widths.map((w) => `/images/${variant.base}-${w}.webp ${w}w`).join(", "),
  };
}
