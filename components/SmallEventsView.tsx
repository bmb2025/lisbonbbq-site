import React from 'react';
import { Users, Check, Flame, MapPin, ArrowRight } from 'lucide-react';
import { LOCATIONS } from '../constants';

interface SmallEventsViewProps {
  lang: 'pt' | 'en';
  onBook: () => void;
  onCorporate: () => void;
}

// Landing: "espaço para eventos pequenos em Lisboa" — small-capacity venues.
// GEO pattern: direct answer up top, citable numbers, visible FAQs backed by
// FAQPage JSON-LD, and a clear path into the booking funnel.
export const SmallEventsView: React.FC<SmallEventsViewProps> = ({ lang, onBook, onCorporate }) => {
  const pt = lang === 'pt';

  // Small venues = capacity ceiling up to ~100 guests.
  const smallVenues = LOCATIONS.filter(l => l.maxGuests <= 100);

  const faqs = [
    {
      q: pt ? 'Qual é o número mínimo de pessoas?' : 'What is the minimum group size?',
      a: pt
        ? 'O mínimo são 20 convidados. Os nossos espaços para grupos pequenos recebem entre 20 e 100 pessoas.'
        : 'The minimum is 20 guests. Our small-event venues host between 20 and 100 people.',
    },
    {
      q: pt ? 'Que espaços têm para eventos pequenos em Lisboa?' : 'Which venues do you have for small events in Lisbon?',
      a: pt
        ? 'Carnide (20–40 pessoas), Alvito (20–60), Marvila (30–80, às segundas-feiras) e Restelo (20–100). Todos são espaços privados, reservados em exclusivo para o teu grupo.'
        : 'Carnide (20–40 guests), Alvito (20–60), Marvila (30–80, on Mondays) and Restelo (20–100). All are private venues, reserved exclusively for your group.',
    },
    {
      q: pt ? 'O que está incluído?' : 'What is included?',
      a: pt
        ? 'Espaço privado, grelhador a carvão, carvão, carne, acompanhamentos, bebidas no frio, mesa posta, utensílios e limpeza. Só tens de aparecer.'
        : 'Private venue, charcoal grill, charcoal, meat, sides, cold drinks, table setup, utensils and cleanup. You just show up.',
    },
    {
      q: pt ? 'Quanto custa?' : 'How much does it cost?',
      a: pt
        ? 'A partir de 35€ por pessoa, com comida, bebida e espaço incluídos. O orçamento final depende do número de convidados e dos extras.'
        : 'From €35 per person, including food, drinks and the venue. The final quote depends on guest count and extras.',
    },
    {
      q: pt ? 'Serve para eventos de empresa?' : 'Does it work for company events?',
      a: pt
        ? 'Sim — organizamos team buildings, festas de equipa e convívios de empresa para grupos pequenos. Vê a página de eventos corporativos.'
        : 'Yes — we organize team buildings and company gatherings for small groups. See our corporate events page.',
    },
    {
      q: pt ? 'Preciso de organizar alguma coisa?' : 'Do I need to organize anything?',
      a: pt
        ? 'Não. Escolhes a data, o espaço e a tradição de churrasco — nós montamos tudo antes de chegares e limpamos no fim.'
        : 'No. Pick the date, venue and barbecue tradition — we set everything up before you arrive and clean up afterwards.',
    },
  ];

  const faqJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }).replace(/</g, '\\u003c');

  const venuesJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: pt ? 'Espaços para eventos pequenos em Lisboa' : 'Small event venues in Lisbon',
    itemListElement: smallVenues.map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Place',
        name: `LisbonBBQ ${l.name}`,
        description: l.description,
        address: { '@type': 'PostalAddress', addressLocality: 'Lisboa', addressCountry: 'PT' },
        maximumAttendeeCapacity: l.maxGuests,
      },
    })),
  }).replace(/</g, '\\u003c');

  const included = pt
    ? ['Espaço privado só para o teu grupo', 'Grelhador a carvão e utensílios', 'Carne e acompanhamentos', 'Bebidas no frio', 'Mesa posta e descartáveis', 'Montagem e limpeza incluídas']
    : ['Private venue just for your group', 'Charcoal grill and utensils', 'Meat and sides', 'Cold drinks', 'Table setup and disposables', 'Setup and cleanup included'];

  return (
    <div className="bg-bbq-cream min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: venuesJsonLd }} />

      {/* HERO — H1 with the target keyword + direct answer (GEO) */}
      <section className="bg-white border-b-4 border-bbq-black px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
            {pt ? 'Espaço para Eventos Pequenos em Lisboa' : 'Small Event Venues in Lisbon'}
          </h1>
          <div className="h-2 w-24 bg-bbq-red mx-auto mb-8" />
          {/* Direct answer — the 2-3 sentences an answer engine can lift verbatim */}
          <p className="text-lg md:text-xl font-bold text-gray-600 leading-relaxed max-w-3xl mx-auto mb-10">
            {pt
              ? 'A LisbonBBQ reserva espaços privados em Lisboa para grupos de 20 a 100 pessoas, com churrasco, bebidas e logística incluídos — a partir de 35€/pessoa. Escolhes a data e o espaço; quando chegas, está tudo montado.'
              : 'LisbonBBQ books private venues in Lisbon for groups of 20 to 100 people, with barbecue, drinks and logistics included — from €35/person. Pick a date and a venue; when you arrive, everything is set up.'}
          </p>
          <button onClick={onBook} className="bg-bbq-red text-white px-12 py-6 font-black uppercase text-xl border-4 border-bbq-black shadow-hard hover:bg-bbq-black transition-all inline-flex items-center gap-3">
            {pt ? 'Ver Datas Disponíveis' : 'Check Available Dates'} <Flame size={24} />
          </button>
        </div>
      </section>

      {/* CITABLE FACTS strip */}
      <section className="bg-bbq-yellow border-b-4 border-bbq-black px-6 py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { n: '20–100', l: pt ? 'pessoas por evento' : 'guests per event' },
            { n: '35€', l: pt ? 'por pessoa, tudo incluído' : 'per person, all included' },
            { n: '700+', l: pt ? 'eventos realizados' : 'events hosted' },
          ].map((f, i) => (
            <div key={i} className="bg-white border-4 border-bbq-black p-6 shadow-hard-sm">
              <div className="text-4xl font-black">{f.n}</div>
              <div className="text-[11px] font-black uppercase tracking-widest text-gray-500 mt-1">{f.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* VENUES — the actual small-capacity spaces */}
      <section className="px-6 py-20 bg-white border-b-4 border-bbq-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4">
            {pt ? 'Os espaços para grupos pequenos' : 'Our small-group venues'}
          </h2>
          <p className="text-sm font-bold uppercase text-gray-400 tracking-widest mb-12">
            {pt ? 'Privados e reservados em exclusivo para o teu evento' : 'Private and reserved exclusively for your event'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {smallVenues.map(loc => (
              <div key={loc.id} className="border-4 border-bbq-black bg-white shadow-hard flex flex-col">
                <div className="aspect-[4/3] overflow-hidden border-b-4 border-bbq-black relative">
                  <img src={loc.images[0]} alt={`${pt ? 'Espaço para eventos pequenos' : 'Small event venue'} — ${loc.name}, Lisboa`} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute top-4 left-4 bg-bbq-yellow border-2 border-bbq-black px-3 py-1 text-[10px] font-black uppercase shadow-hard-sm flex items-center gap-1">
                    <Users size={12} /> {loc.minGuests}–{loc.maxGuests} {pt ? 'pessoas' : 'guests'}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">{loc.name}</h3>
                  <p className="text-xs font-bold uppercase text-gray-500 leading-relaxed flex-1">{loc.description}</p>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-60 mt-4">
                    <MapPin size={12} /> Lisboa
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="px-6 py-20 bg-bbq-cream border-b-4 border-bbq-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-12 text-center">
            {pt ? 'Tudo incluído, zero trabalho' : 'All included, zero effort'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {included.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white border-4 border-bbq-black p-4 shadow-hard-sm">
                <Check className="text-bbq-red shrink-0" strokeWidth={4} size={20} />
                <span className="font-black uppercase text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — visible questions matching the FAQPage JSON-LD */}
      <section className="px-6 py-20 bg-white border-b-4 border-bbq-black">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-12 text-center">
            {pt ? 'Perguntas Frequentes' : 'Frequently Asked Questions'}
          </h2>
          <div className="space-y-6">
            {faqs.map((f, i) => (
              <div key={i} className="border-4 border-bbq-black p-6 bg-white shadow-hard-sm">
                <h3 className="font-black uppercase text-sm mb-2 flex items-start gap-2">
                  <span className="text-bbq-red">Q:</span> {f.q}
                </h3>
                <p className="font-bold text-gray-600 text-sm pl-6 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL + internal links */}
      <section className="px-6 py-24 bg-bbq-red text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-10 text-bbq-cream leading-tight">
            {pt ? 'Reserva o espaço para o teu evento' : 'Book the venue for your event'}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={onBook} className="bg-bbq-black text-white px-10 py-5 font-black uppercase text-lg border-4 border-bbq-black shadow-hard hover:bg-white hover:text-bbq-black transition-all">
              {pt ? 'Pedir Orçamento' : 'Get a Quote'}
            </button>
            <button onClick={onCorporate} className="bg-white text-bbq-black px-10 py-5 font-black uppercase text-lg border-4 border-bbq-black shadow-hard hover:bg-bbq-yellow transition-all inline-flex items-center justify-center gap-2">
              {pt ? 'Eventos Corporativos' : 'Corporate Events'} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
