import React, { useEffect, useMemo, useRef, useState } from 'react';
import { track, identifyLead } from '../services/analytics';

// Landing page do workshop de churrasco (lisbonbbq.pt/workshop), em PT e EN.
// O idioma vem do botão PT/EN do cabeçalho. O inglês não é tradução palavra a
// palavra: mantém o tom de camaradagem, mas com expressões naturais em inglês.
//
// Preços: têm de ficar iguais a PRICES em api/workshop-waitlist.ts, que é quem
// decide o preço de facto. A variante vem do link do anúncio (?v=b) para o teste
// de preço; sem parâmetro é a variante "a".
export const WORKSHOP_PRICES: Record<string, { public: number; invite: number }> = {
  a: { public: 110, invite: 90 },
  b: { public: 95, invite: 80 },
};

type Lang = 'pt' | 'en';

const IMG = '/images/workshop';

// Opções dos campos de escolha. O `value` (em PT) é o que segue para a API e para
// o PostHog, nas duas línguas, para os dados ficarem comparáveis; o `en` é só o
// que a pessoa vê.
const SLOTS = [
  { value: 'Sexta ao fim da tarde', pt: 'Sexta ao fim da tarde', en: 'Friday early evening' },
  { value: 'Sábado', pt: 'Sábado', en: 'Saturday' },
  { value: 'Domingo', pt: 'Domingo', en: 'Sunday' },
  { value: 'Tanto faz', pt: 'Tanto faz', en: 'Any day works' },
];
const LEVELS = [
  { value: 'Nunca', pt: 'Nunca', en: 'Never' },
  { value: 'Às vezes', pt: 'Às vezes', en: 'Sometimes' },
  { value: 'Sou o grelhador da família', pt: 'Sou o grelhador da família', en: "I'm the family grill master" },
];
const MOTIVES = [
  { value: 'Aprender a grelhar', pt: 'Aprender a grelhar', en: 'Learning to grill' },
  { value: 'A malta e a mesa', pt: 'A malta e a mesa', en: 'The crowd and the table' },
  { value: 'As duas', pt: 'As duas', en: 'Both' },
];
const SOURCES = [
  { value: 'instagram', pt: 'Instagram', en: 'Instagram' },
  { value: 'amigos', pt: 'Amigos ou família', en: 'Friends or family' },
  { value: 'evento', pt: 'Já fui a um churrasco Lisbon BBQ', en: "I've been to a Lisbon BBQ event" },
  { value: 'google', pt: 'Google', en: 'Google' },
  { value: 'outro', pt: 'Outro', en: 'Other' },
];

const COPY = {
  pt: {
    heroBadge: 'Workshop de churrasco · Lisboa',
    heroAlt: 'Quatro homens à volta de uma grelha a carvão ao fim da tarde, com um pitmaster a explicar',
    h1: 'Nunca mais erres o ponto da carne.',
    heroP: 'Três horas à volta do fogo, com malta que gosta do mesmo que tu. Aprendes a grelhar como se faz cá e acabas à mesa longa, a comer o que grelharam juntos.',
    chips: ['Refeição incluída', 'Ao vivo em Lisboa'],
    limited: 'Vagas limitadas',
    inviteTitle: (n: string) => `${n} guardou-te um lugar.`,
    inviteBody: (inv: number, pub: number) => `Com este convite pagas ${inv}€ em vez de ${pub}€, e ficam na mesma estação de grelha.`,
    cta: 'Entrar na waiting list',
    ctaNote: 'Não pagas nada para entrar na lista.',
    meetEyebrow: 'O workshop',
    meetH2: 'Conhece o workshop',
    meetP1: 'Uma tarde de trabalho à volta da grelha: uns acendem, outros cortam, todos provam. O pitmaster vai puxando por ti e, quando dás por isso, estás a discutir o ponto da picanha com alguém que conheceste há uma hora.',
    meetP2: 'Acaba como acabam os bons churrascos: à mesa longa, com o que grelharam juntos, e com vontade de repetir.',
    stats: [
      ['3 horas', 'ao vivo, em Lisboa'],
      ['Pitmasters', 'da Lisbon BBQ, com anos de brasa e centenas de eventos'],
      ['Mão na pinça', 'cada técnica é logo posta em prática'],
      ['16 pessoas', 'no máximo, para acompanhamento personalizado'],
    ],
    beerH2: 'Aprender, com cerveja na mão',
    beerP: 'À volta do fogo há sempre trabalho para dividir. Alguém segura a pinça, alguém corta, alguém tem uma opinião sobre o sal. Não há jogos para quebrar o gelo nem rodas de apresentações. Há uma grelha, uma tarefa e uma cerveja. A conversa vem sozinha.',
    beerTag: 'Fogo, mesa comprida, telemóvel no bolso.',
    beerAlt: 'Dois homens à grelha: um deita sal grosso na carne, o outro aponta e dá palpite com uma cerveja na mão',
    learnEyebrow: 'O que vais dominar',
    learnH2: 'Oito coisas que deixas de errar',
    learnP: 'Carvão vegetal, brasa e os cortes que se comem cá. Nada de smoker nem molho barbecue.',
    learn: [
      { t: 'A churrasqueira', d: 'Que grelhador e que utensílios valem o dinheiro, e como preparar a grelha antes de acender.' },
      { t: 'Brasa', d: 'Acendes o carvão à primeira, montas zona quente e zona fria e manténs a brasa viva até à última peça.' },
      { t: 'Escolher as melhores carnes', d: 'Picanha, maminha, fraldinha. Escolhes a peça certa no talho e cortas no sentido certo. É muito acerto.' },
      { t: 'Tempero', d: 'Sal grosso, flor de sal ou marinada? Sabes o que pôr em cada carne e em que momento.' },
      { t: 'Reação de Maillard', d: 'Percebes porque é que a carne ganha crosta e como a consegues sem passar o interior. É a diferença entre grelhar e cozer na grelha.' },
      { t: 'O ponto', d: 'Acertas no ponto sem abrir a carne para espreitar.' },
      { t: 'Entremeada e linguiça', d: 'Tostadas por fora, suculentas por dentro. Sem secar nem queimar.' },
      { t: 'Descanso e corte', d: 'Deixas a carne descansar o tempo certo e cortas à mesa, para servir quente.' },
    ],
    flowEyebrow: 'Como corre a tarde',
    flowH2: 'Do carvão à mesa',
    steps: [
      { t: 'Chegada', d: 'Avental vestido, luvas calçadas, bebida na mão. Trabalho em equipa de dois.' },
      { t: 'O fogo', d: 'Acendes o carvão e aprendes a ler a brasa.' },
      { t: 'Os cortes', d: 'Faca na mão: picanha, maminha, fraldinha, entremeada e linguiça.' },
      { t: 'A grelha', d: 'Grelhas tu, ao lado do teu camarada. O pitmaster acompanha e orienta.' },
      { t: 'A mesa longa', d: 'Sentamo-nos todos a comer o que grelhámos, com cerveja gelada e acompanhamentos.' },
    ],
    tableAlt: 'Um prato a passar de mão em mão numa mesa longa',
    inclEyebrow: 'O que está incluído',
    inclH2: 'Tudo. Só trazes a fome.',
    included: ['Toda a carne e os acompanhamentos', 'Refeição completa à mesa longa', 'Bebidas: cerveja ou vinho da casa', 'Avental e receita para levar para casa', '1 pitmaster que ensina e acompanha'],
    when: ['Quando:', 'próximas sessões em novembro e dezembro de 2026, sexta ao fim da tarde, sábado ou domingo.'],
    where: ['Onde:', 'espaço Lisbon BBQ, em Lisboa. O local exato vai na confirmação.'],
    spots: ['Lugares:', '16 por sessão. Quem está na lista tem 48 horas de prioridade antes de abrirmos ao público.'],
    priceLabel: 'Workshop · por pessoa',
    priceLabelInvite: 'Workshop · com convite',
    money: (n: number) => `${n}€`,
    insteadOf: (n: number) => `em vez de ${n} euros`,
    vat: 'IVA incluído',
    priceNote: '3 horas de workshop prático, com a refeição completa no fim.',
    pmEyebrow: 'Os pitmasters',
    pmH2: 'Quem puxa pela tarde',
    pmP: 'Cada turma tem um destes pitmasters ao lado, do primeiro carvão ao último corte.',
    pmAlt: (n: string) => `${n}, pitmaster da Lisbon BBQ`,
    pitmasters: [
      { n: 'David', img: 'david-400.webp', bio: 'Aficionado tornado especialista. Os seus workshops são encontros de amigos que ainda não se conheciam.', q: '«Oiçam esta chiadeira maravilhosa!»', lang: undefined as string | undefined },
      { n: 'Santiago', img: 'santiago-400.webp', bio: 'Há mais de 5 anos que leva os sabores do seu país a eventos privados, como private chef. Especialista nos cortes e na parrilla argentina.', q: '«Che, a Cristiano le encantaría este chimichurri»', lang: 'es-AR' as string | undefined },
    ],
    faqH2: 'Perguntas frequentes',
    faqs: [
      { q: 'Nunca grelhei, posso ir?', a: 'Podes. Começamos com o carvão apagado e explicamos tudo desde aí. Quem já grelha vai afinar a brasa e o ponto.' },
      { q: 'Posso ir sozinho?', a: 'Deves. A tarde foi pensada para quem chega sem conhecer ninguém: o trabalho na grelha é dividido e a mesa é uma só.' },
      { q: 'Tenho de falar com toda a gente?', a: 'Não. Ninguém te põe a apresentar-te em voz alta. A conversa nasce do que estás a fazer.' },
      { q: 'Há opção sem carne?', a: 'Este workshop é de carne. Se tiveres alguma restrição alimentar, avisa-nos por email para pitmasters@lisbonbbq.pt.' },
      { q: 'E se chover?', a: 'O espaço tem cobertura, por isso o workshop acontece na mesma.' },
      { q: 'Posso oferecer?', a: 'Sim. Em breve vamos ter vouchers.' },
      { q: 'Política de cancelamento', a: 'Se não puderes vir, o teu lugar é transferível para outra pessoa ou para outra data.' },
    ],
    calEyebrow: 'Calendário',
    calH2: 'Workshops recentes',
    calNext: 'Próximos workshops',
    calMonths: 'Novembro e dezembro',
    calNextNote: 'Abrem primeiro para a waiting list, com 48 horas de prioridade.',
    soldOut: 'Esgotado',
    calMeta: '16 lugares · 3 horas',
    recent: [
      { d: '20 setembro', s: 'Churrasco tradicional português' },
      { d: '19 setembro', s: 'Churrasco estilo brasileiro' },
      { d: '6 setembro', s: 'Churrasco estilo argentino' },
      { d: '5 setembro', s: 'Churrasco tradicional português' },
      { d: '30 agosto', s: 'Churrasco estilo brasileiro' },
    ],
    formEyebrow: 'Lista de espera',
    formH2: 'Entra na lista',
    formP: 'Quem está na lista tem 48 horas de prioridade quando abrirmos novos workshops, e recebe vantagens exclusivas por email. Não pagas nada agora.',
    doneTitle: (n: string) => `Está feito, ${n}.`,
    doneDup: 'Este email já estava na lista. O teu lugar continua guardado e avisamos-te antes de abrirmos ao público.',
    doneNew: 'Estás na lista! Avisamos-te 48h antes de abrirmos novas datas de workshop ao público. Entretanto enviámos-te um email com uma pequena surpresa. Vai lá dar uma vista de olhos 🙂',
    inviteBoxTitle: 'Tens um convite para oferecer.',
    inviteBoxText: (inv: number, pub: number) => `Quem se inscrever com o teu link fica na tua estação de grelha, e os dois pagam ${inv}€ em vez de ${pub}€.`,
    inviteBoxMore: (inv: number) => `Vale para quantos camaradas quiseres. Cada um paga ${inv}€, e tu também.`,
    shareLabel: 'Partilha o teu convite',
    shareText: (inv: number, pub: number) => `Olha este Workshop de Churrasco da Lisbon BBQ & Churrasco! Com este link, temos os dois um desconto de ${pub - inv}€ cada.`,
    shareMore: 'Sabe mais ->',
    shareSubject: 'Workshop de churrasco Lisbon BBQ',
    shareCopy: 'Copiar link',
    shareCopied: 'Link copiado.',
    shareIgHint: 'Link copiado. Cola-o numa mensagem ou story no Instagram.',
    lName: 'Nome',
    phName: 'Nome e apelido',
    lEmail: 'Email',
    lPhone: 'Telemóvel',
    qSlot: 'Que horário te dá mais jeito?',
    qExp: 'Já grelhas?',
    qMotive: 'O que te traz mais?',
    qSource: 'Como soubeste de nós?',
    pickOne: 'Escolhe uma opção',
    consentBefore: 'Autorizo a Lisbon BBQ a guardar estes dados para me contactar sobre o workshop de churrasco da Lisbon BBQ, de acordo com o RGPD. Posso pedir para os apagar a qualquer momento em ',
    consentMid: '. Lê a ',
    consentLink: 'política de privacidade',
    consentAfter: '.',
    submit: 'Entrar na waiting list',
    sending: 'A guardar…',
    formNote: 'Entrar na lista não garante lugar nem data. Quando as datas abrirem, quem está na lista é avisado primeiro.',
    errMissing: (list: string) => `Falta preencher: ${list}.`,
    errConsent: 'Para guardarmos o teu pedido, precisamos da tua autorização (caixa acima).',
    errSend: 'Não conseguimos guardar o teu pedido. Tenta outra vez daqui a pouco ou escreve-nos para pitmasters@lisbonbbq.pt.',
    fName: 'nome',
    fEmail: 'um email válido',
    fPhone: 'telemóvel',
    fSlot: 'horário',
    fExp: 'experiência a grelhar',
    fMotive: 'o que te traz',
    stickyCta: (price: string) => `Entrar na waiting list · ${price}`,
  },
  en: {
    heroBadge: 'BBQ workshop · Lisbon',
    heroAlt: 'Four men around a charcoal grill in the late afternoon, with a pitmaster explaining',
    h1: 'Never get the doneness wrong again.',
    heroP: "Three hours around the fire with people who like what you like. You'll learn to grill the way it's done here, and finish at the long table, eating what you grilled together.",
    chips: ['Meal included', 'Live in Lisbon'],
    limited: 'Limited spots',
    inviteTitle: (n: string) => `${n} saved you a spot.`,
    inviteBody: (inv: number, pub: number) => `With this invite you pay €${inv} instead of €${pub}, and you stay at the same grill station.`,
    cta: 'Join the waiting list',
    ctaNote: "You don't pay anything to join the list.",
    meetEyebrow: 'The workshop',
    meetH2: 'Meet the workshop',
    meetP1: "An afternoon of work around the grill: some light the fire, others cut, everyone tastes. The pitmaster keeps nudging you along and, before you know it, you're arguing about how to cook picanha with someone you met an hour ago.",
    meetP2: 'It ends the way good barbecues end: at the long table, with what you grilled together, and wanting to do it again.',
    stats: [
      ['3 hours', 'live, in Lisbon'],
      ['Pitmasters', 'from Lisbon BBQ, with years of embers and hundreds of events'],
      ['Tongs in hand', 'every technique goes straight into practice'],
      ['16 people', 'maximum, for personal guidance'],
    ],
    beerH2: 'Learn, beer in hand',
    beerP: "There's always work to share around the fire. Someone holds the tongs, someone cuts, someone has an opinion about the salt. No icebreaker games, no introduction circles. There's a grill, a task and a beer. The conversation takes care of itself.",
    beerTag: 'Fire, long table, phone in your pocket.',
    beerAlt: 'Two men at the grill: one sprinkles coarse salt on the meat while the other points and gives his opinion, beer in hand',
    learnEyebrow: "What you'll master",
    learnH2: "Eight things you'll stop getting wrong",
    learnP: 'Charcoal, embers and the cuts people eat here. No smoker, no barbecue sauce.',
    learn: [
      { t: 'The grill', d: 'Which grill and tools are worth the money, and how to prepare the grate before you light up.' },
      { t: 'Embers', d: 'You light the charcoal first time, set up a hot zone and a cold zone, and keep the embers alive until the last piece.' },
      { t: 'Choosing the best cuts', d: 'Picanha, maminha, fraldinha. You pick the right piece at the butcher and cut it against the grain. Small details make a big difference.' },
      { t: 'Seasoning', d: 'Coarse salt, flor de sal or marinade? You know what goes on each meat, and when.' },
      { t: 'The Maillard reaction', d: "You understand why meat gets a crust and how to get one without overcooking the inside. It's the difference between grilling and steaming on the grill." },
      { t: 'Doneness', d: 'You nail the doneness without cutting the meat open to peek.' },
      { t: 'Pork belly and linguiça', d: 'Crisp outside, juicy inside. No drying out, no burning.' },
      { t: 'Resting and carving', d: 'You let the meat rest for the right time and carve at the table, so it goes out hot.' },
    ],
    flowEyebrow: 'How the afternoon goes',
    flowH2: 'From charcoal to table',
    steps: [
      { t: 'Arrival', d: 'Apron on, gloves on, drink in hand. Teamwork in pairs.' },
      { t: 'The fire', d: 'You light the charcoal and learn to read the embers.' },
      { t: 'The cuts', d: 'Knife in hand: picanha, maminha, fraldinha, pork belly and linguiça.' },
      { t: 'The grill', d: 'You do the grilling, next to your grill mate. The pitmaster coaches and guides.' },
      { t: 'The long table', d: 'We all sit down to eat what we grilled, with ice-cold beer and sides.' },
    ],
    tableAlt: 'A plate being passed from hand to hand along a long table',
    inclEyebrow: "What's included",
    inclH2: 'Everything. Just bring your appetite.',
    included: ['All the meat and sides', 'Full meal at the long table', 'Drinks: beer or house wine', 'Apron and recipe to take home', '1 pitmaster who teaches and guides you'],
    when: ['When:', 'upcoming sessions in November and December 2026, Friday early evening, Saturday or Sunday.'],
    where: ['Where:', 'Lisbon BBQ venue, in Lisbon. The exact location comes with your confirmation.'],
    spots: ['Spots:', '16 per session. People on the list get 48 hours of priority before we open to the public.'],
    priceLabel: 'Workshop · per person',
    priceLabelInvite: 'Workshop · with invite',
    money: (n: number) => `€${n}`,
    insteadOf: (n: number) => `instead of ${n} euros`,
    vat: 'VAT included',
    priceNote: '3-hour hands-on workshop, with the full meal at the end.',
    pmEyebrow: 'The pitmasters',
    pmH2: 'Who runs the afternoon',
    pmP: 'Every class has one of these pitmasters beside you, from the first charcoal to the last cut.',
    pmAlt: (n: string) => `${n}, Lisbon BBQ pitmaster`,
    pitmasters: [
      { n: 'David', img: 'david-400.webp', bio: "A hobbyist turned expert. His workshops are meetups of friends who just haven't met yet.", q: '«Listen to that beautiful sizzle!»', lang: undefined as string | undefined },
      { n: 'Santiago', img: 'santiago-400.webp', bio: 'For over 5 years he has been bringing the flavours of his country to private events as a private chef. A specialist in cuts and Argentine parrilla.', q: '«Che, a Cristiano le encantaría este chimichurri»', lang: 'es-AR' as string | undefined },
    ],
    faqH2: 'Frequently asked questions',
    faqs: [
      { q: "I've never grilled. Can I come?", a: 'You can. We start with the charcoal unlit and explain everything from there. If you already grill, you will fine-tune your embers and doneness.' },
      { q: 'Can I come alone?', a: 'You should. The afternoon is designed for people who arrive not knowing anyone: the grill work is shared and there is just one table.' },
      { q: 'Do I have to talk to everyone?', a: 'No. Nobody makes you stand up and introduce yourself. Conversation grows out of what you are doing.' },
      { q: 'Is there a meat-free option?', a: 'This workshop is all about meat. If you have a dietary restriction, let us know by email at pitmasters@lisbonbbq.pt.' },
      { q: 'What if it rains?', a: 'The space is covered, so the workshop goes ahead regardless.' },
      { q: 'Can I give it as a gift?', a: 'Yes. Vouchers are coming soon.' },
      { q: 'Cancellation policy', a: "If you can't make it, your place can be transferred to someone else or to another date." },
    ],
    calEyebrow: 'Calendar',
    calH2: 'Recent workshops',
    calNext: 'Upcoming workshops',
    calMonths: 'November and December',
    calNextNote: 'They open to the waiting list first, with 48 hours of priority.',
    soldOut: 'Sold out',
    calMeta: '16 spots · 3 hours',
    recent: [
      { d: '20 September', s: 'Traditional Portuguese barbecue' },
      { d: '19 September', s: 'Brazilian-style barbecue' },
      { d: '6 September', s: 'Argentine-style barbecue' },
      { d: '5 September', s: 'Traditional Portuguese barbecue' },
      { d: '30 August', s: 'Brazilian-style barbecue' },
    ],
    formEyebrow: 'Waiting list',
    formH2: 'Join the list',
    formP: 'People on the list get 48 hours of priority when we open new workshops, and receive exclusive perks by email. You pay nothing now.',
    doneTitle: (n: string) => `You're in, ${n}.`,
    doneDup: 'This email was already on the list. Your spot is still saved and we will let you know before we open to the public.',
    doneNew: "You're on the list! We'll let you know 48h before we open new workshop dates to the public. In the meantime we've sent you an email with a little surprise. Go take a look 🙂",
    inviteBoxTitle: 'You have an invite to give away.',
    inviteBoxText: (inv: number, pub: number) => `Anyone who signs up with your link joins your grill station, and you both pay €${inv} instead of €${pub}.`,
    inviteBoxMore: (inv: number) => `It works for as many mates as you like. Each pays €${inv}, and so do you.`,
    shareLabel: 'Share your invite',
    shareText: (inv: number, pub: number) => `Check out this barbecue workshop from Lisbon BBQ & Churrasco! With this link, we each get €${pub - inv} off.`,
    shareMore: 'Find out more ->',
    shareSubject: 'Lisbon BBQ barbecue workshop',
    shareCopy: 'Copy link',
    shareCopied: 'Link copied.',
    shareIgHint: 'Link copied. Paste it into an Instagram message or story.',
    lName: 'Name',
    phName: 'First and last name',
    lEmail: 'Email',
    lPhone: 'Mobile',
    qSlot: 'Which day works best for you?',
    qExp: 'Do you grill already?',
    qMotive: 'What brings you most?',
    qSource: 'How did you hear about us?',
    pickOne: 'Choose an option',
    consentBefore: 'I authorise Lisbon BBQ to store this data to contact me about the Lisbon BBQ barbecue workshop, in accordance with the GDPR. I can ask for it to be deleted at any time at ',
    consentMid: '. Read the ',
    consentLink: 'privacy policy',
    consentAfter: '.',
    submit: 'Join the waiting list',
    sending: 'Saving…',
    formNote: "Joining the list doesn't guarantee a spot or a date. When dates open, people on the list are told first.",
    errMissing: (list: string) => `Please fill in: ${list}.`,
    errConsent: 'To save your request we need your permission (box above).',
    errSend: "We couldn't save your request. Try again in a moment or write to us at pitmasters@lisbonbbq.pt.",
    fName: 'name',
    fEmail: 'a valid email',
    fPhone: 'mobile',
    fSlot: 'day',
    fExp: 'grilling experience',
    fMotive: 'what brings you',
    stickyCta: (price: string) => `Join the waiting list · ${price}`,
  },
};

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];

const FlameMark: React.FC<{ size?: number; fill?: string; stroke?: string }> = ({ size = 32, fill = '#F4B41A', stroke = '#1A1A1A' }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

type BtnVariant = 'accent' | 'dark';
const Btn: React.FC<{ variant?: BtnVariant; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean; className?: string; children: React.ReactNode }> = ({
  variant = 'accent', onClick, type = 'button', disabled, className = '', children,
}) => {
  const colors = variant === 'accent'
    ? 'bg-bbq-yellow text-bbq-black hover:bg-bbq-cream'
    : 'bg-bbq-black text-bbq-yellow hover:bg-bbq-red hover:text-white';
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${colors} border-4 border-bbq-black shadow-hard active:shadow-none active:translate-x-[2px] active:translate-y-[2px] font-black uppercase tracking-wider text-lg px-8 py-4 min-h-[56px] transition-colors disabled:opacity-60 disabled:cursor-wait ${className}`}
    >
      {children}
    </button>
  );
};

const Eyebrow: React.FC<{ color?: string; children: React.ReactNode }> = ({ color = 'text-bbq-yellow', children }) => (
  <span className={`font-black text-xs tracking-[0.1em] uppercase ${color}`}>{children}</span>
);

const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="m-0 font-black uppercase leading-none tracking-tighter text-[clamp(2.25rem,6vw,3.75rem)]">{children}</h2>
);

const Choice: React.FC<{ options: { value: string; label: string }[]; value: string; onChange: (v: string) => void; label: string }> = ({ options, value, onChange, label }) => (
  <fieldset className="flex flex-col gap-2 border-0 p-0 m-0">
    <legend className="font-black text-sm tracking-[0.1em] uppercase mb-2">{label}</legend>
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o.value)}
            className={`min-h-[52px] px-4 border-4 font-black uppercase text-[0.9375rem] transition-colors ${on ? 'bg-bbq-yellow text-bbq-black border-bbq-yellow' : 'bg-transparent text-bbq-cream border-bbq-cream hover:border-bbq-yellow'}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  </fieldset>
);

const shareBtn = 'inline-flex items-center justify-center min-h-[48px] px-4 bg-bbq-cream text-bbq-black border-4 border-bbq-cream font-black uppercase text-sm tracking-wider no-underline transition-colors hover:bg-bbq-yellow hover:border-bbq-yellow cursor-pointer';

const inputCls = 'w-full box-border bg-white text-bbq-black border-4 border-bbq-black px-5 py-4 text-xl font-black outline-none focus:shadow-[0_0_0_4px_#F4B41A]';

export const WorkshopView: React.FC<{ lang?: Lang }> = ({ lang = 'pt' }) => {
  const c = COPY[lang];
  const opts = (list: typeof SLOTS) => list.map((o) => ({ value: o.value, label: o[lang] }));
  const formRef = useRef<HTMLElement>(null);

  const params = useMemo(() => new URLSearchParams(typeof window !== 'undefined' ? window.location.search : ''), []);
  const variant = useMemo(() => {
    const fromUrl = (params.get('v') || '').toLowerCase();
    let v = WORKSHOP_PRICES[fromUrl] ? fromUrl : '';
    try {
      if (v) sessionStorage.setItem('workshop_variant', v);
      else v = sessionStorage.getItem('workshop_variant') || '';
    } catch { /* storage bloqueado: segue com a variante do URL */ }
    return WORKSHOP_PRICES[v] ? v : 'a';
  }, [params]);
  const inviteCode = useMemo(() => (params.get('c') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6), [params]);
  const utm = useMemo(() => {
    const o: Record<string, string> = {};
    UTM_KEYS.forEach((k) => { const v = params.get(k); if (v) o[k] = v.slice(0, 200); });
    return Object.keys(o).length ? o : null;
  }, [params]);

  const [invite, setInvite] = useState<{ firstName: string; invitePrice: number; publicPrice: number } | null>(null);
  useEffect(() => {
    if (inviteCode.length !== 6) return;
    let cancelled = false;
    fetch(`/api/workshop-waitlist?c=${inviteCode}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled && d?.valid) setInvite({ firstName: d.firstName, invitePrice: d.invitePrice, publicPrice: d.publicPrice }); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [inviteCode]);

  const prices = invite ? { public: invite.publicPrice, invite: invite.invitePrice } : WORKSHOP_PRICES[variant];
  const shownPrice = invite ? prices.invite : prices.public;
  const price = c.money(shownPrice);

  // O botão fixo no telemóvel esconde-se quando o formulário ou o rodapé estão
  // à vista: não faz falta junto ao formulário e taparia os links do rodapé
  // (privacidade, termos, cookies).
  const [hideSticky, setHideSticky] = useState(false);
  useEffect(() => {
    const targets = [formRef.current, document.querySelector('footer')].filter(Boolean) as Element[];
    if (!targets.length || typeof IntersectionObserver === 'undefined') return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      setHideSticky(visible.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  const [openFaq, setOpenFaq] = useState(-1);
  const [form, setForm] = useState({ name: '', email: '', phone: '', slot: '', exp: '', motive: '', source: '', consent: false, website: '' });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ firstName: string; duplicate?: boolean; inviteCode?: string; invitePrice?: number; publicPrice?: number } | null>(null);
  const [shareNote, setShareNote] = useState('');
  useEffect(() => { setShareNote(''); }, [lang]);

  const set = (k: keyof typeof form) => (v: any) => { setForm((f) => ({ ...f, [k]: v })); setError(''); };

  const goForm = (where: string) => {
    track('workshop_cta_click', { where, variant, lang });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing: string[] = [];
    if (!form.name.trim()) missing.push(c.fName);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) missing.push(c.fEmail);
    if (form.phone.replace(/\D/g, '').length < 9) missing.push(c.fPhone);
    if (!form.slot) missing.push(c.fSlot);
    if (!form.exp) missing.push(c.fExp);
    if (!form.motive) missing.push(c.fMotive);
    if (missing.length) { setError(c.errMissing(missing.join(', '))); return; }
    if (!form.consent) { setError(c.errConsent); return; }

    setSending(true);
    try {
      const r = await fetch('/api/workshop-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email, phone: form.phone,
          preferredSlot: form.slot, experience: form.exp, motive: form.motive, heardFrom: form.source,
          consent: form.consent, website: form.website, lang,
          priceVariant: variant, inviteCode: invite ? inviteCode : undefined,
          utm, landingUrl: window.location.href, referrer: document.referrer || undefined,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d?.ok) throw new Error(d?.error || 'failed');
      identifyLead({ email: form.email.trim(), name: form.name.trim(), phone: form.phone.trim() });
      track('workshop_waitlist_submitted', { variant, lang, invited: !!d.invited, motive: form.motive, experience: form.exp, duplicate: !!d.duplicate });
      setDone({ firstName: d.firstName || form.name.trim().split(' ')[0], duplicate: d.duplicate, inviteCode: d.inviteCode, invitePrice: d.invitePrice, publicPrice: d.publicPrice });
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {
      setError(c.errSend);
    } finally {
      setSending(false);
    }
  };

  const canShare = !!(done && !done.duplicate && done.inviteCode && done.invitePrice && done.publicPrice);
  const inviteUrl = canShare ? `${window.location.origin}/workshop?c=${done!.inviteCode}${lang === 'en' ? '&lang=en' : ''}` : '';
  const shareText = canShare ? c.shareText(done!.invitePrice!, done!.publicPrice!) : '';
  const shareFull = `${shareText} ${c.shareMore} ${inviteUrl}`;
  const enc = encodeURIComponent;
  const shareChannels: { id: string; label: string; href: string }[] = canShare ? [
    { id: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/?text=${enc(shareFull)}` },
    { id: 'telegram', label: 'Telegram', href: `https://t.me/share/url?url=${enc(inviteUrl)}&text=${enc(shareText)}` },
    { id: 'facebook', label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(inviteUrl)}` },
    { id: 'email', label: 'Email', href: `mailto:?subject=${enc(c.shareSubject)}&body=${enc(shareFull)}` },
  ] : [];

  const copyInvite = async (): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      return true;
    } catch {
      return false;
    }
  };
  const shareCopy = async () => {
    track('workshop_invite_shared', { channel: 'copy', lang, variant });
    setShareNote((await copyInvite()) ? c.shareCopied : inviteUrl);
  };
  // O Instagram não tem endereço de partilha para páginas web: no telemóvel abre-se
  // a folha de partilha do sistema (onde o Instagram aparece), no computador
  // copia-se o link e abre-se a caixa de mensagens.
  const shareInstagram = async () => {
    track('workshop_invite_shared', { channel: 'instagram', lang, variant });
    if (typeof navigator.share === 'function' && window.matchMedia('(pointer: coarse)').matches) {
      try { await navigator.share({ title: c.shareSubject, text: `${shareText} ${c.shareMore}`, url: inviteUrl }); } catch { /* cancelado */ }
      return;
    }
    setShareNote((await copyInvite()) ? c.shareIgHint : inviteUrl);
    window.open('https://www.instagram.com/direct/inbox/', '_blank', 'noopener');
  };

  return (
    <div className="bg-bbq-black text-bbq-cream font-sans pb-24 md:pb-0">
      {/* HERO */}
      <section className="relative overflow-hidden border-b-4 border-bbq-yellow">
        <img
          src={`${IMG}/hero-1400.webp`}
          srcSet={`${IMG}/hero-800.webp 800w, ${IMG}/hero-1400.webp 1400w, ${IMG}/hero-1816.webp 1816w`}
          sizes="100vw"
          alt={c.heroAlt}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '72% center' }}
          fetchPriority="high"
        />
        {/* Computador: escuro à esquerda (texto), limpo à direita (grupo e brasa). Telemóvel: o texto ocupa a largura toda, por isso escurece de baixo para cima. */}
        <div className="absolute inset-0 hidden md:block" style={{ background: 'linear-gradient(to right, rgba(26,26,26,0.92) 0%, rgba(26,26,26,0.7) 35%, rgba(26,26,26,0.15) 65%, rgba(26,26,26,0) 100%), linear-gradient(to top, rgba(26,26,26,0.85) 0%, rgba(26,26,26,0) 45%)' }} />
        <div className="absolute inset-0 md:hidden" style={{ background: 'linear-gradient(to top, rgba(26,26,26,0.95) 0%, rgba(26,26,26,0.8) 45%, rgba(26,26,26,0.25) 80%, rgba(26,26,26,0.1) 100%)' }} />
        <div className="relative max-w-6xl mx-auto px-5 pb-16 min-h-[40rem] md:min-h-[40rem] pt-48 md:pt-8 flex flex-col justify-end gap-6">
          <div className="flex flex-col gap-6 max-w-[46rem]">
            <div>
              <span className="inline-block bg-bbq-yellow text-bbq-black border-2 border-bbq-black shadow-hard-sm px-3 py-1 font-black text-[10px] tracking-[0.05em] uppercase">{c.heroBadge}</span>
            </div>
            <h1 className="m-0 font-black uppercase tracking-tighter leading-[0.92] text-[clamp(2.75rem,9vw,6.5rem)]" style={{ textShadow: '6px 6px 0 #1a1a1a' }}>
              {c.h1}
            </h1>
            <p className="m-0 text-xl leading-snug font-medium max-w-xl">
              {c.heroP}
            </p>
            <div className="flex flex-wrap gap-2">
              {c.chips.map((chip) => (
                <span key={chip} className="border-2 border-bbq-cream px-3 py-1.5 font-black text-[0.8125rem] tracking-[0.08em] uppercase">{chip}</span>
              ))}
              <span className="bg-bbq-yellow text-bbq-black border-2 border-bbq-yellow px-3 py-1.5 font-black text-[0.8125rem] tracking-[0.08em] uppercase">{c.limited}</span>
            </div>
            {invite && (
              <div role="status" className="bg-bbq-yellow text-bbq-black border-4 border-bbq-black shadow-hard p-4 max-w-xl">
                <p className="m-0 font-black uppercase text-lg leading-tight">{c.inviteTitle(invite.firstName)}</p>
                <p className="m-0 mt-1 font-bold">{c.inviteBody(invite.invitePrice, invite.publicPrice)}</p>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-4">
              <Btn onClick={() => goForm('hero')}>{c.cta}</Btn>
              <span className="text-sm font-bold text-gray-400">{c.ctaNote}</span>
            </div>
          </div>
        </div>
      </section>

      {/* CONHECE O WORKSHOP */}
      <section id="workshop" className="bg-bbq-cream text-bbq-black border-b-4 border-bbq-yellow">
        <div className="max-w-6xl mx-auto px-5 py-20 flex flex-col gap-10">
          <div className="flex flex-col gap-4 max-w-[46rem]">
            <Eyebrow color="text-bbq-red">{c.meetEyebrow}</Eyebrow>
            <H2>{c.meetH2}</H2>
            <p className="m-0 text-lg leading-relaxed">{c.meetP1}</p>
            <p className="m-0 text-lg leading-relaxed">{c.meetP2}</p>
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(13rem, 1fr))' }}>
            {c.stats.map(([t, d]) => (
              <div key={t} className="bg-bbq-black text-bbq-cream border-4 border-bbq-black p-6 flex flex-col gap-2" style={{ boxShadow: '6px 6px 0 0 #d91a2a' }}>
                <span className="text-4xl leading-none font-black tracking-tight uppercase text-bbq-yellow">{t}</span>
                <span className="font-bold leading-snug">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APRENDER, COM CERVEJA NA MÃO */}
      <section className="bg-bbq-red text-white border-b-4 border-bbq-yellow">
        <div className="max-w-6xl mx-auto px-5 py-20 grid gap-10 items-center" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(18rem, 100%), 1fr))' }}>
          <div className="flex flex-col gap-5">
            <H2>{c.beerH2}</H2>
            <p className="m-0 text-lg leading-relaxed font-medium">{c.beerP}</p>
            <p className="m-0 font-black uppercase tracking-wide">{c.beerTag}</p>
          </div>
          <img
            src={`${IMG}/sal-opiniao-1000.webp`}
            srcSet={`${IMG}/sal-opiniao-600.webp 600w, ${IMG}/sal-opiniao-1000.webp 1000w`}
            sizes="(min-width: 768px) 50vw, 100vw"
            alt={c.beerAlt}
            className="w-full h-[28rem] object-cover border-4 border-bbq-black shadow-hard"
            style={{ objectPosition: 'center 40%' }}
            loading="lazy"
          />
        </div>
      </section>

      {/* O QUE VAIS DOMINAR */}
      <section className="max-w-6xl mx-auto px-5 py-20 flex flex-col gap-10">
        <div className="flex flex-col gap-4 max-w-[44rem]">
          <Eyebrow>{c.learnEyebrow}</Eyebrow>
          <H2>{c.learnH2}</H2>
          <p className="m-0 text-lg leading-normal">{c.learnP}</p>
        </div>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(16rem, 100%), 1fr))' }}>
          {c.learn.map((l, i) => (
            <div key={l.t} className="border-4 border-bbq-cream p-6 flex flex-col gap-2">
              <span aria-hidden="true" className="text-5xl leading-none font-black text-bbq-yellow">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="m-0 text-xl font-black uppercase tracking-tight">{l.t}</h3>
              <p className="m-0 leading-normal">{l.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMO CORRE A TARDE */}
      <section className="bg-bbq-cream text-bbq-black border-y-4 border-bbq-yellow">
        <div className="max-w-6xl mx-auto px-5 py-20 flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Eyebrow color="text-bbq-red">{c.flowEyebrow}</Eyebrow>
            <H2>{c.flowH2}</H2>
          </div>
          <ol className="m-0 p-0 list-none grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(11rem, 100%), 1fr))' }}>
            {c.steps.map((s, i) => {
              const last = i === c.steps.length - 1;
              return (
                <li key={s.t} className={`${last ? 'bg-bbq-yellow' : 'bg-white'} border-4 border-bbq-black shadow-hard p-5 flex flex-col gap-2`}>
                  <span className={`text-4xl leading-none font-black ${last ? 'text-bbq-black' : 'text-bbq-red'}`}>{i + 1}</span>
                  <h3 className="m-0 text-lg font-black uppercase">{s.t}</h3>
                  <p className="m-0 leading-normal">{s.d}</p>
                </li>
              );
            })}
          </ol>
          <img
            src={`${IMG}/mesa-longa-1400.webp`}
            srcSet={`${IMG}/mesa-longa-800.webp 800w, ${IMG}/mesa-longa-1400.webp 1400w`}
            sizes="(min-width: 1152px) 1152px, 100vw"
            alt={c.tableAlt}
            className="w-full h-[22rem] object-cover border-4 border-bbq-black shadow-hard"
            style={{ filter: 'saturate(1.15) sepia(0.12) contrast(1.05)' }}
            loading="lazy"
          />
        </div>
      </section>

      {/* O QUE ESTÁ INCLUÍDO + PREÇO */}
      <section className="max-w-6xl mx-auto px-5 py-20 grid gap-10 items-start" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(18rem, 100%), 1fr))' }}>
        <div className="flex flex-col gap-6">
          <Eyebrow>{c.inclEyebrow}</Eyebrow>
          <H2>{c.inclH2}</H2>
          <ul className="m-0 p-0 list-none flex flex-col gap-3 text-[1.0625rem] leading-snug">
            {c.included.map((x) => (
              <li key={x} className="flex gap-3 items-baseline"><span aria-hidden="true" className="text-bbq-yellow font-black">+</span><span>{x}</span></li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 text-[0.9375rem] leading-normal">
            <p className="m-0"><strong className="font-black uppercase tracking-wide">{c.when[0]}</strong> {c.when[1]}</p>
            <p className="m-0"><strong className="font-black uppercase tracking-wide">{c.where[0]}</strong> {c.where[1]}</p>
            <p className="m-0"><strong className="font-black uppercase tracking-wide">{c.spots[0]}</strong> {c.spots[1]}</p>
          </div>
        </div>
        <div className="bg-bbq-yellow text-bbq-black border-4 border-bbq-cream p-8 flex flex-col gap-4" style={{ boxShadow: '8px 8px 0 0 #d91a2a' }}>
          <span className="font-black text-sm tracking-[0.1em] uppercase">{invite ? c.priceLabelInvite : c.priceLabel}</span>
          <div className="flex items-end gap-4 flex-wrap">
            <span className="text-8xl leading-[0.9] font-black tracking-tighter">{price}</span>
            {invite && <span className="text-3xl font-black line-through opacity-60 mb-2" aria-label={c.insteadOf(prices.public)}>{c.money(prices.public)}</span>}
          </div>
          <span className="self-start bg-bbq-black text-bbq-yellow px-3 py-1.5 font-black text-sm tracking-[0.1em] uppercase">{c.vat}</span>
          <p className="m-0 font-bold leading-snug">{c.priceNote}</p>
          <Btn variant="dark" onClick={() => goForm('price')}>{c.cta}</Btn>
        </div>
      </section>

      {/* PITMASTERS */}
      <section className="border-t-4 border-bbq-cream">
        <div className="max-w-6xl mx-auto px-5 py-20 flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Eyebrow>{c.pmEyebrow}</Eyebrow>
            <H2>{c.pmH2}</H2>
            <p className="m-0 text-lg leading-normal">{c.pmP}</p>
          </div>
          <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(22rem, 100%), 1fr))' }}>
            {c.pitmasters.map((p) => (
              <div key={p.n} className="flex flex-wrap gap-5 items-start">
                <img src={`${IMG}/${p.img}`} alt={c.pmAlt(p.n)} width={208} height={208} loading="lazy" className="w-52 h-52 flex-none object-cover border-4 border-bbq-cream" />
                <div className="flex-[1_1_13rem] min-w-0 flex flex-col gap-2">
                  <h3 className="m-0 text-2xl font-black uppercase">{p.n}</h3>
                  <p className="m-0 leading-normal">{p.bio}</p>
                  <p lang={p.lang} className="m-0 leading-tight font-black text-lg uppercase text-bbq-yellow">{p.q}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-bbq-cream text-bbq-black border-t-4 border-bbq-yellow">
        <div className="max-w-3xl mx-auto px-5 py-20 flex flex-col gap-8">
          <H2>{c.faqH2}</H2>
          <div className="flex flex-col gap-3">
            {c.faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className="bg-white border-4 border-bbq-black">
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    className="w-full min-h-[56px] flex justify-between items-center gap-4 px-5 py-4 bg-transparent border-0 cursor-pointer text-[1.0625rem] font-black uppercase text-left text-bbq-black"
                  >
                    <span>{f.q}</span>
                    <span aria-hidden="true" className="text-2xl text-bbq-red">{open ? '−' : '+'}</span>
                  </button>
                  {open && <p className="m-0 px-5 pb-5 leading-relaxed text-gray-600">{f.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WORKSHOPS RECENTES */}
      <section id="calendario" className="bg-bbq-cream text-bbq-black border-t-4 border-bbq-yellow">
        <div className="max-w-6xl mx-auto px-5 py-20 flex flex-col gap-8">
          <div className="flex flex-col gap-4 max-w-[44rem]">
            <Eyebrow color="text-bbq-red">{c.calEyebrow}</Eyebrow>
            <H2>{c.calH2}</H2>
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(14rem, 100%), 1fr))' }}>
            <div className="bg-bbq-red text-white border-4 border-bbq-black shadow-hard p-5 flex flex-col gap-3">
              <span className="font-black text-xs tracking-[0.1em] uppercase">{c.calNext}</span>
              <span className="text-2xl leading-tight font-black uppercase tracking-tight">{c.calMonths}</span>
              <span className="font-bold text-[0.9375rem] leading-snug">{c.calNextNote}</span>
              <button type="button" onClick={() => goForm('calendar')} className="mt-auto self-start bg-bbq-yellow text-bbq-black border-2 border-bbq-black shadow-hard-sm px-4 py-2 min-h-[44px] font-black text-xs tracking-[0.1em] uppercase">{c.cta}</button>
            </div>
            {c.recent.map((r) => (
              <div key={r.d} className="bg-white border-4 border-bbq-black p-5 flex flex-col gap-3">
                <div className="flex justify-between items-start gap-3">
                  <span className="text-2xl leading-none font-black uppercase tracking-tight">{r.d}</span>
                  <span className="flex-none bg-bbq-red text-white px-2 py-1 font-black text-xs tracking-[0.08em] uppercase">{c.soldOut}</span>
                </div>
                <span className="font-black uppercase leading-tight">{r.s}</span>
                <span className="font-bold text-sm text-gray-600">{c.calMeta}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WAITING LIST */}
      <section id="reserva" ref={formRef} className="border-t-4 border-bbq-black scroll-mt-24">
        <div className="max-w-2xl mx-auto px-5 py-20 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Eyebrow>{c.formEyebrow}</Eyebrow>
            <H2>{c.formH2}</H2>
            <p className="m-0 text-[1.0625rem] leading-normal">{c.formP}</p>
          </div>

          {done ? (
            <>
              <div role="status" className="bg-bbq-yellow text-bbq-black border-4 border-bbq-cream p-8 flex flex-col gap-3" style={{ boxShadow: '8px 8px 0 0 #d91a2a' }}>
                <span className="text-3xl font-black uppercase tracking-tight">{c.doneTitle(done.firstName)}</span>
                <p className="m-0 text-lg leading-normal font-bold">
                  {done.duplicate ? c.doneDup : c.doneNew}
                </p>
              </div>
              {canShare && (
                <div className="border-4 border-bbq-yellow p-6 flex flex-col gap-4">
                  <p className="m-0 font-black uppercase text-xl leading-tight text-bbq-yellow">{c.inviteBoxTitle}</p>
                  <p className="m-0 leading-normal">{c.inviteBoxText(done.invitePrice!, done.publicPrice!)}</p>
                  <p className="m-0 leading-normal">{c.inviteBoxMore(done.invitePrice!)}</p>
                  <span className="font-black text-sm tracking-[0.1em] uppercase">{c.shareLabel}</span>
                  <div className="flex flex-wrap gap-2">
                    {shareChannels.map((ch) => (
                      <a
                        key={ch.id}
                        href={ch.href}
                        target={ch.id === 'email' ? undefined : '_blank'}
                        rel="noopener noreferrer"
                        onClick={() => track('workshop_invite_shared', { channel: ch.id, lang, variant })}
                        className={shareBtn}
                      >
                        {ch.label}
                      </a>
                    ))}
                    <button type="button" onClick={shareInstagram} className={shareBtn}>Instagram</button>
                    <button type="button" onClick={shareCopy} className={shareBtn}>{c.shareCopy}</button>
                  </div>
                  <p role="status" className="m-0 text-sm font-bold break-all min-h-[1.25rem]">{shareNote}</p>
                </div>
              )}
            </>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-6">
              {/* honeypot */}
              <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
                <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set('website')(e.target.value)} /></label>
              </div>
              <label className="flex flex-col gap-2">
                <span className="font-black text-sm tracking-[0.1em] uppercase">{c.lName}</span>
                <input className={inputCls} type="text" autoComplete="name" placeholder={c.phName} value={form.name} onChange={(e) => set('name')(e.target.value)} />
              </label>
              <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(15rem, 100%), 1fr))' }}>
                <label className="flex flex-col gap-2">
                  <span className="font-black text-sm tracking-[0.1em] uppercase">{c.lEmail}</span>
                  <input className={inputCls} type="email" autoComplete="email" inputMode="email" placeholder="nome@email.pt" value={form.email} onChange={(e) => set('email')(e.target.value)} />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="font-black text-sm tracking-[0.1em] uppercase">{c.lPhone}</span>
                  <input className={inputCls} type="tel" autoComplete="tel" inputMode="tel" placeholder="912 345 678" value={form.phone} onChange={(e) => set('phone')(e.target.value)} />
                </label>
              </div>
              <Choice label={c.qSlot} options={opts(SLOTS)} value={form.slot} onChange={set('slot')} />
              <Choice label={c.qExp} options={opts(LEVELS)} value={form.exp} onChange={set('exp')} />
              <Choice label={c.qMotive} options={opts(MOTIVES)} value={form.motive} onChange={set('motive')} />
              <label className="flex flex-col gap-2">
                <span className="font-black text-sm tracking-[0.1em] uppercase">{c.qSource}</span>
                <select className={`${inputCls} min-h-[64px] text-lg rounded-none`} value={form.source} onChange={(e) => set('source')(e.target.value)}>
                  <option value="">{c.pickOne}</option>
                  {SOURCES.map((o) => <option key={o.value} value={o.value}>{o[lang]}</option>)}
                </select>
              </label>
              <label className="flex gap-3 items-start cursor-pointer leading-normal text-[0.9375rem]">
                <input type="checkbox" checked={form.consent} onChange={(e) => set('consent')(e.target.checked)} className="w-6 h-6 m-0 flex-none accent-[#f4b41a]" />
                <span>{c.consentBefore}<a href="mailto:pitmasters@lisbonbbq.pt" className="text-bbq-yellow underline">pitmasters@lisbonbbq.pt</a>{c.consentMid}<a href="/privacy" className="text-bbq-yellow underline">{c.consentLink}</a>{c.consentAfter}</span>
              </label>
              {error && <p role="alert" className="m-0 px-4 py-3 border-4 border-bbq-yellow font-bold leading-snug">{error}</p>}
              <div><Btn type="submit" disabled={sending}>{sending ? c.sending : c.submit}</Btn></div>
              <p className="m-0 text-sm leading-normal text-gray-400">{c.formNote}</p>
            </form>
          )}
        </div>
      </section>

      {/* CTA fixo no telemóvel */}
      {!done && !hideSticky && (
        <div className="md:hidden fixed left-0 right-0 bottom-0 z-40 px-4 pt-3 bg-bbq-black border-t-4 border-bbq-yellow" style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}>
          <Btn className="w-full" onClick={() => goForm('sticky')}>{c.stickyCta(price)}</Btn>
        </div>
      )}
    </div>
  );
};
