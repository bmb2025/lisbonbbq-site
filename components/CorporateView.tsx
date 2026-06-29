
import React, { useState, useEffect } from 'react';
import { 
  Users, MapPin, CheckCircle2, Flame, Camera, 
  MessageCircle, Send, Check, X, Info, 
  Clock, ShieldCheck, Heart, Coffee, Utensils
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LOCATIONS } from '../constants';
import { cloudService } from '../services/cloudService';

interface CorporateViewProps {
  lang: 'pt' | 'en';
  onBack: () => void;
  onSubmit: (data: any) => Promise<boolean>;
  isSending: boolean;
}

export const CorporateView: React.FC<CorporateViewProps> = ({ lang, onBack, onSubmit, isSending }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    guests: '10-20',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const internalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    const success = await onSubmit(formData);
    if (success) {
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', company: '', guests: '10-20', message: '' });
    } else {
      setError(true);
    }
  };
  // SEO & GEO Optimization: JSON-LD Structured Data
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    const schema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Lisbon BBQ Team Building",
      "serviceType": "Team building",
      "provider": {
        "@type": "Organization",
        "name": "Lisbon BBQ",
        "url": window.location.origin
      },
      "areaServed": {
        "@type": "City",
        "name": "Lisbon"
      },
      "description": "Serviço de organização de team building em Lisboa, focado em churrascos privados para empresas com tudo incluído."
    };
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const t = {
    heroTitle: lang === 'pt' ? 'Team building em Lisboa, sem complicações' : 'Team building in Lisbon, hassle-free',
    heroSub: lang === 'pt' 
      ? 'Organizamos churrascos completos para equipas — espaço, grelhador, bebidas e logística incluídos.'
      : 'We organize complete BBQs for teams — venue, grill, drinks, and logistics included.',
    ctaPrimary: lang === 'pt' ? 'Pedir Proposta' : 'Request Proposal',
    ctaSecondary: lang === 'pt' ? 'Ver opções de evento' : 'View Event Options',
    definition: lang === 'pt'
      ? 'Lisbon BBQ é um serviço de organização de eventos para empresas em Lisboa, especializado em team building com churrascos privados.'
      : 'Lisbon BBQ is a corporate event organization service in Lisbon, specialized in team building with private BBQs.',
    forWhom: {
      title: lang === 'pt' ? 'Para quem é' : 'Who is it for',
      items: [
        lang === 'pt' ? 'Equipas de 10 a 80 pessoas' : 'Teams of 10 to 80 people',
        lang === 'pt' ? 'Empresas que querem eventos informais' : 'Companies looking for informal events',
        lang === 'pt' ? 'Convívios, celebrações, onboarding, offsites' : 'Gatherings, celebrations, onboarding, offsites'
      ]
    },
    included: {
      title: lang === 'pt' ? 'O que está incluído' : 'What is included',
      items: [
        lang === 'pt' ? 'Espaço reservado' : 'Reserved space',
        lang === 'pt' ? 'Grelhador + carvão' : 'Grill + charcoal',
        lang === 'pt' ? 'Utensílios e descartáveis' : 'Utensils and disposables',
        lang === 'pt' ? 'Bebidas' : 'Drinks',
        lang === 'pt' ? 'Setup e limpeza' : 'Setup and cleanup'
      ]
    },
    howItWorks: {
      title: lang === 'pt' ? 'Como funciona' : 'How it works',
      steps: [
        { t: lang === 'pt' ? 'Escolher data e local' : 'Choose date and venue' },
        { t: lang === 'pt' ? 'Confirmar reserva' : 'Confirm reservation' },
        { t: lang === 'pt' ? 'Aparecer — tudo preparado' : 'Show up — everything ready' }
      ]
    },
    comparison: {
      title: lang === 'pt' ? 'Diferenciação' : 'Differentiation',
      columns: [
        { name: lang === 'pt' ? 'Restaurante' : 'Restaurant', items: [lang === 'pt' ? 'Baixa interação' : 'Low interaction', lang === 'pt' ? 'Experiência standard' : 'Standard experience'] },
        { name: lang === 'pt' ? 'Evento tradicional' : 'Traditional Event', items: [lang === 'pt' ? 'Complexo de organizar' : 'Complex to organize', lang === 'pt' ? 'Custo elevado' : 'High cost'] },
        { name: 'Lisbon BBQ', items: [lang === 'pt' ? 'Social e informal' : 'Social and informal', lang === 'pt' ? 'Logística resolvida' : 'Logistics solved', lang === 'pt' ? 'Formato simples' : 'Simple format'] }
      ]
    },
    pricingTitle: lang === 'pt' ? 'Investimento' : 'Investment',
    pricingAnchor: lang === 'pt' ? 'A partir de 35€/pessoa' : 'From 35€/person',
    faqTitle: lang === 'pt' ? 'FAQs (Perguntas Frequentes)' : 'FAQs (Frequently Asked Questions)',
    faqs: [
      { q: lang === 'pt' ? 'O que é o Lisbon BBQ?' : 'What is Lisbon BBQ?', a: lang === 'pt' ? 'Serviço de team building com churrasco incluído.' : 'Team building service with BBQ included.' },
      { q: lang === 'pt' ? 'O que está incluído num evento?' : 'What is included in an event?', a: lang === 'pt' ? 'Espaço, grelhador, bebidas, logística completa.' : 'Venue, grill, drinks, full logistics.' },
      { q: lang === 'pt' ? 'Para que tipo de empresas é indicado?' : 'What type of companies is it for?', a: lang === 'pt' ? 'Equipas de 10–80 pessoas.' : 'Teams of 10–80 people.' },
      { q: lang === 'pt' ? 'Onde são realizados os eventos?' : 'Where are the events held?', a: lang === 'pt' ? 'Em locais pré-definidos na zona de Lisboa.' : 'In pre-defined locations in the Lisbon area.' },
      { q: lang === 'pt' ? 'É necessário organizar alguma coisa internamente?' : 'Do I need to organize anything internally?', a: lang === 'pt' ? 'Não. O serviço é completo.' : 'No. It is a full service.' }
    ]
  };

  return (
    <div className="min-h-screen bg-bbq-cream font-sans text-bbq-black selection:bg-bbq-red selection:text-white">
      {/* 8. SEO (ON-PAGE) - Hidden keywords for indexers if needed, but headlines below cover it */}
      
      {/* 12. Floating WhatsApp */}
      <a 
        href="https://wa.me/351961058571" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-hard transition-transform hover:scale-110 flex items-center justify-center"
      >
        <MessageCircle size={24} />
      </a>

      {/* 6.1 HERO */}
      <section className="relative px-6 py-20 md:py-32 border-b-4 border-bbq-black overflow-hidden bg-white">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6 italic">
              {t.heroTitle}
            </h1>
            <p className="text-xl md:text-2xl font-bold uppercase tracking-tight text-gray-600 mb-10 max-w-2xl mx-auto">
              {t.heroSub}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={onBack}
                className="bg-bbq-red text-white px-10 py-5 font-black uppercase text-lg border-4 border-bbq-black shadow-hard hover:bg-bbq-yellow hover:text-bbq-black transition-all transform hover:-translate-y-1"
              >
                {t.ctaPrimary}
              </button>
              <button 
                onClick={() => document.getElementById('venues')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-bbq-black px-10 py-5 font-black uppercase text-lg border-4 border-bbq-black shadow-hard hover:bg-gray-50 transition-all transform hover:-translate-y-1"
              >
                {t.ctaSecondary}
              </button>
            </div>
          </motion.div>
        </div>
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:20px_20px]" />
      </section>

      {/* 6.2 DEFINITION (CRITICAL FOR GEO) */}
      <section className="bg-bbq-yellow py-12 px-6 border-b-4 border-bbq-black">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg md:text-xl font-bold uppercase tracking-wide leading-relaxed">
            {t.definition}
          </p>
        </div>
      </section>

      {/* 6.3 FOR WHOM & 6.4 WHAT IS INCLUDED */}
      <section className="grid grid-cols-1 md:grid-cols-2 border-b-4 border-bbq-black">
        <div className="p-8 md:p-16 border-b-4 md:border-b-0 md:border-r-4 border-bbq-black bg-white">
          <h2 className="text-3xl font-black uppercase italic mb-8">{t.forWhom.title}</h2>
          <ul className="space-y-4">
            {t.forWhom.items.map((item, i) => (
              <li key={i} className="flex gap-4 items-start">
                <CheckCircle2 className="text-bbq-red mt-1 shrink-0" size={20} />
                <span className="font-bold uppercase text-sm tracking-tight">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-8 md:p-16 bg-bbq-cream">
          <h2 className="text-3xl font-black uppercase italic mb-8">{t.included.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {t.included.items.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <Check className="text-bbq-red font-black" size={24} />
                <span className="font-black uppercase text-xs tracking-widest">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6.5 HOW IT WORKS */}
      <section className="py-20 px-6 bg-white border-b-4 border-bbq-black">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-16 italic">{t.howItWorks.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-[60px] left-[20%] right-[20%] h-1 border-t-4 border-dashed border-bbq-black opacity-20" />
            {t.howItWorks.steps.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-bbq-red text-white flex items-center justify-center font-black text-2xl border-4 border-bbq-black shadow-hard-sm mb-6">
                  {i + 1}
                </div>
                <p className="font-black uppercase tracking-widest text-sm leading-tight max-w-[150px]">
                  {step.t}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6.6 DIFFERENTIATION (COMPARISON) */}
      <section className="py-20 px-6 bg-bbq-cream border-b-4 border-bbq-black">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-16 italic text-center">{t.comparison.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.comparison.columns.map((col, i) => (
              <div 
                key={i} 
                className={`p-8 border-4 border-bbq-black shadow-hard ${i === 2 ? 'bg-bbq-yellow' : 'bg-white'}`}
              >
                <div className="flex items-center gap-2 mb-6">
                  {i === 2 && <Flame size={20} className="fill-bbq-red" />}
                  <h3 className="font-black uppercase text-xl italic">{col.name}</h3>
                </div>
                <ul className="space-y-4">
                  {col.items.map((item, j) => (
                    <li key={j} className="flex gap-3 items-center">
                      {i === 2 ? <Check size={16} /> : <X size={16} className="text-gray-300" />}
                      <span className={`font-bold uppercase text-[10px] tracking-widest ${i === 2 ? 'text-bbq-black' : 'text-gray-500'}`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6.7 LOCALS AVAILABLE */}
      <section id="venues" className="py-20 px-6 bg-white border-b-4 border-bbq-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">Locais Disponíveis</h2>
            <p className="hidden md:block font-bold uppercase text-[10px] tracking-[0.2em] opacity-40">Lisbon & Area</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {LOCATIONS.slice(0, 4).map((loc, idx) => (
              <div key={loc.id} className="group flex flex-col h-full border-4 border-bbq-black bg-white shadow-hard">
                <div className="aspect-[4/3] overflow-hidden border-b-4 border-bbq-black">
                  <img 
                    src={loc.images[0]} 
                    alt={loc.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-4 italic leading-none">{loc.name}</h3>
                  <div className="flex flex-col gap-2 mt-auto">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-60">
                      <Users size={12} />
                      <span>Capacidade: 10 a 80 pessoas</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase opacity-60">
                      <MapPin size={12} />
                      <span>Zona: {loc.name === 'Expo' ? 'Parque das Nações' : (loc.name === 'Tapadinha (Lisboa)' ? 'Alcântara' : 'Lisboa')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6.8 PRICING (ANCHORAGE) */}
      <section className="bg-bbq-black text-white py-20 border-b-4 border-bbq-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black uppercase tracking-widest subtitle mb-8 text-bbq-yellow">{t.pricingTitle}</h2>
          <div className="inline-block border-4 border-bbq-yellow p-8 md:p-12 transform -rotate-1 shadow-hard-sm bg-[#111]">
            <p className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic leading-none">
              {t.pricingAnchor}
            </p>
          </div>
          <p className="mt-8 text-xs font-bold uppercase tracking-widest text-gray-500">
            {lang === 'pt' ? '*Sujeito a orçamento final decorrente do número de pessoas e addons' : '*Subject to final quote based on head count and add-ons'}
          </p>
        </div>
      </section>

      {/* 6.9 FAQ (CRITICAL FOR GEO) */}
      <section className="py-20 px-6 bg-white border-b-4 border-bbq-black">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 italic text-center underline decoration-bbq-red decoration-8 underline-offset-8">
            {t.faqTitle}
          </h2>
          <div className="space-y-6">
            {t.faqs.map((faq, i) => (
              <div key={i} className="border-4 border-bbq-black p-6 bg-white shadow-hard-sm">
                <h4 className="font-black uppercase text-sm mb-2 flex items-center gap-2">
                  <span className="text-bbq-red">Q:</span> {faq.q}
                </h4>
                <p className="font-bold text-gray-600 uppercase text-xs pl-6">
                  <span className="text-bbq-black">A:</span> {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6.10 CONTACT FORM (DEDICATED) */}
      <section id="corporate-form" className="py-20 px-6 bg-bbq-cream border-b-4 border-bbq-black">
        <div className="max-w-2xl mx-auto">
          <div className="border-4 border-bbq-black bg-white p-8 md:p-12 shadow-hard">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter italic mb-8 text-center">{lang === 'pt' ? 'Solicitar Orçamento' : 'Request Quote'}</h2>
            
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-bbq-red text-white flex items-center justify-center rounded-full mx-auto mb-6 border-4 border-bbq-black shadow-hard-sm">
                  <Check size={40} />
                </div>
                <h3 className="text-2xl font-black uppercase mb-2">{lang === 'pt' ? 'Proposta Solicitada!' : 'Proposal Requested!'}</h3>
                <p className="font-bold uppercase text-xs text-gray-500">{lang === 'pt' ? 'Entraremos em contacto em menos de 24h.' : 'We will contact you in less than 24h.'}</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-8 text-bbq-red font-black uppercase text-xs tracking-widest underline underline-offset-4"
                >
                  {lang === 'pt' ? 'Enviar outra mensagem' : 'Send another message'}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={internalSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-2 ml-1">{lang === 'pt' ? 'Nome Responsável' : 'Contact Person'}</label>
                    <input 
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full bg-bbq-cream border-4 border-bbq-black p-4 font-bold uppercase text-sm focus:outline-none focus:ring-4 ring-bbq-red/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-2 ml-1">{lang === 'pt' ? 'Email Corporativo' : 'Company Email'}</label>
                    <input 
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full bg-bbq-cream border-4 border-bbq-black p-4 font-bold uppercase text-sm focus:outline-none focus:ring-4 ring-bbq-red/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-2 ml-1">{lang === 'pt' ? 'Empresa' : 'Company'}</label>
                    <input 
                      required
                      name="company"
                      value={formData.company}
                      onChange={handleFormChange}
                      className="w-full bg-bbq-cream border-4 border-bbq-black p-4 font-bold uppercase text-sm focus:outline-none focus:ring-4 ring-bbq-red/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase mb-2 ml-1">{lang === 'pt' ? 'Número de Pessoas' : 'Estimated Guests'}</label>
                    <select 
                      name="guests"
                      value={formData.guests}
                      onChange={handleFormChange}
                      className="w-full bg-bbq-cream border-4 border-bbq-black p-4 font-bold uppercase text-sm focus:outline-none"
                    >
                      <option value="10-20">10-20</option>
                      <option value="20-40">20-40</option>
                      <option value="40-60">40-60</option>
                      <option value="60-80">60-80</option>
                      <option value="80+">80+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase mb-2 ml-1">{lang === 'pt' ? 'Telemóvel' : 'Phone'}</label>
                  <input 
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="w-full bg-bbq-cream border-4 border-bbq-black p-4 font-bold uppercase text-sm focus:outline-none focus:ring-4 ring-bbq-red/20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase mb-2 ml-1">{lang === 'pt' ? 'Mensagem (Addons, Data, Restrições)' : 'Message (Addons, Date, Restrictions)'}</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    rows={4}
                    className="w-full bg-bbq-cream border-4 border-bbq-black p-4 font-bold uppercase text-sm focus:outline-none focus:ring-4 ring-bbq-red/20"
                  />
                </div>

                {error && (
                  <p className="text-bbq-red font-black uppercase text-[10px] text-center">
                    {lang === 'pt' ? 'Erro ao enviar. Tente novamente ou WhatsApp.' : 'Error sending. Try again or WhatsApp.'}
                  </p>
                )}

                <button 
                  disabled={isSending}
                  className="w-full bg-bbq-red text-white py-6 font-black uppercase text-xl border-4 border-bbq-black shadow-hard hover:bg-bbq-yellow hover:text-bbq-black transition-all transform hover:-translate-y-1 disabled:opacity-50"
                >
                  {isSending ? (lang === 'pt' ? 'A Enviar...' : 'Sending...') : (lang === 'pt' ? 'Enviar Pedido' : 'Send Request')}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 6.11 CTA FINAL */}
      <section className="py-24 px-6 bg-bbq-red text-center border-b-4 border-bbq-black">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic mb-12 text-bbq-cream leading-tight">
            Organizar um evento de equipa pode ser simples
          </h2>
          <button 
            onClick={onBack}
            className="bg-bbq-black text-white px-12 py-6 font-black uppercase text-xl border-4 border-bbq-black shadow-hard hover:bg-white hover:text-bbq-black transition-all transform hover:-translate-y-1"
          >
            {t.ctaPrimary}
          </button>
        </div>
      </section>
    </div>
  );
};
