
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
          h: lang === 'pt' ? 'Responsável pelo Tratamento' : 'Data Controller',
          p: lang === 'pt'
            ? 'O responsável pelo tratamento dos seus dados é a Disruptive Theory, Lda., NIF 519686551, com sede na Rua José Farinha, n.º 20, 2.º B, Lisboa, que explora a marca Lisbon Barbecue & Churrasco (LisbonBBQ). Para qualquer questão sobre os seus dados, escreva para pitmasters@lisbonbbq.pt.'
            : 'The controller of your data is Disruptive Theory, Lda., tax number (NIF) 519686551, registered office at Rua José Farinha, n.º 20, 2.º B, Lisbon, which operates the Lisbon Barbecue & Churrasco (LisbonBBQ) brand. For any question about your data, write to pitmasters@lisbonbbq.pt.'
        },
        {
          h: lang === 'pt' ? '1. Dados Recolhidos' : '1. Data Collected',
          p: lang === 'pt' 
            ? 'Recolhemos o seu nome, endereço de e-mail e número de telefone apenas quando solicita um orçamento através do nosso formulário ou quando entra na waiting list do workshop de churrasco. Na waiting list guardamos também as preferências que indica (horário, experiência a grelhar, o que o traz, como soube de nós), o código de convite pessoal, quem o convidou (se for o caso) e a origem da visita (parâmetros UTM da campanha).'
            : 'We collect your name, email address, and phone number only when you request a quote via our form or join the barbecue workshop waiting list. For the waiting list we also store the preferences you give us (time slot, grilling experience, what brings you, how you heard about us), your personal invite code, who invited you (if applicable) and the visit source (campaign UTM parameters).'
        },
        {
          h: lang === 'pt' ? '2. Finalidade do Tratamento' : '2. Purpose of Processing',
          p: lang === 'pt'
            ? 'Os dados são utilizados exclusivamente para o envio de propostas, gestão de reservas e comunicação direta relacionada com o seu evento.'
            : 'The data is used exclusively for sending proposals, booking management, and direct communication related to your event.'
        },
        {
          h: lang === 'pt' ? '3. Waiting List do Workshop' : '3. Workshop Waiting List',
          p: lang === 'pt'
            ? 'Os dados da waiting list são tratados com base no seu consentimento, dado no formulário, e servem apenas para o avisar da abertura de datas, enviar o seu convite pessoal e os lembretes associados, e organizar as turmas. Quando alguém se inscreve com o seu convite, avisamos-o por email e indicamos o primeiro nome dessa pessoa; o seu primeiro nome é mostrado a quem abrir o seu link de convite. Pode retirar o consentimento a qualquer momento respondendo a qualquer email nosso ou escrevendo para pitmasters@lisbonbbq.pt. Guardamos estes dados até 12 meses depois do último workshop para o qual o contactámos, ou até pedir a sua eliminação.'
            : 'Waiting list data is processed on the basis of the consent you give in the form, and is used only to notify you when dates open, send your personal invite and related reminders, and organise the classes. When someone signs up with your invite, we let you know by email with that person\'s first name; your first name is shown to anyone who opens your invite link. You may withdraw consent at any time by replying to any of our emails or writing to pitmasters@lisbonbbq.pt. We keep this data for up to 12 months after the last workshop we contacted you about, or until you ask us to delete it.'
        },
        {
          h: lang === 'pt' ? '4. Subcontratantes' : '4. Processors',
          p: lang === 'pt'
            ? 'Para prestar o serviço usamos fornecedores que tratam dados por nossa conta: Supabase (base de dados, alojada na União Europeia), Resend (envio de emails) e Vercel (alojamento do site). Não vendemos nem cedemos os seus dados a terceiros para fins de marketing.'
            : 'To provide the service we use providers that process data on our behalf: Supabase (database, hosted in the European Union), Resend (email delivery) and Vercel (website hosting). We do not sell or share your data with third parties for marketing purposes.'
        },
        {
          h: lang === 'pt' ? 'Cookies e Tecnologias Semelhantes' : 'Cookies and Similar Technologies',
          p: lang === 'pt'
            ? 'Usamos cookies e armazenamento local do navegador em três categorias. Essenciais: guardam a sua escolha de cookies e dados necessários ao funcionamento do site (por exemplo, a variante de preço de uma campanha); estão sempre ativos. Estatística, só com o seu consentimento: Google Analytics (Google Ireland Limited) e PostHog (alojado na União Europeia), para medir a utilização do site. Marketing, só com o seu consentimento: Google Ads e Meta Pixel (Meta Platforms Ireland Limited), para medir que anúncios geram pedidos. Sem consentimento, as ferramentas da Google funcionam em modo de consentimento recusado, sem guardar cookies de estatística ou publicidade. Pode alterar ou retirar o consentimento a qualquer momento através da ligação «Cookies» no rodapé do site.'
            : 'We use cookies and browser local storage in three categories. Essential: they store your cookie choice and data the site needs to work (for example, a campaign price variant); always active. Statistics, only with your consent: Google Analytics (Google Ireland Limited) and PostHog (hosted in the European Union), to measure site usage. Marketing, only with your consent: Google Ads and Meta Pixel (Meta Platforms Ireland Limited), to measure which ads generate requests. Without consent, Google tools run in consent-denied mode, without storing analytics or advertising cookies. You can change or withdraw consent at any time through the "Cookies" link in the site footer.'
        },
        {
          h: lang === 'pt' ? '5. Seus Direitos' : '5. Your Rights',
          p: lang === 'pt'
            ? 'Tem o direito de aceder, retificar, limitar o tratamento ou solicitar a eliminação total (Direito ao Esquecimento) dos seus dados a qualquer momento, escrevendo para pitmasters@lisbonbbq.pt. Tem ainda o direito de apresentar reclamação à Comissão Nacional de Proteção de Dados (CNPD).'
            : 'You have the right to access, rectify, limit processing, or request total deletion (Right to be Forgotten) of your data at any time, by writing to pitmasters@lisbonbbq.pt. You also have the right to lodge a complaint with the Portuguese data protection authority (CNPD).'
        }
      ]
    },
    terms: {
      title: lang === 'pt' ? 'Condições Gerais do Serviço' : 'General Terms of Service',
      intro: lang === 'pt'
        ? 'Os serviços Lisbon Barbecue & Churrasco (LisbonBBQ) são prestados pela Disruptive Theory, Lda., NIF 519686551, com sede na Rua José Farinha, n.º 20, 2.º B, Lisboa. Ao utilizar os nossos serviços de reserva, concorda com as seguintes condições comerciais e operacionais que garantem a excelência do seu evento.'
        : 'Lisbon Barbecue & Churrasco (LisbonBBQ) services are provided by Disruptive Theory, Lda., tax number (NIF) 519686551, registered office at Rua José Farinha, n.º 20, 2.º B, Lisbon. By using our booking services, you agree to the following commercial and operational conditions that ensure the excellence of your event.',
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
        },
        {
          h: lang === 'pt' ? '8. Workshops de Churrasco' : '8. Barbecue Workshops',
          p: lang === 'pt'
            ? 'A inscrição na waiting list do workshop é gratuita e não garante lugar nem data. Quando abrirmos datas, quem está na lista tem 48 horas de prioridade; o lugar só fica reservado após o pagamento, no prazo indicado nesse aviso. Os preços são por pessoa, com IVA incluído. O preço de convite aplica-se a quem se inscreve com o link de convite de outra pessoa inscrita, e também a quem convidou; se a pessoa convidada não vier, quem convidou mantém esse preço. Se não puder comparecer, o lugar é transferível para outra pessoa ou para outra data, sujeito a disponibilidade. O workshop inclui bebidas alcoólicas, servidas apenas a maiores de 18 anos.'
            : 'Joining the workshop waiting list is free and does not guarantee a place or date. When we open dates, people on the list get 48 hours of priority; a place is only reserved after payment within the deadline given in that notice. Prices are per person, VAT included. The invite price applies to anyone who signs up with another registered person\'s invite link, and also to the person who invited them; if the invited person does not attend, the inviter keeps that price. If you cannot attend, your place can be transferred to another person or to another date, subject to availability. The workshop includes alcoholic drinks, served only to people aged 18 or over.'
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
                Última Atualização: 2026-10-22
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
