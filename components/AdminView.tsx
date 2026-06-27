
import React, { useRef, useState } from 'react';
import { ArrowLeft, Image as ImageIcon, Upload, RotateCcw, Loader2, Trash2, RefreshCw, CheckCircle, Cloud, AlertCircle } from 'lucide-react';
import { LOCATIONS, ADD_ONS } from '../constants';
import { cloudService } from '../services/cloudService';

interface AdminViewProps {
  assets: Record<string, string>;
  setAssets: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  leads: any[];
  setLeads: React.Dispatch<React.SetStateAction<any[]>>;
  onBack: () => void;
  onReset: () => void;
  isCloudSyncing?: boolean;
}

export const AdminView: React.FC<AdminViewProps> = ({ assets, setAssets, leads, setLeads, onBack, onReset, isCloudSyncing }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeKeyRef = useRef<string | null>(null);
  const [activeTab, setActiveTab] = useState<'assets' | 'leads'>('leads');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Deteta se o URL configurado é real
  const isMock = !window.location.hostname.includes('cloudfunctions.net'); 

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = activeKeyRef.current;
    const file = e.target.files?.[0];
    
    if (file && key) {
      setIsProcessing(key);
      
      try {
        const cloudUrl = await cloudService.uploadImage(key, file);
        if (cloudUrl) {
          setAssets(prev => ({ ...prev, [key]: cloudUrl }));
        } else {
          alert("Falha no upload. Verifique as configurações de rede.");
        }
      } catch (err) {
        console.error(err);
        alert("Ocorreu um erro inesperado no upload.");
      } finally {
        setIsProcessing(null);
        e.target.value = "";
      }
    }
  };

  const deleteLead = (id: string) => {
    if (window.confirm('Eliminar pedido de lead permanentemente?')) {
      setLeads(prev => prev.filter(l => l.id !== id));
    }
  };

  const triggerUpload = (key: string) => {
    activeKeyRef.current = key;
    fileInputRef.current?.click();
  };

  const isCloudAsset = (url: string) => 
    url.includes('google') || url.includes('storage') || url.startsWith('data:image');

  const renderUploadOverlay = (key: string) => {
    const loading = isProcessing === key;
    return (
      <div 
        className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center transition-opacity cursor-pointer z-10 ${loading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} 
        onClick={(e) => { e.stopPropagation(); if (!loading) triggerUpload(key); }}
      >
        {loading ? (
          <>
            <Loader2 className="text-bbq-yellow animate-spin mb-2" size={32} />
            <span className="text-[10px] font-black uppercase text-white animate-pulse">Syncing...</span>
          </>
        ) : (
          <>
            <Upload className="text-white mb-2" size={32} />
            <span className="text-[10px] font-black uppercase text-white">Upload to Cloud</span>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="bg-bbq-black min-h-screen font-sans text-bbq-cream">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} />

      <div className="bg-bbq-red border-b-4 border-bbq-black p-4 flex items-center justify-between sticky top-0 z-[60]">
         <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 bg-bbq-black text-white border-2 border-bbq-black shadow-hard-sm">
               <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-black uppercase tracking-tighter italic">Concierge Admin</h1>
            {isCloudSyncing ? (
              <div className="flex items-center gap-2 bg-black/30 px-3 py-1 text-[10px] font-black uppercase animate-pulse">
                <RefreshCw size={12} className="animate-spin"/> Sincronizando...
              </div>
            ) : (
              <div className={`flex items-center gap-2 px-3 py-1 text-[10px] font-black uppercase border ${isMock ? 'bg-bbq-yellow/20 text-bbq-yellow border-bbq-yellow/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
                {isMock ? <AlertCircle size={12}/> : <Cloud size={12}/>}
                {isMock ? 'Simulated Cloud (Dev Mode)' : 'Google Cloud Active'}
              </div>
            )}
         </div>
         <button onClick={onReset} className="bg-white text-bbq-black p-2 border-2 border-bbq-black shadow-hard-sm hover:bg-bbq-yellow transition-all">
            <RotateCcw size={18} />
         </button>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex border-b-4 border-bbq-cream/10 mb-10 overflow-x-auto">
           <button onClick={() => setActiveTab('leads')} className={`px-10 py-4 font-black uppercase text-sm border-b-4 whitespace-nowrap ${activeTab === 'leads' ? 'border-bbq-yellow text-bbq-yellow' : 'border-transparent text-gray-500'}`}>Gestão de Leads</button>
           <button onClick={() => setActiveTab('assets')} className={`px-10 py-4 font-black uppercase text-sm border-b-4 whitespace-nowrap ${activeTab === 'assets' ? 'border-bbq-yellow text-bbq-yellow' : 'border-transparent text-gray-500'}`}>Media & Cloud Storage</button>
        </div>

        {activeTab === 'leads' ? (
          <div className="grid gap-4">
            {leads.length === 0 ? (
              <div className="text-center py-32 bg-white/5 border-4 border-dashed border-white/10">
                <p className="font-black uppercase text-gray-600 tracking-widest">Aguardando novos pedidos...</p>
              </div>
            ) : (
              leads.map(lead => (
                <div key={lead.id} className="bg-white text-bbq-black p-6 border-4 border-bbq-black shadow-hard flex flex-col md:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       <h3 className="font-black uppercase text-xl leading-none">{lead.client.name}</h3>
                       <span className="bg-bbq-yellow px-2 py-0.5 text-[9px] font-black uppercase border-2 border-bbq-black">{lead.id}</span>
                    </div>
                    <p className="text-xs font-bold text-gray-500 mb-4">{lead.client.email} • {lead.client.phone}</p>
                    <div className="flex flex-wrap gap-2">
                       <div className="text-[10px] font-black uppercase bg-bbq-cream border-2 border-bbq-black/10 px-3 py-1">
                         {lead.summary.menu}
                       </div>
                       <div className="text-[10px] font-black uppercase bg-bbq-cream border-2 border-bbq-black/10 px-3 py-1">
                         {lead.summary.location}
                       </div>
                       <div className="text-[10px] font-black uppercase bg-bbq-red text-white px-3 py-1">
                         {lead.summary.totalGuests} Pax
                       </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none bg-bbq-black text-white px-6 py-3 font-black uppercase text-xs shadow-hard-sm">Ver Proposta</button>
                    <button onClick={() => deleteLead(lead.id)} className="p-3 border-2 border-red-600 text-red-600 hover:bg-red-50"><Trash2 size={20}/></button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
            {Object.keys(assets).map(key => (
              <div key={key} className="bg-white text-bbq-black p-4 border-4 border-bbq-black shadow-hard group">
                <div className="aspect-video relative mb-4 bg-bbq-black border-2 border-bbq-black overflow-hidden group">
                   <img src={assets[key]} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" alt={key} />
                   {renderUploadOverlay(key)}
                   {isCloudAsset(assets[key]) && (
                     <div className="absolute top-2 left-2 bg-green-500 text-white p-1 rounded-full shadow-lg z-20" title="Hosted on Cloud Storage">
                       <CheckCircle size={12} strokeWidth={4}/>
                     </div>
                   )}
                </div>
                <div className="flex items-center justify-between">
                  <h4 className="font-black uppercase text-[10px] truncate max-w-[150px]">{key}</h4>
                  <span className={`text-[8px] font-black uppercase ${isCloudAsset(assets[key]) ? 'text-green-600' : 'text-orange-500'}`}>
                    {isCloudAsset(assets[key]) ? 'Remote Cloud' : 'Local Default'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
