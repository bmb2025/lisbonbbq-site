import React from 'react';
import { Flame, ArrowLeft } from 'lucide-react';

interface NotFoundViewProps {
  lang: 'pt' | 'en';
  onBack: () => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ lang, onBack }) => {
  const pt = lang === 'pt';
  return (
    <div className="bg-bbq-cream min-h-screen py-24 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <Flame className="w-16 h-16 mx-auto mb-8 fill-bbq-yellow text-bbq-black" />
        <div className="text-8xl font-black uppercase tracking-tighter mb-4 text-bbq-black">404</div>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-6 leading-none">
          {pt ? 'Esta página apagou-se como as brasas' : 'This page burned out'}
        </h1>
        <p className="text-lg font-bold uppercase text-gray-500 mb-10 leading-relaxed">
          {pt
            ? 'A página que procuras não existe ou foi movida.'
            : "The page you're looking for doesn't exist or has moved."}
        </p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-3 bg-bbq-black text-white px-8 py-4 font-black uppercase text-sm tracking-widest border-4 border-bbq-black shadow-hard hover:bg-bbq-red transition-colors"
        >
          <ArrowLeft size={18} strokeWidth={3} />
          {pt ? 'Voltar ao início' : 'Back to home'}
        </button>
      </div>
    </div>
  );
};
