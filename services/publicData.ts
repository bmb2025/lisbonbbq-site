// Leituras públicas do Supabase a partir do browser, com a chave publishable
// (equivalente à anon): só vê o que as políticas RLS deixam — testemunhos com
// published = true e as colunas de showcase de eventos com published = true e
// showcase = true. NUNCA usar aqui a SUPABASE_SERVICE_ROLE_KEY.
// fetch direto ao PostgREST em vez do supabase-js para não pesar no bundle da
// homepage.
const SUPABASE_URL = 'https://mlqdpjiolbyewcumvajn.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_vSHFxiGX5o4IAoHFB54g3Q_fVd5to_S';

export interface Testimonial {
  id: string;
  author_name: string;
  quote: string;
  venue_label: string | null;
  event_id: string | null;
}

export interface ShowcaseEvent {
  id: string;
  showcase_name: string | null;
  showcase_blurb: string | null;
  guest_count: number | null;
  showcase_images: string[] | null;
  showcase_url: string | null;
  venue_name: string | null;
  starts_at: string;
}

async function rest<T>(path: string): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_PUBLISHABLE_KEY },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}`);
  return res.json();
}

export function fetchTestimonials(): Promise<Testimonial[]> {
  return rest<Testimonial[]>(
    'testimonials?select=id,author_name,quote,venue_label,event_id&published=eq.true&order=sort_order.asc,created_at.asc'
  );
}

export function fetchShowcaseEvents(limit = 6): Promise<ShowcaseEvent[]> {
  return rest<ShowcaseEvent[]>(
    `events?select=id,showcase_name,showcase_blurb,guest_count,showcase_images,showcase_url,venue_name,starts_at&published=eq.true&showcase=eq.true&order=starts_at.desc&limit=${limit}`
  );
}

// Um único pedido partilhado pelos testemunhos e pelos cards de eventos.
let testimonialsPromise: Promise<Testimonial[]> | null = null;
export function getTestimonials(): Promise<Testimonial[]> {
  if (!testimonialsPromise) {
    testimonialsPromise = fetchTestimonials().catch((err) => {
      testimonialsPromise = null;
      throw err;
    });
  }
  return testimonialsPromise;
}
