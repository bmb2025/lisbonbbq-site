
import React from 'react';
import { MapPin, Quote, Globe, ChefHat, Flame, Check, Camera, ImageOff, HelpCircle } from 'lucide-react';

interface LangProp {
  lang: 'pt' | 'en';
}

export const LogoBar: React.FC<LangProp> = ({ lang }) => {
  const logos = ["LISBON BARBECUE & CHURRASCO", "DESDE 2016", "700+ EVENTOS", "AUTÊNTICO", "LISBOA", "SERVIÇO PREMIUM"];
  return (
    <div className="bg-bbq-yellow border-b-4 border-bbq-black overflow-hidden py-3">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...logos, ...logos, ...logos].map((logo, i) => (
          <span key={i} className="text-xl font-black mx-8 uppercase tracking-widest text-bbq-black flex items-center gap-4">
            {logo} <span className="w-2 h-2 rounded-full bg-bbq-black" />
          </span>
        ))}
      </div>
    </div>
  );
};

export const PackageCard: React.FC<{ onBook: () => void, lang: 'pt' | 'en', customImage?: string }> = ({ onBook, lang, customImage }) => {
  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
    const parent = e.currentTarget.parentElement;
    if (parent) {
      parent.classList.add('flex', 'items-center', 'justify-center', 'bg-gradient-to-br', 'from-gray-100', 'to-gray-200');
    }
  };

  const features = [
    { pt: 'Carnes selecionadas', en: 'Selected Meats' },
    { pt: 'Acompanhamentos frescos', en: 'Fresh Sides' },
    { pt: 'Grelha profissional & utensílios', en: 'Professional Grill & Utensils' },
    { pt: 'Carvão e consumíveis', en: 'Charcoal & Supplies' },
    { pt: 'Os locais mais incríveis em Lisboa', en: 'The most amazing spots in Lisbon' },
  ];

  return (
    <section className="py-16 px-4 bg-bbq-cream">
      <div className="max-w-6xl mx-auto">
        <div className="relative group cursor-pointer" onClick={onBook}>
          <div className="absolute top-0 left-0 w-full h-full bg-bbq-black translate-x-4 translate-y-4 -z-10 transition-transform group-hover:translate-x-6 group-hover:translate-y-6"></div>
          <div className="bg-white border-4 border-bbq-black overflow-hidden flex flex-col md:flex-row items-stretch">
            <div className="w-full md:w-1/2 h-80 md:h-auto overflow-hidden relative border-b-4 md:border-b-0 md:border-r-4 border-bbq-black bg-gray-50">
              <img 
                src={customImage || "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200"} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                alt={lang === 'pt' ? "Evento de churrasco premium ao ar livre em Lisboa com mestre churrasqueiro e carnes no fogo" : "Premium outdoor BBQ event in Lisbon with pitmaster and meats on the fire"} 
                onError={handleImgError}
              />
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                 <ImageOff className="text-gray-300" size={48} />
              </div>
              <div className="absolute top-4 left-4 bg-bbq-yellow text-bbq-black px-4 py-1 font-black uppercase text-xs border-2 border-bbq-black shadow-hard-sm">
                Stress-Free
              </div>
            </div>
            <div className="p-10 flex-1 flex flex-col justify-center">
               <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 leading-none">
                 {lang === 'pt' ? 'Chegar, grelhar' : 'Show up, grill'}<br/>
                 <span className="text-bbq-red">{lang === 'pt' ? 'e viver!' : '& live it up!'}</span>
               </h3>
               <p className="text-lg font-bold uppercase text-gray-400 mb-8 tracking-wide">
                 {lang === 'pt' 
                   ? 'Nós tratamos de tudo. Tu só tens de aparecer e brilhar no grelhador.' 
                   : 'We handle the mess. You just show up and master the grill.'}
               </p>
               <div className="space-y-3 mb-10">
                  {features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 font-black uppercase text-sm">
                      <Check className="text-bbq-red shrink-0" strokeWidth={4} size={18} /> {lang === 'pt' ? f.pt : f.en}
                    </div>
                  ))}
               </div>
               <button onClick={onBook} className="bg-bbq-black text-white py-5 font-black uppercase text-xl shadow-hard hover:bg-bbq-red transition-colors flex items-center justify-center gap-3 w-full md:w-auto px-12">
                 {lang === 'pt' ? 'Reservar Agora' : 'Book Now'} <Flame size={24}/>
               </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const BrandStory: React.FC<LangProp> = ({ lang }) => {
  return (
    <section className="py-24 px-4 bg-white border-y-4 border-bbq-black">
      <div className="max-w-4xl mx-auto text-center">
         <div className="flex justify-center mb-8">
            <ChefHat size={80} className="text-bbq-black" />
         </div>
         <h2 className="text-4xl md:text-6xl font-black uppercase mb-8 tracking-tighter leading-none">
           {lang === 'pt' 
             ? 'Montamos o cenário perfeito para um convívio perfeito' 
             : 'Setting the perfect stage for a perfect gathering'}
         </h2>
         <p className="text-xl md:text-2xl font-bold uppercase text-gray-500 tracking-widest leading-relaxed">
           {lang === 'pt'
             ? 'Fogo aceso. Mesas longas. Conversas que acabam tarde.'
             : 'Fire lit. Long tables. Late-night talks.'}
         </p>
      </div>
    </section>
  );
};

export const VenueGrid: React.FC<LangProp & { customImages?: string[] }> = ({ lang, customImages = [] }) => {
  const steps = [
    { 
      pt: "Dizes-nos quando, onde e quantas pessoas", 
      en: "Tell us when, where and how many guests" 
    },
    { 
      pt: "Escolhe as carnes e nós preparamos o churrasco", 
      en: "Choose the meats and we prep the BBQ" 
    },
    { 
      pt: "Sê um super anfitrião e diverte-te!", 
      en: "Be a super host and have fun!" 
    }
  ];

  return (
    <section id="como-funciona" className="py-24 px-4 bg-bbq-cream">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-baseline gap-4 mb-12">
          <h2 className="text-5xl font-black uppercase tracking-tighter">
            {lang === 'pt' ? 'Como funciona' : 'How it works'}
          </h2>
          <div className="h-1 flex-1 bg-bbq-black"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {customImages.slice(0, 3).map((img, i) => (
            <div 
              key={i} 
              className="group relative aspect-[4/5] border-4 border-bbq-black shadow-hard overflow-hidden bg-bbq-black"
            >
              <img 
                src={img} 
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-1000" 
                alt={`${steps[i]?.[lang] || ''} - Lisbon Barbecue Service Visual Step ${i + 1}`} 
              />
              <div className="absolute top-4 left-4 bg-bbq-black text-bbq-yellow w-12 h-12 flex items-center justify-center font-black text-2xl border-2 border-bbq-yellow shadow-hard-sm">
                0{i + 1}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-bbq-yellow border-t-4 border-bbq-black p-6">
                <h3 className="text-xl font-black uppercase tracking-tighter text-bbq-black text-center">
                  {steps[i]?.[lang] || ''}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Referrals: React.FC<LangProp> = ({ lang }) => {
  const testimonials = [
    { name: 'Ricardo S.', text: lang === 'pt' ? 'O melhor churrasco que já organizei em Lisboa. O local em Monsanto é mágico.' : 'The best BBQ I ever organized in Lisbon. The Monsanto spot is magical.' },
    { name: 'Elena G.', text: lang === 'pt' ? 'Qualidade da carne impecável. O concierge tratou de todos os detalhes.' : 'Meat quality was flawless. The concierge handled every single detail.' },
  ];

  return (
    <section className="py-24 px-4 bg-bbq-red text-white overflow-hidden">
       <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="md:w-1/3">
             <h2 className="text-6xl font-black uppercase tracking-tighter leading-none mb-6">
               {lang === 'pt' ? 'O Que Dizem' : 'Word on'} <br/>
               <span className="text-bbq-yellow">{lang === 'pt' ? 'Os Nossos Mestres' : 'The Street'}</span>
             </h2>
             <div className="bg-white text-bbq-black p-4 inline-block font-black uppercase text-sm border-4 border-bbq-black shadow-hard-sm">
                700+ Clientes Felizes
             </div>
          </div>
          <div className="flex-1 grid md:grid-cols-2 gap-8">
             {testimonials.map((t, i) => (
               <div key={i} className="bg-bbq-black p-8 border-4 border-white relative shadow-hard">
                  <Quote size={40} className="text-bbq-yellow mb-6" />
                  <p className="text-lg font-bold uppercase tracking-wide leading-relaxed mb-6 italic">
                    "{t.text}"
                  </p>
                  <div className="font-black uppercase text-bbq-yellow tracking-widest">— {t.name}</div>
               </div>
             ))}
          </div>
       </div>
    </section>
  );
};
