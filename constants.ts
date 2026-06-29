
import { AddOnItem, VenueLocation, BBQMenuItem, SideDish, BBQTradition } from './types';

const IMG = "https://mlqdpjiolbyewcumvajn.supabase.co/storage/v1/object/public/lisbonbbq-media";

export const DEFAULT_ASSETS: Record<string, string> = {
  hero: `${IMG}/Fotos/Hero.webp`,
  stressFree: `${IMG}/Fotos/Churrasco%20People.png`,
  noExtras: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=800&auto=format&fit=crop",
  venueFeature1: `${IMG}/Fotos/B1.webp`,
  venueFeature2: `${IMG}/Fotos/grill.webp`,
  venueFeature3: `${IMG}/Fotos/B3.webp`,
  ownLocation: `${IMG}/Fotos/backyard.webp`
};

export const BRAZILIAN_MENUS: BBQMenuItem[] = [
  { id: 'brazilian-1', name: 'Churrasco de quintal', desc: 'Picanha, Linguiça Toscana e coxa de frango desossada.', maxSides: 2 }
];

export const PORTUGUESE_MENUS: BBQMenuItem[] = [
  { id: 'portuguese-1', name: 'Grelhada Mista', desc: 'Lagartos, maminha e entremeada.', maxSides: 2 },
  { id: 'portuguese-2', name: 'Festa da Aldeia', desc: 'Porco no Espeto', maxSides: 2 }
];

export const ARGENTINIAN_MENUS: BBQMenuItem[] = [
  { id: 'argentinian-1', name: 'Juntada con asado', desc: 'Vacío, Tira de asado, criollo, sal argentino e chimichurri.', maxSides: 2 }
];

export const BRAZILIAN_SIDES: SideDish[] = [
  { name: 'Batata frita', isVegan: true },
  { name: 'Feijão Preto', isVegan: false },
  { name: 'Arroz Branco', isVegan: true },
  { name: 'Farofa brasileira', isVegan: false }
];

export const PORTUGUESE_SIDES: SideDish[] = [
  { name: 'Batata frita', isVegan: true },
  { name: 'Arroz branco', isVegan: true },
  { name: 'Salada de alface e cebola', isVegan: true }
];

export const ARGENTINIAN_SIDES: SideDish[] = [
  { name: 'Batata Frita', isVegan: true },
  { name: 'Salada de Alface e Cebola', isVegan: true },
  { name: 'Provoleta', isVegan: false }
];

export const ADD_ONS: AddOnItem[] = [
  {
    id: 'birthday_pack',
    name: 'Pack Aniversário',
    description: 'Inclui balões númericos cheios com hélio, velas e bolo de aniversário.',
    unit: 'unidade',
    category: 'service',
    image: `${IMG}/Fotos/Aniver_opt.webp`
  },
  {
    id: 'wheelbarrow_beer',
    name: 'Carrinho de mão com cerveja e gelo',
    description: 'A forma mais original e refrescante de manter as bebidas geladas durante todo o evento.',
    unit: 'unidade',
    category: 'service',
    image: `${IMG}/Fotos/Carrinho%20de%20mao%20gelo.webp`
  },
  {
    id: 'da_bomb',
    name: 'Packing a punch',
    description: 'Molho picante Da Bomb para os mais corajosos.',
    unit: 'unidade',
    category: 'starter',
    image: `${IMG}/Fotos/Da_bomb.webp`
  },
  {
    id: 'pitmaster',
    name: 'Pitmaster',
    description: 'Especialista em grelhados que assume o pit enquanto dá uma verdadeira aula.',
    unit: 'serviço',
    category: 'service',
    image: `${IMG}/Fotos/Pitmasters.webp`
  },
  {
    id: 'cheese_board',
    name: 'Tabua de Queijos e enchidos',
    description: 'As melhores gordices para os convidados mais exigentes.',
    unit: 'unidade',
    category: 'starter',
    image: `${IMG}/Fotos/Enchidos.webp`
  },
  {
    id: 'pro_photographer',
    name: 'Fotógrafo profissional',
    description: 'Registe o momento especial com um fotógrafo totalmente dedicado ao seu evento.',
    unit: 'serviço',
    category: 'service',
    image: `${IMG}/Fotos/Fotografo.png`
  },
  {
    id: 'inflatable_kids',
    name: 'Insuflável para crianças',
    description: 'Diversão garantida para os mais pequenos enquanto os adultos dominam o grelhador.',
    unit: 'unidade',
    category: 'service',
    image: `${IMG}/Fotos/escorrega-palmeiras1.jpeg`
  },
  {
    id: 'open_bar',
    name: 'Bar aberto',
    description: 'Serviço de bar aberto com bebidas à descrição durante todo o evento. Opcional.',
    unit: 'evento',
    category: 'service',
    image: `${IMG}/Fotos/Bar.webp`
  }
];

// Special "venue" option for clients who already have their own space.
export const OWN_LOCATION_ID = 'own_location';
export const OWN_LOCATION_NAME = 'Local próprio';

export const LOCATIONS: VenueLocation[] = [
  {
    id: 'tapadinha_lisboa',
    name: 'Monsanto (Lisboa)',
    description: 'Espaço versátil rodeado de natureza no pulmão de Lisboa. Ideal para grandes grupos ao ar livre.',
    images: [
      `${IMG}/Fotos/Locais/Tapadinha/Tapa1.webp`,
      `${IMG}/Fotos/Locais/Tapadinha/Tapa2.webp`,
      `${IMG}/Fotos/Locais/Tapadinha/Tapa3.webp`
    ],
    minGuests: 80,
    maxGuests: 1000
  },
  {
    id: 'restelo_urban',
    name: 'Restelo',
    description: 'O verdadeiro churrasco em contexto urbano, bem no centro do Restelo onde a vibe tradicional impera.',
    images: [
      `${IMG}/Fotos/Locais/Restelo/restelo1.png`,
      `${IMG}/Fotos/Locais/Restelo/restelo3.webp`,
      `${IMG}/Fotos/Locais/Restelo/restelo4.webp`
    ],
    minGuests: 20,
    maxGuests: 100
  },
  {
    id: 'carnide_local',
    name: 'Carnide',
    description: 'Um refúgio tranquilo em Carnide, ideal para grupos íntimos e celebrações tradicionais.',
    images: [
      `${IMG}/Fotos/Locais/Carnide/Tasq1.webp`,
      `${IMG}/Fotos/Locais/Carnide/Tasq2.webp`,
      `${IMG}/Fotos/Locais/Carnide/Tast3.webp`,
      `${IMG}/Fotos/Locais/Carnide/Carnide4.jpeg`,
    ],
    minGuests: 20,
    maxGuests: 40
  },
  {
    id: 'expo_rooftop',
    name: 'Expo',
    description: 'Rooftop que nos transporta para um mundo de cor, criatividade e comunhão com a cidade.',
    images: [
      `${IMG}/Fotos/Locais/Expo/Expo1_A.webp`,
      `${IMG}/Fotos/Locais/Expo/Expo1_E.webp`,
      `${IMG}/Fotos/Locais/Expo/Expo1_D.webp`,
      `${IMG}/Fotos/Locais/Expo/Expo1_C.webp`
    ],
    minGuests: 30,
    maxGuests: 500,
    // Special rule: Mon–Wed requires 80+ guests
    specialRules: [
      { days: [1, 2, 3], minGuests: 80 }
    ]
  },
  {
    id: 'benfica',
    name: 'Benfica',
    description: 'Espaço com história e carácter em pleno coração de Benfica. Perfeito para fins de semana em família.',
    images: [
      `${IMG}/Fotos/Locais/Benfica/Benfica1.jpeg`,
      `${IMG}/Fotos/Locais/Benfica/Benfica2.jpeg`,
      `${IMG}/Fotos/Locais/Benfica/Benfica3.webp`,
      `${IMG}/Fotos/Locais/Benfica/Benfica4.jpeg`,
      `${IMG}/Fotos/Locais/Benfica/Benfica5.jpeg`
    ],
    minGuests: 20,
    maxGuests: 120,
    availableDays: [0, 6] // weekends only
  },
  {
    id: 'musa_marvila',
    name: 'Musa Marvila',
    description: 'Ambiente industrial e criativo em Marvila, a zona mais cool de Lisboa. Exclusivo às segundas-feiras.',
    images: [
      `${IMG}/Fotos/Locais/Marvila/Marvila1.jpg`,
      `${IMG}/Fotos/Locais/Marvila/Marvila2.webp`,
      `${IMG}/Fotos/Locais/Marvila/Marvila3.webp`,
      `${IMG}/Fotos/Locais/Marvila/Marvila4.jpg`
    ],
    minGuests: 30,
    maxGuests: 80,
    availableDays: [1] // Monday only
  },
  {
    id: 'alvito',
    name: 'Alvito',
    description: 'Pátio histórico com pavimento em calçada portuguesa e luzes de cordão. Um ambiente íntimo e único no coração de Lisboa.',
    images: [
      `${IMG}/Fotos/Locais/Alvito/Alvito1.png`,
      `${IMG}/Fotos/Locais/Alvito/Alvito2.png`
    ],
    minGuests: 20,
    maxGuests: 60
  }
];

// Filter venues by number of guests and date
export function getAvailableVenues(guests: number, date: Date | null): VenueLocation[] {
  if (!date) return LOCATIONS;
  const dow = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat

  return LOCATIONS.filter(loc => {
    // Capacity check
    if (guests < loc.minGuests || guests > loc.maxGuests) return false;

    // Day availability check
    if (loc.availableDays && !loc.availableDays.includes(dow)) return false;

    // Special per-day min-guests rules
    if (loc.specialRules) {
      for (const rule of loc.specialRules) {
        if (rule.days.includes(dow) && guests < rule.minGuests) return false;
      }
    }

    return true;
  });
}

// Meats per tradition (informational, not selectable)
export const TRADITION_MEATS: Record<string, string[]> = {
  brazilian: ['Picanha', 'Linguiça Toscana', 'Coxa de frango desossada'],
  portuguese: ['Lagartos', 'Maminha', 'Entremeada'],
  argentinian: ['Vacío', 'Tira de asado', 'Criollo e sal argentino'],
};

// Always the same drinks
export const FIXED_DRINKS = ['Cerveja gelada', 'Vinho branco e tinto', 'Sumo de Laranja Natural', 'Águas'];

// Sides depend on tradition: black-bean rice only for Brazilian, white rice for
// Portuguese, no rice for Argentinian.
export const FIXED_SIDES = ['Arroz com feijão preto', 'Salada Mista', 'Batata Frita'];

export function getFixedSides(tradition: BBQTradition | null): string[] {
  switch (tradition) {
    case 'brazilian':
      return ['Arroz com feijão preto', 'Salada Mista', 'Batata Frita'];
    case 'portuguese':
      return ['Arroz branco', 'Salada Mista', 'Batata Frita'];
    case 'argentinian':
      return ['Salada Mista', 'Batata Frita'];
    default:
      return FIXED_SIDES;
  }
}

// Returns all venues available on a given day (ignores guest count — use for display with disabled state)
export function getVenuesByDay(date: Date | null): VenueLocation[] {
  if (!date) return LOCATIONS;
  const dow = date.getDay();
  return LOCATIONS.filter(loc => {
    if (loc.availableDays && !loc.availableDays.includes(dow)) return false;
    return true;
  });
}
