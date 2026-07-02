import posthog from 'posthog-js';

// PostHog project "lisbonbbq.pt" (EU cloud). The key is publishable by design.
const POSTHOG_KEY = 'phc_mfn7B3EMiV3iEDQjRvWWJAREZhdeQs2wSVpAh5WgxuUn';
const POSTHOG_HOST = 'https://eu.i.posthog.com';

// Only track the real production domain — keeps localhost/dev and preview
// deployments out of the analytics.
const PROD_HOSTS = ['lisbonbbq.pt', 'www.lisbonbbq.pt'];

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
