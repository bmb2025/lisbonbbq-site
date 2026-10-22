// Consentimento de cookies e tecnologias semelhantes (RGPD / ePrivacy).
//
// Duas categorias opcionais, ambas desligadas até a pessoa escolher:
//  - analytics: Google Analytics 4 e PostHog (estatística de utilização)
//  - marketing: Google Ads e Meta Pixel (medição de anúncios)
//
// O Google Consent Mode v2 arranca em "denied" no <head> de index.html, antes de
// qualquer tag da Google; aqui só fazemos o "update". O PostHog e o Meta Pixel
// só são carregados depois de haver consentimento (ver services/analytics.ts).

export interface Consent {
  v: 1;
  analytics: boolean;
  marketing: boolean;
  ts: string;
}

// Mudar a chave (v2…) volta a pedir consentimento a toda a gente — fazer isso
// quando se acrescenta uma ferramenta nova que a pessoa ainda não aceitou.
export const CONSENT_KEY = 'lbbq_consent_v1';
export const CONSENT_EVENT = 'lbbq-consent-change';
export const OPEN_SETTINGS_EVENT = 'lbbq-open-cookie-settings';

export function getConsent(): Consent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw);
    if (c && c.v === 1 && typeof c.analytics === 'boolean' && typeof c.marketing === 'boolean') return c;
  } catch {
    /* storage bloqueado ou valor inválido: trata como sem resposta */
  }
  return null;
}

function updateGoogleConsent(c: Pick<Consent, 'analytics' | 'marketing'>) {
  const gtag = (window as any).gtag;
  if (typeof gtag !== 'function') return;
  gtag('consent', 'update', {
    analytics_storage: c.analytics ? 'granted' : 'denied',
    ad_storage: c.marketing ? 'granted' : 'denied',
    ad_user_data: c.marketing ? 'granted' : 'denied',
    ad_personalization: c.marketing ? 'granted' : 'denied',
  });
}

export function saveConsent(choice: { analytics: boolean; marketing: boolean }) {
  const c: Consent = { v: 1, analytics: choice.analytics, marketing: choice.marketing, ts: new Date().toISOString() };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
  } catch {
    /* sem storage: a escolha vale só para esta visita */
  }
  updateGoogleConsent(c);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: c }));
  return c;
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}
