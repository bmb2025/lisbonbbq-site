-- Já aplicada no projeto Supabase mlqdpjiolbyewcumvajn a 2026-11-16 (via MCP).
-- Fica aqui como registo do esquema usado por api/workshop-waitlist.ts.
create table if not exists public.workshop_editions (
  id text primary key,
  date date not null,
  start_time time not null,
  end_time time not null,
  title_pt text not null,
  title_en text not null,
  location text not null default 'Lisboa',
  price_cents int not null,
  invite_price_cents int,
  max_attendees int not null default 16,
  status text not null default 'available' check (status in ('available','sold_out','cancelled','draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workshop_bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  edition_id text not null references public.workshop_editions(id),
  name text not null,
  email text not null,
  phone text not null,
  quantity int not null check (quantity between 1 and 6),
  unit_price_cents int not null,
  amount_cents int not null,
  invite_code text,
  waitlist_id uuid references public.workshop_waitlist(id),
  lang text not null default 'pt',
  consent boolean not null default false,
  consent_at timestamptz,
  consent_text text,
  utm jsonb,
  status text not null default 'pending' check (status in ('pending','paid','expired','cancelled','refunded')),
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  payment_method text,
  expires_at timestamptz,
  paid_at timestamptz,
  confirmation_sent_at timestamptz
);
create index if not exists workshop_bookings_edition_idx on public.workshop_bookings(edition_id, status);

alter table public.workshop_editions enable row level security;
alter table public.workshop_bookings enable row level security;

create or replace view public.workshop_editions_with_status with (security_invoker = true) as
select e.*,
  coalesce((select sum(b.quantity) from public.workshop_bookings b
     where b.edition_id = e.id and (b.status = 'paid' or (b.status = 'pending' and b.expires_at > now()))), 0)::int as taken,
  case
    when e.status in ('cancelled','draft') then e.status
    when e.date < (now() at time zone 'Europe/Lisbon')::date then 'past'
    when coalesce((select sum(b.quantity) from public.workshop_bookings b
       where b.edition_id = e.id and (b.status = 'paid' or (b.status = 'pending' and b.expires_at > now()))), 0) >= e.max_attendees then 'sold_out'
    else e.status
  end as effective_status
from public.workshop_editions e;

-- Primeira data aberta
insert into public.workshop_editions (id, date, start_time, end_time, title_pt, title_en, location, price_cents, invite_price_cents, max_attendees, status)
values ('ws-2026-11-29', '2026-11-29', '12:00', '15:00',
  'Grelhada mista: portuguesa, brasileira e argentina', 'Mixed grill: Portuguese, Brazilian and Argentinian',
  'Lisboa', 11000, 9000, 16, 'available')
on conflict (id) do nothing;
