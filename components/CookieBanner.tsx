import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getConsent, saveConsent, OPEN_SETTINGS_EVENT, LANG_EVENT } from '../services/consent';

// Aviso de cookies para o site todo. Fica fora de #root (portal para <body>)
// para os snapshots de scripts/prerender-snapshots.mjs, que copiam só o
// conteúdo de #root, não o apanharem.
//
// "Aceitar tudo" vai a amarelo; "Rejeitar" e "Escolher"/"Guardar" a preto, com
// o mesmo tamanho e contorno visível para recusar continuar a ser fácil.

type Lang = 'pt' | 'en';

const COPY = {
  pt: {
    intro: 'Usamos cookies e tecnologias semelhantes para perceber como o site é usado e medir os nossos anúncios. Só os ligamos se aceitares. Podes mudar de ideias a qualquer momento em «Cookies», no fundo da página.',
    privacy: 'Política de privacidade',
    essential: 'Essenciais',
    essentialDesc: 'Necessários para o site funcionar e para guardar esta escolha. Estão sempre ligados.',
    stats: 'Estatística',
    statsDesc: 'Google Analytics e PostHog: páginas vistas e utilização do site, para o melhorarmos.',
    marketing: 'Marketing',
    marketingDesc: 'Google Ads e Meta (Facebook e Instagram): medir que anúncios trazem pedidos.',
    save: 'Guardar escolha',
    choose: 'Escolher',
    reject: 'Rejeitar',
    accept: 'Aceitar tudo',
  },
  en: {
    intro: 'We use cookies and similar technologies to understand how the site is used and to measure our ads. We only switch them on if you accept. You can change your mind at any time under “Cookies”, at the bottom of the page.',
    privacy: 'Privacy policy',
    essential: 'Essential',
    essentialDesc: 'Needed for the site to work and to save this choice. Always on.',
    stats: 'Statistics',
    statsDesc: 'Google Analytics and PostHog: page views and how the site is used, so we can improve it.',
    marketing: 'Marketing',
    marketingDesc: 'Google Ads and Meta (Facebook and Instagram): measure which ads bring requests.',
    save: 'Save choice',
    choose: 'Choose',
    reject: 'Reject',
    accept: 'Accept all',
  },
};

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
  const [lang, setLang] = useState<Lang>('pt');

  useEffect(() => {
    setMounted(true);
    setLang(document.documentElement.lang === 'en' ? 'en' : 'pt');
    const onLang = (e: Event) => setLang((e as CustomEvent<Lang>).detail === 'en' ? 'en' : 'pt');
    window.addEventListener(LANG_EVENT, onLang);
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
    return () => {
      window.removeEventListener(OPEN_SETTINGS_EVENT, reopen);
      window.removeEventListener(LANG_EVENT, onLang);
    };
  }, []);

  if (!mounted || !open) return null;

  const c = COPY[lang];

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
            {c.intro}{' '}
            <a href="/privacy" className="text-bbq-yellow underline">{c.privacy}</a>
          </p>
        </div>

        {details && (
          <div className="max-w-3xl">
            <Toggle label={c.essential} desc={c.essentialDesc} checked disabled />
            <Toggle label={c.stats} desc={c.statsDesc} checked={analytics} onChange={setAnalytics} />
            <Toggle label={c.marketing} desc={c.marketingDesc} checked={marketing} onChange={setMarketing} />
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {details ? (
            <button type="button" onClick={() => decide(analytics, marketing)} className="min-h-[48px] px-5 bg-bbq-black text-bbq-cream border-2 border-bbq-cream font-black uppercase text-sm tracking-wider">
              {c.save}
            </button>
          ) : (
            <button type="button" onClick={() => setDetails(true)} className="min-h-[48px] px-5 bg-bbq-black text-bbq-cream border-2 border-bbq-cream font-black uppercase text-sm tracking-wider">
              {c.choose}
            </button>
          )}
          <button type="button" onClick={() => decide(false, false)} className="min-h-[48px] px-5 bg-bbq-black text-bbq-cream border-2 border-bbq-cream font-black uppercase text-sm tracking-wider">
            {c.reject}
          </button>
          <button type="button" onClick={() => decide(true, true)} className="min-h-[48px] px-5 bg-bbq-yellow text-bbq-black border-2 border-bbq-yellow font-black uppercase text-sm tracking-wider">
            {c.accept}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
