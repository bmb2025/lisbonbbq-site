
import React, { useState, useRef, useEffect } from 'react';
import { Flame, MapPin, Printer, UtensilsCrossed, Users, Calendar, Phone, CheckCircle2, Package, Clock, Plus, Beer, Gauge, Mail, Copy, Code, Eye, FileJson } from 'lucide-react';

// --- INTERNAL TYPES ---

export enum SlotTime {
  MORNING = '09:00 - 13:00',
  AFTERNOON = '15:00 - 19:00',
  ALL_DAY = 'Full Day Experience',
}

export type BBQTradition = 'brazilian' | 'portuguese' | 'argentinian';

export interface BookingState {
  tradition: BBQTradition | null;
  date: Date | null;
  slot: SlotTime | null;
  guests: number;
  guestsConfirmed: boolean;
  style: string | null;
  locationId: string | null;
  selectedSides: string[];
  sidesConfirmed: boolean;
  paoAlentejano: boolean;
  sobremesa: boolean;
  extrasConfirmed: boolean;
}

export interface AddOnItem {
  id: string;
  name: string;
  description: string;
  unit: string;
  image: string;
  category: 'starter' | 'premium-meat' | 'dessert' | 'service';
}

export interface CartItem extends AddOnItem {
  quantity: number;
}

export interface VenueLocation {
  id: string;
  name: string;
  description: string;
  images: string[];
}

const LOCATIONS_DATA: VenueLocation[] = [
  { 
    id: 'tapadinha_lisboa', 
    name: 'Monsanto (Lisboa)', 
    description: 'Espaço versátil rodeado de natureza no pulmão de Lisboa. Ideal para convívios ao ar livre.', 
    images: ['https://images.unsplash.com/photo-1533167649158-6d508895b680?q=80&w=1200&auto=format&fit=crop']
  },
  { 
    id: 'restelo_urban', 
    name: 'Restelo', 
    description: 'O verdadeiro churrasco em contexto urbano, bem no centro do Restelo onde a vibe tradicional impera.', 
    images: ['https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/Carama%CC%83o%20hero.webp']
  },
  { 
    id: 'expo_rooftop', 
    name: 'Expo', 
    description: 'Rooftop que nos transporta para um mundo de cor, criatividade e comunhão com a cidade', 
    images: ['https://storage.googleapis.com/imagens-publicas-lisbonbbq/Fotos/Locais/Expo/Expo1_A%20(1).webp']
  }
];

// --- COMPONENT ---

interface ProposalViewProps {
  onReturn: () => void;
  assets: Record<string, string>;
  booking: BookingState;
  cart: CartItem[];
  lang: 'pt' | 'en';
}

export const ProposalView: React.FC<ProposalViewProps> = ({ onReturn, assets, booking, cart, lang }) => {
  const [viewMode, setViewMode] = useState<'premium' | 'email-visual' | 'email-code'>('premium');
  const [copySuccess, setCopySuccess] = useState(false);
  const emailRef = useRef<HTMLDivElement>(null);
  const [editableHtml, setEditableHtml] = useState('');

  const selectedLocation = LOCATIONS_DATA.find(l => l.id === booking.locationId);
  const selectedExtras = cart.filter(item => item.quantity > 0);
  
  const basePricePerPerson = booking.tradition === 'brazilian' ? 45 : booking.tradition === 'argentinian' ? 48 : 39;
  const totalMenuPrice = (booking.guests || 10) * basePricePerPerson;
  const venueFee = 0; // Removido: A taxa é gerida centralmente no Drive/Script

  // Função para gerar o HTML puro com estilos Inline (compatível com e-mail)
  const generateEmailHtml = () => {
    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Orçamento LisbonBBQ</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F9F7F2; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F9F7F2; padding: 40px 0;">
    <tr>
      <td align="center">
        <!-- Wrapper -->
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border: 4px solid #1A1A1A;">
          <!-- Header -->
          <tr>
            <td bgcolor="#D91A2A" style="padding: 40px; text-align: center;">
              <h1 style="color: #F4B41A; font-size: 32px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: -1px;">Lisbon Barbecue</h1>
              <p style="color: #ffffff; font-size: 14px; font-weight: bold; margin: 10px 0 0; text-transform: uppercase; letter-spacing: 2px;">Premium Concierge Service</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 40px;">
              <p style="font-size: 16px; color: #1A1A1A; font-weight: bold;">Olá,</p>
              <p style="font-size: 15px; color: #666666; line-height: 1.6;">Enviamos a proposta personalizada para a vossa experiência de churrasco em Lisboa. Tratamos de toda a logística para que o vosso foco seja apenas o convívio.</p>
              
              <h3 style="font-size: 14px; font-weight: 900; text-transform: uppercase; color: #D91A2A; border-bottom: 2px solid #D91A2A; padding-bottom: 5px; margin-top: 30px;">Detalhes do Evento</h3>
              <table width="100%" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;">
                    <strong style="font-size: 11px; text-transform: uppercase; color: #999;">Local</strong><br>
                    <span style="font-weight: bold; font-size: 14px;">${selectedLocation?.name || 'Lisboa'}</span>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;">
                    <strong style="font-size: 11px; text-transform: uppercase; color: #999;">Convidados</strong><br>
                    <span style="font-weight: bold; font-size: 14px;">${booking.guests} Pessoas</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;">
                    <strong style="font-size: 11px; text-transform: uppercase; color: #999;">Menu</strong><br>
                    <span style="font-weight: bold; font-size: 14px;">${booking.style} (${booking.tradition})</span>
                  </td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee;">
                    <strong style="font-size: 11px; text-transform: uppercase; color: #999;">Horário</strong><br>
                    <span style="font-weight: bold; font-size: 14px;">${booking.slot}</span>
                  </td>
                </tr>
              </table>

              <h3 style="font-size: 14px; font-weight: 900; text-transform: uppercase; color: #D91A2A; border-bottom: 2px solid #D91A2A; padding-bottom: 5px; margin-top: 30px;">Orçamento Estimado</h3>
              <table width="100%" cellpadding="15" cellspacing="0" style="background-color: #F9F7F2; border: 2px solid #1A1A1A;">
                <tr>
                  <td style="font-weight: bold; font-size: 13px;">MENU BASE (${booking.guests}x)</td>
                  <td align="right" style="font-weight: bold;">${totalMenuPrice}€</td>
                </tr>
                ${selectedExtras.length > 0 ? selectedExtras.map(ex => `
                <tr>
                  <td style="font-weight: bold; font-size: 13px;">${ex.name} (x${ex.quantity})</td>
                  <td align="right" style="font-weight: bold;">Sob Consulta</td>
                </tr>`).join('') : ''}
                <tr>
                  <td style="padding-top: 20px; font-size: 18px; font-weight: 900; color: #D91A2A;">TOTAL ESTIMADO*</td>
                  <td align="right" style="padding-top: 20px; font-size: 18px; font-weight: 900; color: #D91A2A;">${totalMenuPrice}€</td>
                </tr>
              </table>

              <p style="font-size: 10px; color: #999; margin-top: 10px;">*Taxas de local e logística serão calculadas e enviadas na proposta formal via Drive.</p>

              <div style="margin-top: 40px; border-top: 4px solid #F4B41A; padding-top: 20px;">
                <p style="font-size: 12px; font-weight: 900; color: #1A1A1A; text-transform: uppercase; margin: 0;">Próximos Passos:</p>
                <p style="font-size: 13px; color: #666; margin-top: 5px;">A reserva é oficializada mediante adjudicação de 50%. Ficamos ao dispor para qualquer ajuste!</p>
              </div>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td bgcolor="#1A1A1A" style="padding: 30px; text-align: center; color: #ffffff;">
              <p style="font-size: 11px; font-weight: bold; text-transform: uppercase; margin: 0; letter-spacing: 1px;">Lisbon Barbecue & Churrasco</p>
              <p style="font-size: 10px; color: #666; margin-top: 10px;">+351 961 058 571 · pitmasters@lisbonbbq.pt</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim();
  };

  useEffect(() => {
    setEditableHtml(generateEmailHtml());
  }, [booking, cart]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editableHtml);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const t = {
    back: lang === 'pt' ? 'Voltar ao Editor' : 'Back to Designer',
    premiumMode: lang === 'pt' ? 'Proposta Premium' : 'Premium Proposal',
    emailMode: lang === 'pt' ? 'Editor Email' : 'Email Editor',
    codeMode: lang === 'pt' ? 'Ver Código HTML' : 'View HTML Code',
    copy: lang === 'pt' ? 'Copiar Código' : 'Copy Code',
    copied: lang === 'pt' ? 'Copiado!' : 'Copied!'
  };

  return (
    <div className="min-h-screen bg-bbq-cream py-12 px-4 md:px-6 font-sans text-bbq-black print:bg-white print:p-0">
      
      {/* Navegação Superior (Escondida na Impressão) */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-6 no-print">
        <div className="flex bg-white border-4 border-bbq-black p-1 shadow-hard-sm">
          <button 
            onClick={() => setViewMode('premium')} 
            className={`px-4 py-2 font-black uppercase text-xs flex items-center gap-2 transition-all ${viewMode === 'premium' ? 'bg-bbq-red text-white' : 'hover:bg-bbq-cream'}`}
          >
            <Eye size={16}/> {t.premiumMode}
          </button>
          <button 
            onClick={() => setViewMode('email-visual')} 
            className={`px-4 py-2 font-black uppercase text-xs flex items-center gap-2 transition-all ${viewMode === 'email-visual' ? 'bg-bbq-red text-white' : 'hover:bg-bbq-cream'}`}
          >
            <Mail size={16}/> {t.emailMode}
          </button>
          <button 
            onClick={() => setViewMode('email-code')} 
            className={`px-4 py-2 font-black uppercase text-xs flex items-center gap-2 transition-all ${viewMode === 'email-code' ? 'bg-bbq-red text-white' : 'hover:bg-bbq-cream'}`}
          >
            <Code size={16}/> {t.codeMode}
          </button>
        </div>

        <div className="flex gap-4">
          <button onClick={onReturn} className="flex items-center gap-2 font-black uppercase text-xs hover:text-bbq-red">
            <UtensilsCrossed size={16} /> {t.back}
          </button>
          <button 
            onClick={copyToClipboard}
            className="bg-bbq-black text-white px-6 py-3 font-black uppercase text-xs flex items-center gap-2 shadow-hard hover:bg-bbq-red transition-all"
          >
            {copySuccess ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            {copySuccess ? t.copied : t.copy}
          </button>
        </div>
      </div>

      {/* RENDERIZAÇÃO CONSOANTE O MODO */}
      <div className="max-w-4xl mx-auto">
        
        {/* MODO 1: PREMIUM (EXISTENTE) */}
        {viewMode === 'premium' && (
          <div className="bg-white border-[8px] border-bbq-black shadow-hard overflow-hidden print:border-4">
            <header className="bg-bbq-red text-bbq-cream p-12 border-b-8 border-bbq-black relative overflow-hidden">
               <div className="relative z-10">
                <div className="bg-bbq-yellow text-bbq-black inline-block px-4 py-1 font-black uppercase text-xs mb-4 border-2 border-bbq-black shadow-hard-sm">Premium Proposta</div>
                <h1 className="text-5xl font-black uppercase tracking-tighter leading-[0.8]">Lisbon <br/><span className="text-bbq-yellow">Barbecue</span></h1>
               </div>
               <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12"><Flame size={200} /></div>
            </header>
            <div className="p-12 space-y-12">
               <section>
                 <h2 className="text-3xl font-black uppercase italic border-l-8 border-bbq-red pl-6 mb-6">A Tua Experiência</h2>
                 <p className="text-xl font-bold uppercase text-gray-500 leading-relaxed">Configurámos o melhor banquete para {booking.guests} convidados no {selectedLocation?.name}.</p>
               </section>
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-bbq-cream p-8 border-4 border-bbq-black shadow-hard-sm">
                    <h3 className="font-black uppercase text-sm text-bbq-red mb-4 tracking-widest">Menu Selecionado</h3>
                    <p className="text-2xl font-black uppercase">{booking.style}</p>
                    <p className="text-xs font-bold text-gray-400 mt-2 uppercase">{booking.tradition} Tradition</p>
                  </div>
                  <div className="bg-bbq-yellow p-8 border-4 border-bbq-black shadow-hard-sm">
                    <h3 className="font-black uppercase text-sm text-bbq-black mb-4 tracking-widest">Orçamento Estimado</h3>
                    <p className="text-4xl font-black italic">{totalMenuPrice + venueFee}€</p>
                    <p className="text-[10px] font-black uppercase mt-2 opacity-60">Total com IVA e Logística</p>
                  </div>
               </div>
            </div>
            <footer className="bg-bbq-black text-white p-6 text-center text-[10px] font-black uppercase tracking-widest">
              Lisbon Barbecue & Churrasco · 2024
            </footer>
          </div>
        )}

        {/* MODO 2: EMAIL VISUAL (DRAFT) */}
        {viewMode === 'email-visual' && (
          <div className="bg-white p-12 border-4 border-bbq-black shadow-hard">
            <div className="mb-6 p-4 bg-blue-50 text-blue-800 border-2 border-blue-200 text-xs font-bold uppercase">
              Visualização de E-mail: O conteúdo abaixo pode ser editado diretamente antes de copiares o código.
            </div>
            <div 
              className="border border-gray-100"
              dangerouslySetInnerHTML={{ __html: editableHtml }}
              contentEditable
              onBlur={(e) => setEditableHtml(e.currentTarget.innerHTML)}
            />
          </div>
        )}

        {/* MODO 3: CÓDIGO FONTE (PARA COLAR NO EDITOR) */}
        {viewMode === 'email-code' && (
          <div className="space-y-4">
            <div className="p-6 bg-bbq-black text-bbq-yellow border-4 border-bbq-black shadow-hard">
               <h3 className="text-xl font-black uppercase flex items-center gap-2 mb-2">
                 <Code size={20}/> Código HTML para E-mail
               </h3>
               <p className="text-xs font-bold opacity-70 uppercase tracking-widest">
                 Copia o código abaixo e cola-o no teu editor HTML ou cliente de e-mail. Estilos inline incluídos para máxima compatibilidade.
               </p>
            </div>
            <textarea 
              value={editableHtml}
              onChange={(e) => setEditableHtml(e.target.value)}
              className="w-full h-[600px] bg-white border-4 border-bbq-black p-8 font-mono text-xs focus:ring-4 focus:ring-bbq-red outline-none shadow-hard"
              spellCheck={false}
            />
          </div>
        )}

      </div>
      
      <div className="max-w-4xl mx-auto mt-12 text-center text-[10px] font-black uppercase text-gray-400 tracking-[0.4em] no-print">
        LisbonBBQ · Proposta Digital v2.5
      </div>
    </div>
  );
};
