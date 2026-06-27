import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { Plus, Trash2, Edit3, Sparkles, Save, X, Loader2, ExternalLink, Mail, Phone, Briefcase, Users, Calendar, BookOpen, Database, RefreshCw, MessageSquare } from 'lucide-react';
import { generateArticleDraft } from '../services/anthropicService';
import { cloudService } from '../services/cloudService';

interface CMSProps {
  articles: Article[];
  onSave: (article: Article) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export const BlogAdmin: React.FC<CMSProps> = ({ articles, onSave, onDelete, onBack }) => {
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [activeTab, setActiveTab] = useState<'blog' | 'leads'>('blog');
  const [leads, setLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState<boolean>(false);

  // Load corporate leads whenever we switch to leads tab or on mount
  const loadLeads = async () => {
    setLoadingLeads(true);
    try {
      const fetched = await cloudService.fetchCorporateLeads();
      setLeads(fetched);
    } catch (e) {
      console.error("Error loading corporate leads in UI:", e);
    } finally {
      setLoadingLeads(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'leads') {
      loadLeads();
    }
  }, [activeTab]);

  const handleDeleteLead = async (id: string) => {
    if (window.confirm("Remover esta lead permanentemente da base de dados Leads-Corp?")) {
      const success = await cloudService.deleteCorporateLead(id);
      if (success) {
        setLeads(prev => prev.filter(l => l.id !== id));
      } else {
        alert("Erro ao remover a lead.");
      }
    }
  };

  const createNew = () => {
    setEditingArticle({
      id: `art-${Date.now()}`,
      slug: '',
      title: '',
      excerpt: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200',
      category: 'Dicas',
      author: 'Mestre Churrasqueiro',
      publishedAt: new Date().toISOString(),
      isPublished: false
    });
  };

  if (editingArticle) {
    return <ArticleEditor article={editingArticle} onSave={(a) => { onSave(a); setEditingArticle(null); }} onCancel={() => setEditingArticle(null)} />;
  }

  return (
    <div className="bg-bbq-black min-h-screen p-8 text-bbq-cream">
      <div className="max-w-6xl mx-auto">
        {/* Main Administrative Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b-4 border-bbq-yellow/20 pb-8">
          <div>
            <h1 className="text-5xl font-black uppercase tracking-tighter italic text-bbq-yellow">Consola Mestre</h1>
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mt-1">Gestão de Conteúdo & Leads do Churrasco</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button onClick={onBack} className="flex-1 md:flex-initial bg-white/10 text-white px-6 py-3 font-black uppercase border-2 border-white/20 hover:bg-white/20 transition-all text-center">
              Sair da Consola
            </button>
          </div>
        </div>

        {/* Console Navigation Tabs */}
        <div className="flex border-b-4 border-bbq-black mb-8">
          <button 
            onClick={() => setActiveTab('blog')}
            className={`flex-1 md:flex-initial px-8 py-5 font-black uppercase text-sm tracking-wider flex items-center justify-center gap-3 border-t-4 border-x-4 transition-all duration-150 ${activeTab === 'blog' ? 'bg-bbq-yellow text-bbq-black border-bbq-black font-black translate-y-[4px]' : 'bg-transparent text-gray-400 border-transparent hover:text-white'}`}
          >
            <BookOpen size={18} /> Redação do Fogo ({articles.length})
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`flex-1 md:flex-initial px-8 py-5 font-black uppercase text-sm tracking-wider flex items-center justify-center gap-3 border-t-4 border-x-4 transition-all duration-150 ${activeTab === 'leads' ? 'bg-bbq-yellow text-bbq-black border-bbq-black font-black translate-y-[4px]' : 'bg-transparent text-gray-400 border-transparent hover:text-white'}`}
          >
            <Database size={18} /> Leads-Corp BD ({leads.length})
          </button>
        </div>

        {/* Tab 1: Blog Articles Manager */}
        {activeTab === 'blog' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/5 p-4 border-2 border-white/10">
              <span className="font-bold uppercase tracking-wider text-xs text-gray-400">Artigos de Blog Ativos</span>
              <button onClick={createNew} className="bg-bbq-yellow text-bbq-black px-5 py-2 font-black uppercase flex items-center gap-2 text-xs shadow-hard-sm hover:bg-bbq-red hover:text-white transition-all">
                <Plus size={16} /> Novo Artigo
              </button>
            </div>

            <div className="grid gap-4">
              {articles.length === 0 ? (
                <div className="border-4 border-dashed border-white/20 p-12 text-center text-gray-500 font-bold uppercase tracking-widest">
                  Nenhum artigo registado. Clica em "Novo Artigo" para começar.
                </div>
              ) : (
                articles.map(article => (
                  <div key={article.id} className="bg-white text-bbq-black p-6 border-4 border-bbq-black shadow-hard flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-black uppercase text-xl">{article.title || 'Sem Título'}</h3>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 border-2 border-bbq-black ${article.isPublished ? 'bg-green-500 text-white' : 'bg-bbq-yellow'}`}>
                          {article.isPublished ? 'Publicado' : 'Rascunho'}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{article.category} • {new Date(article.publishedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingArticle(article)} className="p-3 bg-bbq-black text-white hover:bg-bbq-red hover:text-yellow transition-all border-2 border-bbq-black shadow-hard-sm">
                        <Edit3 size={20} />
                      </button>
                      <button onClick={() => onDelete(article.id)} className="p-3 border-2 border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Leads-Corp Database Viewer */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white/5 p-4 border-2 border-white/10">
              <span className="font-bold uppercase tracking-wider text-xs text-gray-400">Pedidos Corporativos Registados em /corporate</span>
              <button 
                onClick={loadLeads} 
                disabled={loadingLeads} 
                className="bg-white text-bbq-black px-4 py-2 font-black uppercase text-xs flex items-center gap-2 hover:bg-bbq-yellow transition-all disabled:opacity-50"
              >
                <RefreshCw size={14} className={loadingLeads ? 'animate-spin' : ''} /> {loadingLeads ? 'A Atualizar...' : 'Atualizar'}
              </button>
            </div>

            {loadingLeads ? (
              <div className="text-center py-20">
                <Loader2 size={48} className="animate-spin text-bbq-yellow mx-auto mb-4" />
                <span className="font-bold uppercase tracking-widest text-gray-400 text-sm">A aceder à Base de Dados Leads-Corp...</span>
              </div>
            ) : leads.length === 0 ? (
              <div className="border-4 border-dashed border-white/20 p-20 text-center text-gray-500 font-bold uppercase tracking-widest">
                Nenhum pedido corporativo gravado na Base de Dados ainda.<br/>
                <span className="text-xs font-bold text-gray-600 mt-2 block">Os formulários preenchidos em /corporate serão listados aqui.</span>
              </div>
            ) : (
              <div className="grid gap-6">
                {leads.map((lead, i) => {
                  const client = lead.client || { name: lead.name, email: lead.email, phone: lead.phone };
                  const corporate = lead.corporate || { company: lead.company, guests: lead.guests, message: lead.message };
                  
                  return (
                    <div key={lead.id || i} className="bg-white text-bbq-black p-6 border-4 border-bbq-black shadow-hard flex flex-col md:flex-row justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        {/* Title Row with Metadata info */}
                        <div className="flex flex-wrap items-center gap-2 border-b-2 border-gray-100 pb-3">
                          <span className="bg-bbq-black text-bbq-yellow font-mono text-xs font-black px-3 py-1 border-2 border-bbq-black">
                            {lead.id || 'LB-LEAD'}
                          </span>
                          <span className="text-xs font-black uppercase bg-gray-100 text-gray-600 border border-gray-400 px-2 py-0.5 rounded">
                            {lead.source || 'corporate'}
                          </span>
                          <span className="text-xs font-bold text-gray-400 ml-auto flex items-center gap-2">
                            <Calendar size={12} /> {lead.timestamp ? new Date(lead.timestamp).toLocaleString('pt-PT') : 'Data Indisponível'}
                          </span>
                        </div>

                        {/* Detailed Columns Grid */}
                        <div className="grid md:grid-cols-3 gap-4">
                          {/* Client Contacts */}
                          <div className="border-r border-gray-200 pr-4 last:border-0">
                            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5"><Users size={12}/> Contacto do Cliente</h4>
                            <p className="font-extrabold uppercase text-sm mb-1">{client.name || 'Sem nome informado'}</p>
                            <p className="text-xs font-bold text-gray-600 mb-1 flex items-center gap-1.5">
                              <Mail size={12}/> <a href={`mailto:${client.email}`} className="hover:underline">{client.email || 'N/A'}</a>
                            </p>
                            <p className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                              <Phone size={12}/> <a href={`tel:${client.phone}`} className="hover:underline">{client.phone || 'N/A'}</a>
                            </p>
                          </div>

                          {/* Event Meta Details */}
                          <div className="border-r border-gray-200 pr-4 last:border-0">
                            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5"><Briefcase size={12}/> Informações da Empresa</h4>
                            <p className="text-sm font-extrabold uppercase mb-1">
                              Empresa: <span className="text-bbq-red">{corporate.company || 'Não informada'}</span>
                            </p>
                            <p className="text-xs font-bold text-gray-600 bg-bbq-yellow/20 border border-bbq-yellow inline-block px-2 py-0.5 uppercase tracking-wider">
                              Convidados: {corporate.guests || lead.guests || 'Não especificado'}
                            </p>
                          </div>

                          {/* Message / Remarks */}
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-1.5"><MessageSquare size={12}/> Mensagem / Observações</h4>
                            <p className="text-xs font-bold text-gray-700 italic border-l-2 border-bbq-yellow pl-2 line-clamp-4 overflow-y-auto max-h-24 py-0.5">
                              {corporate.message || lead.message || 'Sem mensagem adicional'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="md:self-start flex md:flex-col justify-end gap-2 shrink-0">
                        <button 
                          onClick={() => handleDeleteLead(lead.id)} 
                          className="flex items-center gap-2 justify-center px-4 py-3 bg-red-100 hover:bg-red-200 text-red-600 font-bold uppercase text-xs border-2 border-red-400 shadow-hard-sm transition-all"
                          title="Excluir Lead da BD"
                        >
                          <Trash2 size={16} /> Remover
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ArticleEditor: React.FC<{ article: Article; onSave: (a: Article) => void; onCancel: () => void }> = ({ article, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Article>(article);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAISuggest = async () => {
    if (!formData.title) return alert("Insere um título primeiro!");
    setIsGenerating(true);
    const draft = await generateArticleDraft(formData.title, formData.category);
    setFormData(prev => ({ ...prev, content: draft }));
    setIsGenerating(false);
  };

  return (
    <div className="bg-bbq-cream min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white border-4 border-bbq-black p-10 shadow-hard">
        <div className="flex justify-between items-center mb-10 border-b-4 border-bbq-black pb-6">
          <h2 className="text-3xl font-black uppercase tracking-tighter">Editor de Artigo</h2>
          <button onClick={onCancel} className="p-2 hover:bg-gray-100"><X size={32}/></button>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black uppercase mb-2">Título do Artigo</label>
              <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} className="w-full border-4 border-bbq-black p-4 font-black text-lg focus:ring-4 focus:ring-bbq-yellow outline-none" placeholder="Ex: 5 Dicas para a Picanha Perfeita"/>
            </div>
            <div>
              <label className="block text-xs font-black uppercase mb-2">Categoria</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border-4 border-bbq-black p-4 font-black text-lg focus:ring-4 focus:ring-bbq-yellow outline-none">
                <option>Dicas</option>
                <option>Receitas</option>
                <option>Lisboa</option>
                <option>Eventos</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase mb-2">Resumo (Excerpt)</label>
            <textarea value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full border-4 border-bbq-black p-4 font-bold text-sm h-24 focus:ring-4 focus:ring-bbq-yellow outline-none" placeholder="Breve descrição para a listagem..."/>
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-xs font-black uppercase">Conteúdo Principal</label>
              <button onClick={handleAISuggest} disabled={isGenerating} className="bg-bbq-black text-bbq-yellow px-4 py-2 font-black uppercase text-[10px] flex items-center gap-2 hover:bg-bbq-red hover:text-white transition-all">
                {isGenerating ? <Loader2 className="animate-spin" size={14}/> : <Sparkles size={14}/>}
                IA: Gerar Rascunho
              </button>
            </div>
            <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full border-4 border-bbq-black p-6 font-bold text-lg h-96 focus:ring-4 focus:ring-bbq-yellow outline-none" placeholder="Escreve aqui a tua história..."/>
          </div>

          <div className="flex items-center gap-4 py-6 border-t-2 border-bbq-black/5">
             <input type="checkbox" checked={formData.isPublished} onChange={e => setFormData({...formData, isPublished: e.target.checked})} className="w-6 h-6 border-4 border-bbq-black text-bbq-red focus:ring-0"/>
             <span className="font-black uppercase text-sm">Publicar Artigo</span>
          </div>

          <button onClick={() => onSave(formData)} className="w-full bg-bbq-red text-white py-6 font-black uppercase text-2xl shadow-hard flex items-center justify-center gap-3 hover:translate-y-[-2px] transition-all">
            <Save size={24}/> Guardar Artigo
          </button>
        </div>
      </div>
    </div>
  );
};