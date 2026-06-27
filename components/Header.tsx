
import React from 'react';
import { Flame } from 'lucide-react';

interface HeaderProps {
  setView: (view: 'booking' | 'proposal' | 'privacy' | 'terms' | 'blog' | 'cms' | 'faqs' | 'about' | 'corporate' | 'verbola') => void;
  lang: 'pt' | 'en';
  setLang: (lang: 'pt' | 'en') => void;
}

export const Header: React.FC<HeaderProps> = ({ setView, lang, setLang }) => {
  return (
    <header className="no-print sticky top-0 z-50 bg-bbq-red text-bbq-cream border-b-4 border-bbq-black shadow-hard">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <button onClick={() => setView('booking')} className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Flame className="w-8 h-8 fill-bbq-yellow text-bbq-black" />
          <h1 className="text-xl md:text-2xl font-black tracking-tighter uppercase">
            Lisbon Barbecue & Churrasco
          </h1>
        </button>
        
        <nav className="flex gap-4 md:gap-6 font-bold text-[10px] md:text-sm uppercase tracking-widest items-center">
          <button onClick={() => setView('corporate')} className="hover:text-bbq-yellow transition-colors hidden md:block">
            {lang === 'pt' ? 'Empresas' : 'Corporate'}
          </button>
          <div className="flex bg-bbq-black/20 p-1 border-2 border-bbq-black ml-4">
            <button 
              onClick={() => setLang('pt')} 
              className={`px-2 py-0.5 text-[10px] font-black transition-all ${lang === 'pt' ? 'bg-bbq-yellow text-bbq-black' : 'text-bbq-cream hover:bg-white/10'}`}
            >
              PT
            </button>
            <button 
              onClick={() => setLang('en')} 
              className={`px-2 py-0.5 text-[10px] font-black transition-all ${lang === 'en' ? 'bg-bbq-yellow text-bbq-black' : 'text-bbq-cream hover:bg-white/10'}`}
            >
              EN
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};
