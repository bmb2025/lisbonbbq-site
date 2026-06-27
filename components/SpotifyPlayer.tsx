import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Music, X, ChevronUp, ChevronDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface SpotifyPlayerProps {
  showQuote?: boolean;
}

export const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ showQuote }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolledPast, setIsScrolledPast] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const target = document.getElementById('como-funciona');
      if (target) {
        const rect = target.getBoundingClientRect();
        // Hide when the top of 'Como funciona' is near the top of the viewport
        setIsScrolledPast(rect.top < 150);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide if not on homepage, if scrolled past, or if quote popup is showing
  const shouldHide = !isHomePage || isScrolledPast || showQuote;

  return (
    <div 
      className={`fixed bottom-6 right-6 z-[9999] flex flex-col items-end transition-all duration-500 ${
        shouldHide ? 'opacity-0 pointer-events-none translate-y-10' : 'opacity-100'
      }`}
    >
      <motion.div
        initial={false}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          y: isOpen ? 0 : 40, 
          scale: isOpen ? 1 : 0.9,
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="mb-4 w-[300px] sm:w-[352px] bg-white border-4 border-bbq-black shadow-hard overflow-hidden rounded-xl origin-bottom-right"
      >
        <div className="bg-bbq-black text-white px-4 py-2 flex justify-between items-center">
          <span className="font-black uppercase text-xs tracking-widest flex items-center gap-2">
            <Music size={14} className="text-bbq-yellow" />
            LisbonBBQ Grooves
          </span>
          <button 
            onClick={() => setIsOpen(false)}
            className="hover:text-bbq-red transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="bg-bbq-black">
          <iframe 
            data-testid="embed-iframe" 
            style={{ borderRadius: '0px' }} 
            src="https://open.spotify.com/embed/playlist/20NirTGC12jDIXUnX6k34W?utm_source=generator" 
            width="100%" 
            height="352" 
            frameBorder="0" 
            allowFullScreen={true} 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
          ></iframe>
        </div>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-3 px-6 py-3 rounded-full font-black uppercase tracking-widest text-sm
          border-4 border-bbq-black shadow-hard transition-colors
          ${isOpen ? 'bg-bbq-red text-white' : 'bg-bbq-yellow text-bbq-black'}
        `}
      >
        <Music className={isOpen ? 'animate-pulse' : ''} size={20} />
        {isOpen ? 'Minimizar' : 'LisbonBBQ Grooves'}
        {isOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
      </motion.button>
    </div>
  );
};
