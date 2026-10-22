import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getConsent, saveConsent, OPEN_SETTINGS_EVENT } from '../services/consent';

// Aviso de cookies para o site todo. Fica fora de #root (portal para <body>)
// para os snapshots de scripts/prerender-snapshots.mjs, que copiam só o
// conteúdo de #root, não o apanharem.
//
// "Aceitar" e "Rejeitar" têm o mesmo peso visual, como a CNPD pede: recusar tem
// de ser tão fácil como aceitar.

const Toggle: React.FC<{ label: string; desc: string; checked: boolean; disabled?: boolean; onChange?: (v: boolean) => void }> = ({ label, desc, checked, disabled, onChange }) => (
  <label className={`flex gap-3 items-start py-3 border-t border-white/15 ${disabled ? 'opacity-70' : 'cursor-pointer'}`}>
    <input
      type="checkbox"
      className="w-5 h-5 mt-0.5 flex-none accent-[#f4b41a]"
      checked={checked}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.checked)}
    />
    <span className="flex flex-col gap-1">
      <span className="font-black uppercase text-sm tracking-wide">{label}</span>
      <span className="text-sm leading-snug text-gray-300">{desc}</span>
    </span>
  </label>
);

export const CookieBanner: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    setMounted(true);
    const current = getConsent();
    if (!current) setOpen(true);
    const reopen = () => {
      const c = getConsent();
      setAnalytics(!!c?.analytics);
      setMarketing(!!c?.marketing);
      setDetails(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, reopen);
  }, []);

  if (!mounted || !open) return null;

  const decide = (a: boolean, m: boolean) => {
    saveConsent({ analytics: a, marketing: m });
    setOpen(false);
    setDetails(false);
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      className="no-print fixed inset-x-0 bottom-0 z-[100] bg-bbq-black text-bbq-cream border-t-4 border-bbq-yellow shadow-[0_-8px_0_0_rgba(0,0,0,0.25)] font-sans"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
        <div className="flex flex-col gap-2">
          <h2 id="cookie-title" className="m-0 font-black uppercase text-lg tracking-tight">Cookies</h2>
          <p className="m-0 text-sm leading-relaxed max-w-3xl">
            Usamos cookies e tecnologias semelhantes para perceber como o site é usado e medir os nossos anúncios. Só os ligamos se aceitares. Podes mudar de ideias a qualquer momento em «Cookies», no fundo da página.{' '}
            <a href="/privacy" className="text-bbq-yellow underline">Política de privacidade</a>
          </p>
        </div>

        {details && (
          <div className="max-w-3xl">
            <Toggle label="Essenciais" desc="Necessários para o site funcionar e para guardar esta escolha. Estão sempre ligados." checked disabled />
            <Toggle label="Estatística" desc="Google Analytics e PostHog: páginas vistas e utilização do site, para o melhorarmos." checked={analytics} onChange={setAnalytics} />
            <Toggle label="Marketing" desc="Google Ads e Meta (Facebook e Instagram): medir que anúncios trazem pedidos." checked={marketing} onChange={setMarketing} />
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {details ? (
            <button type="button" onClick={() => decide(analytics, marketing)} className="min-h-[48px] px-5 bg-bbq-yellow text-bbq-black border-2 border-bbq-yellow font-black uppercase text-sm tracking-wider">
              Guardar escolha
            </button>
          ) : (
            <button type="button" onClick={() => setDetails(true)} className="min-h-[48px] px-5 bg-transparent text-bbq-cream border-2 border-bbq-cream/50 font-black uppercase text-sm tracking-wider underline-offset-4">
              Escolher
            </button>
          )}
          <button type="button" onClick={() => decide(false, false)} className="min-h-[48px] px-5 bg-bbq-cream text-bbq-black border-2 border-bbq-cream font-black uppercase text-sm tracking-wider">
            Rejeitar
          </button>
          <button type="button" onClick={() => decide(true, true)} className="min-h-[48px] px-5 bg-bbq-cream text-bbq-black border-2 border-bbq-cream font-black uppercase text-sm tracking-wider">
            Aceitar tudo
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
