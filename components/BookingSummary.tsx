
import React from 'react';
import { CartItem, BookingState } from '../types';

interface BookingSummaryProps {
  booking: BookingState;
  cart: CartItem[];
  onCheckout: () => void;
  lang: 'pt' | 'en';
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({ booking, cart, onCheckout, lang }) => {
  // Requirement: Button bar only appears when user chooses number of participants (guestsConfirmed)
  if (!booking.guestsConfirmed) return null;

  // Requirement: Final action only enabled after Step 3 sides confirmed AND Step 6 extras confirmed
  const isComplete = 
    booking.date && 
    booking.slot && 
    booking.style && 
    booking.selectedSides.length > 0 && 
    booking.sidesConfirmed &&
    booking.extrasConfirmed;

  return (
    <div className="no-print fixed bottom-0 left-0 right-0 bg-white border-t-4 border-bbq-black p-4 z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-500">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            {lang === 'pt' ? 'Resumo do Plano' : 'Plan Summary'}
          </span>
          <span className="text-2xl font-black text-bbq-red uppercase leading-none">
            {lang === 'pt' ? 'Pedido de Orçamento' : 'Custom Quote Request'}
          </span>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden md:block text-right">
             <div className="text-sm font-bold uppercase">{booking.style || (lang === 'pt' ? 'Escolher Menu' : 'Choose Menu')}</div>
             <div className="text-xs text-gray-600 uppercase font-black">
               {booking.date ? booking.date.toLocaleDateString(lang === 'pt' ? 'pt-PT' : 'en-US') : (lang === 'pt' ? 'Escolher Data' : 'Pick a Date')}
             </div>
           </div>
           <button 
            onClick={onCheckout}
            disabled={!isComplete}
            className="bg-bbq-black text-bbq-yellow hover:bg-bbq-red hover:text-white disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed px-8 py-3 font-black uppercase tracking-widest text-lg shadow-hard-sm active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
           >
             {lang === 'pt' ? 'Pedir Orçamento' : 'Get Custom Quote'}
           </button>
        </div>
      </div>
    </div>
  );
};
