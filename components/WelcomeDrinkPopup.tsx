import React, { useEffect, useState } from 'react';
import { Instagram, X } from 'lucide-react';
import { EVENT_SOCIALS } from '../constants';
import { EventRecord } from '../types';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type Step = 'instagram' | 'newsletter' | 'success';

export const WelcomeDrinkPopup: React.FC<{ event: EventRecord }> = ({ event }) => {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState<Step>('instagram');
  const [fading, setFading] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(id);
  }, []);

  const goTo = (next: Step) => {
    setFading(true);
    setTimeout(() => {
      setStep(next);
      setFading(false);
    }, 200);
  };

  const close = () => setVisible(false);

  const socials = event.socials || EVENT_SOCIALS;
  const instagramUrl = socials.find(s => s.key === 'instagram')?.url
    || EVENT_SOCIALS.find(s => s.key === 'instagram')!.url;

  const handleInstagramClick = () => {
    window.open(instagramUrl, '_blank', 'noopener,noreferrer');
    goTo('newsletter');
  };

  const submitNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) { setError(true); return; }
    setError(false);
    setSending(true);
    try {
      await fetch('/api/save-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'event_popup_newsletter',
          stage: 'partial',
          email,
          event_slug: event.slug,
          event_title: event.title,
        }),
      });
      goTo('success');
      setTimeout(close, 1800);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/70 backdrop-blur-[2px]"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div
        className="relative w-full max-w-[420px] bg-bbq-cream text-bbq-black border-4 border-bbq-black p-8 text-center"
        style={{ boxShadow: '10px 10px 0 #F4B41A' }}
      >
        <button
          onClick={close}
          aria-label="Fechar"
          className="absolute -top-4 -right-4 w-9 h-9 bg-bbq-black text-bbq-cream border-3 border-bbq-cream flex items-center justify-center hover:bg-bbq-red transition-colors"
          style={{ boxShadow: '3px 3px 0 rgba(0,0,0,.3)' }}
        >
          <X size={18} strokeWidth={3} />
        </button>

        <div className={`transition-opacity duration-200 ${fading ? 'opacity-0' : 'opacity-100'}`}>
          {step === 'instagram' && (
            <>
              <span className="inline-block bg-bbq-red text-bbq-cream font-black uppercase text-[11px] tracking-wide px-3.5 py-1.5 mb-4">Oferta especial</span>
              <div className="text-4xl mb-2.5">🍹</div>
              <h2 className="text-2xl font-black uppercase leading-tight mb-3.5 text-balance">Recebe um welcome drink no dia do churrasco</h2>
              <p className="text-[15px] text-[#3a3a3a] mb-5 leading-relaxed">
                Segue-nos no Instagram, mostra que já nos segues e recebe uma bebida de boas-vindas por nossa conta.
              </p>
              <button
                onClick={handleInstagramClick}
                className="w-full inline-flex items-center justify-center gap-2.5 bg-bbq-black text-bbq-cream border-4 border-bbq-black font-black uppercase text-sm tracking-tight px-4.5 py-3.5 active:translate-x-[2px] active:translate-y-[2px] transition-transform"
                style={{ boxShadow: '4px 4px 0 0 #D91A2A' }}
              >
                <Instagram size={20} /> Seguir no Instagram
              </button>
              <span className="block mt-3 text-[13px] font-bold text-[#6b6b6b]">@lisbon.barbecue.churrasco</span>
              <button onClick={close} className="block mx-auto mt-4.5 text-xs font-bold text-[#8a8a8a] underline underline-offset-4 hover:text-bbq-black">Agora não</button>
            </>
          )}

          {step === 'newsletter' && (
            <>
              <span className="inline-block bg-bbq-yellow text-bbq-black font-black uppercase text-[11px] tracking-wide px-3.5 py-1.5 mb-4">Quase lá</span>
              <div className="text-4xl mb-2.5">📬</div>
              <h2 className="text-2xl font-black uppercase leading-tight mb-3.5 text-balance">Falta só a newsletter</h2>
              <p className="text-[15px] text-[#3a3a3a] mb-5 leading-relaxed">Novidades de eventos, spots novos e descontos — direto no teu email, sem spam.</p>
              <form onSubmit={submitNewsletter} className="flex gap-0 mb-3.5">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nome@exemplo.pt"
                  className={`flex-1 min-w-0 h-[52px] border-4 border-r-0 px-3.5 text-[15px] ${error ? 'border-bbq-red' : 'border-bbq-black'}`}
                />
                <button type="submit" disabled={sending} className="h-[52px] flex-none bg-bbq-yellow text-bbq-black border-4 border-bbq-black font-black uppercase text-[13px] px-4.5 hover:bg-[#ffc94a] transition-colors">
                  {sending ? '...' : 'Subscrever'}
                </button>
              </form>
              <button onClick={close} className="block mx-auto text-xs font-bold text-[#8a8a8a] underline underline-offset-4 hover:text-bbq-black">Saltar este passo</button>
            </>
          )}

          {step === 'success' && (
            <div className="py-2.5">
              <div className="text-4xl mb-2">🎉</div>
              <h2 className="text-2xl font-black uppercase mb-1">Tudo pronto!</h2>
              <p className="text-[15px] text-[#3a3a3a]">Vemo-nos no dia do churrasco — welcome drink garantido.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
