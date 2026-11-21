-- POR APLICAR no projeto Supabase do LisbonBBQ (antes do merge).
-- Anúncio «Abriram novas datas» à waiting list.
--
-- Como aprovar um anúncio (o envio sai no cron diário das 10:00 UTC a seguir):
--   update public.workshop_editions set announce_at = now() where id in ('ws-2026-12-06','ws-2026-12-13');
-- Para enviar logo, em vez de esperar pelo cron, pede ao CEO para disparar o cron na Vercel.

alter table public.workshop_editions add column if not exists announce_at timestamptz;   -- aprovado pelo Bruno
alter table public.workshop_editions add column if not exists announced_at timestamptz;  -- enviado

-- Quem já recebeu o anúncio de cada edição (nunca recebe duas vezes).
create table if not exists public.workshop_waitlist_notified (
  waitlist_id uuid not null references public.workshop_waitlist(id) on delete cascade,
  edition_id text not null references public.workshop_editions(id) on delete cascade,
  sent_at timestamptz not null default now(),
  primary key (waitlist_id, edition_id)
);
alter table public.workshop_waitlist_notified enable row level security;

-- A vista com o estado efetivo passa a expor as colunas novas. Tem de ser apagada e
-- recriada: «create or replace» não deixa acrescentar colunas no meio (e.*).
drop view if exists public.workshop_editions_with_status;
create view public.workshop_editions_with_status with (security_invoker = true) as
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
