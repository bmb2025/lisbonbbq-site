
import React from 'react';
import { ArrowLeft, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

interface LegalViewProps {
  type: 'privacy' | 'terms';
  lang: 'pt' | 'en';
  onBack: () => void;
}

export const LegalView: React.FC<LegalViewProps> = ({ type, lang, onBack }) => {
  const content = {
    privacy: {
      title: lang === 'pt' ? 'Política de Privacidade (RGPD)' : 'Privacy Policy (GDPR)',
      intro: lang === 'pt' 
        ? 'A Lisbon Barbecue & Churrasco está comprometida em proteger a sua privacidade e cumprir o Regulamento Geral de Proteção de Dados (RGPD).'
        : 'Lisbon Barbecue & Churrasco is committed to protecting your privacy and complying with the General Data Protection Regulation (GDPR).',
      sections: [
        {
          h: lang === 'pt' ? '1. Dados Recolhidos' : '1. Data Collected',
          p: lang === 'pt' 
            ? 'Recolhemos o seu nome, endereço de e-mail e número de telefone apenas quando solicita um orçamento através do nosso formulário.'
            : 'We collect your name, email address, and phone number only when you request a quote via our form.'
        },
        {
          h: lang === 'pt' ? '2. Finalidade do Tratamento' : '2. Purpose of Processing',
          p: lang === 'pt'
            ? 'Os dados são utilizados exclusivamente para o envio de propostas, gestão de reservas e comunicação direta relacionada com o seu evento.'
            : 'The data is used exclusively for sending proposals, booking management, and direct communication related to your event.'
        },
        {
          h: lang === 'pt' ? '3. Seus Direitos' : '3. Your Rights',
          p: lang === 'pt'
            ? 'Tem o direito de aceder, retificar, limitar o tratamento ou solicitar a eliminação total (Direito ao Esquecimento) dos seus dados a qualquer momento.'
            : 'You have the right to access, rectify, limit processing, or request total deletion (Right to be Forgotten) of your data at any time.'
        }
      ]
    },
    terms: {
      title: lang === 'pt' ? 'Condições Gerais do Serviço' : 'General Terms of Service',
      intro: lang === 'pt'
        ? 'Ao utilizar os nossos serviços de reserva, concorda com as seguintes condições comerciais e operacionais que garantem a excelência do seu evento.'
        : 'By using our booking services, you agree to the following commercial and operational conditions that ensure the excellence of your event.',
      sections: [
        {
          h: lang === 'pt' ? '1. Reserva e Pagamento' : '1. Reservation and Payment',
          p: lang === 'pt'
            ? 'A reserva é confirmada mediante o pagamento de um sinal de 50% do valor orçamentado. O valor remanescente deve ser liquidado até 24 horas antes do início do evento. A falta de pagamento integral neste prazo resulta no cancelamento automático sem devolução do sinal.'
            : 'The reservation is confirmed upon payment of a 50% deposit. The remaining balance must be settled up to 24 hours before the start of the event. Failure to pay in full within this period results in automatic cancellation without refund of the deposit.'
        },
        {
          h: lang === 'pt' ? '2. Confirmação de Convidados' : '2. Confirmation of Guests',
          p: lang === 'pt'
            ? 'O número final de participantes deve ser confirmado até 5 dias úteis antes do evento. Após esta data, não são aceites reduções no valor total faturado, independentemente do número real de presenças.'
            : 'The final number of participants must be confirmed up to 5 working days before the event. After this date, reductions in the total invoiced amount are not accepted, regardless of the actual number of attendees.'
        },
        {
          h: lang === 'pt' ? '3. Cancelamentos e Reagendamento' : '3. Cancellations and Rescheduling',
          p: lang === 'pt'
            ? 'Poderá cancelar ou reagendar a sua reserva até 5 dias úteis antes da data prevista. Cancelamentos posteriores implicam a perda total do sinal, exceto se for acordado um reagendamento num período máximo de 6 meses (sujeito a disponibilidade).'
            : 'You may cancel or reschedule your reservation up to 5 working days before the scheduled date. Subsequent cancellations imply total loss of the deposit, unless a rescheduling within a maximum period of 6 months is agreed upon (subject to availability).'
        },
        {
          h: lang === 'pt' ? '4. Condições Meteorológicas' : '4. Weather Conditions',
          p: lang === 'pt'
            ? 'Em caso de meteorologia adversa ou situações de força maior que inviabilizem a operação, será proposto o reagendamento para uma nova data num prazo de 6 meses.'
            : 'In case of adverse weather or force majeure situations that make operation impossible, a rescheduling for a new date within 6 months will be proposed.'
        },
        {
          h: lang === 'pt' ? '5. Responsabilidade e Segurança' : '5. Responsibility and Safety',
          p: lang === 'pt'
            ? 'O cliente é responsável pelo comportamento dos convidados e danos ao espaço. Intolerâncias alimentares devem ser comunicadas até 5 dias úteis antes. Não nos responsabilizamos por acidentes por uso indevido de equipamentos ou consumo excessivo de álcool.'
            : 'The client is responsible for guests behavior and space damages. Dietary intolerances must be communicated up to 5 working days before. We are not responsible for accidents resulting from misuse of equipment or excessive alcohol consumption.'
        },
        {
          h: lang === 'pt' ? '6. Duração e Extras' : '6. Duration and Extras',
          p: lang === 'pt'
            ? 'O evento tem a duração prevista de 4 horas. A permanência além deste período, ou a solicitação de serviços extra no local, implica custos adicionais a serem faturados posteriormente.'
            : 'The event has a planned duration of 4 hours. Staying beyond this period, or requesting extra services on-site, implies additional costs to be invoiced later.'
        },
        {
          h: lang === 'pt' ? '7. Conteúdo e Produto' : '7. Content and Product',
          p: lang === 'pt'
            ? 'Salvo indicação em contrário, a LisbonBBQ reserva-se o direito de captar imagens para fins promocionais. Reservamos o direito de substituir pontualmente produtos por equivalentes de qualidade semelhante ou superior.'
            : 'Unless otherwise indicated, LisbonBBQ reserves the right to capture images for promotional purposes. We reserve the right to occasionally replace products with equivalents of similar or superior quality.'
        }
      ]
    }
  };

  const active = content[type];

  return (
    <div className="bg-bbq-cream min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 font-black uppercase text-sm mb-12 hover:text-bbq-red transition-colors group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" /> 
          {lang === 'pt' ? 'Voltar para a Reserva' : 'Back to Booking'}
        </button>

        <div className="bg-white border-4 border-bbq-black p-10 md:p-16 shadow-hard relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-5 rotate-12">
            {type === 'privacy' ? <ShieldCheck size={280} /> : <FileText size={280} />}
          </div>

          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-none">
              {active.title}
            </h2>
            <div className="h-2 w-32 bg-bbq-red mb-12"></div>
            
            <p className="text-xl font-bold uppercase text-gray-500 mb-16 leading-relaxed max-w-2xl">
              {active.intro}
            </p>

            <div className="space-y-16">
              {active.sections.map((sec, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="bg-bbq-yellow p-3 border-2 border-bbq-black shrink-0">
                    <CheckCircle2 size={24} strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">{sec.h}</h3>
                    <p className="text-lg font-medium text-gray-600 leading-relaxed uppercase tracking-tight">
                      {sec.p}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-24 pt-12 border-t-4 border-bbq-black/5 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                Última Atualização: 2024-11-20
              </div>
              <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-bbq-red"></div>
                 <div className="w-8 h-8 rounded-full bg-bbq-yellow"></div>
                 <div className="w-8 h-8 rounded-full bg-bbq-black"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
