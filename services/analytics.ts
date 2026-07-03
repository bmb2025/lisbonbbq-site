import posthog from 'posthog-js';

// PostHog project "lisbonbbq.pt" (EU cloud). The key is publishable by design.
const POSTHOG_KEY = 'phc_mfn7B3EMiV3iEDQjRvWWJAREZhdeQs2wSVpAh5WgxuUn';
const POSTHOG_HOST = 'https://eu.i.posthog.com';

// Only track the real production domain — keeps localhost/dev and preview
// deployments out of the analytics.
const PROD_HOSTS = ['lisbonbbq.pt', 'www.lisbonbbq.pt'];

// Google Ads conversion action "Pedido de orçamento — lisbonbbq.pt" (conta 792-139-3201).
// Fired on completed lead forms so Google Ads optimizes for real leads, not clicks.
const ADS_CONVERSION_SEND_TO = 'AW-17958063640/xmUkCOivjcocEJicifNC';
const ADS_CONVERSION_EVENTS = ['quote_request_submitted', 'corporate_form_submitted'];

let enabled = false;

export function initAnalytics() {
  if (typeof window === 'undefined') return;
  if (!PROD_HOSTS.includes(window.location.hostname)) return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    // SPA: capture a $pageview on every history change, not just the first load.
    capture_pageview: 'history_change',
    capture_pageleave: true,
    // localStorage persistence — no analytics cookies.
    persistence: 'localStorage',
  });
  enabled = true;
}

export function track(event: string, properties?: Record<string, any>) {
  if (!enabled) return;
  posthog.capture(event, properties);

  // Mirror conversion events to GA4 (gtag already on the page) so they can be
  // marked as key events and imported into Google Ads as conversions.
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
