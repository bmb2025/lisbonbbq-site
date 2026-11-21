-- POR APLICAR no Supabase do LisbonBBQ (antes do merge).
-- Datas exclusivas da waiting list: o anúncio leva a frase «48 horas só para a lista».
-- Por defeito false (as datas de 6 e 13/12 já são públicas no site).
alter table public.workshop_editions add column if not exists list_only boolean not null default false;

-- Recria a vista para incluir a coluna nova.
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
