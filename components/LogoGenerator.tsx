
import React, { useState } from 'react';
import { Download, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { generateBrandLogo } from '../services/anthropicService';

export const LogoGenerator: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    const url = await generateBrandLogo();
    setLogoUrl(url);
    setLoading(false);
  };

  const downloadLogo = () => {
    if (!logoUrl) return;
    const link = document.createElement('a');
    link.href = logoUrl;
    link.download = 'lisbon-churrasco-logo-square.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="brand-lab" className="py-24 px-4 bg-bbq-black text-bbq-cream border-t-4 border-bbq-yellow scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="bg-bbq-red text-white inline-block px-4 py-1 font-black uppercase text-xs mb-4 shadow-hard-sm">Creative Tools</div>
            <h2 className="text-4xl md:text-6xl font-black uppercase mb-6 tracking-tighter flex items-center justify-center md:justify-start gap-4">
              <Sparkles className="text-bbq-yellow" size={40} />
              Brand Lab
            </h2>
            <p className="text-xl font-bold mb-8 text-gray-400 uppercase tracking-widest leading-tight">
              Gerar o Logo oficial <span className="text-bbq-yellow">1:1 Quadrado</span> para materiais de marketing e redes sociais.
            </p>
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="bg-bbq-yellow text-bbq-black px-10 py-5 font-black uppercase text-xl border-4 border-bbq-black shadow-hard hover:translate-y-[-2px] active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mx-auto md:mx-0 min-w-[280px]"
            >
              {loading ? <Loader2 className="animate-spin" /> : <ImageIcon size={24} />}
              {logoUrl ? 'Gerar Outra Versão' : 'Gerar Logo Quadrado'}
            </button>
          </div>

          <div className="w-full md:w-96 h-96 bg-bbq-cream border-8 border-bbq-yellow shadow-hard relative flex items-center justify-center group overflow-hidden">
            {logoUrl ? (
              <div className="w-full h-full relative">
                <img src={logoUrl} alt="Generated Logo" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <button 
                    onClick={downloadLogo}
                    className="w-full bg-bbq-red text-white py-4 font-black uppercase flex items-center justify-center gap-2 hover:bg-white hover:text-bbq-red transition-colors border-2 border-transparent hover:border-bbq-red"
                  >
                    <Download size={24} />
                    Download PNG
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-bbq-black/10 flex flex-col items-center gap-4 p-8 text-center">
                <div className="relative">
                  <ImageIcon size={100} strokeWidth={1} />
                  {loading && <Loader2 size={40} className="absolute inset-0 m-auto animate-spin text-bbq-red" />}
                </div>
                <span className="font-black text-sm uppercase opacity-50 tracking-widest">
                  {loading ? 'A criar a tua marca...' : 'Aguarda Criação'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
