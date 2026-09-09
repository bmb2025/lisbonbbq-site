import { createContext, useContext } from 'react';
import { EventMenuItem, EventRecord } from './types';

export type Lang = 'pt' | 'en';

export const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'pt',
  setLang: () => {},
});

export function useLang() {
  return useContext(LangContext);
}

const STRINGS: Record<Lang, Record<string, string>> = {
  pt: {
    countdown_prefix: 'Faltam',
    countdown_days: 'dias',
    countdown_hours: 'horas',
    countdown_min: 'min',
    countdown_sec: 'seg',
    add_to_calendar: 'Adicionar ao calendário',
    getting_there_cta: 'Como chegar',
    essential_heading: 'O essencial',
    map_title: 'Mapa do local',
    open_google_maps: 'Abrir no Google Maps',
    open_apple_maps: 'Abrir no Apple Maps',
    menu_heading: 'O Churrasco',
    section_grelha: 'Da grelha',
    section_acompanha: 'Acompanha',
    section_bar: 'No bar',
    veg_tag: 'veg',
    balcao_heading: 'Pago ao balcão',
    weather_heading: 'Vai estar bom tempo!',
    diet_heading: 'Comes de tudo?',
    diet_deadline_prefix: 'Precisamos de saber até',
    diet_form_heading: 'Ajusta o teu prato',
    diet_opt_nenhuma: 'Como de tudo',
    diet_opt_vegetariano: 'Vegetariano',
    diet_opt_vegano: 'Vegano',
    diet_opt_gluten: 'Sem glúten',
    diet_opt_lactose: 'Sem lactose',
    diet_opt_alergia: 'Tenho alergia',
    details_label: 'Detalhes',
    optional: '(opcional)',
    detail_placeholder: 'Ex: alergia a frutos secos, não como porco...',
    children_checkbox: 'Vou acompanhado de crianças',
    children_count_label: 'Quantas crianças',
    children_count_placeholder: 'Ex: 2',
    children_diet_label: 'Preferências ou restrições alimentares das crianças',
    children_diet_placeholder: 'Ex: só comem massa, alergia a ovo...',
    name_label: 'Nome e apelido',
    name_placeholder: 'Nome Apelido',
    email_label: 'O teu email',
    email_placeholder: 'nome@exemplo.pt',
    diet_optin: 'Sim, quero receber as fotos do evento e, de vez em quando, novidades do Lisbon BBQ. Nada de spam, e sais com um clique.',
    sending: 'A enviar…',
    send: 'Enviar',
    diet_footnote1: 'Podes alterar a tua resposta submetendo de novo com o mesmo email.',
    privacy_policy: 'Política de privacidade',
    allergy_footnote: 'Alergia grave? Fala directamente com os pitmasters:',
    diet_done_heading: 'Anotado.',
    diet_done_body_prefix: 'Os pitmasters já sabem. Se precisarmos de detalhes, escrevemos para',
    change_answer: 'Alterar resposta',
    side_panel_heading: 'O que já está garantido',
    chegar_heading: 'Como chegar',
    bring_heading: 'Bom saber',
    bring_label: 'Traz',
    skip_label: 'Não precisas de trazer',
    rules_heading: 'Regras da casa',
    playlist_heading: 'A playlist é vossa',
    open_spotify: 'Abrir no Spotify',
    after_heading: 'Depois',
    album_heading: 'Álbum partilhado',
    album_body: 'Carreguem as fotos todas para o álbum do evento.',
    album_cta: 'Carregar para o álbum',
    review_heading: 'Como correu?',
    review_body: '30 segundos do vosso tempo ajudam-nos mais do que imaginam.',
    review_cta: 'Deixar review no Google',
    instagram_heading: 'Segue-nos no Instagram',
    instagram_body: 'Fica a par das próximas datas e vê os bastidores dos nossos churrascos.',
    follow_instagram: 'Seguir no Instagram',
    photographer_heading: '🔥 As nossas fotos',
    photographer_body_prefix: 'O nosso fotógrafo esteve lá. Ficam disponíveis em alta resolução',
    photographer_body_from: 'a partir de',
    socials_heading: 'Segue o fogo',
    referral_kicker: 'E o vosso?',
    referral_heading: 'Gostaste? Organiza o próximo.',
    referral_email_placeholder: 'o teu email',
    referral_sent_prefix: 'A caminho. Enviámos o teu código para',
    footer_private_note: 'Página privada do evento. Não partilhar fora do grupo de convidados.',
    popup_kicker: 'Antes de começar',
    popup_heading: 'Segue-nos no Instagram',
    popup_body: 'Fotos dos churrascos, spots novos e o que sai da grelha. É por lá que mostramos o que fazemos.',
    popup_not_now: 'Agora não',
    popup_success_heading: 'Obrigado!',
    popup_success_body: 'Vemo-nos no dia do churrasco.',
  },
  en: {
    countdown_prefix: 'Time left:',
    countdown_days: 'days',
    countdown_hours: 'hours',
    countdown_min: 'min',
    countdown_sec: 'sec',
    add_to_calendar: 'Add to calendar',
    getting_there_cta: 'Getting there',
    essential_heading: 'The essentials',
    map_title: 'Location map',
    open_google_maps: 'Open in Google Maps',
    open_apple_maps: 'Open in Apple Maps',
    menu_heading: 'The Barbecue',
    section_grelha: 'From the grill',
    section_acompanha: 'Sides',
    section_bar: 'At the bar',
    veg_tag: 'veg',
    balcao_heading: 'Paid at the counter',
    weather_heading: 'The weather looks good!',
    diet_heading: 'Any dietary needs?',
    diet_deadline_prefix: 'We need to know by',
    diet_form_heading: 'Adjust your plate',
    diet_opt_nenhuma: 'Eat everything',
    diet_opt_vegetariano: 'Vegetarian',
    diet_opt_vegano: 'Vegan',
    diet_opt_gluten: 'Gluten-free',
    diet_opt_lactose: 'Lactose-free',
    diet_opt_alergia: 'I have an allergy',
    details_label: 'Details',
    optional: '(optional)',
    detail_placeholder: "E.g.: nut allergy, don't eat pork...",
    children_checkbox: "I'll be bringing children",
    children_count_label: 'How many children',
    children_count_placeholder: 'E.g.: 2',
    children_diet_label: "Children's food preferences or restrictions",
    children_diet_placeholder: 'E.g.: only eat pasta, egg allergy...',
    name_label: 'Full name',
    name_placeholder: 'Full name',
    email_label: 'Your email',
    email_placeholder: 'name@example.com',
    diet_optin: "Yes, I'd like to receive the event photos and, occasionally, news from Lisbon BBQ. No spam, and you can opt out anytime.",
    sending: 'Sending…',
    send: 'Send',
    diet_footnote1: 'You can change your answer by submitting again with the same email.',
    privacy_policy: 'Privacy policy',
    allergy_footnote: 'Serious allergy? Talk directly to the pitmasters:',
    diet_done_heading: 'Got it.',
    diet_done_body_prefix: "The pitmasters already know. If we need details, we'll email",
    change_answer: 'Change answer',
    side_panel_heading: "What's already sorted",
    chegar_heading: 'Getting there',
    bring_heading: 'Good to know',
    bring_label: 'Bring',
    skip_label: "You don't need to bring",
    rules_heading: 'House rules',
    playlist_heading: 'The playlist is yours',
    open_spotify: 'Open on Spotify',
    after_heading: 'Afterwards',
    album_heading: 'Shared album',
    album_body: 'Upload all your photos to the event album.',
    album_cta: 'Upload to the album',
    review_heading: 'How was it?',
    review_body: "30 seconds of your time helps us more than you'd think.",
    review_cta: 'Leave a review on Google',
    instagram_heading: 'Follow us on Instagram',
    instagram_body: 'Stay up to date on future dates and see behind the scenes of our barbecues.',
    follow_instagram: 'Follow on Instagram',
    photographer_heading: '🔥 Our photos',
    photographer_body_prefix: 'Our photographer was there. High-res photos will be available',
    photographer_body_from: 'from',
    socials_heading: 'Follow the fire',
    referral_kicker: 'What about yours?',
    referral_heading: 'Enjoyed it? Host the next one.',
    referral_email_placeholder: 'your email',
    referral_sent_prefix: 'On its way. We sent your code to',
    footer_private_note: "Private event page. Please don't share outside the guest group.",
    popup_kicker: 'Before we start',
    popup_heading: 'Follow us on Instagram',
    popup_body: "Photos from our barbecues, new spots and what's coming off the grill. That's where we show what we do.",
    popup_not_now: 'Not now',
    popup_success_heading: 'Thanks!',
    popup_success_body: 'See you at the barbecue.',
  },
};

export function useT() {
  const { lang } = useLang();
  return (key: keyof typeof STRINGS['pt']) => STRINGS[lang][key];
}

export function referralFallback(lang: Lang, eur: number, hasCode: boolean) {
  if (lang === 'en') {
    return hasCode
      ? `€${eur} off your barbecue with this code.`
      : `€${eur} off your next barbecue.`;
  }
  return hasCode
    ? `${eur}€ de desconto no vosso churrasco com este código.`
    : `${eur}€ de desconto no próximo churrasco.`;
}

export function formatDate(iso: string | null, tz: string, lang: Lang, opts: Intl.DateTimeFormatOptions = {}) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(lang === 'en' ? 'en-GB' : 'pt-PT', { timeZone: tz, ...opts });
}

export function formatTime(iso: string, tz: string, lang: Lang) {
  return new Date(iso).toLocaleTimeString(lang === 'en' ? 'en-GB' : 'pt-PT', { timeZone: tz, hour: '2-digit', minute: '2-digit' });
}

// Sobrepõe o conteúdo confirmado em `event.translations.en` sobre os campos em
// português — campos sem tradução (ex.: menu_intro nalguns eventos) mantêm o
// original em vez de aparecerem em branco.
export function localizeEvent(event: EventRecord, lang: Lang): EventRecord {
  if (lang === 'pt') return event;
  const en = event.translations?.en;
  if (!en) return event;
  return {
    ...event,
    title: en.title ?? event.title,
    hero_tag: en.hero_tag ?? event.hero_tag,
    essential_cards: en.essential_cards ?? event.essential_cards,
    getting_there: en.getting_there ?? event.getting_there,
    menu_intro: en.menu_intro ?? event.menu_intro,
    balcao_note: en.balcao_note ?? event.balcao_note,
    diet_intro: en.diet_intro ?? event.diet_intro,
    bring_items: en.bring_items ?? event.bring_items,
    skip_items: en.skip_items ?? event.skip_items,
    house_rules: en.house_rules ?? event.house_rules,
    side_panel: en.side_panel ?? event.side_panel,
    playlist_intro: en.playlist_intro ?? event.playlist_intro,
    referral_intro: en.referral_intro ?? event.referral_intro,
    allergy_contact_note: en.allergy_contact_note ?? event.allergy_contact_note,
  };
}

export function localizeMenuItems(items: EventMenuItem[], event: EventRecord, lang: Lang): EventMenuItem[] {
  if (lang === 'pt') return items;
  const translations = event.translations?.en?.menu_items;
  if (!translations) return items;
  return items.map(item => {
    const tr = translations[item.id];
    if (!tr) return item;
    return { ...item, name: tr.name ?? item.name, description: tr.description ?? item.description };
  });
}
