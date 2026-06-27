
import React from 'react';
import { ArrowLeft, Flame, Award, Users, MapPin, ChefHat, Heart, ShieldCheck } from 'lucide-react';

interface QuemSomosViewProps {
  lang: 'pt' | 'en';
  onBack: () => void;
}

export const QuemSomosView: React.FC<QuemSomosViewProps> = ({ lang, onBack }) => {
  const t = {
    back: lang === 'pt' ? 'Voltar para a Reserva' : 'Back to Booking',
    title: lang === 'pt' ? 'Quem Somos' : 'About Us',
    subtitle: lang === 'pt' ? 'Transformamos fogo em memórias desde 2016.' : 'Turning fire into memories since 2016.',
    storyTitle: lang === 'pt' ? 'A Nossa História' : 'Our Story',
    storyText1: lang === 'pt' 
      ? 'O LisbonBBQ nasceu de uma ideia simples: o churrasco é a forma mais pura de convívio, mas a logística é o seu pior inimigo.'
      : 'LisbonBBQ was born from a simple idea: barbecue is the purest form of gathering, but logistics is its worst enemy.',
    storyText2: lang === 'pt'
      ? 'Desde 2016, a nossa missão é libertar o anfitrião. Criamos o cenário, preparamos as brasas e selecionamos as melhores carnes para que tu só tenhas de fazer uma coisa: aproveitar o momento.'
      : 'Since 2016, our mission has been to free the host. We set the scene, prepare the coals, and select the finest meats so you only have to do one thing: enjoy the moment.',
    stats: [
      { label: lang === 'pt' ? 'Eventos' : 'Events', value: '700+', icon: Award },
      { label: lang === 'pt' ? 'Anos de Fogo' : 'Years of Fire', value: '8+', icon: Flame },
      { label: lang === 'pt' ? 'Convidados' : 'Guests', value: '15k+', icon: Users },
      { label: lang === 'pt' ? 'Spots Únicos' : 'Unique Spots', value: 'Lisboa', icon: MapPin },
    ],
    manifestoTitle: lang === 'pt' ? 'O Nosso Manifesto' : 'Our Manifesto',
    manifestoItems: [
      { 
        h: lang === 'pt' ? 'Autenticidade' : 'Authenticity', 
        p: lang === 'pt' ? 'Não somos um catering industrial. Somos o churrasco do teu quintal, mas elevado ao nível profissional.' : 'We are not industrial catering. We are your backyard BBQ, elevated to a professional level.' 
      },
      { 
        h: lang === 'pt' ? 'Qualidade Sem Atalhos' : 'Quality Without Shortcuts', 
        p: lang === 'pt' ? 'Carvão de alta performance, carnes certificadas e acompanhamentos frescos preparados no dia.' : 'High-performance charcoal, certified meats, and fresh sides prepared daily.' 
      },
      { 
        h: lang === 'pt' ? 'Zero Stress' : 'Zero Stress', 
        p: lang === 'pt' ? 'Tu chegas, grelhas (ou não) e bebes uma cerveja gelada. Nós tratamos da limpeza e da montagem.' : 'You show up, grill (or not), and have a cold beer. We handle the cleanup and setup.' 
      }
    ],
    cta: lang === 'pt' ? 'Pronto para acender o lume?' : 'Ready to light the fire?'
  };

  return (
    <div className="bg-bbq-cream min-h-screen py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 font-black uppercase text-sm mb-12 hover:text-bbq-red transition-colors group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
          {t.back}
        </button>

        <div className="bg-white border-4 border-bbq-black shadow-hard overflow-hidden">
          {/* Hero Section */}
          <div className="bg-bbq-red text-white p-12 md:p-20 text-center relative overflow-hidden border-b-4 border-bbq-black">
            <div className="relative z-10">
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6 italic">
                {t.title}
              </h1>
              <p className="text-xl md:text-2xl font-bold uppercase tracking-widest text-bbq-yellow">
                {t.subtitle}
              </p>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
              <ChefHat size={300} />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b-4 border-bbq-black bg-bbq-yellow">
            {t.stats.map((stat, i) => (
              <div key={i} className="p-8 border-r-4 last:border-r-0 border-bbq-black flex flex-col items-center text-center">
                <stat.icon size={32} className="mb-4 text-bbq-black" />
                <div className="text-4xl font-black uppercase leading-none mb-1">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-widest opacity-60">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Story Content */}
          <div className="p-12 md:p-20 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 border-b-8 border-bbq-red inline-block italic">
                {t.storyTitle}
              </h2>
              <p className="text-xl font-bold uppercase text-bbq-black leading-relaxed mb-6">
                {t.storyText1}
              </p>
              <p className="text-lg font-medium text-gray-500 uppercase tracking-tight leading-relaxed">
                {t.storyText2}
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-bbq-black translate-x-4 translate-y-4 -z-10"></div>
              <img 
                src="https://mlqdpjiolbyewcumvajn.supabase.co/storage/v1/object/public/lisbonbbq-media/Fotos/Pitmasters.webp" 
                alt="Pitmasters LisbonBBQ" 
                className="w-full border-4 border-bbq-black grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>

          {/* Manifesto Section */}
          <div className="bg-bbq-cream p-12 md:p-20 border-t-4 border-bbq-black">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-16 text-center">
              {t.manifestoTitle}
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              {t.manifestoItems.map((item, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <div className="bg-white p-4 border-2 border-bbq-black w-fit shadow-hard-sm">
                    {i === 0 ? <Heart className="text-bbq-red" /> : i === 1 ? <ShieldCheck className="text-bbq-red" /> : <Flame className="text-bbq-red" />}
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight">{item.h}</h3>
                  <p className="text-sm font-bold text-gray-500 uppercase leading-relaxed tracking-tight">
                    {item.p}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer CTA */}
          <div className="p-12 text-center bg-bbq-black text-white">
            <p className="text-2xl font-black uppercase mb-8 italic">{t.cta}</p>
            <button 
              onClick={onBack}
              className="bg-bbq-yellow text-bbq-black px-12 py-5 font-black uppercase text-xl border-4 border-bbq-black shadow-[6px_6px_0px_#D91A2A] hover:translate-y-[-2px] transition-all"
            >
              {lang === 'pt' ? 'Reservar Agora' : 'Book Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
