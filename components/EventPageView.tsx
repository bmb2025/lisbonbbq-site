import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Flame, Check, X, MapPin, Music, Camera, Star, Instagram, Linkedin, Twitter,
  MessageCircle, Sun, Cloud, CloudRain, CloudLightning, CloudFog, Snowflake, Calendar
} from 'lucide-react';
import { EVENT_SOCIALS } from '../constants';
import { EventRecord, EventMenuItem, DailyWeather } from '../types';
import { WelcomeDrinkPopup } from './WelcomeDrinkPopup';

const DIET_OPTIONS: { value: string; icon: string; label: string }[] = [
  { value: 'nenhuma', icon: '🥩', label: 'Como de tudo' },
  { value: 'vegetariano', icon: '🥗', label: 'Vegetariano' },
  { value: 'vegano', icon: '🌱', label: 'Vegano' },
  { value: 'gluten', icon: '🌾', label: 'Sem glúten' },
  { value: 'lactose', icon: '🥛', label: 'Sem lactose' },
  { value: 'alergia', icon: '⚠️', label: 'Tenho alergia' },
];

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  instagram: <Instagram size={20} />,
  linkedin: <Linkedin size={20} />,
  x: <Twitter size={20} />,
  whatsapp: <MessageCircle size={20} />,
};

const btnBase = 'inline-flex items-center justify-center gap-2 border-4 border-bbq-black shadow-hard-sm px-6 py-3.5 font-black uppercase text-sm tracking-tight transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer no-underline';
const btnDark = `${btnBase} bg-bbq-black text-bbq-cream`;
const btnLight = `${btnBase} bg-bbq-cream text-bbq-black`;
const btnFlame = `${btnBase} bg-bbq-yellow text-bbq-black`;

const Card: React.FC<{ bg?: string; className?: string; children: React.ReactNode }> = ({ bg = 'bg-white', className = '', children }) => (
  <div className={`${bg} border-4 border-bbq-black shadow-hard-sm p-6 ${className}`}>{children}</div>
);

const SectionHead: React.FC<{ n: string; children: React.ReactNode }> = ({ n, children }) => (
  <div className="flex items-end gap-4 mb-8 flex-wrap">
    <span className="text-xs font-black bg-bbq-black text-bbq-yellow px-2.5 py-1.5 tracking-wider">{n}</span>
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">{children}</h2>
  </div>
);

function formatDatePt(iso: string | null, tz: string, opts: Intl.DateTimeFormatOptions = {}) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-PT', { timeZone: tz, ...opts });
}

function formatTimePt(iso: string, tz: string) {
  return new Date(iso).toLocaleTimeString('pt-PT', { timeZone: tz, hour: '2-digit', minute: '2-digit' });
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function useCountdown(target: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  const d = Math.floor(diff / 864e5);
  const h = Math.floor((diff % 864e5) / 36e5);
  const m = Math.floor((diff % 36e5) / 6e4);
  const s = Math.floor((diff % 6e4) / 1e3);
  const pad = (n: number) => String(n).padStart(2, '0');
  return { d: pad(d), h: pad(h), m: pad(m), s: pad(s), label: `${d}d ${pad(h)}h${pad(m)}` };
}

const WeatherIcon: React.FC<{ code: number; size?: number }> = ({ code, size = 22 }) => {
  if (code === 0) return <Sun size={size} />;
  if (code >= 1 && code <= 3) return <Cloud size={size} />;
  if (code === 45 || code === 48) return <CloudFog size={size} />;
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return <CloudRain size={size} />;
  if (code >= 71 && code <= 77) return <Snowflake size={size} />;
  if (code >= 95) return <CloudLightning size={size} />;
  return <Sun size={size} />;
};

export const EventPageView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [menuItems, setMenuItems] = useState<EventMenuItem[]>([]);
  const [status, setStatus] = useState<'loading' | 'ok' | 'notfound'>('loading');
  const [weather, setWeather] = useState<DailyWeather | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/events/${slug}`)
      .then(r => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(data => {
        if (cancelled) return;
        setEvent(data.event);
        setMenuItems(data.menuItems || []);
        setStatus('ok');
      })
      .catch(() => { if (!cancelled) setStatus('notfound'); });
    return () => { cancelled = true; };
  }, [slug]);

  const daysUntil = event ? Math.ceil((new Date(event.starts_at).getTime() - Date.now()) / 864e5) : null;

  useEffect(() => {
    if (!event?.lat || !event?.lng || daysUntil === null || daysUntil > 7 || daysUntil < 0) return;
    let cancelled = false;
    const dateStr = event.starts_at.slice(0, 10);
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${event.lat}&longitude=${event.lng}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FLisbon&forecast_days=16`)
      .then(r => r.json())
      .then(data => {
        if (cancelled || !data?.daily?.time) return;
        const idx = data.daily.time.indexOf(dateStr);
        if (idx === -1) return;
        setWeather({
          date: dateStr,
          maxTemp: Math.round(data.daily.temperature_2m_max[idx]),
          minTemp: Math.round(data.daily.temperature_2m_min[idx]),
          code: data.daily.weather_code[idx],
        });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [event?.lat, event?.lng, event?.starts_at, daysUntil]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-bbq-cream flex items-center justify-center">
        <meta name="robots" content="noindex, nofollow" />
        <Flame className="animate-pulse text-bbq-yellow" size={40} />
      </div>
    );
  }

  if (status === 'notfound' || !event) {
    return (
      <div className="min-h-screen bg-bbq-cream flex items-center justify-center text-center px-6">
        <meta name="robots" content="noindex, nofollow" />
        <title>Evento não encontrado · LisbonBBQ</title>
        <div>
          <h1 className="text-3xl font-black uppercase mb-2">Página não encontrada</h1>
          <p>Este link de evento não existe ou já não está disponível.</p>
        </div>
      </div>
    );
  }

  // Secções opcionais só aparecem quando há dados reais (nunca botões/links
  // fictícios para placeholders por preencher) — por isso a numeração é
  // calculada dinamicamente em vez de fixa, para não haver saltos (ex.: "06"
  // seguido de "09") quando um evento não tem playlist ou álbum.
  const hasMenu = menuItems.length > 0;
  const hasChegar = event.getting_there.length > 0;
  const hasBring = event.bring_items.length > 0 || event.skip_items.length > 0;
  const hasRules = event.house_rules.length > 0;
  const hasPlaylist = !!event.playlist_url;
  const hasAfter = !!(event.album_url || event.review_url || event.show_photographer_card);

  let n = 0;
  const num = () => String(++n).padStart(2, '0');
  const nEssential = num();
  const nMenu = hasMenu ? num() : null;
  const nSocials = num();
  const nDiet = num();
  const nBring = hasBring ? num() : null;
  const nChegar = hasChegar ? num() : null;
  const nRules = hasRules ? num() : null;
  const nPlaylist = hasPlaylist ? num() : null;
  const nAfter = hasAfter ? num() : null;

  return (
    <div className="bg-bbq-cream text-bbq-black font-sans">
      <meta name="robots" content="noindex, nofollow" />
      <title>{event.title} · LisbonBBQ</title>
      <WelcomeDrinkPopup event={event} />
      <EventTopBar event={event} />
      <EventHero event={event} />
      <EventCountdown event={event} />
      <EventEssential event={event} n={nEssential} />
      {hasMenu && <EventMenu event={event} menuItems={menuItems} n={nMenu!} />}
      {weather && <EventWeather weather={weather} />}
      <EventSocials event={event} n={nSocials} />
      <EventDiet event={event} n={nDiet} />
      {hasBring && <EventBring event={event} n={nBring!} />}
      {hasChegar && <EventGettingThere event={event} n={nChegar!} />}
      {hasRules && <EventRules event={event} n={nRules!} />}
      {hasPlaylist && <EventPlaylist event={event} n={nPlaylist!} />}
      {hasAfter && <EventAfter event={event} n={nAfter!} />}
      <EventReferral event={event} />
      <EventFooter />
    </div>
  );
};

const EventTopBar: React.FC<{ event: EventRecord }> = ({ event }) => {
  const cd = useCountdown(event.starts_at);
  return (
    <div className="sticky top-0 z-50 bg-bbq-black text-bbq-cream flex items-center justify-between gap-3 px-5 py-3 border-b-4 border-bbq-black">
      <div className="font-black uppercase text-xs sm:text-sm tracking-wide flex items-center gap-2 min-w-0">
        <Flame size={16} className="text-bbq-yellow flex-none" />
        <span className="truncate">LISBON <span className="text-bbq-yellow">Barbecue &amp; Churrasco</span></span>
      </div>
      <div className="hidden sm:block text-xs font-black uppercase tracking-widest">
        Faltam <b className="text-bbq-yellow">{cd.label}</b>
      </div>
    </div>
  );
};

const EventHero: React.FC<{ event: EventRecord }> = ({ event }) => {
  const dateLabel = formatDatePt(event.starts_at, event.timezone, { weekday: 'short', day: 'numeric', month: 'short' });
  const timeLabel = formatTimePt(event.starts_at, event.timezone);
  return (
    <header className="relative border-b-4 border-bbq-black bg-bbq-black overflow-hidden">
      {event.hero_image_url && (
        <img src={event.hero_image_url} alt={event.title} className="w-full h-[clamp(300px,48vh,480px)] object-cover opacity-50" style={{ filter: 'saturate(.9) contrast(1.05)' }} loading="eager" fetchPriority="high" />
      )}
      <div className="absolute inset-0 flex flex-col justify-end px-5 pb-9 pt-8">
        <div className="max-w-[960px] mx-auto w-full">
          <span className="inline-block bg-bbq-red text-white px-3 py-1.5 text-xs font-black uppercase tracking-widest mb-3.5">{event.hero_tag}</span>
          <h1 className="text-bbq-cream font-black uppercase leading-[0.88] text-[clamp(36px,8vw,80px)] tracking-tight" style={{ textShadow: '5px 5px 0 rgba(0,0,0,.35)' }}>
            {event.title}
          </h1>
          <div className="mt-4 text-bbq-cream font-bold uppercase text-[clamp(14px,2.4vw,19px)] tracking-wide">
            {dateLabel} · {timeLabel} · {event.venue_name}
          </div>
        </div>
      </div>
    </header>
  );
};

const EventCountdown: React.FC<{ event: EventRecord }> = ({ event }) => {
  const cd = useCountdown(event.starts_at);
  const boxes: [string, string][] = [[cd.d, 'dias'], [cd.h, 'horas'], [cd.m, 'min'], [cd.s, 'seg']];
  return (
    <div className="bg-bbq-yellow border-b-4 border-bbq-black py-7">
      <div className="max-w-[960px] mx-auto px-5">
        <div className="grid grid-cols-4 gap-2.5 max-w-[520px] mx-auto mb-5">
          {boxes.map(([v, l]) => (
            <div key={l} className="bg-bbq-cream border-4 border-bbq-black shadow-hard-sm text-center py-3 px-1">
              <b className="block text-[clamp(26px,7vw,40px)] font-black leading-none tabular-nums">{v}</b>
              <small className="text-[9px] font-black uppercase tracking-widest">{l}</small>
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-center flex-wrap">
          <a className={btnDark} href={`/api/events/${event.slug}?action=ics`} download>
            <Calendar size={16} /> Adicionar ao calendário
          </a>
          <a className={btnLight} href="#chegar">Como chegar</a>
        </div>
      </div>
    </div>
  );
};

const EventEssential: React.FC<{ event: EventRecord; n: string }> = ({ event, n }) => {
  const bboxDelta = 0.007;
  const bbox = event.lat && event.lng
    ? `${event.lng - bboxDelta}%2C${event.lat - bboxDelta}%2C${event.lng + bboxDelta}%2C${event.lat + bboxDelta}`
    : null;
  return (
    <section className="py-16 border-b-4 border-bbq-black">
      <div className="max-w-[960px] mx-auto px-5">
        <SectionHead n={n}>O essencial</SectionHead>
        {event.essential_cards.length > 0 && (
          <div className={`grid gap-5 mb-5 ${event.essential_cards.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
            {event.essential_cards.map((c, i) => (
              <Card key={i} bg={c.variant === 'flame' ? 'bg-bbq-yellow' : 'bg-white'}>
                <h3 className="text-red-600 font-black uppercase text-sm tracking-wide mb-2.5">{c.label}</h3>
                <div className="text-[clamp(19px,3.2vw,25px)] font-black uppercase leading-tight whitespace-pre-line">{c.big}</div>
                {c.note && <div className="text-sm mt-2 opacity-75">{c.note}</div>}
              </Card>
            ))}
          </div>
        )}
        {bbox && (
          <div className="border-4 border-bbq-black shadow-hard-sm overflow-hidden h-[260px] bg-[#dcd8cd]">
            <iframe title="Mapa do local" loading="lazy" className="w-full h-full border-0" src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${event.lat}%2C${event.lng}`} />
          </div>
        )}
        {event.venue_address && (
          <div className="flex gap-3 flex-wrap mt-5">
            <a className={btnFlame} target="_blank" rel="noopener" href={`https://maps.google.com/?q=${encodeURIComponent(event.venue_address)}`}>Abrir no Google Maps</a>
            <a className={btnLight} target="_blank" rel="noopener" href={`https://maps.apple.com/?q=${encodeURIComponent(event.venue_address)}`}>Abrir no Apple Maps</a>
          </div>
        )}
      </div>
    </section>
  );
};

const SECTION_LABELS: Record<string, string> = { grelha: 'Da grelha', acompanha: 'Acompanha', bar: 'No bar' };

const EventMenu: React.FC<{ event: EventRecord; menuItems: EventMenuItem[]; n: string }> = ({ event, menuItems, n }) => {
  const bySection = (s: string) => menuItems.filter(m => m.section === s);
  return (
    <section className="py-16 border-b-4 border-bbq-black">
      <div className="max-w-[960px] mx-auto px-5">
        <SectionHead n={n}>O Churrasco</SectionHead>
        {event.menu_intro && <p className="max-w-[640px] mb-7 text-base leading-relaxed">{event.menu_intro}</p>}
        <div className="grid sm:grid-cols-2 gap-5">
          <Card>
            {(['grelha', 'acompanha'] as const).map(section => bySection(section).length > 0 && (
              <div key={section} className="mb-2">
                <h3 className="text-red-600 font-black uppercase text-sm tracking-wide mb-1">{SECTION_LABELS[section]}</h3>
                <ul>
                  {bySection(section).map(item => (
                    <li key={item.id} className="flex justify-between gap-4 items-baseline py-3 border-b-2 border-dashed border-black/20 last:border-0">
                      <span className="text-[17px] font-black uppercase">
                        {item.name}
                        {item.is_vegan && <span className="inline-block text-[9px] font-black uppercase tracking-widest border-2 border-bbq-black bg-green-600 text-white px-1.5 py-0.5 ml-1.5 align-middle">veg</span>}
                      </span>
                      <span className="text-[13px] opacity-70 text-right max-w-[52%]">{item.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Card>
          <Card>
            {bySection('bar').length > 0 && (
              <div>
                <h3 className="text-red-600 font-black uppercase text-sm tracking-wide mb-1">{SECTION_LABELS.bar}</h3>
                <ul>
                  {bySection('bar').map(item => (
                    <li key={item.id} className="flex justify-between gap-4 items-baseline py-3 border-b-2 border-dashed border-black/20 last:border-0">
                      <span className="text-[17px] font-black uppercase">{item.name}</span>
                      <span className="text-[13px] opacity-70 text-right max-w-[52%]">{item.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {event.balcao_note && (
              <div className="mt-5 border-4 border-bbq-black bg-bbq-cream p-4">
                <h3 className="font-black uppercase text-sm mb-2">Pago ao balcão</h3>
                <p className="text-sm leading-relaxed">{event.balcao_note}</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

const EventWeather: React.FC<{ weather: DailyWeather }> = ({ weather }) => (
  <section className="py-16 border-b-4 border-bbq-black">
    <div className="max-w-[960px] mx-auto px-5">
      <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-none mb-6">Vai estar bom tempo!</h2>
      <Card className="inline-flex items-center gap-4">
        <WeatherIcon code={weather.code} size={32} />
        <div className="font-black text-xl">{weather.maxTemp}° / {weather.minTemp}°</div>
      </Card>
    </div>
  </section>
);

const EventDiet: React.FC<{ event: EventRecord; n: string }> = ({ event, n }) => {
  const [diet, setDiet] = useState('nenhuma');
  const [detail, setDetail] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [optin, setOptin] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !isValidEmail(email)) { setError(true); return; }
    setError(false);
    setSending(true);
    try {
      const res = await fetch(`/api/events/${event.slug}?action=dieta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, diet, detail, marketingOptin: optin }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="dieta" className="py-16 border-b-4 border-bbq-black bg-bbq-black text-bbq-cream">
      <div className="max-w-[960px] mx-auto px-5">
        <div className="flex items-end gap-4 mb-8 flex-wrap">
          <span className="text-xs font-black bg-bbq-yellow text-bbq-black px-2.5 py-1.5 tracking-wider">{n}</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-none text-bbq-yellow">Comes de tudo?</h2>
        </div>
        {event.diet_deadline && (
          <div className="inline-flex items-center gap-2 bg-bbq-red text-white px-3.5 py-2 text-xs font-black uppercase tracking-wide mb-7">
            ⏳ Precisamos de saber até {formatDatePt(event.diet_deadline, event.timezone, { day: 'numeric', month: 'long' })}
          </div>
        )}
        <div className={`grid gap-6 items-start ${event.side_panel ? 'md:grid-cols-2' : ''}`}>
          <div>
            {!submitted ? (
              <form onSubmit={submit} className="bg-bbq-cream text-bbq-black border-4 border-bbq-cream p-6" style={{ boxShadow: '8px 8px 0 #F4B41A' }}>
                <h3 className="text-red-600 font-black uppercase text-sm mb-1.5">Ajusta o teu prato</h3>
                {event.diet_intro && <p className="text-sm mb-4">{event.diet_intro}</p>}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {DIET_OPTIONS.map(o => (
                    <label key={o.value} className="cursor-pointer">
                      <input type="radio" name="diet" value={o.value} checked={diet === o.value} onChange={() => setDiet(o.value)} className="sr-only peer" />
                      <span className={`block text-center px-1.5 py-3.5 border-4 border-bbq-black text-[11px] font-black uppercase leading-tight break-words transition-all ${diet === o.value ? 'bg-bbq-yellow shadow-hard-sm -translate-x-0.5 -translate-y-0.5' : 'bg-white'}`}>
                        <i className="block not-italic text-xl mb-1">{o.icon}</i>{o.label}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-black uppercase tracking-wide mb-1.5">Detalhes <span className="font-normal opacity-50 normal-case">(opcional)</span></label>
                  <textarea value={detail} onChange={e => setDetail(e.target.value)} placeholder="Ex: alergia a frutos secos, não como porco..." className="w-full border-4 border-bbq-black p-3 text-[15px] min-h-[70px]" />
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-black uppercase tracking-wide mb-1.5">Nome e apelido</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nome Apelido" className={`w-full border-4 p-3 text-[15px] ${error && !name.trim() ? 'border-bbq-red' : 'border-bbq-black'}`} />
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-black uppercase tracking-wide mb-1.5">O teu email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nome@exemplo.pt" className={`w-full border-4 p-3 text-[15px] ${error && !isValidEmail(email) ? 'border-bbq-red' : 'border-bbq-black'}`} />
                </div>
                <div className="flex gap-3 items-start bg-white border-3 border-bbq-black p-3.5 mb-4">
                  <input type="checkbox" checked={optin} onChange={e => setOptin(e.target.checked)} className="w-5 h-5 mt-0.5 accent-bbq-black" />
                  <label className="text-[13px] leading-snug" onClick={() => setOptin(o => !o)}>
                    <b>Sim, quero receber as fotos do evento</b> e, de vez em quando, novidades do Lisbon BBQ. Nada de spam, e sais com um clique.
                  </label>
                </div>
                <button type="submit" disabled={sending} className={`${btnFlame} w-full`}>{sending ? 'A enviar…' : 'Enviar'}</button>
                <p className="text-xs opacity-60 mt-3 leading-relaxed">Podes alterar a tua resposta submetendo de novo com o mesmo email. <a href="/privacy" className="underline">Política de privacidade</a>.</p>
                <p className="text-xs opacity-60 mt-2 leading-relaxed"><strong>Alergia grave?</strong> Fala directamente com os pitmasters: {event.allergy_contact_note}</p>
              </form>
            ) : (
              <div className="bg-bbq-yellow text-bbq-black border-4 border-bbq-black p-6" style={{ boxShadow: '8px 8px 0 #1A1A1A' }}>
                <div className="text-4xl">🔥</div>
                <h3 className="text-xl font-black uppercase mt-2.5 mb-2">Anotado.</h3>
                <p className="font-semibold">Os pitmasters já sabem. Se precisarmos de detalhes, escrevemos para <span className="underline">{email}</span>.</p>
                <button onClick={() => setSubmitted(false)} className={`${btnLight} mt-5`}>Alterar resposta</button>
              </div>
            )}
          </div>
          {event.side_panel && (
            <aside className="bg-[#242424] border-4 border-bbq-cream p-6" style={{ boxShadow: '8px 8px 0 #D91A2A' }}>
              <h3 className="text-bbq-yellow font-black uppercase text-sm mb-3.5">O que já está garantido</h3>
              <ul>
                {event.side_panel.map((item, i) => (
                  <li key={i} className="flex gap-3 py-2.5 text-sm leading-relaxed border-b-2 border-white/10 last:border-0">
                    <em className="not-italic text-base">{item.icon}</em><span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
};

const EventGettingThere: React.FC<{ event: EventRecord; n: string }> = ({ event, n }) => {
  return (
    <section id="chegar" className="py-16 border-b-4 border-bbq-black">
      <div className="max-w-[960px] mx-auto px-5">
        <SectionHead n={n}>Como chegar</SectionHead>
        <div className="grid sm:grid-cols-3 gap-5">
          {event.getting_there.map((c, i) => (
            <Card key={i} bg={i === 0 ? 'bg-bbq-black' : 'bg-white'} className={i === 0 ? 'text-bbq-cream' : ''}>
              <h3 className={`font-black uppercase text-sm mb-2.5 ${i === 0 ? 'text-bbq-yellow' : 'text-red-600'}`}>{c.icon} {c.title}</h3>
              <p className="text-[15px] leading-relaxed">{c.body}</p>
              {c.highlight && <p className="mt-2.5 font-bold text-bbq-yellow">{c.highlight}</p>}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const EventBring: React.FC<{ event: EventRecord; n: string }> = ({ event, n }) => {
  return (
    <section className="py-16 border-b-4 border-bbq-black">
      <div className="max-w-[960px] mx-auto px-5">
        <SectionHead n={n}>Bom saber</SectionHead>
        <div className={`grid gap-5 ${event.skip_items.length > 0 ? 'sm:grid-cols-2' : ''}`}>
          {event.bring_items.length > 0 && (
            <Card>
              <h3 className="font-black uppercase text-sm mb-2.5">Traz</h3>
              <ul>
                {event.bring_items.map((t, i) => (
                  <li key={i} className="flex gap-3 items-start py-2.5 text-base leading-snug">
                    <span className="flex-none w-6 h-6 border-3 border-bbq-black grid place-items-center text-[13px] font-black bg-bbq-yellow">✓</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
          {event.skip_items.length > 0 && (
            <Card>
              <h3 className="font-black uppercase text-sm mb-2.5">Não precisas de trazer</h3>
              <ul>
                {event.skip_items.map((t, i) => (
                  <li key={i} className="flex gap-3 items-start py-2.5 text-base leading-snug">
                    <span className="flex-none w-6 h-6 border-3 border-bbq-black grid place-items-center text-[13px] font-black bg-white text-bbq-red">✕</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

const EventRules: React.FC<{ event: EventRecord; n: string }> = ({ event, n }) => (
  <section className="py-16 border-b-4 border-bbq-black">
    <div className="max-w-[960px] mx-auto px-5">
      <SectionHead n={n}>Regras da casa</SectionHead>
      <ul>
        {event.house_rules.map((r, i) => (
          <li key={i} className="flex gap-3 py-2.5 border-b-2 border-black/10 last:border-0 text-[15px]">
            <b className="flex-none text-red-600 font-black uppercase text-xs tracking-wide pt-0.5 min-w-[92px]">{r.label}</b>
            <span>{r.text}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

const EventPlaylist: React.FC<{ event: EventRecord; n: string }> = ({ event, n }) => (
  <section className="py-16 border-b-4 border-bbq-black">
    <div className="max-w-[960px] mx-auto px-5">
      <SectionHead n={n}>A playlist é vossa</SectionHead>
      {event.playlist_intro && <p className="max-w-[620px] mb-5 text-base leading-relaxed">{event.playlist_intro}</p>}
      <a className={btnFlame} href={event.playlist_url!} target="_blank" rel="noopener"><Music size={16} /> Abrir no Spotify</a>
    </div>
  </section>
);

const EventAfter: React.FC<{ event: EventRecord; n: string }> = ({ event, n }) => {
  return (
    <section className="py-16 border-b-4 border-bbq-black bg-bbq-black text-bbq-cream">
      <div className="max-w-[960px] mx-auto px-5">
        <div className="flex items-end gap-4 mb-8 flex-wrap">
          <span className="text-xs font-black bg-bbq-yellow text-bbq-black px-2.5 py-1.5 tracking-wider">{n}</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-none text-bbq-yellow">Depois</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {event.album_url && (
            <div className="bg-[#242424] border-4 border-bbq-cream p-6" style={{ boxShadow: '4px 4px 0 #F4B41A' }}>
              <h3 className="text-bbq-yellow font-black uppercase text-sm mb-2.5"><Camera size={16} className="inline mr-1.5" />Álbum partilhado</h3>
              <p className="opacity-85 text-[15px]">Carreguem as fotos todas para o álbum do evento.</p>
              <a href={event.album_url} target="_blank" rel="noopener" className={`${btnFlame} w-full mt-4`}>Carregar para o álbum</a>
            </div>
          )}
          {event.review_url && (
            <div className="bg-[#242424] border-4 border-bbq-cream p-6 text-center" style={{ boxShadow: '4px 4px 0 #F4B41A' }}>
              <h3 className="text-bbq-yellow font-black uppercase text-sm mb-2.5">Como correu?</h3>
              <div className="text-2xl text-bbq-yellow tracking-[6px] my-3"><Star className="inline" fill="currentColor" size={22} /><Star className="inline" fill="currentColor" size={22} /><Star className="inline" fill="currentColor" size={22} /><Star className="inline" fill="currentColor" size={22} /><Star className="inline" fill="currentColor" size={22} /></div>
              <p className="opacity-85 text-[15px] mb-4">30 segundos do vosso tempo ajudam-nos mais do que imaginam.</p>
              <a href={event.review_url} target="_blank" rel="noopener" className={btnLight}>Deixar review no Google</a>
            </div>
          )}
          {event.show_photographer_card && (
            <div className="bg-[#242424] border-4 border-bbq-cream p-6">
              <h3 className="text-bbq-yellow font-black uppercase text-sm mb-2.5">🔥 As nossas fotos</h3>
              <p className="opacity-85 text-[15px]">O nosso fotógrafo esteve lá. Ficam disponíveis em alta resolução{event.photographer_available_at ? ` a partir de ${formatDatePt(event.photographer_available_at, event.timezone, { day: 'numeric', month: 'long' })}` : ''}.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const EventSocials: React.FC<{ event: EventRecord; n: string }> = ({ event, n }) => {
  const socials = event.socials || EVENT_SOCIALS;
  return (
    <section className="py-16 border-b-4 border-bbq-black">
      <div className="max-w-[960px] mx-auto px-5">
        <SectionHead n={n}>Segue o fogo</SectionHead>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {socials.map(s => (
            <a key={s.key} href={s.url} target="_blank" rel="noopener noreferrer" className="bg-bbq-cream border-4 border-bbq-black shadow-hard-sm px-3 py-4.5 text-center no-underline text-bbq-black hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform">
              <div className="flex justify-center">{SOCIAL_ICONS[s.key] || <MapPin size={20} />}</div>
              <b className="block text-[11px] font-black uppercase tracking-wide mt-1.5">{s.label}</b>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const EventReferral: React.FC<{ event: EventRecord }> = ({ event }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) { setError(true); return; }
    setError(false);
    setSending(true);
    try {
      const res = await fetch(`/api/events/${event.slug}?action=codigo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="py-16 bg-bbq-yellow text-center border-b-4 border-bbq-black">
      <div className="max-w-[960px] mx-auto px-5">
        <span className="text-xs font-black uppercase tracking-widest">E o vosso?</span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-none mt-2.5">Gostaste? Organiza o próximo.</h2>
        {event.referral_code ? (
          <>
            <div className="inline-block bg-bbq-black text-bbq-yellow text-[clamp(22px,5vw,34px)] font-black tracking-[.12em] px-6 py-3.5 border-4 border-bbq-black shadow-hard my-4.5">{event.referral_code}</div>
            <p className="max-w-[520px] mx-auto mb-5">{event.referral_intro || `${event.referral_discount_eur}€ de desconto no vosso churrasco com este código.`}</p>
          </>
        ) : (
          <>
            <p className="max-w-[540px] mx-auto mt-5 mb-2">{event.referral_intro || `${event.referral_discount_eur}€ de desconto no próximo churrasco.`}</p>
            {!submitted ? (
              <form onSubmit={submit} className="flex gap-2.5 max-w-[460px] mx-auto mt-5 flex-col sm:flex-row">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="o teu email" aria-label="O teu email" className={`flex-1 bg-bbq-cream border-4 p-3 text-[15px] ${error ? 'border-bbq-red' : 'border-bbq-black'}`} />
                <button type="submit" disabled={sending} className={btnDark}>{sending ? '...' : 'Enviar'}</button>
              </form>
            ) : (
              <div className="max-w-[460px] mx-auto mt-5 bg-bbq-black text-bbq-cream border-4 border-bbq-black shadow-hard-sm p-4.5 text-[15px]">
                <strong className="text-bbq-yellow">A caminho.</strong> Enviámos o teu código para {email}.
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

const EventFooter: React.FC = () => (
  <footer className="bg-bbq-black text-bbq-cream py-10 text-center">
    <div className="max-w-[960px] mx-auto px-5">
      <div className="font-black uppercase text-sm flex justify-center items-center gap-2 mb-3">
        <Flame size={16} className="text-bbq-yellow" /> LISBON<span className="text-bbq-yellow">BBQ</span>
      </div>
      <p className="text-xs opacity-60">Fire. Long Tables. Building Community.<br />
        <a href="https://lisbonbbq.pt" className="text-bbq-yellow">lisbonbbq.pt</a> · pitmasters@lisbonbbq.pt · +351 961 058 571</p>
      <p className="mt-3.5 text-[11px] opacity-60">Página privada do evento. Não partilhar fora do grupo de convidados.</p>
    </div>
  </footer>
);
