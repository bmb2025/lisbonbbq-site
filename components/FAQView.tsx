
import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import faqs from '../seo/faqs.json';

interface FAQViewProps {
  lang: 'pt' | 'en';
  onBack: () => void;
}

export const FAQView: React.FC<FAQViewProps> = ({ lang, onBack }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-bbq-cream min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 font-black uppercase text-sm mb-12 hover:text-bbq-red transition-colors group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
          {lang === 'pt' ? 'Voltar para a Reserva' : 'Back to Booking'}
        </button>

        <div className="bg-white border-4 border-bbq-black p-10 md:p-16 shadow-hard relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-5 rotate-12">
            <HelpCircle size={280} />
          </div>

          <div className="relative z-10">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-none">
              FAQ do Mestre
            </h1>
            <div className="h-2 w-32 bg-bbq-red mb-12"></div>
            
            <p className="text-xl font-bold uppercase text-gray-500 mb-16 leading-relaxed max-w-2xl">
              {lang === 'pt' ? 'Todas as respostas para o teu churrasco perfeito.' : 'All the answers for your perfect barbecue.'}
            </p>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border-4 border-bbq-black overflow-hidden bg-bbq-cream shadow-hard-sm">
                  <button 
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full text-left p-6 font-black uppercase text-lg flex justify-between items-center bg-white hover:bg-bbq-yellow transition-colors"
                  >
                    <span>{faq.q[lang]}</span>
                    {openIndex === i ? <ChevronUp size={24}/> : <ChevronDown size={24}/>}
                  </button>
                  {openIndex === i && (
                    <div className="p-8 font-bold text-gray-600 uppercase tracking-tight leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                      {faq.a[lang]}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-24 pt-12 border-t-4 border-bbq-black/5 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                {lang === 'pt' ? 'Alguma dúvida extra? Envia e-mail!' : 'Extra questions? Send an email!'}
              </div>
              <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-bbq-red"></div>
                 <div className="w-8 h-8 rounded-full bg-bbq-yellow"></div>
                 <div className="w-8 h-8 rounded-full bg-bbq-black"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
