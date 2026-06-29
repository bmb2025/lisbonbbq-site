
import React, { useState } from 'react';
import { Article } from '../types';
import { Calendar, User, ArrowLeft, Share2, Check } from 'lucide-react';

export const BlogCard: React.FC<{ article: Article; onClick: (slug: string) => void }> = ({ article, onClick }) => {
  return (
    <div 
      onClick={() => onClick(article.slug)}
      className="group cursor-pointer bg-white border-4 border-bbq-black shadow-hard hover:translate-y-[-4px] transition-all overflow-hidden"
    >
      <div className="aspect-video border-b-4 border-bbq-black overflow-hidden bg-gray-100">
        <img src={article.coverImage} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={article.title} />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-bbq-yellow text-bbq-black px-2 py-0.5 font-black uppercase text-[10px] border-2 border-bbq-black">
            {article.category}
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(article.publishedAt).toLocaleDateString()}</span>
        </div>
        <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 leading-tight group-hover:text-bbq-red transition-colors">
          {article.title}
        </h3>
        <p className="text-sm font-bold text-gray-500 uppercase leading-relaxed line-clamp-2">
          {article.excerpt}
        </p>
      </div>
    </div>
  );
};

export const BlogList: React.FC<{ articles: Article[]; onArticleClick: (slug: string) => void }> = ({ articles, onArticleClick }) => {
  return (
    <section className="py-24 px-4 bg-bbq-cream">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-4">
            O Jornal <br/><span className="text-bbq-red">Do Fogo</span>
          </h1>
          <p className="text-xl font-bold uppercase text-gray-400 tracking-widest">Dicas, Histórias e a Cultura do Churrasco em Lisboa.</p>
        </div>
        
        {articles.length === 0 ? (
          <div className="py-32 text-center border-4 border-dashed border-bbq-black/10">
            <p className="font-black uppercase text-gray-400">Em breve, novos segredos do mestre...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.filter(a => a.isPublished).map(article => (
              <BlogCard key={article.id} article={article} onClick={onArticleClick} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export const ArticleDetail: React.FC<{ article: Article; onBack: () => void; lang: 'pt' | 'en' }> = ({ article, onBack, lang }) => {
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    document.title = `${article.title} | Lisbon Barbecue & Churrasco`;
  }, [article.title]);

  const handleShare = async () => {
    const shareData = {
      title: article.title,
      text: article.excerpt,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return <div key={i} className="h-4" />;

      if (trimmedLine.startsWith('### ')) {
        return (
          <h3
            key={i}
            className="text-2xl md:text-3xl font-black uppercase tracking-tight text-bbq-black mt-8 mb-4 border-l-8 border-bbq-yellow pl-4"
          >
            {trimmedLine.replace('### ', '')}
          </h3>
        );
      }

      if (trimmedLine.startsWith('## ')) {
        return (
          <h2
            key={i}
            className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-bbq-black mt-12 mb-6 leading-none"
          >
            {trimmedLine.replace('## ', '')}
          </h2>
        );
      }

      if (trimmedLine.startsWith('# ')) {
        // Body H1 markdown is demoted to h2 — the article title is the only <h1>.
        return (
          <h2
            key={i}
            className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-bbq-red mt-16 mb-8 leading-none italic"
          >
            {trimmedLine.replace('# ', '')}
          </h2>
        );
      }

      return (
        <p
          key={i}
          className="text-lg md:text-xl font-bold uppercase tracking-tight text-gray-600 leading-relaxed mb-6"
        >
          {trimmedLine}
        </p>
      );
    });
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-black uppercase text-sm mb-12 hover:text-bbq-red transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> {lang === 'pt' ? 'Voltar ao Blog' : 'Back to Blog'}
        </button>

        <header className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <span className="bg-bbq-yellow text-bbq-black px-4 py-1 font-black uppercase text-xs border-2 border-bbq-black shadow-hard-sm">
              {article.category}
            </span>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <Calendar size={14} /> {new Date(article.publishedAt).toLocaleDateString()}
              <span className="mx-2">•</span>
              <User size={14} /> {article.author}
            </div>
          </div>

          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-10 text-bbq-black drop-shadow-sm">
            {article.title}
          </h1>

          <div className="aspect-[21/9] border-4 border-bbq-black shadow-hard overflow-hidden mb-12 bg-bbq-cream">
            <img
              src={article.coverImage}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              alt={article.title}
            />
          </div>
        </header>

        <div className="article-body border-t-4 border-bbq-black pt-12">{renderContent(article.content)}</div>

        <footer className="mt-24 pt-12 border-t-4 border-bbq-black flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-bbq-red rounded-full flex items-center justify-center border-2 border-bbq-black">
              <User className="text-white" size={24} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase text-gray-400">Autor</div>
              <div className="font-black uppercase text-lg">{article.author}</div>
            </div>
          </div>
          <button 
            onClick={handleShare}
            className="bg-bbq-black text-white px-8 py-4 border-2 border-bbq-black shadow-hard-sm hover:bg-bbq-red transition-all font-black uppercase flex items-center gap-2 active:translate-y-1 active:shadow-none"
          >
            {copied ? (lang === 'pt' ? 'Link Copiado' : 'Link Copied') : (lang === 'pt' ? 'Partilhar o Fogo' : 'Share the Fire')} 
            {copied ? <Check size={20} /> : <Share2 size={20} />}
          </button>
        </footer>
      </div>
    </div>
  );
};
