
import React, { useState, useMemo } from 'react';
import { Search, Download, Zap, Check, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MembershipType } from './types';

export default function Library({ user, voices, downloadedVoiceIds, setDownloadedVoiceIds, setActiveVoiceId, activeVoiceId }: any) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);

  const filteredVoices = useMemo(() => {
    return voices.filter((v: any) => {
      const matchesFilter = filter === 'All' || v.category === filter;
      const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, search, voices]);

  const handleDownload = (id: string) => {
    setDownloading(id);
    setTimeout(() => {
      setDownloadedVoiceIds((prev: any) => new Set([...Array.from(prev), id]));
      setDownloading(null);
    }, 1500);
  };

  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-24">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tight">Neural Vault</h1>
          <p className="text-slate-400">Deploy high-fidelity AI models to your local engine ({filteredVoices.length} available).</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Filter identities..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm text-white focus:border-indigo-500 transition-all w-full sm:w-64" />
          </div>
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
            {['All', 'Free', 'Premium', 'Ultra'].map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${filter === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}>{cat}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {filteredVoices.map((voice: any) => {
          const isDownloaded = downloadedVoiceIds.has(voice.id);
          const isActive = activeVoiceId === voice.id;
          const isLocked = voice.category !== 'Free' && user?.membership === MembershipType.FREE;

          return (
            <div key={voice.id} className={`glass-card p-6 rounded-[2.5rem] border-white/5 hover:border-indigo-500/30 transition-all flex flex-col group relative overflow-hidden h-[340px] ${isActive ? 'ring-2 ring-indigo-500 bg-indigo-500/5' : ''}`}>
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-500">{voice.avatar}</div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-white truncate italic uppercase tracking-tight">{voice.name}</h3>
                  <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${voice.category === 'Free' ? 'bg-green-500/10 text-green-400' : voice.category === 'Premium' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-yellow-500/10 text-yellow-500'}`}>{voice.category}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{voice.description}</p>
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{voice.size}</p>
              </div>
              <div className="mt-6">
                {downloading === voice.id ? (
                  <div className="h-12 flex items-center justify-center bg-white/5 rounded-2xl border border-white/5">
                    <div className="w-6 h-1 bg-indigo-500/20 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 animate-progress"></div>
                    </div>
                  </div>
                ) : !isDownloaded ? (
                  <button onClick={() => handleDownload(voice.id)} className="w-full py-4 bg-white/5 text-slate-300 text-xs font-black rounded-2xl border border-white/5 uppercase hover:bg-white/10 transition-all active:scale-95"><Download size={14} className="inline mr-2" /> Download</button>
                ) : (
                  <button disabled={isLocked} onClick={() => setActiveVoiceId(voice.id)} className={`w-full py-4 text-xs font-black rounded-2xl uppercase transition-all flex items-center justify-center space-x-2 active:scale-95 ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40' : isLocked ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-900 hover:bg-slate-200'}`}>
                    {isLocked ? <Lock size={14} /> : isActive ? <Check size={14} /> : <Zap size={14} />}
                    <span>{isLocked ? 'Premium Locked' : isActive ? 'Active Identity' : 'Inject Engine'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredVoices.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-slate-600">
            <Search size={32} />
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-widest">No identities found in this frequency.</p>
        </div>
      )}
    </div>
  );
}
