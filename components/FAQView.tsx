
import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQViewProps {
  lang: 'pt' | 'en';
  onBack: () => void;
}

export const FAQView: React.FC<FAQViewProps> = ({ lang, onBack }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: {
        pt: "1. O que é o LisbonBBQ?",
        en: "1. What is LisbonBBQ?"
      },
      a: {
        pt: "O LisbonBBQ é um serviço de organização de churrascos em espaços privados e pré-definidos por nós, em Lisboa e arredores. Preparamos tudo para que só tenhas de chegar e começar a grelhar. Não somos um catering tradicional. Criamos a experiência de churrasco “backyard” sem esforço.",
        en: "LisbonBBQ is a BBQ organization service in private spaces pre-defined by us in Lisbon and surroundings. We prepare everything so you only have to show up and start grilling. We are not a traditional catering service. We create an effortless 'backyard' BBQ experience."
      }
    },
    {
      q: {
        pt: "2. Onde acontecem os eventos?",
        en: "2. Where do events happen?"
      },
      a: {
        pt: "Os eventos acontecem exclusivamente em espaços selecionados e assegurados pelo LisbonBBQ. São quintais, terraços ou casas privadas/parceiras previamente definidos por nós, mediante disponibilidade. Não realizamos eventos em casa do cliente.",
        en: "Events happen exclusively in selected spots secured by LisbonBBQ. These are backyards, terraces, or private/partner houses previously defined by us, subject to availability. We do not hold events at the client's home."
      }
    },
    {
      q: {
        pt: "3. Posso escolher qualquer local?",
        en: "3. Can I choose any location?"
      },
      a: {
        pt: "Não. Trabalhamos apenas com locais parceiros previamente validados por nós. A escolha do espaço é feita com base no número de convidados, data e disponibilidade.",
        en: "No. We only work with partner locations previously validated by us. The choice of venue is based on the number of guests, date, and availability."
      }
    },
    {
      q: {
        pt: "4. Quantas pessoas podem participar?",
        en: "4. How many people can participate?"
      },
      a: {
        pt: "Organizamos eventos para grupos entre 20 e 80 pessoas. Para grupos fora deste intervalo, a viabilidade é analisada caso a caso.",
        en: "We organize events for groups between 20 and 80 people. For groups outside this range, feasibility is analyzed on a case-by-case basis."
      }
    },
    {
      q: {
        pt: "5. O que está incluído no serviço base?",
        en: "5. What is included in the base service?"
      },
      a: {
        pt: "O serviço inclui: Espaço do evento, grelhador a carvão, carvão, utensílios de churrasco, mesa posta, descartáveis, bebidas no frio e comida preparada para grelhar. Tudo fica pronto antes da chegada dos convidados.",
        en: "The service includes: Event space, charcoal grill, charcoal, BBQ tools, table setting, disposables, cold drinks, and food ready to grill. Everything is ready before the guests arrive."
      }
    },
    {
      q: {
        pt: "6. O que tenho de fazer no dia do evento?",
        en: "6. What do I have to do on the event day?"
      },
      a: {
        pt: "Chegar e começar o churrasco. A grelha está preparada, as bebidas estão frias, a mesa está posta. Se quiseres, podes simplesmente assumir a grelha e viver a experiência.",
        en: "Show up and start the BBQ. The grill is ready, the drinks are cold, the table is set. If you want, you can simply take over the grill and live the experience."
      }
    },
    {
      q: {
        pt: "7. Tenho de grelhar?",
        en: "7. Do I have to grill?"
      },
      a: {
        pt: "Só se quiseres. Podes grelhar tu próprio ou contratar um pitmaster como extra.",
        en: "Only if you want. You can grill yourself or hire a pitmaster as an extra."
      }
    },
    {
      q: {
        pt: "8. Posso levar a minha própria comida ou bebidas?",
        en: "8. Can I bring my own food or drinks?"
      },
      a: {
        pt: "Não. O conceito do LisbonBBQ inclui o fornecimento completo da experiência gastronómica. Não é permitido trazer comida ou bebidas externas.",
        en: "No. The LisbonBBQ concept includes full supply of the gastronomic experience. External food or drinks are not allowed."
      }
    },
    {
      q: {
        pt: "9. O que acontece se chover?",
        en: "9. What happens if it rains?"
      },
      a: {
        pt: "Alguns espaços têm zonas cobertas. Se as condições meteorológicas forem incompatíveis com a realização do evento, tentamos reagendar ou avaliamos alternativas disponíveis. Cada caso é analisado individualmente.",
        en: "Some spaces have covered areas. If weather conditions are incompatible with the event, we try to reschedule or evaluate available alternatives. Each case is analyzed individually."
      }
    },
    {
      q: {
        pt: "10. Qual é a duração do evento?",
        en: "10. What is the duration of the event?"
      },
      a: {
        pt: "A duração é definida no momento da reserva, de acordo com o horário disponível do espaço. Extensões estão sujeitas a disponibilidade e custos adicionais.",
        en: "Duration is defined at the time of booking, according to the space's available time. Extensions are subject to availability and additional costs."
      }
    },
    {
      q: {
        pt: "11. O preço é por pessoa?",
        en: "11. Is the price per person?"
      },
      a: {
        pt: "Sim. O valor é calculado por pessoa, com base no dia da semana, número de convidados e extras escolhidos.",
        en: "Yes. The price is calculated per person based on the day of the week, number of guests, and selected extras."
      }
    },
    {
      q: {
        pt: "12. O staff está incluído?",
        en: "12. Is staff included?"
      },
      a: {
        pt: "O serviço base não inclui staff de serviço ou pitmaster. Caso pretendido, pode ser contratado como extra e é cobrado à parte.",
        en: "The base service does not include service staff or a pitmaster. If desired, they can be hired as an extra and charged separately."
      }
    },
    {
      q: {
        pt: "13. Como funciona a reserva?",
        en: "13. How does the booking work?"
      },
      a: {
        pt: "1. Pedido de orçamento através do site; 2. Confirmação de disponibilidade; 3. Envio de proposta; 4. Pagamento de sinal para bloqueio da data. Sem sinal pago, a data não fica reservada.",
        en: "1. Quote request via website; 2. Confirmation of availability; 3. Sending the proposal; 4. Payment of a deposit to block the date. Without a deposit paid, the date is not reserved."
      }
    },
    {
      q: {
        pt: "14. Qual é a política de cancelamento?",
        en: "14. What is the cancellation policy?"
      },
      a: {
        pt: "O sinal não é reembolsável. Cancelamentos com maior antecedência poderão permitir reagendamento mediante disponibilidade. As condições específicas são indicadas na proposta formal.",
        en: "The deposit is non-refundable. Cancellations made further in advance may allow rescheduling subject to availability. Specific conditions are indicated in the formal proposal."
      }
    },
    {
      q: {
        pt: "15. O LisbonBBQ é um Alojamento Local?",
        en: "15. Is LisbonBBQ an 'Alojamento Local'?"
      },
      a: {
        pt: "Não. O LisbonBBQ é um serviço de organização de eventos privados de churrasco em espaços parceiros. Não prestamos serviços de alojamento.",
        en: "No. LisbonBBQ is a private BBQ event organization service in partner spaces. We do not provide accommodation services."
      }
    },
    {
      q: {
        pt: "16. Posso fazer aniversários ou eventos corporativos?",
        en: "16. Can I host birthdays or corporate events?"
      },
      a: {
        pt: "Sim. Organizamos aniversários, eventos de empresa, convívios e celebrações privadas, desde que enquadrados no conceito de churrasco.",
        en: "Yes. We organize birthdays, company events, gatherings, and private celebrations, as long as they fit the BBQ concept."
      }
    },
    {
      q: {
        pt: "17. Há restrições de ruído?",
        en: "17. Are there noise restrictions?"
      },
      a: {
        pt: "Sim. Todos os eventos devem respeitar as regras do espaço, a legislação em vigor e os horários acordados. O incumprimento pode implicar encerramento do evento.",
        en: "Yes. All events must respect the space's rules, current legislation, and agreed times. Non-compliance may lead to the termination of the event."
      }
    },
    {
      q: {
        pt: "18. Existe limpeza incluída?",
        en: "18. Is cleaning included?"
      },
      a: {
        pt: "Sim. A desmontagem e limpeza final do espaço estão incluídas no serviço base, desde que o espaço seja utilizado dentro do normal. Danos ou uso negligente poderão ser cobrados à parte.",
        en: "Yes. Final cleanup and teardown are included in the base service, provided the space is used normally. Damages or negligent use may be charged separately."
      }
    },
    {
      q: {
        pt: "19. O que não é permitido?",
        en: "19. What is not allowed?"
      },
      a: {
        pt: "Trazer comida ou bebidas externas, ultrapassar o número de convidados acordado, alterar o espaço sem autorização e prolongar o evento para além do horário contratado.",
        en: "Bringing external food or drinks, exceeding the agreed number of guests, altering the space without authorization, and extending the event beyond the contracted time."
      }
    },
    {
      q: {
        pt: "20. Porque escolher o LisbonBBQ em vez de um catering tradicional?",
        en: "20. Why choose LisbonBBQ instead of traditional catering?"
      },
      a: {
        pt: "Porque não é um catering. É uma experiência. É o ambiente de churrasco entre amigos, com zero esforço logístico, num espaço privado preparado para isso.",
        en: "Because it's not catering. It's an experience. It's the BBQ atmosphere among friends, with zero logistical effort, in a private space prepared for just that."
      }
    }
  ];

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
            <HelpCircle size={280} />
          </div>

          <div className="relative z-10">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-none">
              FAQ do Mestre
            </h2>
            <div className="h-2 w-32 bg-bbq-red mb-12"></div>
            
            <p className="text-xl font-bold uppercase text-gray-500 mb-16 leading-relaxed max-w-2xl">
              {lang === 'pt' ? 'Todas as respostas para o teu churrasco perfeito.' : 'All the answers for your perfect barbecue.'}
            </p>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border-4 border-bbq-black overflow-hidden bg-bbq-cream shadow-hard-sm">
                  <button 
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full text-left p-6 font-black uppercase text-lg flex justify-between items-center bg-white hover:bg-bbq-yellow transition-colors"
                  >
                    <span>{faq.q[lang]}</span>
                    {openIndex === i ? <ChevronUp size={24}/> : <ChevronDown size={24}/>}
                  </button>
                  {openIndex === i && (
                    <div className="p-8 font-bold text-gray-600 uppercase tracking-tight leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                      {faq.a[lang]}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-24 pt-12 border-t-4 border-bbq-black/5 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                {lang === 'pt' ? 'Alguma dúvida extra? Envia e-mail!' : 'Extra questions? Send an email!'}
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
