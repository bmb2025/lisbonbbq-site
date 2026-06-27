
import { AddOnItem, VenueLocation, BBQMenuItem, SideDish } from './types';

export const DEFAULT_ASSETS: Record<string, string> = {
  hero: "https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/Hero.webp",
  stressFree: "https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/Churrasco%20People.png",
  noExtras: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?q=80&w=800&auto=format&fit=crop",
  venueFeature1: "https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/B1.webp",
  venueFeature2: "https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/B2.webp",
  venueFeature3: "https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/B3.webp"
};

export const BRAZILIAN_MENUS: BBQMenuItem[] = [
  { 
    id: 'brazilian-1', 
    name: 'Churrasco de quintal', 
    desc: 'Picanha, Linguiça Toscana e coxa de frango desossada.',
    maxSides: 2
  }
];

export const PORTUGUESE_MENUS: BBQMenuItem[] = [
  {
    id: 'portuguese-1',
    name: 'Grelhada Mista',
    desc: 'Lagartos, maminha e entremeada.',
    maxSides: 2
  },
  {
    id: 'portuguese-2',
    name: 'Festa da Aldeia',
    desc: 'Porco no Espeto',
    maxSides: 2
  }
];

export const ARGENTINIAN_MENUS: BBQMenuItem[] = [
  {
    id: 'argentinian-1',
    name: 'Juntada con asado',
    desc: 'Vacío, Tira de asado, criollo, sal argentino e chimichurri.',
    maxSides: 2
  }
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
    image: 'https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/Aniver_opt.webp'
  },
  {
    id: 'wheelbarrow_beer',
    name: 'Carrinho de mão com cerveja e gelo',
    description: 'A forma mais original e refrescante de manter as bebidas geladas durante todo o evento.',
    unit: 'unidade',
    category: 'service',
    image: 'https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/Carrinho%20de%20mao%20gelo.webp'
  },
  {
    id: 'da_bomb',
    name: 'Packing a punch',
    description: 'Molho picante Da Bomb para os mais corajosos.',
    unit: 'unidade',
    category: 'starter',
    image: 'https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/Da_bomb.webp'
  },
  {
    id: 'pitmaster',
    name: 'Pitmaster',
    description: 'Especialista em grelhados que assume o pit enquanto dá uma verdadeira aula.',
    unit: 'serviço',
    category: 'service',
    image: 'https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/Pitmasters.webp'
  },
  {
    id: 'cheese_board',
    name: 'Tabua de Queijos e enchidos',
    description: 'As melhores gordices para os convidados mais exigentes.',
    unit: 'unidade',
    category: 'starter',
    image: 'https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/Enchidos.webp'
  },
  {
    id: 'pro_photographer',
    name: 'Fotógrafo profissional',
    description: 'Registe o momento especial com um fotógrafo totalmente dedicado ao seu evento.',
    unit: 'serviço',
    category: 'service',
    image: 'https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/Fotografo.png'
  },
  {
    id: 'inflatable_kids',
    name: 'Insuflável para crianças',
    description: 'Diversão garantida para os mais pequenos enquanto os adultos dominam o grelhador.',
    unit: 'unidade',
    category: 'service',
    image: 'https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/escorrega-palmeiras1.jpeg'
  }
];

export const LOCATIONS: VenueLocation[] = [
  { 
    id: 'tapadinha_lisboa', 
    name: 'Monsanto (Lisboa)', 
    description: 'Espaço versátil rodeado de natureza no pulmão de Lisboa. Ideal para convívios ao ar livre.', 
    images: [
      'https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/Locais/Tapadinha/Tapa1.webp',
      'https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/Locais/Tapadinha/Tapa2.webp',
      'https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/Locais/Tapadinha/Tapa3.webp'
    ]
  },
  { 
    id: 'restelo_urban', 
    name: 'Restelo', 
    description: 'O verdadeiro churrasco em contexto urbano, bem no centro do Restelo onde a vibe tradicional impera.', 
    images: [
      'https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/Locais/Caramao/Carama%CC%83o%20hero.webp',
      'https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/Locais/Caramao/Carama%CC%83o%20hero.webp',
      'https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/Locais/Caramao/restelo3.webp'
    ]
  },
  { 
    id: 'carnide_local', 
    name: 'Carnide', 
    description: 'Um refúgio tranquilo em Carnide, ideal para grandes grupos e celebrações tradicionais.', 
    images: [
      'https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/Locais/Tasquissima/Tasq1.webp',
      'https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/Locais/Tasquissima/Tasq2.webp',
      'https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/Locais/Tasquissima/Tast3.webp'
    ]
  },
  { 
    id: 'expo_rooftop', 
    name: 'Expo', 
    description: 'Rooftop que nos transporta para um mundo de cor, criatividade e comunhão com a cidade', 
    images: [
      'https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/Locais/Expo/Expo1_A%20(1).webp',
      'https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/Locais/Expo/Expo1_E%20(1).webp',
      'https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/Locais/Expo/Expo1_D%20(1).webp',
      'https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/Locais/Expo/Expo1_C%20(1).webp'
    ]
  }
];
