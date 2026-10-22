import React, { useEffect, useMemo, useRef, useState } from 'react';
import { track, identifyLead } from '../services/analytics';

// Landing page do workshop de churrasco (lisbonbbq.pt/workshop).
// Só em português: o público são residentes, e o tom ("tu", camaradagem) não
// tem equivalente direto em inglês.
//
// Preços: têm de ficar iguais a PRICES em api/workshop-waitlist.ts, que é quem
// decide o preço de facto. A variante vem do link do anúncio (?v=b) para o teste
// de preço; sem parâmetro é a variante "a".
export const WORKSHOP_PRICES: Record<string, { public: number; invite: number }> = {
  a: { public: 110, invite: 90 },
  b: { public: 95, invite: 80 },
};

const IMG = '/images/workshop';

const LEARN = [
  { t: 'A churrasqueira', d: 'Que grelhador e que utensílios valem o dinheiro, e como preparar a grelha antes de acender.' },
  { t: 'Brasa', d: 'Acendes o carvão à primeira, montas zona quente e zona fria e manténs a brasa viva até à última peça.' },
  { t: 'Escolher as melhores carnes', d: 'Picanha, maminha, fraldinha. Escolhes a peça certa no talho e cortas no sentido certo. É muito acerto.' },
  { t: 'Tempero', d: 'Sal grosso, flor de sal ou marinada? Sabes o que pôr em cada carne e em que momento.' },
  { t: 'Reação de Maillard', d: 'Percebes porque é que a carne ganha crosta e como a consegues sem passar o interior. É a diferença entre grelhar e cozer na grelha.' },
  { t: 'O ponto', d: 'Acertas no ponto sem abrir a carne para espreitar.' },
  { t: 'Entremeada e linguiça', d: 'Tostadas por fora, suculentas por dentro. Sem secar nem queimar.' },
  { t: 'Descanso e corte', d: 'Deixas a carne descansar o tempo certo e cortas à mesa, para servir quente.' },
];

const STEPS = [
  { t: 'Chegada', d: 'Avental vestido, luvas calçadas, bebida na mão. Trabalho em equipa de dois.' },
  { t: 'O fogo', d: 'Acendes o carvão e aprendes a ler a brasa.' },
  { t: 'Os cortes', d: 'Faca na mão: picanha, maminha, fraldinha, entremeada e linguiça.' },
  { t: 'A grelha', d: 'Grelhas tu, ao lado do teu camarada. O pitmaster acompanha e orienta.' },
  { t: 'A mesa longa', d: 'Sentamo-nos todos a comer o que grelhámos, com cerveja gelada e acompanhamentos.' },
];

const RECENT = [
  { d: '20 setembro', s: 'Churrasco tradicional português' },
  { d: '19 setembro', s: 'Churrasco estilo brasileiro' },
  { d: '6 setembro', s: 'Churrasco estilo argentino' },
  { d: '5 setembro', s: 'Churrasco tradicional português' },
  { d: '30 agosto', s: 'Churrasco estilo brasileiro' },
];

const FAQS = [
  { q: 'Nunca grelhei, posso ir?', a: 'Podes. Começamos com o carvão apagado e explicamos tudo desde aí. Quem já grelha vai afinar a brasa e o ponto.' },
  { q: 'Posso ir sozinho?', a: 'Deves. A tarde foi pensada para quem chega sem conhecer ninguém: o trabalho na grelha é dividido e a mesa é uma só.' },
  { q: 'Tenho de falar com toda a gente?', a: 'Não. Ninguém te põe a apresentar-te em voz alta. A conversa nasce do que estás a fazer.' },
  { q: 'Há opção sem carne?', a: 'Este workshop é de carne. Se tiveres alguma restrição alimentar, avisa-nos por email para pitmasters@lisbonbbq.pt.' },
  { q: 'E se chover?', a: 'O espaço tem cobertura, por isso o workshop acontece na mesma.' },
  { q: 'Posso oferecer?', a: 'Sim. Em breve vamos ter vouchers.' },
  { q: 'Política de cancelamento', a: 'Se não puderes vir, o teu lugar é transferível para outra pessoa ou para outra data.' },
];

const SLOTS = ['Sexta ao fim da tarde', 'Sábado', 'Domingo', 'Tanto faz'];
const LEVELS = ['Nunca', 'Às vezes', 'Sou o grelhador da família'];
const MOTIVES = ['Aprender a grelhar', 'A malta e a mesa', 'As duas'];
const SOURCES = [
  ['instagram', 'Instagram'],
  ['amigos', 'Amigos ou família'],
  ['evento', 'Já fui a um churrasco Lisbon BBQ'],
  ['google', 'Google'],
  ['outro', 'Outro'],
];

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'];

const FlameMark: React.FC<{ size?: number; fill?: string; stroke?: string }> = ({ size = 32, fill = '#F4B41A', stroke = '#1A1A1A' }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

type BtnVariant = 'accent' | 'dark';
const Btn: React.FC<{ variant?: BtnVariant; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean; className?: string; children: React.ReactNode }> = ({
  variant = 'accent', onClick, type = 'button', disabled, className = '', children,
}) => {
  const colors = variant === 'accent'
    ? 'bg-bbq-yellow text-bbq-black hover:bg-bbq-cream'
    : 'bg-bbq-black text-bbq-yellow hover:bg-bbq-red hover:text-white';
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${colors} border-4 border-bbq-black shadow-hard active:shadow-none active:translate-x-[2px] active:translate-y-[2px] font-black uppercase tracking-wider text-lg px-8 py-4 min-h-[56px] transition-colors disabled:opacity-60 disabled:cursor-wait ${className}`}
    >
      {children}
    </button>
  );
};

const Eyebrow: React.FC<{ color?: string; children: React.ReactNode }> = ({ color = 'text-bbq-yellow', children }) => (
  <span className={`font-black text-xs tracking-[0.1em] uppercase ${color}`}>{children}</span>
);

const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="m-0 font-black uppercase leading-none tracking-tighter text-[clamp(2.25rem,6vw,3.75rem)]">{children}</h2>
);

const Choice: React.FC<{ options: string[]; value: string; onChange: (v: string) => void; label: string }> = ({ options, value, onChange, label }) => (
  <fieldset className="flex flex-col gap-2 border-0 p-0 m-0">
    <legend className="font-black text-sm tracking-[0.1em] uppercase mb-2">{label}</legend>
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value === o;
        return (
          <button
            key={o}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(o)}
            className={`min-h-[52px] px-4 border-4 font-black uppercase text-[0.9375rem] transition-colors ${on ? 'bg-bbq-yellow text-bbq-black border-bbq-yellow' : 'bg-transparent text-bbq-cream border-bbq-cream hover:border-bbq-yellow'}`}
          >
            {o}
          </button>
        );
      })}
    </div>
  </fieldset>
);

const inputCls = 'w-full box-border bg-white text-bbq-black border-4 border-bbq-black px-5 py-4 text-xl font-black outline-none focus:shadow-[0_0_0_4px_#F4B41A]';

export const WorkshopView: React.FC = () => {
  const formRef = useRef<HTMLElement>(null);

  const params = useMemo(() => new URLSearchParams(typeof window !== 'undefined' ? window.location.search : ''), []);
  const variant = useMemo(() => {
    const fromUrl = (params.get('v') || '').toLowerCase();
    let v = WORKSHOP_PRICES[fromUrl] ? fromUrl : '';
    try {
      if (v) sessionStorage.setItem('workshop_variant', v);
      else v = sessionStorage.getItem('workshop_variant') || '';
    } catch { /* storage bloqueado: segue com a variante do URL */ }
    return WORKSHOP_PRICES[v] ? v : 'a';
  }, [params]);
  const inviteCode = useMemo(() => (params.get('c') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6), [params]);
  const utm = useMemo(() => {
    const o: Record<string, string> = {};
    UTM_KEYS.forEach((k) => { const v = params.get(k); if (v) o[k] = v.slice(0, 200); });
    return Object.keys(o).length ? o : null;
  }, [params]);

  const [invite, setInvite] = useState<{ firstName: string; invitePrice: number; publicPrice: number } | null>(null);
  useEffect(() => {
    if (inviteCode.length !== 6) return;
    let cancelled = false;
    fetch(`/api/workshop-waitlist?c=${inviteCode}`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled && d?.valid) setInvite({ firstName: d.firstName, invitePrice: d.invitePrice, publicPrice: d.publicPrice }); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [inviteCode]);

  const prices = invite ? { public: invite.publicPrice, invite: invite.invitePrice } : WORKSHOP_PRICES[variant];
  const shownPrice = invite ? prices.invite : prices.public;

  // O botão fixo no telemóvel esconde-se quando o formulário ou o rodapé estão
  // à vista: não faz falta junto ao formulário e taparia os links do rodapé
  // (privacidade, termos, cookies).
  const [hideSticky, setHideSticky] = useState(false);
  useEffect(() => {
    const targets = [formRef.current, document.querySelector('footer')].filter(Boolean) as Element[];
    if (!targets.length || typeof IntersectionObserver === 'undefined') return;
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
      setHideSticky(visible.size > 0);
    });
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  const [openFaq, setOpenFaq] = useState(-1);
  const [form, setForm] = useState({ name: '', email: '', phone: '', slot: '', exp: '', motive: '', source: '', consent: false, website: '' });
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ firstName: string; duplicate?: boolean } | null>(null);

  const set = (k: keyof typeof form) => (v: any) => { setForm((f) => ({ ...f, [k]: v })); setError(''); };

  const goForm = (where: string) => {
    track('workshop_cta_click', { where, variant });
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing: string[] = [];
    if (!form.name.trim()) missing.push('nome');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) missing.push('um email válido');
    if (form.phone.replace(/\D/g, '').length < 9) missing.push('telemóvel');
    if (!form.slot) missing.push('horário');
    if (!form.exp) missing.push('experiência a grelhar');
    if (!form.motive) missing.push('o que te traz');
    if (missing.length) { setError('Falta preencher: ' + missing.join(', ') + '.'); return; }
    if (!form.consent) { setError('Para guardarmos o teu pedido, precisamos da tua autorização (caixa acima).'); return; }

    setSending(true);
    try {
      const r = await fetch('/api/workshop-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email, phone: form.phone,
          preferredSlot: form.slot, experience: form.exp, motive: form.motive, heardFrom: form.source,
          consent: form.consent, website: form.website,
          priceVariant: variant, inviteCode: invite ? inviteCode : undefined,
          utm, landingUrl: window.location.href, referrer: document.referrer || undefined,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d?.ok) throw new Error(d?.error || 'failed');
      identifyLead({ email: form.email.trim(), name: form.name.trim(), phone: form.phone.trim() });
      track('workshop_waitlist_submitted', { variant, invited: !!d.invited, motive: form.motive, experience: form.exp, duplicate: !!d.duplicate });
      setDone({ firstName: d.firstName || form.name.trim().split(' ')[0], duplicate: d.duplicate });
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch {
      setError('Não conseguimos guardar o teu pedido. Tenta outra vez daqui a pouco ou escreve-nos para pitmasters@lisbonbbq.pt.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-bbq-black text-bbq-cream font-sans pb-24 md:pb-0">
      {/* HERO */}
      <section className="relative overflow-hidden border-b-4 border-bbq-yellow">
        <img
          src={`${IMG}/hero-1400.webp`}
          srcSet={`${IMG}/hero-800.webp 800w, ${IMG}/hero-1400.webp 1400w, ${IMG}/hero-1816.webp 1816w`}
          sizes="100vw"
          alt="Quatro homens à volta de uma grelha a carvão ao fim da tarde, com um pitmaster a explicar"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '72% center' }}
          fetchPriority="high"
        />
        {/* Computador: escuro à esquerda (texto), limpo à direita (grupo e brasa). Telemóvel: o texto ocupa a largura toda, por isso escurece de baixo para cima. */}
        <div className="absolute inset-0 hidden md:block" style={{ background: 'linear-gradient(to right, rgba(26,26,26,0.92) 0%, rgba(26,26,26,0.7) 35%, rgba(26,26,26,0.15) 65%, rgba(26,26,26,0) 100%), linear-gradient(to top, rgba(26,26,26,0.85) 0%, rgba(26,26,26,0) 45%)' }} />
        <div className="absolute inset-0 md:hidden" style={{ background: 'linear-gradient(to top, rgba(26,26,26,0.95) 0%, rgba(26,26,26,0.8) 45%, rgba(26,26,26,0.25) 80%, rgba(26,26,26,0.1) 100%)' }} />
        <div className="relative max-w-6xl mx-auto px-5 pb-16 min-h-[40rem] md:min-h-[40rem] pt-48 md:pt-8 flex flex-col justify-end gap-6">
          <div className="flex flex-col gap-6 max-w-[46rem]">
            <div>
              <span className="inline-block bg-bbq-yellow text-bbq-black border-2 border-bbq-black shadow-hard-sm px-3 py-1 font-black text-[10px] tracking-[0.05em] uppercase">Workshop de churrasco · Lisboa</span>
            </div>
            <h1 className="m-0 font-black uppercase tracking-tighter leading-[0.92] text-[clamp(2.75rem,9vw,6.5rem)]" style={{ textShadow: '6px 6px 0 #1a1a1a' }}>
              Nunca mais erres o ponto da carne.
            </h1>
            <p className="m-0 text-xl leading-snug font-medium max-w-xl">
              Três horas à volta do fogo, com malta que gosta do mesmo que tu. Aprendes a grelhar como se faz cá e acabas à mesa longa, a comer o que grelharam juntos.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Refeição incluída', 'Ao vivo em Lisboa'].map((c) => (
                <span key={c} className="border-2 border-bbq-cream px-3 py-1.5 font-black text-[0.8125rem] tracking-[0.08em] uppercase">{c}</span>
              ))}
              <span className="bg-bbq-yellow text-bbq-black border-2 border-bbq-yellow px-3 py-1.5 font-black text-[0.8125rem] tracking-[0.08em] uppercase">Vagas limitadas</span>
            </div>
            {invite && (
              <div role="status" className="bg-bbq-yellow text-bbq-black border-4 border-bbq-black shadow-hard p-4 max-w-xl">
                <p className="m-0 font-black uppercase text-lg leading-tight">{invite.firstName} guardou-te um lugar.</p>
                <p className="m-0 mt-1 font-bold">Com este convite pagas {invite.invitePrice}€ em vez de {invite.publicPrice}€, e ficam na mesma estação de grelha.</p>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-4">
              <Btn onClick={() => goForm('hero')}>Entrar na waiting list</Btn>
              <span className="text-sm font-bold text-gray-400">Não pagas nada para entrar na lista.</span>
            </div>
          </div>
        </div>
      </section>

      {/* CONHECE O WORKSHOP */}
      <section id="workshop" className="bg-bbq-cream text-bbq-black border-b-4 border-bbq-yellow">
        <div className="max-w-6xl mx-auto px-5 py-20 flex flex-col gap-10">
          <div className="flex flex-col gap-4 max-w-[46rem]">
            <Eyebrow color="text-bbq-red">O workshop</Eyebrow>
            <H2>Conhece o workshop</H2>
            <p className="m-0 text-lg leading-relaxed">Uma tarde de trabalho à volta da grelha: uns acendem, outros cortam, todos provam. O pitmaster vai puxando por ti e, quando dás por isso, estás a discutir o ponto da picanha com alguém que conheceste há uma hora.</p>
            <p className="m-0 text-lg leading-relaxed">Acaba como acabam os bons churrascos: à mesa longa, com o que grelharam juntos, e com vontade de repetir.</p>
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(13rem, 1fr))' }}>
            {[
              ['3 horas', 'ao vivo, em Lisboa'],
              ['Pitmasters', 'da Lisbon BBQ, com anos de brasa e centenas de eventos'],
              ['Mão na pinça', 'cada técnica é logo posta em prática'],
              ['16 pessoas', 'no máximo, para acompanhamento personalizado'],
            ].map(([t, d]) => (
              <div key={t} className="bg-bbq-black text-bbq-cream border-4 border-bbq-black p-6 flex flex-col gap-2" style={{ boxShadow: '6px 6px 0 0 #d91a2a' }}>
                <span className="text-4xl leading-none font-black tracking-tight uppercase text-bbq-yellow">{t}</span>
                <span className="font-bold leading-snug">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APRENDER, COM CERVEJA NA MÃO */}
      <section className="bg-bbq-red text-white border-b-4 border-bbq-yellow">
        <div className="max-w-6xl mx-auto px-5 py-20 grid gap-10 items-center" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(18rem, 100%), 1fr))' }}>
          <div className="flex flex-col gap-5">
            <H2>Aprender, com cerveja na mão</H2>
            <p className="m-0 text-lg leading-relaxed font-medium">À volta do fogo há sempre trabalho para dividir. Alguém segura a pinça, alguém corta, alguém tem uma opinião sobre o sal. Não há jogos para quebrar o gelo nem rodas de apresentações. Há uma grelha, uma tarefa e uma cerveja. A conversa vem sozinha.</p>
            <p className="m-0 font-black uppercase tracking-wide">Fogo, mesa comprida, telemóvel no bolso.</p>
          </div>
          <img
            src={`${IMG}/sal-opiniao-1000.webp`}
            srcSet={`${IMG}/sal-opiniao-600.webp 600w, ${IMG}/sal-opiniao-1000.webp 1000w`}
            sizes="(min-width: 768px) 50vw, 100vw"
            alt="Dois homens à grelha: um deita sal grosso na carne, o outro aponta e dá palpite com uma cerveja na mão"
            className="w-full h-[28rem] object-cover border-4 border-bbq-black shadow-hard"
            style={{ objectPosition: 'center 40%' }}
            loading="lazy"
          />
        </div>
      </section>

      {/* O QUE VAIS DOMINAR */}
      <section className="max-w-6xl mx-auto px-5 py-20 flex flex-col gap-10">
        <div className="flex flex-col gap-4 max-w-[44rem]">
          <Eyebrow>O que vais dominar</Eyebrow>
          <H2>Oito coisas que deixas de errar</H2>
          <p className="m-0 text-lg leading-normal">Carvão vegetal, brasa e os cortes que se comem cá. Nada de smoker nem molho barbecue.</p>
        </div>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(16rem, 100%), 1fr))' }}>
          {LEARN.map((l, i) => (
            <div key={l.t} className="border-4 border-bbq-cream p-6 flex flex-col gap-2">
              <span aria-hidden="true" className="text-5xl leading-none font-black text-bbq-yellow">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="m-0 text-xl font-black uppercase tracking-tight">{l.t}</h3>
              <p className="m-0 leading-normal">{l.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMO CORRE A TARDE */}
      <section className="bg-bbq-cream text-bbq-black border-y-4 border-bbq-yellow">
        <div className="max-w-6xl mx-auto px-5 py-20 flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Eyebrow color="text-bbq-red">Como corre a tarde</Eyebrow>
            <H2>Do carvão à mesa</H2>
          </div>
          <ol className="m-0 p-0 list-none grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(11rem, 100%), 1fr))' }}>
            {STEPS.map((s, i) => {
              const last = i === STEPS.length - 1;
              return (
                <li key={s.t} className={`${last ? 'bg-bbq-yellow' : 'bg-white'} border-4 border-bbq-black shadow-hard p-5 flex flex-col gap-2`}>
                  <span className={`text-4xl leading-none font-black ${last ? 'text-bbq-black' : 'text-bbq-red'}`}>{i + 1}</span>
                  <h3 className="m-0 text-lg font-black uppercase">{s.t}</h3>
                  <p className="m-0 leading-normal">{s.d}</p>
                </li>
              );
            })}
          </ol>
          <img
            src={`${IMG}/mesa-longa-1400.webp`}
            srcSet={`${IMG}/mesa-longa-800.webp 800w, ${IMG}/mesa-longa-1400.webp 1400w`}
            sizes="(min-width: 1152px) 1152px, 100vw"
            alt="Um prato a passar de mão em mão numa mesa longa"
            className="w-full h-[22rem] object-cover border-4 border-bbq-black shadow-hard"
            style={{ filter: 'saturate(1.15) sepia(0.12) contrast(1.05)' }}
            loading="lazy"
          />
        </div>
      </section>

      {/* O QUE ESTÁ INCLUÍDO + PREÇO */}
      <section className="max-w-6xl mx-auto px-5 py-20 grid gap-10 items-start" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(18rem, 100%), 1fr))' }}>
        <div className="flex flex-col gap-6">
          <Eyebrow>O que está incluído</Eyebrow>
          <H2>Tudo. Só trazes a fome.</H2>
          <ul className="m-0 p-0 list-none flex flex-col gap-3 text-[1.0625rem] leading-snug">
            {['Toda a carne e os acompanhamentos', 'Refeição completa à mesa longa', 'Bebidas: cerveja ou vinho da casa', 'Avental e receita para levar para casa', '1 pitmaster que ensina e acompanha'].map((x) => (
              <li key={x} className="flex gap-3 items-baseline"><span aria-hidden="true" className="text-bbq-yellow font-black">+</span><span>{x}</span></li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 text-[0.9375rem] leading-normal">
            <p className="m-0"><strong className="font-black uppercase tracking-wide">Quando:</strong> próximas sessões em novembro e dezembro de 2026, sexta ao fim da tarde, sábado ou domingo.</p>
            <p className="m-0"><strong className="font-black uppercase tracking-wide">Onde:</strong> espaço Lisbon BBQ, em Lisboa. O local exato vai na confirmação.</p>
            <p className="m-0"><strong className="font-black uppercase tracking-wide">Lugares:</strong> 16 por sessão. Quem está na lista tem 48 horas de prioridade antes de abrirmos ao público.</p>
          </div>
        </div>
        <div className="bg-bbq-yellow text-bbq-black border-4 border-bbq-cream p-8 flex flex-col gap-4" style={{ boxShadow: '8px 8px 0 0 #d91a2a' }}>
          <span className="font-black text-sm tracking-[0.1em] uppercase">{invite ? 'Workshop · com convite' : 'Workshop · por pessoa'}</span>
          <div className="flex items-end gap-4 flex-wrap">
            <span className="text-8xl leading-[0.9] font-black tracking-tighter">{shownPrice}€</span>
            {invite && <span className="text-3xl font-black line-through opacity-60 mb-2" aria-label={`em vez de ${prices.public} euros`}>{prices.public}€</span>}
          </div>
          <span className="self-start bg-bbq-black text-bbq-yellow px-3 py-1.5 font-black text-sm tracking-[0.1em] uppercase">IVA incluído</span>
          <p className="m-0 font-bold leading-snug">3 horas de workshop prático, com a refeição completa no fim.</p>
          <Btn variant="dark" onClick={() => goForm('price')}>Entrar na waiting list</Btn>
        </div>
      </section>

      {/* PITMASTERS */}
      <section className="border-t-4 border-bbq-cream">
        <div className="max-w-6xl mx-auto px-5 py-20 flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <Eyebrow>Os pitmasters</Eyebrow>
            <H2>Quem puxa pela tarde</H2>
            <p className="m-0 text-lg leading-normal">Cada turma tem um destes pitmasters ao lado, do primeiro carvão ao último corte.</p>
          </div>
          <div className="grid gap-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(22rem, 100%), 1fr))' }}>
            {[
              { n: 'David', img: 'david-400.webp', bio: 'Aficionado tornado especialista. Os seus workshops são encontros de amigos que ainda não se conheciam.', q: '«Oiçam esta chiadeira maravilhosa!»', lang: undefined },
              { n: 'Santiago', img: 'santiago-400.webp', bio: 'Há mais de 5 anos que leva os sabores do seu país a eventos privados, como private chef. Especialista nos cortes e na parrilla argentina.', q: '«Che, a Cristiano le encantaría este chimichurri»', lang: 'es-AR' },
            ].map((p) => (
              <div key={p.n} className="flex flex-wrap gap-5 items-start">
                <img src={`${IMG}/${p.img}`} alt={`${p.n}, pitmaster da Lisbon BBQ`} width={208} height={208} loading="lazy" className="w-52 h-52 flex-none object-cover border-4 border-bbq-cream" />
                <div className="flex-[1_1_13rem] min-w-0 flex flex-col gap-2">
                  <h3 className="m-0 text-2xl font-black uppercase">{p.n}</h3>
                  <p className="m-0 leading-normal">{p.bio}</p>
                  <p lang={p.lang} className="m-0 leading-tight font-black text-lg uppercase text-bbq-yellow">{p.q}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-bbq-cream text-bbq-black border-t-4 border-bbq-yellow">
        <div className="max-w-3xl mx-auto px-5 py-20 flex flex-col gap-8">
          <H2>Perguntas frequentes</H2>
          <div className="flex flex-col gap-3">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className="bg-white border-4 border-bbq-black">
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? -1 : i)}
                    className="w-full min-h-[56px] flex justify-between items-center gap-4 px-5 py-4 bg-transparent border-0 cursor-pointer text-[1.0625rem] font-black uppercase text-left text-bbq-black"
                  >
                    <span>{f.q}</span>
                    <span aria-hidden="true" className="text-2xl text-bbq-red">{open ? '−' : '+'}</span>
                  </button>
                  {open && <p className="m-0 px-5 pb-5 leading-relaxed text-gray-600">{f.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WORKSHOPS RECENTES */}
      <section id="calendario" className="bg-bbq-cream text-bbq-black border-t-4 border-bbq-yellow">
        <div className="max-w-6xl mx-auto px-5 py-20 flex flex-col gap-8">
          <div className="flex flex-col gap-4 max-w-[44rem]">
            <Eyebrow color="text-bbq-red">Calendário</Eyebrow>
            <H2>Workshops recentes</H2>
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(14rem, 100%), 1fr))' }}>
            <div className="bg-bbq-red text-white border-4 border-bbq-black shadow-hard p-5 flex flex-col gap-3">
              <span className="font-black text-xs tracking-[0.1em] uppercase">Próximos workshops</span>
              <span className="text-2xl leading-tight font-black uppercase tracking-tight">Novembro e dezembro</span>
              <span className="font-bold text-[0.9375rem] leading-snug">Abrem primeiro para a waiting list, com 48 horas de prioridade.</span>
              <button type="button" onClick={() => goForm('calendar')} className="mt-auto self-start bg-bbq-yellow text-bbq-black border-2 border-bbq-black shadow-hard-sm px-4 py-2 min-h-[44px] font-black text-xs tracking-[0.1em] uppercase">Entrar na waiting list</button>
            </div>
            {RECENT.map((r) => (
              <div key={r.d} className="bg-white border-4 border-bbq-black p-5 flex flex-col gap-3">
                <div className="flex justify-between items-start gap-3">
                  <span className="text-2xl leading-none font-black uppercase tracking-tight">{r.d}</span>
                  <span className="flex-none bg-bbq-red text-white px-2 py-1 font-black text-xs tracking-[0.08em] uppercase">Esgotado</span>
                </div>
                <span className="font-black uppercase leading-tight">{r.s}</span>
                <span className="font-bold text-sm text-gray-600">16 lugares · 3 horas</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WAITING LIST */}
      <section id="reserva" ref={formRef} className="border-t-4 border-bbq-black scroll-mt-24">
        <div className="max-w-2xl mx-auto px-5 py-20 flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Eyebrow>Lista de espera</Eyebrow>
            <H2>Entra na lista</H2>
            <p className="m-0 text-[1.0625rem] leading-normal">Quem está na lista tem 48 horas de prioridade quando abrirmos novos workshops, e recebe vantagens exclusivas por email. Não pagas nada agora.</p>
          </div>

          {done ? (
            <div role="status" className="bg-bbq-yellow text-bbq-black border-4 border-bbq-cream p-8 flex flex-col gap-3" style={{ boxShadow: '8px 8px 0 0 #d91a2a' }}>
              <span className="text-3xl font-black uppercase tracking-tight">Está feito, {done.firstName}.</span>
              <p className="m-0 text-lg leading-normal font-bold">
                {done.duplicate
                  ? 'Este email já estava na lista. O teu lugar continua guardado e avisamos-te antes de abrirmos ao público.'
                  : 'Estás na lista! Avisamos-te 48h antes de abrirmos novas datas de workshop ao público. Entretanto enviámos-te um email com uma pequena surpresa. Vai lá dar uma vista de olhos 🙂'}
              </p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-6">
              {/* honeypot */}
              <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
                <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set('website')(e.target.value)} /></label>
              </div>
              <label className="flex flex-col gap-2">
                <span className="font-black text-sm tracking-[0.1em] uppercase">Nome</span>
                <input className={inputCls} type="text" autoComplete="name" placeholder="Nome e apelido" value={form.name} onChange={(e) => set('name')(e.target.value)} />
              </label>
              <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(15rem, 100%), 1fr))' }}>
                <label className="flex flex-col gap-2">
                  <span className="font-black text-sm tracking-[0.1em] uppercase">Email</span>
                  <input className={inputCls} type="email" autoComplete="email" inputMode="email" placeholder="nome@email.pt" value={form.email} onChange={(e) => set('email')(e.target.value)} />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="font-black text-sm tracking-[0.1em] uppercase">Telemóvel</span>
                  <input className={inputCls} type="tel" autoComplete="tel" inputMode="tel" placeholder="912 345 678" value={form.phone} onChange={(e) => set('phone')(e.target.value)} />
                </label>
              </div>
              <Choice label="Que horário te dá mais jeito?" options={SLOTS} value={form.slot} onChange={set('slot')} />
              <Choice label="Já grelhas?" options={LEVELS} value={form.exp} onChange={set('exp')} />
              <Choice label="O que te traz mais?" options={MOTIVES} value={form.motive} onChange={set('motive')} />
              <label className="flex flex-col gap-2">
                <span className="font-black text-sm tracking-[0.1em] uppercase">Como soubeste de nós?</span>
                <select className={`${inputCls} min-h-[64px] text-lg rounded-none`} value={form.source} onChange={(e) => set('source')(e.target.value)}>
                  <option value="">Escolhe uma opção</option>
                  {SOURCES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </label>
              <label className="flex gap-3 items-start cursor-pointer leading-normal text-[0.9375rem]">
                <input type="checkbox" checked={form.consent} onChange={(e) => set('consent')(e.target.checked)} className="w-6 h-6 m-0 flex-none accent-[#f4b41a]" />
                <span>Autorizo a Lisbon BBQ a guardar estes dados para me contactar sobre o workshop de churrasco da Lisbon BBQ, de acordo com o RGPD. Posso pedir para os apagar a qualquer momento em <a href="mailto:pitmasters@lisbonbbq.pt" className="text-bbq-yellow underline">pitmasters@lisbonbbq.pt</a>. Lê a <a href="/privacy" className="text-bbq-yellow underline">política de privacidade</a>.</span>
              </label>
              {error && <p role="alert" className="m-0 px-4 py-3 border-4 border-bbq-yellow font-bold leading-snug">{error}</p>}
              <div><Btn type="submit" disabled={sending}>{sending ? 'A guardar…' : 'Entrar na waiting list'}</Btn></div>
              <p className="m-0 text-sm leading-normal text-gray-400">Entrar na lista não garante lugar nem data. Quando as datas abrirem, quem está na lista é avisado primeiro.</p>
            </form>
          )}
        </div>
      </section>

      {/* CTA fixo no telemóvel */}
      {!done && !hideSticky && (
        <div className="md:hidden fixed left-0 right-0 bottom-0 z-40 px-4 pt-3 bg-bbq-black border-t-4 border-bbq-yellow" style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}>
          <Btn className="w-full" onClick={() => goForm('sticky')}>Entrar na waiting list · {shownPrice}€</Btn>
        </div>
      )}
    </div>
  );
};
