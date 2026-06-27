import React from 'react';
import { ArrowLeft, Calendar, Trophy, Smartphone } from 'lucide-react';

interface VerBolaViewProps {
  lang: 'pt' | 'en';
  onBack: () => void;
}

export const VerBolaView: React.FC<VerBolaViewProps> = ({ lang, onBack }) => {
  const [googleUrl, setGoogleUrl] = React.useState('https://calendar.google.com/calendar/u/0?cid=Y19lOTdmYTQ1ZDYzZDM2ZjlmZWJkY2QzZjg3ZTlmOWUyOTMzMTk4MDcxYWIyYWY5OTRmMWM0ZjAyOTU1ZTg0M2RkQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20');
  const [outlookUrl, setOutlookUrl] = React.useState('/jogosdomundial/outlook');
  const [appleUrl, setAppleUrl] = React.useState('/jogosdomundial/applecalendar');
  const [isSandboxDev, setIsSandboxDev] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;

      setGoogleUrl(`https://calendar.google.com/calendar/u/0?cid=Y19lOTdmYTQ1ZDYzZDM2ZjlmZWJkY2QzZjg3ZTlmOWUyOTMzMTk4MDcxYWIyYWY5OTRmMWM0ZjAyOTU1ZTg0M2RkQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20`);
      setOutlookUrl(`${origin}/jogosdomundial/outlook`);
      setAppleUrl(`${origin}/jogosdomundial/applecalendar`);

      if (window.location.hostname.includes('ais-dev')) {
        setIsSandboxDev(true);
      }
    }
  }, []);

  const steps = [
    {
      title: lang === 'pt' ? "1. Escolhe o teu Calendário" : "1. Select your Calendar",
      desc: lang === 'pt' 
        ? "Clica no botão principal para subscrever diretamente ou copia o link HTTPS para outras aplicações de calendário."
        : "Click the main button to subscribe directly, or copy the HTTPS url for other external calendar apps."
    },
    {
      title: lang === 'pt' ? "2. Sincronização Automática" : "2. Automatic Syncing",
      desc: lang === 'pt'
        ? "Quaisquer atualizações de locais, equipas qualificadas ou horários serão atualizados no teu telemóvel de forma invisível."
        : "Any updates regarding venues, qualified teams, or kickoff times will auto-update in your calendar feed invisibly."
    },
    {
      title: lang === 'pt' ? "3. Acende o Carvão!" : "3. Fire up the Grill!",
      desc: lang === 'pt'
        ? "Os horários estão predefinidos com a Hora de Portugal (WEST/WET). Planeia os teus churrascos sem falhas!"
        : "Times are configured in Portugal local time. Plan your matchday barbecue and catering flawlessly!"
    }
  ];

  return (
    <div className="bg-bbq-cream min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 font-black uppercase text-sm mb-8 hover:text-bbq-red transition-colors group text-bbq-black"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
          {lang === 'pt' ? 'Voltar ao Início' : 'Back to Home'}
        </button>

        {/* Hero Card Container */}
        <div className="bg-white border-4 border-bbq-black p-8 md:p-14 shadow-hard relative overflow-hidden mb-10">
          
          {/* Decorative Soccer Pitch / Stadium corner styling */}
          <div className="absolute -top-12 -right-12 opacity-5 rotate-12 text-bbq-black pointer-events-none">
            <Trophy size={300} />
          </div>

          <div className="relative z-10">
            
            {/* World Cup Tag */}
            <div className="inline-flex items-center gap-2 bg-bbq-yellow text-bbq-black font-black uppercase text-xs px-3 py-1.5 border-2 border-bbq-black mb-6 shadow-hard-xs">
              <Trophy size={14} className="fill-bbq-black" />
              <span>FIFA WORLD CUP 2026 - HORA DE PORTUGAL (WEST)</span>
            </div>

            {/* Main Title */}
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 leading-none text-bbq-black">
              {lang === 'pt' ? 'O MUNDIAL NO TEU CALENDÁRIO' : 'THE WORLD CUP IN YOUR CALENDAR'}
            </h2>
            <div className="h-2 w-36 bg-bbq-red mb-8"></div>
            
            {/* Description intro */}
            <p className="text-lg md:text-xl font-bold uppercase text-gray-500 mb-10 leading-relaxed max-w-3xl">
              {lang === 'pt' 
                ? 'Prepara as brasas e junta os amigos! Adiciona o calendário do Campeonato do Mundo de 2026 com todos os jogos na hora de Portugal e em que canal de televisão vai dar!' 
                : 'Get the grill fired up and invite the gang! Add the 2026 World Cup calendar with all matches on Portugal time and which TV channel will broadcast them!'}
            </p>

            {/* Main Premium CTA Section */}
            <div className="bg-bbq-cream border-4 border-bbq-black p-6 md:p-8 mb-10 shadow-hard-sm">
              <h3 className="text-xl font-black uppercase tracking-tight text-bbq-black mb-3">
                {lang === 'pt' ? '⚽ INSTALAÇÃO RÁPIDA E AUTOMÁTICA' : '⚽ ONE-CLICK AUTOMATIC SYNC'}
              </h3>
              <p className="text-sm font-bold uppercase text-gray-500 mb-6 leading-normal">
                {lang === 'pt' 
                  ? 'Escolhe a tua plataforma de calendário favorita. Todos os 104 jogos na tua mão com sincronização automática!' 
                  : 'Select your preferred calendar platform. All 104 matches synced automatically to your hand!'}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Google Calendar direct server redirect */}
                <a 
                  href={googleUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-bbq-yellow hover:bg-bbq-black hover:text-white text-bbq-black py-4 px-4 border-4 border-bbq-black text-center font-black uppercase text-xs tracking-wider shadow-hard-xs transition-all flex items-center justify-center gap-2 group"
                >
                  <Calendar size={16} className="stroke-[3px] group-hover:scale-110 transition-transform" />
                  <span>Google Calendar</span>
                </a>

                {/* Apple Calendar direct server redirect */}
                <a 
                  href={appleUrl}
                  className="bg-white text-bbq-black py-4 px-4 border-4 border-bbq-black text-center font-black uppercase text-xs tracking-wider shadow-hard-xs hover:bg-bbq-red hover:text-white transition-all flex items-center justify-center gap-2 group"
                >
                  <Smartphone size={16} className="stroke-[3px] group-hover:scale-110 transition-transform" />
                  <span>Apple (iOS / Mac)</span>
                </a>

                {/* Outlook direct server redirect */}
                <a 
                  href={outlookUrl}
                  className="bg-white text-bbq-black py-4 px-4 border-4 border-bbq-black text-center font-black uppercase text-xs tracking-wider shadow-hard-xs hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 group"
                >
                  <Calendar size={16} className="stroke-[3px] group-hover:scale-110 transition-transform" />
                  <span>Outlook / Windows</span>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Step by Step Sync Instructions */}
        <div className="border-4 border-bbq-black bg-bbq-black text-white p-6 md:p-10 shadow-hard">
          <h3 className="text-2xl md:text-3xl font-black uppercase mb-6 text-bbq-yellow tracking-tight">
            {lang === 'pt' ? 'COMO FUNCIONA A SINCRONIZAÇÃO?' : 'HOW DOES THE SYNC WORK?'}
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, idx) => (
              <div key={idx} className="border-2 border-white/20 p-4 bg-white/5 flex flex-col justify-between">
                <div>
                  <h4 className="font-black uppercase text-sm mb-2 text-bbq-yellow">{s.title}</h4>
                  <p className="text-xs font-bold text-gray-300 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
