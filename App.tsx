
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { Footer } from './components/Footer';
import { ProposalView } from './components/ProposalView';
import { LegalView } from './components/LegalView';
import { FAQView } from './components/FAQView';
import { QuemSomosView } from './components/QuemSomosView';
import { CorporateView } from './components/CorporateView';
import { VerBolaView } from './components/VerBolaView';
import { BlogList, ArticleDetail } from './components/BlogComponents';
import { BlogAdmin } from './components/CMSComponents';
import { SpotifyPlayer } from './components/SpotifyPlayer';
import { ADD_ONS, LOCATIONS, DEFAULT_ASSETS, BRAZILIAN_MENUS, PORTUGUESE_MENUS, ARGENTINIAN_MENUS, OWN_LOCATION_ID, OWN_LOCATION_NAME } from './constants';
import { BookingState, CartItem, DailyWeather, Article } from './types';
import { getLisbonWeather } from './services/weatherService';
import { cloudService } from './services/cloudService';
import { fetchArticles, fetchArticleBySlug } from './services/gitCms';
import { Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';

const BOOKINGS_STORAGE_KEY = 'bbq_leads_db_v1';

interface ViewProps {
  lang: 'pt' | 'en';
  setLang: (l: 'pt' | 'en') => void;
  setView: (v: 'booking' | 'proposal' | 'privacy' | 'terms' | 'blog' | 'cms' | 'faqs' | 'about' | 'corporate' | 'verbola') => void;
}

const BlogListPage: React.FC<ViewProps & { articles: Article[], onArticleClick: (s: string) => void }> = ({
  lang, setLang, setView, articles, onArticleClick
}) => (
  <div className="min-h-screen bg-bbq-cream">
    <Header setView={setView} lang={lang} setLang={setLang} />
    <BlogList articles={articles} onArticleClick={onArticleClick} />
    <Footer setView={setView} lang={lang} />
  </div>
);

const BlogArticlePage: React.FC<ViewProps & { onBack: () => void }> = ({
  lang, setLang, setView, onBack
}) => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const a = await fetchArticleBySlug(slug);
        if (!cancelled) setArticle((a as any) || null);
      } catch (e) {
        console.error('CMS fetchArticleBySlug failed:', e);
        if (!cancelled) setArticle(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [slug]);

  return (
    <div className="min-h-screen bg-bbq-cream">
      <Header setView={setView} lang={lang} setLang={setLang} />
      {loading ? (
        <div className="max-w-4xl mx-auto px-4 py-24">
          <div className="border-4 border-bbq-black bg-white p-10 shadow-hard">
            <div className="font-black uppercase text-gray-400">A carregar artigo…</div>
          </div>
        </div>
      ) : article ? (
        <ArticleDetail article={article} onBack={onBack} lang={lang} />
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-24">
          <div className="border-4 border-bbq-black bg-white p-10 shadow-hard">
            <div className="text-3xl font-black uppercase mb-4">Artigo não encontrado</div>
            <button onClick={onBack} className="bg-bbq-black text-white px-6 py-3 font-black uppercase border-2 border-bbq-black shadow-hard-sm hover:bg-bbq-red transition-colors">Voltar ao Blog</button>
          </div>
        </div>
      )}
      <Footer setView={setView} lang={lang} />
    </div>
  );
};

const App: React.FC = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState<'pt' | 'en'>('pt');
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [articles, setArticles] = useState<Article[]>([]);
  const [booking, setBooking] = useState<BookingState>({
    tradition: null,
    date: null,
    slot: null,
    guests: 20,
    guestsConfirmed: false,
    style: null,
    locationId: null,
    selectedSides: [],
    sidesConfirmed: false,
    paoAlentejano: false,
    sobremesa: false,
    extrasConfirmed: false,
  });

  const [leads, setLeads] = useState<any[]>(() => {
    const saved = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetchArticles()
      .then((cmsArticles) => setArticles(cmsArticles as any))
      .catch((e) => console.error('CMS fetchArticles failed:', e));
  }, []);

  const customAssets = useMemo(() => {
    const assets = { ...DEFAULT_ASSETS };
    LOCATIONS.forEach(loc => {
      loc.images.forEach((img, i) => {
        const key = `loc_${loc.id}_${i}`;
        assets[key] = img;
      });
    });
    ADD_ONS.forEach(addon => {
      const key = `addon_${addon.id}`;
      assets[key] = addon.image;
    });
    return assets;
  }, []);

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadSource, setLeadSource] = useState<'direct' | 'corporate'>('direct');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showQuote, setShowQuote] = useState(false);
  const [weatherData, setWeatherData] = useState<Record<string, DailyWeather>>({});
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const traditionSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCart(ADD_ONS.map(item => ({ ...item, quantity: 0 })));
    getLisbonWeather().then(setWeatherData);
  }, []);

  const setView = (view: 'booking' | 'proposal' | 'privacy' | 'terms' | 'blog' | 'cms' | 'faqs' | 'about' | 'corporate' | 'verbola') => {
    if (view === 'booking') setLeadSource('direct');
    switch (view) {
      case 'booking': navigate('/'); break;
      case 'proposal': navigate('/proposal'); break;
      case 'privacy': navigate('/privacy'); break;
      case 'terms': navigate('/terms'); break;
      case 'blog': navigate('/blog'); break;
      case 'cms': navigate('/admin'); break;
      case 'faqs': navigate('/faqs'); break;
      case 'about': navigate('/quem-somos'); break;
      case 'corporate': navigate('/corporate'); break;
      case 'verbola': navigate('/verbola'); break;
      default: navigate('/'); break;
    }
  };

  const toggleSide = (side: string) => {
    setBooking(prev => {
      const exists = prev.selectedSides.includes(side);
      const newState = { ...prev, extrasConfirmed: false, sidesConfirmed: false };
      if (exists) return { ...newState, selectedSides: prev.selectedSides.filter(s => s !== side) };
      
      const allMenus = [...BRAZILIAN_MENUS, ...PORTUGUESE_MENUS, ...ARGENTINIAN_MENUS];
      const currentMenu = allMenus.find(m => m.name === prev.style);
      const limit = currentMenu?.maxSides || 2;
      
      if (prev.selectedSides.length < limit) return { ...newState, selectedSides: [...prev.selectedSides, side] };
      return prev;
    });
  };

  const updateCart = (id: string, delta: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item));
    setBooking(prev => ({ ...prev, extrasConfirmed: false }));
  };

  const scrollToBooking = () => {
    setLeadSource('corporate');
    setView('booking');
    setTimeout(() => traditionSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleArticleClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  const handleCorporateSubmit = async (data: any) => {
    setIsSending(true);

    // Map selected ranges to numeric fallbacks for formulas/numeric cells in GSheets
    const guestCounts: Record<string, number> = {
      '10-20': 15,
      '20-40': 30,
      '40-60': 50,
      '60-80': 70,
      '80+': 80
    };
    const parsedGuestsNum = guestCounts[data.guests] || (data.guests ? parseInt(data.guests) : 20);

    const newLead = {
      // 1. Keep the ID format strictly conforming to standard booking pattern (LB-timestamp)
      id: `LB-${Date.now()}`,
      timestamp: new Date().toISOString(),
      client: { name: data.name, email: data.email, phone: data.phone },
      corporate: { company: data.company, guests: data.guests, message: data.message },
      source: 'corporate',
      lang,
      target_email: 'pitmasters@lisbonbbq.pt', // Explicit for corporate

      // Direct root compatibility
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      // Provide numeric guests for any cell typing/math on spreadsheet side, keep range as meta
      guests: parsedGuestsNum,
      // Enriched message to ensure corporate guests range is clearly visible inside email body / message card
      message: `[Pedida Gama de Convidados: ${data.guests}] ${data.message || ''}`,

      // Fallbacks
      package: 'corporate',
      location: 'TBD',
      event_date: new Date().toISOString(),
      drinks: 'mixed',

      // Fully-populated booking structure matching standard nested properties
      booking: {
        tradition: 'portuguese',
        date: new Date().toISOString(),
        slot: 'almoço',
        guests: parsedGuestsNum,
        guestsConfirmed: true,
        style: 'Corporate',
        styleId: 'corporate',
        locationId: 'TBD',
        selectedSides: [],
        sidesConfirmed: true,
        paoAlentejano: false,
        sobremesa: false,
        extrasConfirmed: true
      },
      extras: [],
      summary: {
        totalGuests: parsedGuestsNum,
        location: 'TBD',
        locationId: 'TBD',
        menu: 'corporate',
        menuId: 'corporate'
      }
    };
    
    const success = await cloudService.saveLead(newLead);
    setIsSending(false);
    return success;
  };

  const saveArticle = async (article: Article) => {
    await cloudService.saveArticle(article);
    const updated = await cloudService.fetchArticles();
    setArticles(updated);
  };

  const deleteArticle = async (id: string) => {
    if (window.confirm("Apagar artigo permanentemente?")) {
      await cloudService.deleteArticle(id);
      const updated = await cloudService.fetchArticles();
      setArticles(updated);
    }
  };

  const calendarDays = useMemo(() => {
    const days = [];
    const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const lastDay = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
    const startPadding = firstDay.getDay();
    for (let i = 0; i < startPadding; i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(viewDate.getFullYear(), viewDate.getMonth(), i));
    }
    return days;
  }, [viewDate]);

  // Early lead capture — name + phone collected before the extras step.
  // Saves to the database immediately (no emails yet — email is collected at the
  // final quote popup). Captures the lead even if the user drops off at extras.
  const handleLeadCapture = async () => {
    if (!clientName.trim() || !clientPhone.trim() || leadCaptured) return;
    setLeadCaptured(true); // reveal extras right away
    const selectedMenuId = [...BRAZILIAN_MENUS, ...PORTUGUESE_MENUS, ...ARGENTINIAN_MENUS].find(m => m.name === booking.style)?.id || 'brazilian-1';

    const partialLead = {
      id: `LB-${Date.now()}`,
      timestamp: new Date().toISOString(),
      stage: 'partial',
      client: { name: clientName, phone: clientPhone },
      booking: { ...booking, date: booking.date?.toISOString(), styleId: selectedMenuId },
      extras: [],
      summary: {
        totalGuests: booking.guests,
        location: booking.locationId === OWN_LOCATION_ID ? OWN_LOCATION_NAME : (LOCATIONS.find(l => l.id === booking.locationId)?.name || booking.locationId),
        locationId: booking.locationId,
        menu: booking.style,
        menuId: selectedMenuId
      },
      package: selectedMenuId,
      location: booking.locationId,
      guests: booking.guests,
      name: clientName,
      phone: clientPhone,
      event_date: booking.date?.toISOString(),
      source: leadSource,
      lang,
    };

    await cloudService.saveLead(partialLead);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (clientName && clientEmail && clientPhone && !isSending) {
      setIsSending(true);
      const selectedMenuId = [...BRAZILIAN_MENUS, ...PORTUGUESE_MENUS, ...ARGENTINIAN_MENUS].find(m => m.name === booking.style)?.id || 'brazilian-1';
      
      const newLead = {
        id: `LB-${Date.now()}`,
        timestamp: new Date().toISOString(),
        client: { name: clientName, email: clientEmail, phone: clientPhone },
        booking: { ...booking, date: booking.date?.toISOString(), styleId: selectedMenuId },
        extras: cart.filter(c => c.quantity > 0).map(c => ({ id: c.id, name: c.name, qty: c.quantity })),
        summary: {
          totalGuests: booking.guests,
          location: booking.locationId === OWN_LOCATION_ID ? OWN_LOCATION_NAME : (LOCATIONS.find(l => l.id === booking.locationId)?.name || booking.locationId),
          locationId: booking.locationId,
          menu: booking.style,
          menuId: selectedMenuId
        },
        // Compatibilidade direta com o script
        package: selectedMenuId,
        location: booking.locationId,
        guests: booking.guests,
        email: clientEmail,
        event_date: booking.date?.toISOString(),
        drinks: 'mixed', // Por defeito
        source: leadSource,
        lang,
        target_email: leadSource === 'corporate' ? 'pitmasters@lisbonbbq.pt' : undefined
      };
      
      const success = await cloudService.saveLead(newLead);
      
      setLeads(prev => [newLead, ...prev]);
      setIsSending(false);
      setIsSubmitted(true);
      
      const currentLeads = JSON.parse(localStorage.getItem(BOOKINGS_STORAGE_KEY) || '[]');
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify([newLead, ...currentLeads]));
    }
  };

  return (
    <>
      <Routes>
        <Route path="/" element={
          <HomePage 
            lang={lang} setLang={setLang} setView={setView} booking={booking} setBooking={setBooking} 
            cart={cart} setCart={setCart} updateCart={updateCart} customAssets={customAssets} weatherData={weatherData} 
            viewDate={viewDate} setViewDate={setViewDate} calendarDays={calendarDays} today={today} 
            showQuote={showQuote} setShowQuote={setShowQuote} isSubmitted={isSubmitted} 
            setIsSubmitted={setIsSubmitted} isSending={isSending} clientName={clientName} 
            setClientName={setClientName} clientEmail={clientEmail} setClientEmail={setClientEmail} 
            clientPhone={clientPhone} setClientPhone={setClientPhone} handleFormSubmit={handleFormSubmit}
            scrollToBooking={scrollToBooking} traditionSectionRef={traditionSectionRef} toggleSide={toggleSide}
            leadCaptured={leadCaptured} setLeadCaptured={setLeadCaptured} handleLeadCapture={handleLeadCapture}
          />
        } />
        <Route path="/blog" element={<BlogListPage lang={lang} setLang={setLang} setView={setView} articles={articles} onArticleClick={handleArticleClick} />} />
        <Route path="/blog/:slug" element={<BlogArticlePage lang={lang} setLang={setLang} setView={setView} onBack={() => navigate('/blog')} />} />
        <Route path="/quem-somos" element={<><Header setView={setView} lang={lang} setLang={setLang} /><QuemSomosView lang={lang} onBack={() => setView('booking')} /><Footer setView={setView} lang={lang} /></>} />
        <Route path="/proposal" element={<><Header setView={setView} lang={lang} setLang={setLang} /><ProposalView onReturn={() => setView('booking')} assets={customAssets} booking={booking} cart={cart} lang={lang} /><Footer setView={setView} lang={lang} /></>} />
        <Route path="/privacy" element={<><Header setView={setView} lang={lang} setLang={setLang} /><LegalView type="privacy" lang={lang} onBack={() => setView('booking')} /><Footer setView={setView} lang={lang} /></>} />
        <Route path="/terms" element={<><Header setView={setView} lang={lang} setLang={setLang} /><LegalView type="terms" lang={lang} onBack={() => setView('booking')} /><Footer setView={setView} lang={lang} /></>} />
        <Route path="/faqs" element={<><Header setView={setView} lang={lang} setLang={setLang} /><FAQView lang={lang} onBack={() => setView('booking')} /><Footer setView={setView} lang={lang} /></>} />
        <Route path="/corporate" element={<><Header setView={setView} lang={lang} setLang={setLang} /><CorporateView lang={lang} onBack={() => {
          const el = document.getElementById('corporate-form');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          else scrollToBooking();
        }} onSubmit={handleCorporateSubmit} isSending={isSending} /><Footer setView={setView} lang={lang} /></>} />
        <Route path="/verbola" element={<><Header setView={setView} lang={lang} setLang={setLang} /><VerBolaView lang={lang} onBack={() => setView('booking')} /><Footer setView={setView} lang={lang} /></>} />
        <Route path="/admin" element={<BlogAdmin articles={articles} onSave={saveArticle} onDelete={deleteArticle} onBack={() => navigate('/blog')} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SpotifyPlayer showQuote={showQuote} />
    </>
  );
};

export default App;
