import React from 'react';
import { Flame, ChefHat, Castle, Utensils, ChevronLeft, ChevronRight, Sun, Cloud, Minus, Plus, CircleOff, Loader2, X, Check, Camera, Users, Beer, UtensilsCrossed } from 'lucide-react';
import { Header } from './Header';
import { BookingSummary } from './BookingSummary';
import { LogoBar, PackageCard, BrandStory, VenueGrid, Referrals } from './LandingComponents';
import { Footer } from './Footer';
import { BookingState, CartItem, SlotTime, DailyWeather } from '../types';
import { LOCATIONS, getAvailableVenues, getVenuesByDay, TRADITION_MEATS, FIXED_SIDES, FIXED_DRINKS } from '../constants';
import { getWeatherIcon } from '../services/weatherService';

interface HomePageProps {
  lang: 'pt' | 'en';
  setLang: (l: 'pt' | 'en') => void;
  setView: (v: 'booking' | 'proposal' | 'privacy' | 'terms' | 'blog' | 'cms' | 'faqs' | 'about' | 'corporate' | 'verbola') => void;
  booking: BookingState;
  setBooking: React.Dispatch<React.SetStateAction<BookingState>>;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  updateCart: (id: string, delta: number) => void;
  customAssets: Record<string, string>;
  weatherData: Record<string, DailyWeather>;
  viewDate: Date;
  setViewDate: (d: Date) => void;
  calendarDays: (Date | null)[];
  today: Date;
  showQuote: boolean;
  setShowQuote: (b: boolean) => void;
  isSubmitted: boolean;
  setIsSubmitted: (b: boolean) => void;
  isSending: boolean;
  clientName: string;
  setClientName: (s: string) => void;
  clientEmail: string;
  setClientEmail: (s: string) => void;
  clientPhone: string;
  setClientPhone: (s: string) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  scrollToBooking: () => void;
  traditionSectionRef: React.RefObject<HTMLDivElement>;
  toggleSide: (side: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  lang, setLang, setView, booking, setBooking, cart, setCart, updateCart, customAssets, weatherData, viewDate, setViewDate,
  calendarDays, today, showQuote, setShowQuote, isSubmitted, setIsSubmitted, isSending, clientName, setClientName,
  clientEmail, setClientEmail, clientPhone, setClientPhone, handleFormSubmit, scrollToBooking, traditionSectionRef
}) => {
  const [viewerLocationId, setViewerLocationId] = React.useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [localGuests, setLocalGuests] = React.useState(booking.guests);

  // Filtered venues based on confirmed guests + date
  const filteredVenues = React.useMemo(() => {
    if (!booking.guestsConfirmed || !booking.date) return [];
    return getAvailableVenues(booking.guests, booking.date);
  }, [booking.guests, booking.guestsConfirmed, booking.date]);

  // All venues available on the selected day (regardless of guest count — for display with disabled state)
  const venuesByDay = React.useMemo(() => {
    if (!booking.guestsConfirmed || !booking.date) return [];
    return getVenuesByDay(booking.date);
  }, [booking.guestsConfirmed, booking.date]);

  // If selected venue is no longer available after guests/date change, clear it
  React.useEffect(() => {
    if (booking.locationId && booking.guestsConfirmed && booking.date) {
      const stillAvailable = filteredVenues.some(l => l.id === booking.locationId);
      if (!stillAvailable) {
        setBooking(prev => ({ ...prev, locationId: null, tradition: null, slot: null }));
      }
    }
  }, [filteredVenues]);

  const meatKg = Math.ceil(booking.guests * 0.45);
  const drinkCount = Math.ceil(booking.guests * 5);
  const meats = booking.tradition ? (TRADITION_MEATS[booking.tradition] || []) : [];

  const canConfirmStep1 = localGuests >= 20 && !!booking.date;

  const handleConfirmStep1 = () => {
    setBooking(prev => ({
      ...prev,
      guests: localGuests,
      guestsConfirmed: true,
      locationId: null,
      tradition: null,
      style: null,
      selectedSides: [],
      sidesConfirmed: false,
      slot: null,
      extrasConfirmed: false
    }));
  };

  const dayLabels = lang === 'pt'
    ? ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
    : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const t = {
    designer: lang === 'pt' ? 'Designer de Evento' : 'Event Designer',
    designerSub: lang === 'pt' ? 'Quando o fogo acende, a experiência começa.' : 'When the fire ignites, the experience begins.',
    step1Title: lang === 'pt' ? 'Pessoas & Data' : 'Guests & Date',
    step1Sub: lang === 'pt' ? 'Vamos encontrar o local certo para o teu evento' : 'Let\'s find the perfect venue for your event',
    guestsLabel: lang === 'pt' ? 'Convidados' : 'Guests',
    confirmStep1: lang === 'pt' ? 'Ver Locais Disponíveis' : 'See Available Venues',
    changeStep1: lang === 'pt' ? 'Alterar' : 'Change',
    minGuests: lang === 'pt' ? 'Mínimo 20 convidados' : 'Minimum 20 guests',
    capacityLabel: lang === 'pt' ? 'pessoas' : 'guests',
    noVenues: lang === 'pt' ? 'Sem locais disponíveis para esta combinação. Tenta outra data ou número de pessoas.' : 'No venues available for this combination. Try another date or guest count.',
    step2: lang === 'pt' ? 'O Local' : 'The Venue',
    step3: lang === 'pt' ? 'A Tradição' : 'The Tradition',
    ptTradition: lang === 'pt' ? 'Churrasco Português' : 'Portuguese Barbecue',
    ptTraditionSub: lang === 'pt' ? 'Grelhada Mista • Especialidades Regionais' : 'Mixed Grill • Regional Specialities',
    brTradition: lang === 'pt' ? 'Churrasco Brasileiro' : 'Brazilian Barbecue',
    brTraditionSub: lang === 'pt' ? 'Picanha Premium • Rodízio Privado' : 'Premium Picanha • Private Rodízio',
    argTradition: lang === 'pt' ? 'Asado Argentino' : 'Argentinian Asado',
    argTraditionSub: lang === 'pt' ? 'Vacío • Chimichurri • Fogo Lento' : 'Vacío • Chimichurri • Slow Fire',
    meatLabel: lang === 'pt' ? 'Carne' : 'Meat',
    drinksLabel: lang === 'pt' ? 'Cervejas estimadas' : 'Estimated Beers',
    sidesLabel: lang === 'pt' ? 'Acompanhamentos' : 'Sides',
    step4: lang === 'pt' ? 'O Horário' : 'The Slot',
    step5: lang === 'pt' ? 'Extras' : 'Extras',
    finalize: lang === 'pt' ? 'Receber orçamento' : 'Get Quote',
    contactDetails: lang === 'pt' ? 'Orçamento será enviado em apenas alguns minutos' : 'Your custom quote will be ready in minutes',
    fullName: lang === 'pt' ? 'Nome Completo' : 'Full Name',
    email: lang === 'pt' ? 'E-mail' : 'Email Address',
    phone: lang === 'pt' ? 'Telemóvel' : 'Phone Number',
    send: lang === 'pt' ? 'Enviar Pedido' : 'Send Request',
    sending: lang === 'pt' ? 'A Enviar...' : 'Sending...',
    sent: lang === 'pt' ? 'Pedido Enviado!' : 'Request Sent!',
    sentSub: lang === 'pt' ? 'O nosso concierge entrará em contacto em 4 horas.' : 'Our concierge will contact you within 4 hours.',
    confirmSelection: lang === 'pt' ? 'Pedir Orçamento' : 'Get Custom Quote',
    noExtras: lang === 'pt' ? 'Não quero extras' : 'No extras, thank you',
    noExtrasSub: lang === 'pt' ? 'Prosseguir apenas com o menu base' : 'Proceed with base menu only',
    seeMore: lang === 'pt' ? 'Ver Mais' : 'See More',
    heroBtn: lang === 'pt' ? 'Personaliza o Teu Banquete' : 'Design Your Feast',
  };

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
  };

  const handleNoExtras = () => {
    setCart(prev => prev.map(item => ({ ...item, quantity: 0 })));
    setBooking(prev => ({ ...prev, extrasConfirmed: true }));
    setShowQuote(true);
  };

  const noExtrasSelected = booking.extrasConfirmed && cart.every(item => item.quantity === 0);

  return (
    <div className="min-h-screen font-sans bg-bbq-cream pb-32">
      <Header setView={setView} lang={lang} setLang={setLang} />

      {/* HERO */}
      <div className="relative h-[750px] border-b-4 border-bbq-black overflow-hidden bg-bbq-black group">
        <img src={customAssets.hero} className="w-full h-full object-cover opacity-70" alt="Hero BBQ" onError={handleImgError} />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/95 via-black/30 to-black/50"></div>
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center p-4">
          <h2 className="text-5xl md:text-[8rem] font-black uppercase leading-none mb-6 text-white drop-shadow-[10px_10px_0px_#1A1A1A] tracking-tighter">
            Lisbon Barbecue<br /><span className="text-bbq-yellow">& Churrasco</span>
          </h2>
          <p className="relative text-white text-lg md:text-2xl font-black uppercase tracking-widest bg-bbq-red px-10 py-5 border-4 border-bbq-black mb-12">
            {lang === 'pt' ? 'O teu backyard' : 'Your backyard'}
          </p>
          <button onClick={scrollToBooking} className="group bg-bbq-yellow text-bbq-black text-2xl font-black uppercase px-14 py-7 border-4 border-bbq-black shadow-hard hover:translate-y-[2px] transition-all flex items-center gap-4">
            {t.heroBtn} <Flame className="w-8 h-8 group-hover:animate-bounce" />
          </button>
        </div>
      </div>

      <LogoBar lang={lang} />
      <PackageCard onBook={scrollToBooking} lang={lang} customImage={customAssets.stressFree} />
      <BrandStory lang={lang} />
      <VenueGrid lang={lang} customImages={[customAssets.venueFeature1, customAssets.venueFeature2, customAssets.venueFeature3]} />
      <Referrals lang={lang} />

      <main ref={traditionSectionRef} className="max-w-6xl mx-auto px-4 py-24 border-t-4 border-bbq-black bg-white">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-black uppercase mb-4 tracking-tighter">{t.designer}</h2>
          <div className="h-2 w-24 bg-bbq-red mx-auto mb-6"></div>
          <p className="text-xl font-bold text-gray-400 max-w-2xl mx-auto uppercase tracking-wide">{t.designerSub}</p>
        </div>

        {/* ── STEP 01: GUESTS & DATE ── */}
        <div className="mb-24">
          <div className="flex items-baseline gap-6 mb-12 border-b-8 border-bbq-black pb-4">
            <span className="text-8xl font-black text-bbq-red/10 leading-none">01</span>
            <div>
              <h3 className="text-4xl font-black uppercase tracking-tighter">{t.step1Title}</h3>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">{t.step1Sub}</p>
            </div>
          </div>

          {booking.guestsConfirmed ? (
            <div className="bg-bbq-yellow border-4 border-bbq-black p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-hard">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-3">
                  <Users size={20} />
                  <span className="font-black text-2xl">{booking.guests}</span>
                  <span className="font-black uppercase text-xs opacity-60">{t.capacityLabel}</span>
                </div>
                <div className="h-8 w-px bg-bbq-black/20" />
                <div className="font-black uppercase text-sm">
                  {booking.date?.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
              </div>
              <button
                onClick={() => setBooking(prev => ({ ...prev, guestsConfirmed: false, locationId: null, tradition: null, style: null, selectedSides: [], sidesConfirmed: false, slot: null }))}
                className="text-[10px] font-black uppercase border-2 border-bbq-black px-4 py-2 hover:bg-bbq-black hover:text-bbq-yellow transition-all"
              >
                {t.changeStep1}
              </button>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Guests counter */}
                <div className="bg-bbq-cream border-4 border-bbq-black p-8 shadow-hard">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-bbq-black text-white border-2 border-bbq-black"><Users size={20} /></div>
                    <h4 className="text-xl font-black uppercase tracking-tighter">{t.guestsLabel}</h4>
                  </div>
                  <div className="relative mb-4">
                    <input
                      type="number" min="20" max="1000" value={localGuests}
                      onChange={e => setLocalGuests(Math.max(20, parseInt(e.target.value) || 20))}
                      className="w-full bg-white border-4 border-bbq-black p-6 text-5xl font-black focus:outline-none focus:ring-4 focus:ring-bbq-red shadow-hard-sm"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                      <button onClick={() => setLocalGuests(g => g + 1)} className="p-1 hover:bg-gray-100 border-2 border-bbq-black bg-white active:translate-y-0.5"><Plus size={16} strokeWidth={4} /></button>
                      <button onClick={() => setLocalGuests(g => Math.max(20, g - 1))} className="p-1 hover:bg-gray-100 border-2 border-bbq-black bg-white active:translate-y-0.5"><Minus size={16} strokeWidth={4} /></button>
                    </div>
                  </div>
                  <p className="text-[10px] font-black uppercase text-bbq-black/50 tracking-widest">{t.minGuests}</p>
                </div>

                {/* Calendar */}
                <div className="bg-white border-4 border-bbq-black shadow-hard">
                  <div className="flex justify-between items-center p-4 border-b-2 border-bbq-black">
                    <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-2 border-2 border-bbq-black/10 hover:bg-bbq-black/5"><ChevronLeft size={16} /></button>
                    <span className="font-black uppercase text-sm tracking-widest">{viewDate.toLocaleString('pt-PT', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-2 border-2 border-bbq-black/10 hover:bg-bbq-black/5"><ChevronRight size={16} /></button>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {dayLabels.map((d, i) => <div key={i} className="text-center font-black text-gray-400 text-[10px] py-1">{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {calendarDays.map((date, i) => {
                        if (!date) return <div key={i} />;
                        const isSelected = booking.date?.toDateString() === date.toDateString();
                        const isPast = date < today;
                        const dateStr = date.toISOString().split('T')[0];
                        const weather = weatherData[dateStr];
                        return (
                          <button key={i} disabled={isPast} onClick={() => setBooking(prev => ({ ...prev, date, slot: null }))}
                            className={`aspect-square p-1 border-2 flex flex-col items-center justify-between transition-all text-[10px] ${isSelected ? 'bg-bbq-yellow border-bbq-black' : isPast ? 'opacity-10 border-transparent cursor-not-allowed' : 'bg-bbq-cream border-bbq-black/5 hover:border-bbq-black/30'}`}>
                            <span className="font-black text-xs">{date.getDate()}</span>
                            {weather && (
                              <div className="flex flex-col items-center">
                                {getWeatherIcon(weather.code) === 'sun' ? <Sun size={8} /> : <Cloud size={8} />}
                                <span className="text-[8px] font-black">{weather.maxTemp}°</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirmStep1}
                disabled={!canConfirmStep1}
                className={`w-full py-6 font-black uppercase text-xl border-4 border-bbq-black shadow-hard transition-all flex items-center justify-center gap-3 ${canConfirmStep1 ? 'bg-bbq-red text-white hover:bg-bbq-black' : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed shadow-none'}`}
              >
                <Flame size={24} /> {t.confirmStep1}
              </button>
            </>
          )}
        </div>

        {/* ── STEP 02: VENUE (filtered by guests + date) ── */}
        {booking.guestsConfirmed && (
          <div className="mb-24 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="flex items-baseline gap-6 mb-12 border-b-8 border-bbq-black pb-4">
              <span className="text-8xl font-black text-bbq-red/10 leading-none">02</span>
              <h3 className="text-4xl font-black uppercase tracking-tighter">{t.step2}</h3>
            </div>

            {venuesByDay.length === 0 ? (
              <div className="bg-bbq-cream border-4 border-bbq-black p-10 text-center">
                <p className="font-black uppercase text-lg text-gray-500">{t.noVenues}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {venuesByDay.map(loc => {
                  const guestsOk = booking.guests >= loc.minGuests && booking.guests <= loc.maxGuests;
                  const isSelected = booking.locationId === loc.id;
                  return (
                    <div
                      key={loc.id}
                      onClick={() => guestsOk && setBooking(prev => ({ ...prev, locationId: loc.id, tradition: null, slot: null }))}
                      className={`group relative border-4 p-4 text-left transition-all ${guestsOk ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'} ${isSelected ? 'bg-bbq-black border-bbq-black shadow-hard translate-y-[-4px]' : guestsOk ? 'bg-white border-gray-100 hover:border-bbq-black' : 'bg-gray-50 border-gray-200'}`}
                    >
                      <div className="aspect-video bg-gray-200 mb-6 overflow-hidden border-2 border-bbq-black relative">
                        <img src={customAssets[`loc_${loc.id}_0`] || loc.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={loc.name} onError={handleImgError} />
                        {guestsOk && (
                          <button
                            onClick={(e) => { e.stopPropagation(); setViewerLocationId(loc.id); setCurrentImageIndex(0); }}
                            className={`absolute bottom-4 right-4 flex items-center gap-2 text-[10px] font-black uppercase px-3 py-2 border-2 transition-all z-10 ${isSelected ? 'bg-white text-bbq-black border-white hover:bg-bbq-yellow' : 'bg-bbq-black text-white border-bbq-black hover:bg-bbq-red shadow-hard-sm'}`}
                          >
                            <Camera size={14} /> {t.seeMore}
                          </button>
                        )}
                        <div className={`absolute top-4 left-4 border-2 border-bbq-black px-3 py-1 text-[10px] font-black uppercase shadow-hard-sm ${guestsOk ? 'bg-bbq-yellow' : 'bg-gray-200 text-gray-600'}`}>
                          {loc.minGuests}–{loc.maxGuests} {t.capacityLabel}
                        </div>
                      </div>
                      <div className={`font-black uppercase text-2xl mb-2 ${isSelected ? 'text-bbq-yellow' : 'text-bbq-black'}`}>{loc.name}</div>
                      <p className={`text-xs font-bold uppercase ${isSelected ? 'text-white' : 'text-gray-500'}`}>{loc.description}</p>
                      {!guestsOk && (
                        <p className="mt-3 text-[11px] font-black uppercase text-bbq-red">
                          {booking.guests < loc.minGuests ? `Mínimo ${loc.minGuests} convidados` : `Máximo ${loc.maxGuests} convidados`}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 03: TRADITION ── */}
        {booking.locationId && (
          <div className="mb-24 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="flex items-baseline gap-6 mb-12 border-b-8 border-bbq-black pb-4">
              <span className="text-8xl font-black text-bbq-red/10 leading-none">03</span>
              <h3 className="text-4xl font-black uppercase tracking-tighter">{t.step3}</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-10">
              <button onClick={() => setBooking(prev => ({ ...prev, tradition: 'portuguese', slot: null }))} className={`relative p-8 border-4 text-left transition-all ${booking.tradition === 'portuguese' ? 'bg-bbq-yellow text-bbq-black border-bbq-black shadow-hard translate-y-[-8px]' : 'bg-white border-gray-100 hover:border-bbq-red'}`}>
                <Castle size={48} className="text-bbq-red mb-6" />
                <div className="font-black uppercase text-2xl mb-2">{t.ptTradition}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">{t.ptTraditionSub}</div>
              </button>
              <button onClick={() => setBooking(prev => ({ ...prev, tradition: 'brazilian', slot: null }))} className={`relative p-8 border-4 text-left transition-all ${booking.tradition === 'brazilian' ? 'bg-bbq-yellow text-bbq-black border-bbq-black shadow-hard translate-y-[-8px]' : 'bg-white border-gray-100 hover:border-bbq-red'}`}>
                <ChefHat size={48} className="text-bbq-red mb-6" />
                <div className="font-black uppercase text-2xl mb-2">{t.brTradition}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">{t.brTraditionSub}</div>
              </button>
              <button onClick={() => setBooking(prev => ({ ...prev, tradition: 'argentinian', slot: null }))} className={`relative p-8 border-4 text-left transition-all ${booking.tradition === 'argentinian' ? 'bg-bbq-yellow text-bbq-black border-bbq-black shadow-hard translate-y-[-8px]' : 'bg-white border-gray-100 hover:border-bbq-red'}`}>
                <Flame size={48} className="text-bbq-red mb-6" />
                <div className="font-black uppercase text-2xl mb-2">{t.argTradition}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">{t.argTraditionSub}</div>
              </button>
            </div>

            {/* Breakdown panel — only when tradition is chosen */}
            {booking.tradition && (
              <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Meat */}
                <div className="bg-white border-4 border-bbq-black p-6 shadow-hard">
                  <div className="flex items-end gap-3 mb-1">
                    <span className="text-5xl font-black leading-none">{meatKg}kg</span>
                  </div>
                  <div className="flex items-center gap-2 mb-5 pb-4 border-b-2 border-bbq-black/10">
                    <Utensils size={14} className="text-bbq-red" />
                    <span className="font-black uppercase text-xs tracking-widest text-gray-500">{t.meatLabel}</span>
                  </div>
                  <ul className="space-y-2">
                    {meats.map(m => (
                      <li key={m} className="flex items-center gap-2 text-sm font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-bbq-red shrink-0" />
                        {m}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-[10px] font-black uppercase text-bbq-black/40 tracking-widest border-t border-bbq-black/10 pt-3">Opção vegetariana disponível</p>
                </div>

                {/* Drinks */}
                <div className="bg-white border-4 border-bbq-black p-6 shadow-hard">
                  <div className="flex items-end gap-3 mb-1">
                    <span className="text-5xl font-black leading-none">{drinkCount}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-5 pb-4 border-b-2 border-bbq-black/10">
                    <Beer size={14} className="text-bbq-red" />
                    <span className="font-black uppercase text-xs tracking-widest text-gray-500">{t.drinksLabel}</span>
                  </div>
                  <ul className="space-y-2">
                    {FIXED_DRINKS.map(d => (
                      <li key={d} className="flex items-center gap-2 text-sm font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-bbq-red shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-[10px] font-black uppercase text-bbq-black/40 tracking-widest border-t border-bbq-black/10 pt-3">Opção bar aberto opcional</p>
                </div>

                {/* Sides */}
                <div className="bg-white border-4 border-bbq-black p-6 shadow-hard">
                  <div className="flex items-end gap-3 mb-1">
                    <span className="text-5xl font-black leading-none">{FIXED_SIDES.length}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-5 pb-4 border-b-2 border-bbq-black/10">
                    <UtensilsCrossed size={14} className="text-bbq-red" />
                    <span className="font-black uppercase text-xs tracking-widest text-gray-500">{t.sidesLabel}</span>
                  </div>
                  <ul className="space-y-2">
                    {FIXED_SIDES.map(s => (
                      <li key={s} className="flex items-center gap-2 text-sm font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-bbq-red shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 04: TIME SLOT ── */}
        {booking.tradition && (
          <div className="mb-24 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="flex items-baseline gap-6 mb-12 border-b-8 border-bbq-black pb-4">
              <span className="text-8xl font-black text-bbq-red/10 leading-none">04</span>
              <h3 className="text-4xl font-black uppercase tracking-tighter">{t.step4}</h3>
            </div>
            <div className="bg-white p-8 border-4 border-bbq-black shadow-hard">
              <div className="mb-4 font-black uppercase text-sm text-gray-500">
                {booking.date?.toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {[SlotTime.MORNING, SlotTime.AFTERNOON].map(slot => (
                  <button key={slot} onClick={() => setBooking(prev => ({ ...prev, slot }))}
                    className={`py-6 border-2 font-black uppercase text-sm transition-all ${booking.slot === slot ? 'bg-bbq-yellow text-bbq-black border-bbq-black shadow-hard-sm' : 'bg-white border-bbq-black/10 text-bbq-black hover:border-bbq-black'}`}>
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 05: EXTRAS ── */}
        {booking.slot && (
          <div className="mb-24 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="flex items-baseline gap-6 mb-12 border-b-8 border-bbq-black pb-4">
              <span className="text-8xl font-black text-bbq-red/10 leading-none">05</span>
              <h3 className="text-4xl font-black uppercase tracking-tighter">{t.step5}</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {cart.map(item => (
                <div key={item.id} className="bg-white border-4 border-bbq-black p-6 shadow-hard-sm flex flex-col group">
                  <div className="aspect-square bg-gray-100 mb-4 border-2 border-bbq-black overflow-hidden">
                    <img src={customAssets[`addon_${item.id}`] || item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={item.name} onError={handleImgError} />
                  </div>
                  <h4 className="font-black uppercase text-sm mb-2 leading-none">{item.name}</h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase leading-tight mb-4 flex-1">{item.description}</p>
                  <div className="flex items-center justify-between border-t-2 border-bbq-black/5 pt-4">
                    <div className="flex border-2 border-bbq-black">
                      <button onClick={() => updateCart(item.id, -1)} className="p-2 bg-bbq-cream hover:bg-bbq-yellow"><Minus size={14} /></button>
                      <div className="px-4 py-2 font-black text-sm bg-white border-x-2 border-bbq-black">{item.quantity}</div>
                      <button onClick={() => updateCart(item.id, 1)} className="p-2 bg-bbq-cream hover:bg-bbq-yellow"><Plus size={14} /></button>
                    </div>
                    <div className="text-[9px] font-black uppercase opacity-60">por {item.unit}</div>
                  </div>
                </div>
              ))}

              <button
                onClick={handleNoExtras}
                className={`bg-white border-4 border-bbq-black p-6 shadow-hard-sm flex flex-col items-center justify-center group transition-all text-center min-h-[300px] ${noExtrasSelected ? 'bg-bbq-black text-bbq-yellow ring-4 ring-bbq-yellow ring-inset' : 'hover:border-bbq-red'}`}
              >
                <div className="bg-bbq-cream w-20 h-20 border-2 border-bbq-black flex items-center justify-center mb-6 shadow-hard-sm group-hover:bg-bbq-yellow">
                  <CircleOff size={40} className={noExtrasSelected ? 'text-bbq-black' : 'text-bbq-red'} />
                </div>
                <h4 className="font-black uppercase text-xl mb-2">{t.noExtras}</h4>
                <p className="text-[10px] font-bold uppercase opacity-60 max-w-[150px]">{t.noExtrasSub}</p>
                {noExtrasSelected && (
                  <div className="mt-4 bg-green-500 text-white px-4 py-1 font-black uppercase text-[10px] border-2 border-bbq-black">{t.confirmSelection}</div>
                )}
              </button>
            </div>

            <button onClick={() => { setBooking(prev => ({ ...prev, extrasConfirmed: true })); setShowQuote(true); }} className="w-full py-8 font-black uppercase text-2xl shadow-hard transition-all bg-bbq-red text-white hover:bg-bbq-black">
              {t.confirmSelection}
            </button>
          </div>
        )}
      </main>

      <Footer setView={setView} lang={lang} />
      <BookingSummary booking={booking} cart={cart} onCheckout={() => setShowQuote(true)} lang={lang} />

      {/* ── LOCATION PHOTO VIEWER ── */}
      {viewerLocationId && (() => {
        const loc = LOCATIONS.find(l => l.id === viewerLocationId);
        const imgs = loc?.images.map((img, i) => customAssets[`loc_${viewerLocationId}_${i}`] || img) || [];
        return (
          <div className="fixed inset-0 z-[70] bg-bbq-black/95 flex items-center justify-center p-4 md:p-10 backdrop-blur-md">
            <div className="bg-white w-full max-w-5xl h-full max-h-[80vh] border-[8px] border-bbq-black shadow-hard flex flex-col relative overflow-hidden">
              <button onClick={() => { setViewerLocationId(null); setCurrentImageIndex(0); }} className="absolute -top-6 -right-6 bg-bbq-red text-white p-2 border-4 border-bbq-black shadow-hard-sm z-20"><X size={32} /></button>
              <div className="p-6 border-b-4 border-bbq-black bg-bbq-yellow flex justify-between items-center">
                <h3 className="text-3xl font-black uppercase tracking-tighter">{loc?.name}</h3>
                <div className="bg-bbq-black text-white px-4 py-1 font-black text-sm border-2 border-bbq-black">{currentImageIndex + 1} / {imgs.length}</div>
              </div>
              <div className="flex-1 relative bg-bbq-cream flex items-center justify-center overflow-hidden">
                <button onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : imgs.length - 1)} className="absolute left-4 z-10 bg-white border-4 border-bbq-black p-3 shadow-hard-sm hover:bg-bbq-yellow"><ChevronLeft size={32} /></button>
                <button onClick={() => setCurrentImageIndex(prev => prev < imgs.length - 1 ? prev + 1 : 0)} className="absolute right-4 z-10 bg-white border-4 border-bbq-black p-3 shadow-hard-sm hover:bg-bbq-yellow"><ChevronRight size={32} /></button>
                <div className="w-full h-full p-8 flex items-center justify-center">
                  <div className="relative w-full h-full border-4 border-bbq-black bg-white shadow-hard overflow-hidden">
                    <img src={imgs[currentImageIndex]} className="w-full h-full object-contain" alt={`View ${currentImageIndex + 1}`} onError={handleImgError} />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white border-t-4 border-bbq-black flex justify-center gap-3">
                {imgs.map((_, i) => (
                  <button key={i} onClick={() => setCurrentImageIndex(i)} className={`w-4 h-4 border-2 border-bbq-black transition-all ${currentImageIndex === i ? 'bg-bbq-red scale-125' : 'bg-bbq-cream hover:bg-bbq-yellow'}`} />
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── QUOTE MODAL ── */}
      {showQuote && (
        <div className="fixed inset-0 z-[60] bg-bbq-black/98 flex items-center justify-center p-4 backdrop-blur-xl">
          <div className="bg-white max-w-2xl w-full border-4 sm:border-[12px] border-bbq-black p-6 sm:p-12 relative shadow-[15px_15px_0px_0px_#F4B41A] sm:shadow-[30px_30px_0px_0px_#F4B41A]">
            {!isSending && <button onClick={() => { setShowQuote(false); setIsSubmitted(false); }} className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-bbq-red text-white p-2 sm:p-3 border-2 sm:border-4 border-bbq-black shadow-hard-sm"><X size={24} className="sm:hidden" /><X size={40} className="hidden sm:block" /></button>}
            {!isSubmitted ? (
              <form onSubmit={handleFormSubmit} className="space-y-8">
                <div className="flex items-center gap-4 sm:gap-5 mb-6 sm:mb-10 border-b-4 sm:border-b-8 border-bbq-black pb-4 sm:pb-6">
                  <ChefHat className="text-bbq-red shrink-0 w-10 h-10 sm:w-16 sm:h-16" />
                  <div>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight sm:leading-none">{t.finalize}</h2>
                    <p className="text-[10px] sm:text-xs font-black uppercase text-gray-400 mt-1 sm:mt-2">{t.contactDetails}</p>
                  </div>
                </div>
                <input required disabled={isSending} placeholder={t.fullName} value={clientName} onChange={e => setClientName(e.target.value)} className="w-full border-4 border-bbq-black p-5 text-xl font-black focus:outline-none focus:ring-4 focus:ring-bbq-yellow disabled:opacity-50" />
                <div className="grid md:grid-cols-2 gap-6">
                  <input required disabled={isSending} type="email" placeholder={t.email} value={clientEmail} onChange={e => setClientEmail(e.target.value)} className="w-full border-4 border-bbq-black p-5 text-xl font-black focus:outline-none focus:ring-4 focus:ring-bbq-yellow disabled:opacity-50" />
                  <input required disabled={isSending} type="tel" placeholder={t.phone} value={clientPhone} onChange={e => setClientPhone(e.target.value)} className="w-full border-4 border-bbq-black p-5 text-xl font-black focus:outline-none focus:ring-4 focus:ring-bbq-yellow disabled:opacity-50" />
                </div>
                <button type="submit" disabled={isSending} className="w-full bg-bbq-red text-white py-5 sm:py-8 font-black uppercase text-xl sm:text-2xl md:text-3xl shadow-hard flex items-center justify-center gap-4 hover:translate-y-[-4px] active:translate-y-0 transition-all disabled:bg-gray-400 disabled:shadow-none disabled:translate-y-0">
                  {isSending ? <Loader2 className="animate-spin w-8 h-8" /> : null}
                  {isSending ? t.sending : t.finalize}
                </button>
              </form>
            ) : (
              <div className="text-center py-12">
                <div className="bg-bbq-yellow w-32 h-32 rounded-full border-8 border-bbq-black flex items-center justify-center mx-auto mb-10 shadow-hard"><Check size={64} strokeWidth={6} /></div>
                <h2 className="text-6xl font-black uppercase mb-4">{t.sent}</h2>
                <p className="font-bold text-gray-500 uppercase tracking-widest mb-12">{t.sentSub}</p>
                <button onClick={() => { setShowQuote(false); setIsSubmitted(false); }} className="bg-bbq-black text-white px-12 py-5 font-black uppercase text-xl shadow-hard-sm">Voltar</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
