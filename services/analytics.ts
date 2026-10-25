import posthog from 'posthog-js';
import { getConsent, CONSENT_EVENT, Consent } from './consent';

// The env vars are not set in the Vercel project, so the build shipped
// posthog.init(undefined) and killed all SPA tracking. The key is publishable
// by design — fall back to the project values so analytics can never be
// silently disabled by a missing env config again.
const POSTHOG_KEY =
  (import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN as string) ||
  'phc_mfn7B3EMiV3iEDQjRvWWJAREZhdeQs2wSVpAh5WgxuUn';
const POSTHOG_HOST =
  (import.meta.env.VITE_PUBLIC_POSTHOG_HOST as string) || 'https://eu.i.posthog.com';

// Only track the real production domain — keeps localhost/dev and preview
// deployments out of the analytics.
const PROD_HOSTS = ['lisbonbbq.pt', 'www.lisbonbbq.pt'];

// Google Ads conversion action "Pedido de orçamento — lisbonbbq.pt" (conta 792-139-3201).
// Fired on completed lead forms so Google Ads optimizes for real leads, not clicks.
const ADS_CONVERSION_SEND_TO = 'AW-17958063640/xmUkCOivjcocEJicifNC';
const ADS_CONVERSION_EVENTS = ['quote_request_submitted', 'corporate_form_submitted'];

// Meta Pixel: só existe se VITE_META_PIXEL_ID estiver definido na Vercel e só
// carrega com consentimento de marketing.
const META_PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID as string) || '';
// Eventos do site que seguem para a Meta, e com que evento padrão.
// Pedidos de orçamento (homepage e corporate) são "Lead"; distinguem-se pelo
// content_name em conversões personalizadas no Gestor de Eventos.
// A waiting list do workshop vai como "CompleteRegistration" para não se misturar
// com os pedidos de orçamento quando uma campanha otimiza para Lead.
const META_EVENTS: Record<string, string> = {
  quote_request_submitted: 'Lead',
  corporate_form_submitted: 'Lead',
  workshop_waitlist_submitted: 'CompleteRegistration',
};

let prod = false;      // domínio de produção: só aqui se mede alguma coisa
let enabled = false;   // PostHog ativo (consentimento de estatística)
let pixelLoaded = false;

export function getPostHogInstance() {
  return posthog;
}

function startPostHog() {
  if (enabled) {
    posthog.opt_in_capturing();
    return;
  }
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    defaults: '2026-01-30',
    // SPA: capture a $pageview on every history change, not just the first load.
    capture_pageview: 'history_change',
    capture_pageleave: true,
    // localStorage persistence — no analytics cookies.
    persistence: 'localStorage',
  });
  enabled = true;
}

function loadMetaPixel() {
  if (pixelLoaded || !META_PIXEL_ID) return;
  /* eslint-disable */
  // Snippet oficial da Meta (fbevents.js), sem a tag <noscript>.
  (function (f: any, b: any, e: any, v: any) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); });
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
    const t = b.createElement(e); t.async = true; t.src = v;
    const s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  (window as any).fbq('init', META_PIXEL_ID);
  (window as any).fbq('track', 'PageView');
  pixelLoaded = true;
}

function applyConsent(c: Pick<Consent, 'analytics' | 'marketing'> | null) {
  if (!prod) return;
  if (c?.analytics) startPostHog();
  else if (enabled) posthog.opt_out_capturing();

  if (c?.marketing) loadMetaPixel();
  else if (pixelLoaded) (window as any).fbq?.('consent', 'revoke');
}

export function initAnalytics() {
  if (typeof window === 'undefined') return;
  if (!PROD_HOSTS.includes(window.location.hostname)) return;
  prod = true;
  applyConsent(getConsent());
  window.addEventListener(CONSENT_EVENT, (e) => applyConsent((e as CustomEvent<Consent>).detail));
}

export function track(event: string, properties?: Record<string, any>) {
  if (!prod) return;
  if (enabled) posthog.capture(event, properties);

  const metaEvent = META_EVENTS[event];
  if (pixelLoaded && metaEvent) {
    (window as any).fbq?.('track', metaEvent, { content_name: event });
  }

  // Mirror conversion events to GA4 (gtag already on the page) so they can be
  // marked as key events and imported into Google Ads as conversions. O Consent
  // Mode decide o que a Google pode guardar ou associar: sem consentimento, só
  // seguem sinais sem cookies.
  // As tags da Google carregam depois do load (index.html); aqui garante-se que
  // já estão a caminho quando há um evento para enviar.
  (window as any).lbbqLoadGoogleTags?.();
  const gtag = (window as any).gtag;
  if (typeof gtag === 'function') {
    const params: Record<string, any> = {};
    for (const [k, v] of Object.entries(properties ?? {})) {
      // GA4 params must be scalars — flatten arrays.
      params[k] = Array.isArray(v) ? v.join(',') : v;
    }
    gtag('event', event, params);

    // Google Ads: completed lead forms count as the "Pedido de orçamento"
    // conversion action (uploaded with the gclid captured by the tag).
    if (ADS_CONVERSION_EVENTS.includes(event)) {
      gtag('event', 'conversion', {
        send_to: ADS_CONVERSION_SEND_TO,
        value: 1.0,
        currency: 'EUR',
      });
    }
  }
}

// Ties the anonymous visitor to the lead once we know who they are.
export function identifyLead(props: { email?: string; name?: string; phone?: string }) {
  if (!enabled) return;
  const distinctId = props.email?.trim().toLowerCase() || props.phone?.trim();
  if (!distinctId) return;
  posthog.identify(distinctId, {
    ...(props.email ? { email: props.email } : {}),
    ...(props.name ? { name: props.name } : {}),
    ...(props.phone ? { phone: props.phone } : {}),
  });
}
