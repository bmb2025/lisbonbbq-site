
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Flame, MapPin, Printer, UtensilsCrossed, Users, Calendar, Phone, CheckCircle2 } from 'lucide-react';
import { LOCATIONS } from './constants';

const ProposalView: React.FC = () => {
  const commonAcompanhamentos = "Batata frita, Arroz branco, Salada de alface e cebola, Pão Alentejano.";

  return (
    <div className="min-h-screen bg-bbq-cream py-12 px-4 md:px-6 font-sans text-bbq-black print:bg-white print:p-0 print:py-0 print:min-h-0">
      <div className="max-w-6xl mx-auto bg-white border-4 border-bbq-black shadow-hard overflow-hidden print:shadow-none print:border-none print:max-w-none print:m-0">
        
        {/* Header Section */}
        <header className="bg-bbq-red text-bbq-cream p-8 md:p-12 flex flex-col md:flex-row justify-between items-center border-b-4 border-bbq-black relative print:border-b-2">
          <div className="flex items-center gap-4 mb-6 md:mb-0">
            <div className="bg-bbq-yellow p-3 border-4 border-bbq-black shadow-hard-sm print:shadow-none">
              <Flame className="w-10 h-10 md:w-14 md:h-14 text-bbq-black fill-bbq-black" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none">Lisbon Churrasco & Barbecue</h1>
              <p className="text-lg md:text-xl font-bold uppercase tracking-widest text-bbq-yellow">Proposta de Experiência</p>
            </div>
          </div>
          <div className="text-center md:text-right flex flex-col items-center md:items-end">
            <div className="bg-bbq-black text-white px-4 py-2 font-black uppercase text-sm mb-2 shadow-hard-sm print:shadow-none">Ref: LB-2024-PROP</div>
            <p className="font-bold opacity-80 uppercase text-xs text-bbq-cream tracking-widest">Válida por 15 dias</p>
          </div>
          <button 
            onClick={() => window.print()} 
            className="no-print absolute top-4 right-4 bg-white text-bbq-black p-2 border-2 border-bbq-black hover:bg-bbq-yellow transition-colors"
            title="Imprimir Proposta / Guardar PDF"
          >
            <Printer size={20} />
          </button>
        </header>

        {/* Intro Section */}
        <section className="p-8 md:p-12 border-b-4 border-bbq-black bg-bbq-cream/10 print:border-b-2">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 border-b-8 border-bbq-black inline-block italic print:border-b-4">O Conceito</h2>
          <p className="text-lg md:text-xl font-bold text-gray-700 leading-relaxed max-w-4xl uppercase tracking-tight">
            Somos especialistas em transformar o fogo em momentos memoráveis. Desde 2016, realizamos mais de 700 eventos em Portugal, garantindo o melhor serviço de churrasco de Lisboa através de um conceito "tailor-made" e premium.
          </p>
        </section>

        {/* UNIFIED MENU GRID */}
        <section className="p-8 md:p-12 bg-white border-b-4 border-bbq-black print:border-b-2">
          <div className="flex items-center gap-4 mb-12">
            <UtensilsCrossed className="text-bbq-red" size={48} />
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Opções de Experiência</h2>
          </div>

          <div className="flex flex-col md:flex-row gap-8 mb-8 items-stretch print:gap-4 print:flex-col">
            {/* Column 1: Grill Urbano */}
            <div className="flex-1 flex flex-col">
               <div className="bg-bbq-black text-white text-center py-2 mb-6 font-black uppercase text-sm tracking-widest italic border-4 border-bbq-black shadow-hard-sm print:shadow-none print:mb-2 print:py-1">
                  Tudo incluído
               </div>
               <div className="flex-1 bg-white border-4 border-bbq-black shadow-hard flex flex-col overflow-hidden group print:shadow-none print:border-2">
                <div className="bg-bbq-red text-white p-5 border-b-4 border-bbq-black font-black uppercase text-2xl italic tracking-tighter print:p-3 print:text-xl">
                  Grill Urbano
                </div>
                <div className="p-8 flex-1 flex flex-col print:p-4">
                  <div className="bg-bbq-cream/60 p-5 border-2 border-bbq-red/10 mb-6 print:p-3 print:mb-3">
                    <p className="text-xl font-black uppercase text-bbq-red leading-none italic print:text-lg mb-2">Grelhada Mista</p>
                    <p className="text-[12px] font-black uppercase text-bbq-black leading-tight">Carnes Selecionadas e Grelhadas no Momento</p>
                  </div>
                  <div className="mb-6 print:mb-3">
                    <h4 className="text-bbq-red font-black uppercase text-xs mb-2 border-b-2 border-bbq-cream inline-block">Acompanhamentos</h4>
                    <p className="text-[11px] font-bold uppercase text-gray-600 leading-relaxed">{commonAcompanhamentos}</p>
                  </div>

                  <div className="pt-4 border-t-2 border-dotted border-gray-200">
                    <h4 className="text-bbq-black font-black uppercase text-[10px] mb-1">Localizações disponíveis</h4>
                    <p className="text-[11px] font-bold uppercase text-bbq-red">Monsanto (Lisboa)</p>
                  </div>
                  
                  <div className="flex-1 min-h-[1.5rem]"></div>

                  <div className="pt-6 border-t-2 border-bbq-cream text-right print:pt-3">
                    <div className="text-3xl font-black text-bbq-black print:text-2xl">39€ <span className="text-sm">por pessoa</span></div>
                    <div className="text-[9px] font-bold uppercase text-bbq-red italic leading-tight mt-1">Fee do espaço já incluído na opção "Urban Grill"</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Pork Grill */}
            <div className="flex-1 flex flex-col">
               <div className="bg-bbq-black text-white text-center py-2 mb-6 font-black uppercase text-sm tracking-widest italic border-4 border-bbq-black shadow-hard-sm print:shadow-none print:mb-2 print:py-1">
                  Acresce Fee de local Premium
               </div>
               <div className="flex-1 bg-white border-4 border-bbq-black shadow-hard flex flex-col overflow-hidden group print:shadow-none print:border-2">
                <div className="bg-bbq-red text-white p-5 border-b-4 border-bbq-black font-black uppercase text-2xl italic tracking-tighter print:p-3 print:text-xl">
                  Pork Grill
                </div>
                <div className="p-8 flex-1 flex flex-col print:p-4">
                  <div className="bg-bbq-cream/60 p-5 border-2 border-bbq-red/10 mb-6 print:p-3 print:mb-3">
                    <p className="text-xl font-black uppercase text-bbq-red leading-none italic print:text-lg mb-2">Porco no Espeto</p>
                    <p className="text-[12px] font-black uppercase text-bbq-black leading-tight">Assado Lentamente com Brasas de Madeira Nobre</p>
                  </div>
                  <div className="mb-6 print:mb-3">
                    <h4 className="text-bbq-red font-black uppercase text-xs mb-2 border-b-2 border-bbq-cream inline-block">Acompanhamentos</h4>
                    <p className="text-[11px] font-bold uppercase text-gray-600 leading-relaxed">{commonAcompanhamentos}</p>
                  </div>

                  <div className="pt-4 border-t-2 border-dotted border-gray-200">
                    <h4 className="text-bbq-black font-black uppercase text-[10px] mb-1">Localizações disponíveis</h4>
                    <p className="text-[11px] font-bold uppercase text-bbq-red">Restelo</p>
                  </div>

                  <div className="flex-1 min-h-[1.5rem]"></div>

                  <div className="pt-6 border-t-2 border-bbq-cream text-right print:pt-3">
                    <div className="text-3xl font-black text-bbq-black print:text-2xl">35€ <span className="text-sm">por pessoa</span></div>
                    <div className="text-[10px] font-bold uppercase text-gray-400 italic">Acresce fee de localização Premium escolhida</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Venues Section */}
        <section className="p-8 md:p-12 border-b-4 border-bbq-black bg-white print:border-b-2">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-12 flex items-center gap-4">
            <MapPin className="text-bbq-red" size={48} /> Locais de Sonho
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:gap-4">
            {LOCATIONS.map((loc) => (
              <div key={loc.id} className="border-4 border-bbq-black bg-white group shadow-hard-sm hover:shadow-hard transition-all print:shadow-none print:border-2">
                <div className="grid grid-cols-3 h-40 border-b-4 border-bbq-black bg-gray-200 print:h-24">
                  {loc.images.map((img, i) => (
                    <div key={i} className="relative overflow-hidden border-r-2 last:border-r-0 border-bbq-black">
                      <img src={img} className="w-full h-full object-cover transition-all duration-700" alt={`${loc.name} ${i+1}`} />
                    </div>
                  ))}
                </div>
                <div className="p-6 print:p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-black uppercase text-bbq-black group-hover:text-bbq-red transition-colors print:text-base">{loc.name}</h3>
                  </div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase leading-relaxed mb-4 print:mb-2">
                    {loc.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Condições Gerais Section */}
        <section className="p-8 md:p-12 bg-bbq-black text-bbq-cream print:p-6 print:bg-white print:text-bbq-black">
          <div className="p-8 border-4 border-bbq-yellow bg-bbq-cream text-bbq-black relative shadow-hard-sm print:shadow-none print:border-2 print:p-4">
            <div className="absolute -top-6 left-8 bg-bbq-yellow text-bbq-black px-6 py-2 font-black uppercase text-lg border-4 border-bbq-black print:text-base print:px-4 print:py-1 print:-top-4">
              Condições Gerais
            </div>
            
            <div className="space-y-6 mt-6 print:space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Users className="text-bbq-red" size={24} />
                  <p className="text-xl font-black uppercase print:text-base">Orçamento para: 70 pessoas</p>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="text-bbq-red" size={24} />
                  <p className="text-xl font-black uppercase print:text-base">28 de março de 2026</p>
                </div>
              </div>

              <div className="border-t-2 border-bbq-black/10 pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-bbq-red shrink-0" size={20} />
                  <p className="text-sm font-black uppercase tracking-tight leading-tight">
                    Sinal de 50% para adjudicação. Restante pagamento até 48 horas antes do evento.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-bbq-red shrink-0" size={20} />
                  <p className="text-sm font-black uppercase tracking-tight leading-tight">
                    Disponibilidade do local condicionada à data de adjudicação.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-bbq-red shrink-0" size={20} />
                  <p className="text-sm font-black uppercase tracking-tight leading-tight italic opacity-70">
                    Este orçamento tem validade de 15 dias, podendo ser reajustado consoante a data do evento.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Contact */}
          <div className="mt-12 pt-8 border-t-2 border-bbq-yellow flex flex-col md:flex-row justify-between items-center gap-8 print:mt-10 print:pt-6">
            <div className="flex flex-wrap justify-center md:justify-start gap-6 md:gap-12 print:gap-6">
              <div className="flex items-center gap-2 text-xs font-black uppercase">
                <Phone className="text-bbq-yellow print:text-bbq-red" size={16} /> +351 961 058 571
              </div>
            </div>
          </div>
        </section>

      </div>
      <div className="max-w-6xl mx-auto mt-8 text-center text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] print:mt-4 print:text-gray-300">
        © 2024 Lisbon Churrasco & Barbecue. Informação Confidencial e Reservada.
      </div>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ProposalView />
    </React.StrictMode>
  );
}
