import { lazy } from 'react';

// Cada página é um chunk próprio: quem abre /workshop não descarrega o código da
// homepage, do corporate, do admin, etc. Os mesmos carregadores servem o
// React.lazy e o preloadRoute, por isso o chunk pedido antes do arranque é o
// que a rota usa depois.
const loaders = {
  home: () => import('./components/HomePage'),
  blog: () => import('./components/BlogComponents'),
  about: () => import('./components/QuemSomosView'),
  proposal: () => import('./components/ProposalView'),
  workshop: () => import('./components/WorkshopView'),
  legal: () => import('./components/LegalView'),
  faqs: () => import('./components/FAQView'),
  smallEvents: () => import('./components/SmallEventsView'),
  corporate: () => import('./components/CorporateView'),
  cms: () => import('./components/CMSComponents'),
  event: () => import('./components/EventPageView'),
  notFound: () => import('./components/NotFoundView'),
};

export const HomePage = lazy(() => loaders.home().then((m) => ({ default: m.HomePage })));
export const BlogList = lazy(() => loaders.blog().then((m) => ({ default: m.BlogList })));
export const ArticleDetail = lazy(() => loaders.blog().then((m) => ({ default: m.ArticleDetail })));
export const QuemSomosView = lazy(() => loaders.about().then((m) => ({ default: m.QuemSomosView })));
export const ProposalView = lazy(() => loaders.proposal().then((m) => ({ default: m.ProposalView })));
export const WorkshopView = lazy(() => loaders.workshop().then((m) => ({ default: m.WorkshopView })));
export const LegalView = lazy(() => loaders.legal().then((m) => ({ default: m.LegalView })));
export const FAQView = lazy(() => loaders.faqs().then((m) => ({ default: m.FAQView })));
export const SmallEventsView = lazy(() => loaders.smallEvents().then((m) => ({ default: m.SmallEventsView })));
export const CorporateView = lazy(() => loaders.corporate().then((m) => ({ default: m.CorporateView })));
export const BlogAdmin = lazy(() => loaders.cms().then((m) => ({ default: m.BlogAdmin })));
export const EventPageView = lazy(() => loaders.event().then((m) => ({ default: m.EventPageView })));
export const NotFoundView = lazy(() => loaders.notFound().then((m) => ({ default: m.NotFoundView })));

// O arranque (index.tsx) espera por este chunk antes de montar o React: o HTML
// pré-renderizado continua visível entretanto, em vez de dar lugar a um ecrã em
// branco enquanto o chunk da rota chega.
export function preloadRoute(pathname: string): Promise<unknown> {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (path === '/') return loaders.home();
  if (path === '/blog' || path.startsWith('/blog/')) return loaders.blog();
  if (path === '/quem-somos') return loaders.about();
  if (path === '/proposal') return loaders.proposal();
  if (path === '/workshop') return loaders.workshop();
  if (path === '/privacy' || path === '/terms') return loaders.legal();
  if (path === '/faqs') return loaders.faqs();
  if (path === '/espaco-para-eventos-pequenos') return loaders.smallEvents();
  if (path === '/corporate') return loaders.corporate();
  if (path === '/admin') return loaders.cms();
  if (path.startsWith('/e/')) return loaders.event();
  return loaders.notFound();
}
