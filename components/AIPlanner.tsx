
import React from 'react';
import { Sparkles, Users, Info, Flame, Beer, Utensils, Plus, Minus, Check } from 'lucide-react';

interface AIPlannerProps {
  guests: number;
  guestsConfirmed: boolean;
  onGuestsChange: (guests: number) => void;
  onConfirm: () => void;
  selectedStyle: string | null;
  lang: 'pt' | 'en';
}

export const AIPlanner: React.FC<AIPlannerProps> = ({ guests, guestsConfirmed, onGuestsChange, onConfirm, selectedStyle, lang }) => {
  const meatEstimate = Math.ceil(guests * 0.45); 
  const drinkEstimate = Math.ceil(guests * 3); 
  const coalEstimate = Math.ceil(guests / 8); 

  const t = {
    title: lang === 'pt' ? 'Tamanho do Evento' : 'Event Size',
    minGuests: lang === 'pt' ? 'Mínimo 20 convidados para o serviço' : 'Minimum 20 guests for concierge service',
    logistics: lang === 'pt' ? 'Estimativa de Logística' : 'Concierge Logistics Estimate',
    meat: lang === 'pt' ? 'Suprimento de Carne' : 'Meat Supply',
    drinks: lang === 'pt' ? 'Unidades de Bebida' : 'Drink Units',
    coal: lang === 'pt' ? 'Sacos de Carvão' : 'Coal Bags',
    confirm: lang === 'pt' ? 'Confirmar Participantes' : 'Confirm Participants',
    confirmed: lang === 'pt' ? 'Number Confirmado' : 'Number Confirmed',
    disclaimer: lang === 'pt' 
      ? `* Estimativas baseadas em consumos médios para um evento ${selectedStyle || 'Premium'} de 4 horas. Valores indicativos.` 
      : `* Estimates based on average consumption for a 4h ${selectedStyle || 'Premium'} event. Values are indicative.`
  };

  return (
    <div id="section-guests" className={`bg-bbq-yellow border-4 border-bbq-black p-8 shadow-hard mb-16 relative overflow-hidden group transition-all duration-500 ${guestsConfirmed ? 'bg-white' : 'bg-bbq-yellow'}`}>
      <div className="absolute -top-12 -right-12 p-4 opacity-5 pointer-events-none transition-transform group-hover:rotate-12 duration-1000">
        <Sparkles size={240} />
      </div>
      
      <div className="flex flex-col md:flex-row gap-12 items-center">
        <div className="w-full md:w-1/3">
          <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 border-2 border-bbq-black transition-colors ${guestsConfirmed ? 'bg-bbq-yellow text-bbq-black' : 'bg-bbq-black text-white'}`}>
              <Users size={24} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter">{t.title}</h3>
          </div>
          
          <div className="relative mb-6">
            <input 
              type="number" 
              min="20" 
              max="500"
              value={guests}
              onChange={(e) => onGuestsChange(parseInt(e.target.value) || 20)}
              className="w-full bg-white border-4 border-bbq-black p-6 text-5xl font-black focus:outline-none focus:ring-4 focus:ring-bbq-red shadow-hard-sm transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
              <button 
                onClick={() => onGuestsChange(guests + 1)}
                className="p-1 hover:bg-gray-100 border-2 border-bbq-black bg-white active:translate-y-0.5"
              >
                <Plus size={16} strokeWidth={4} />
              </button>
              <button 
                onClick={() => onGuestsChange(Math.max(20, guests - 1))}
                className="p-1 hover:bg-gray-100 border-2 border-bbq-black bg-white active:translate-y-0.5"
              >
                <Minus size={16} strokeWidth={4} />
              </button>
            </div>
          </div>
          
          <button 
            onClick={onConfirm}
            className={`w-full py-4 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 border-4 border-bbq-black transition-all shadow-hard-sm active:shadow-none active:translate-x-1 active:translate-y-1 ${guestsConfirmed ? 'bg-bbq-black text-bbq-yellow' : 'bg-bbq-red text-white hover:bg-bbq-black'}`}
          >
            {guestsConfirmed ? <Check size={20} strokeWidth={3} /> : null}
            {guestsConfirmed ? t.confirmed : t.confirm}
          </button>

          <p className="mt-4 text-[10px] font-black uppercase text-bbq-black/60 tracking-widest flex items-center gap-2">
            <Info size={12}/> {t.minGuests}
          </p>
        </div>

        <div className="flex-1 w-full">
          <div className="bg-bbq-black text-white px-6 py-2 inline-block font-black uppercase text-xs italic tracking-widest mb-6 border-2 border-bbq-black">
            {t.logistics}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border-4 border-bbq-black p-4 flex items-center gap-4 shadow-hard-sm">
              <div className="bg-bbq-cream p-2 border-2 border-bbq-black">
                <Utensils className="text-bbq-red" size={20} />
              </div>
              <div>
                <div className="text-2xl font-black leading-none">{meatEstimate}kg</div>
                <div className="text-[10px] font-black uppercase text-gray-400">{t.meat}</div>
              </div>
            </div>

            <div className="bg-white border-4 border-bbq-black p-4 flex items-center gap-4 shadow-hard-sm">
              <div className="bg-bbq-cream p-2 border-2 border-bbq-black">
                <Beer className="text-bbq-red" size={20} />
              </div>
              <div>
                <div className="text-2xl font-black leading-none">{drinkEstimate}</div>
                <div className="text-[10px] font-black uppercase text-gray-400">{t.drinks}</div>
              </div>
            </div>

            <div className="bg-white border-4 border-bbq-black p-4 flex items-center gap-4 shadow-hard-sm">
              <div className="bg-bbq-cream p-2 border-2 border-bbq-black">
                <Flame className="text-bbq-red" size={20} />
              </div>
              <div>
                <div className="text-2xl font-black leading-none">{coalEstimate}</div>
                <div className="text-[10px] font-black uppercase text-gray-400">{t.coal}</div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 border-2 border-dashed border-bbq-black/20 rounded bg-white/30">
            <p className="text-xs font-bold uppercase text-bbq-black/70 italic leading-relaxed">
              {t.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
