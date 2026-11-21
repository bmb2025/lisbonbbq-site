-- POR APLICAR no projeto Supabase mlqdpjiolbyewcumvajn (antes do merge).
-- Giftbox: voucher digital de 1 lugar no workshop, válido 12 meses.
create table if not exists public.workshop_gift_vouchers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  code text not null unique,
  buyer_name text not null,
  buyer_email text not null,
  recipient_name text,
  message text,
  amount_cents int not null,
  lang text not null default 'pt',
  consent boolean not null default false,
  consent_at timestamptz,
  consent_text text,
  utm jsonb,
  status text not null default 'pending' check (status in ('pending','paid','redeemed','expired','cancelled','refunded')),
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  expires_at timestamptz,
  paid_at timestamptz,
  valid_until date,
  email_sent_at timestamptz,
  redeemed_at timestamptz,
  redeemed_booking_id uuid references public.workshop_bookings(id)
);
create index if not exists workshop_gift_vouchers_status_idx on public.workshop_gift_vouchers(status);
alter table public.workshop_gift_vouchers enable row level security;

-- Reserva feita com voucher (o voucher cobre 1 lugar).
alter table public.workshop_bookings add column if not exists gift_code text;
