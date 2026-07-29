// Mapeia URLs de imagens conhecidas (Supabase Storage ou public/images/) para
// as variantes responsivas WebP geradas por scripts/generate-image-variants.mjs
// e servidas do próprio domínio (public/images/). Imagens fora deste mapa
// continuam a ser servidas tal e qual — ver esse script para gerar mais.
const IMG = "https://mlqdpjiolbyewcumvajn.supabase.co/storage/v1/object/public/lisbonbbq-media";
const WIDTHS = [400, 800, 1200];

const LOCAL_VARIANTS: Record<string, string> = {
  [`${IMG}/Fotos/Locais/Alcantara/Alcantara1.webp`]: "alcantara1",
  [`${IMG}/Fotos/Locais/Expo/Expo1_A.webp`]: "expo1-a",
  [`${IMG}/Fotos/Locais/Marvila/Marvila2.webp`]: "marvila2",
  [`${IMG}/Fotos/Locais/Tapadinha/Tapa1.webp`]: "tapa1",
  [`${IMG}/Fotos/Locais/Carnide/Carnide4.jpeg`]: "carnide4",
  [`${IMG}/Fotos/Locais/Benfica/Benfica3.webp`]: "benfica3",
  [`${IMG}/Fotos/Locais/Alvito/Alvito1.png`]: "alvito1",
  [`${IMG}/Fotos/Locais/Restelo/restelo3.webp`]: "restelo3",
  [`${IMG}/Fotos/Churrasco%20People.png`]: "churrasco-people",
  [`${IMG}/Fotos/grill.webp`]: "grill",
  [`${IMG}/Fotos/Carrinho%20de%20mao%20gelo.webp`]: "carrinho-de-mao-gelo",
  "/images/mesa-churrasco.webp": "mesa-churrasco",
};

export type ResponsiveImage = { src: string; srcSet?: string };

export function responsiveImage(src: string): ResponsiveImage {
  const base = LOCAL_VARIANTS[src];
  if (!base) return { src };
  const largest = WIDTHS[WIDTHS.length - 1];
  return {
    src: `/images/${base}-${largest}.webp`,
    srcSet: WIDTHS.map((w) => `/images/${base}-${w}.webp ${w}w`).join(", "),
  };
}
