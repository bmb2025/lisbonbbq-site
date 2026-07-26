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
  ownVenuePostalCode: string | null;
  ownVenueHasWaterElectricity: boolean;
  ownVenueIncludeSeating: boolean;
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

export interface SpecialDayRule {
  days: number[]; // 0=Sun,1=Mon,...,6=Sat
  minGuests: number;
}

export interface VenueLocation {
  id: string;
  name: string;
  description: string;
  images: string[];
  minGuests: number;
  maxGuests: number;
  availableDays?: number[]; // undefined = all days; [0,6] = weekends; [1] = Monday only
  specialRules?: SpecialDayRule[]; // extra min-guests constraints per day group
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

export interface EssentialCard {
  label: string;
  big: string;
  note?: string;
  variant?: 'default' | 'flame';
}

export interface GettingThereCard {
  icon: string;
  title: string;
  body: string;
  highlight?: string;
}

export interface HouseRule {
  label: string;
  text: string;
}

export interface SidePanelItem {
  icon: string;
  text: string;
}

export interface EventMenuItem {
  id: string;
  event_id: string;
  section: 'grelha' | 'acompanha' | 'bar';
  name: string;
  description: string | null;
  is_vegan: boolean;
  sort_order: number;
}

export interface EventRecord {
  id: string;
  slug: string;
  client_name: string | null;
  title: string;
  hero_tag: string;
  hero_image_url: string | null;
  starts_at: string;
  ends_at: string | null;
  timezone: string;
  venue_name: string | null;
  venue_address: string | null;
  lat: number | null;
  lng: number | null;
  essential_cards: EssentialCard[];
  getting_there: GettingThereCard[];
  menu_intro: string | null;
  balcao_note: string | null;
  diet_deadline: string | null;
  diet_intro: string | null;
  bring_items: string[];
  skip_items: string[];
  house_rules: HouseRule[];
  side_panel: SidePanelItem[] | null;
  playlist_url: string | null;
  playlist_intro: string | null;
  album_url: string | null;
  review_url: string | null;
  show_photographer_card: boolean;
  photographer_available_at: string | null;
  allergy_contact_note: string;
  referral_code: string | null;
  referral_discount_eur: number;
  referral_valid_until: string | null;
  referral_intro: string | null;
  socials: { key: string; label: string; url: string }[] | null;
  published: boolean;
}
