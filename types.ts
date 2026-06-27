export enum SlotTime {
  MORNING = '10:00 - 14:00',
  AFTERNOON = '16:00 - 20:00',
  ALL_DAY = 'FULL DAY EXPERIENCE',
}

export type BBQTradition = 'brazilian' | 'portuguese' | 'argentinian';

export type BBQStyle = string;

export interface SideDish {
  name: string;
  isVegan: boolean;
}

export interface BBQMenuItem {
  id: string;
  name: string;
  desc: string;
  maxSides: number;
}

export interface BookingState {
  tradition: BBQTradition | null;
  date: Date | null;
  slot: SlotTime | null;
  guests: number;
  guestsConfirmed: boolean;
  style: BBQStyle | null;
  locationId: string | null;
  selectedSides: string[];
  sidesConfirmed: boolean;
  paoAlentejano: boolean;
  sobremesa: boolean;
  extrasConfirmed: boolean;
}

export interface AddOnItem {
  id: string;
  name: string;
  description: string;
  unit: string;
  image: string;
  category: 'starter' | 'premium-meat' | 'dessert' | 'service';
}

export interface CartItem extends AddOnItem {
  quantity: number;
}

export interface AIRecommendation {
  coalBags: number;
  drinkPacks: number;
  meatKg: number;
  platesPacks: number;
  reasoning: string;
}

export interface DailyWeather {
  date: string;
  maxTemp: number;
  minTemp: number;
  code: number;
}

export interface VenueLocation {
  id: string;
  name: string;
  description: string;
  images: string[];
}

export interface Article {
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
}