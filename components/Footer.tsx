
import React from 'react';
import { Flame, Instagram, Linkedin, Twitter } from 'lucide-react';

interface FooterProps {
  setView: (view: 'booking' | 'proposal' | 'privacy' | 'terms' | 'blog' | 'cms' | 'faqs' | 'about' | 'corporate' | 'verbola') => void;
  lang: 'pt' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ setView, lang }) => {
  return (
    <footer className="no-print bg-bbq-black text-bbq-cream border-t-4 border-bbq-yellow pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-2">
           <div className="flex items-center gap-2 mb-6">
              <Flame className="w-10 h-10 fill-bbq-red text-bbq-yellow" />
              <span className="text-3xl font-black uppercase leading-none">Lisbon Barbecue & Churrasco</span>
           </div>
           <p className="font-bold text-lg max-w-sm mb-6">
             {lang === 'pt' 
               ? 'O único lugar em Lisboa onde podes reservar o grelhador, escolher as carnes e ser o mestre do teu banquete.'
               : 'The only place in Lisbon where you can rent a grill, buy the meat, and be the master of your own destiny.'}
           </p>
           <div className="flex gap-4">
              <a href="https://www.instagram.com/lisbon.barbecue.churrasco/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-2 border-bbq-cream flex items-center justify-center hover:bg-bbq-red transition-colors"><Instagram size={20}/></a>
              <a href="https://www.linkedin.com/company/lisbon-barbecue-churrasco/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-2 border-bbq-cream flex items-center justify-center hover:bg-bbq-red transition-colors"><Linkedin size={20}/></a>
              <a href="https://x.com/Lisbonbbq" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-2 border-bbq-cream flex items-center justify-center hover:bg-bbq-red transition-colors"><Twitter size={20}/></a>
           </div>
        </div>
        
        <div>
           <h4 className="text-bbq-yellow font-black uppercase mb-6 tracking-widest">{lang === 'pt' ? 'Explorar' : 'Explore'}</h4>
           <ul className="space-y-3 font-bold uppercase text-sm">
              <li><button onClick={() => setView('corporate')} className="hover:text-bbq-red transition-colors text-left w-full uppercase">{lang === 'pt' ? 'Corporate' : 'Corporate'}</button></li>
              <li><button onClick={() => setView('about')} className="hover:text-bbq-red transition-colors text-left w-full uppercase">{lang === 'pt' ? 'Quem Somos' : 'About Us'}</button></li>
              <li><button onClick={() => setView('blog')} className="hover:text-bbq-red transition-colors text-left w-full uppercase">Blog</button></li>
              <li><button onClick={() => setView('faqs')} className="hover:text-bbq-red transition-colors text-left w-full uppercase">FAQs</button></li>
              <li><button onClick={() => setView('verbola')} className="hover:text-bbq-yellow text-bbq-red transition-colors text-left w-full uppercase">{lang === 'pt' ? 'Mundial 2026 ⚽' : 'World Cup 2026 ⚽'}</button></li>
           </ul>
        </div>

        <div>
           <h4 className="text-bbq-yellow font-black uppercase mb-6 tracking-widest">{lang === 'pt' ? 'Contacto' : 'Contact'}</h4>
           <ul className="space-y-3 font-bold uppercase text-sm">
              <li><a href="mailto:pitmasters@lisbonbbq.pt" className="text-bbq-yellow font-bold lowercase hover:text-bbq-red transition-colors">pitmasters@lisbonbbq.pt</a></li>
              <li>+351 961 058 571</li>
           </ul>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs font-bold uppercase text-gray-500">
         <div>© 2024 Lisbon Barbecue & Churrasco. All rights reserved.</div>
         <div className="flex gap-6 mt-4 md:mt-0">
            <button onClick={() => setView('privacy')} className="hover:text-bbq-yellow uppercase">Privacy</button>
            <button onClick={() => setView('terms')} className="hover:text-bbq-yellow uppercase">Terms</button>
            <button onClick={() => setView('faqs')} className="hover:text-bbq-yellow uppercase">FAQs</button>
         </div>
      </div>
    </footer>
  );
};
