
import React, { useState } from 'react';
import { Activity, Clock, Shield, Zap, Radio, Play, Square, Loader2, Monitor, Cpu, Download } from 'lucide-react';
import { MembershipType } from './types';
import { Link } from 'react-router-dom';
import { CURRENT_VERSION } from './constants';

export default function Dashboard({ user, activeVoice, isLivePage }: any) {
  const [engineStatus, setEngineStatus] = useState<'OFF' | 'STARTING' | 'OPTIMIZING' | 'ACTIVE'>('OFF');
  const [logs, setLogs] = useState<string[]>([]);

  const startEngine = () => {
    setEngineStatus('STARTING');
    addLog("Requesting Kernel Access...");
    
    setTimeout(() => {
      setEngineStatus('OPTIMIZING');
      addLog("Initializing Neural Virtual Cable...");
      addLog("Mapping background process to System MIC...");
    }, 1500);

    setTimeout(() => {
      setEngineStatus('ACTIVE');
      addLog("Engine Active. System-wide interception enabled.");
    }, 3500);
  };

  const stopEngine = () => {
    setEngineStatus('OFF');
    setLogs([]);
  };

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 5));
  };

  // Guard for Premium Access on Live Engine
  if (isLivePage && user?.membership === MembershipType.FREE) {
    return (
      <div className="p-10 flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-yellow-500/20 blur-2xl animate-pulse rounded-full"></div>
          <div className="relative w-24 h-24 bg-yellow-500/10 border border-yellow-500/20 rounded-[2.5rem] flex items-center justify-center text-yellow-500 shadow-2xl">
            <Shield size={48} />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Premium Locked</h1>
          <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">Live System-Wide Voice Interception is an Elite feature. Upgrade to weekly, monthly or yearly to unlock.</p>
        </div>
        <Link to="/premium" className="px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-500 transition-all uppercase tracking-widest text-xs shadow-xl shadow-indigo-600/30 active:scale-95">Upgrade Membership</Link>
      </div>
    );
  }

  if (isLivePage) return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tight">Live Neural Engine</h1>
          <p className="text-slate-400 text-sm">Real-time system-wide mic interception for games, calls, and chats.</p>
        </div>
        {engineStatus === 'ACTIVE' && (
          <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">Intercept Active</span>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-10 rounded-[3rem] border-white/5 space-y-8 flex flex-col justify-between relative overflow-hidden min-h-[500px]">
          {engineStatus === 'ACTIVE' && (
            <div className="absolute inset-0 bg-indigo-500/[0.03] animate-pulse pointer-events-none"></div>
          )}
          <div className="relative z-10 flex items-center space-x-6">
            <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center text-5xl transition-all duration-700 ${engineStatus === 'ACTIVE' ? 'bg-indigo-600 rotate-12 shadow-2xl shadow-indigo-600/50' : 'bg-white/5 border border-white/10'}`}>
              {activeVoice?.avatar}
            </div>
            <div>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1 italic">Current Model</p>
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">{activeVoice?.name}</h2>
            </div>
          </div>

          <div className="space-y-6 relative z-10">
            {engineStatus === 'OFF' ? (
              <button onClick={startEngine} className="w-full py-10 bg-white text-slate-950 font-black rounded-[2.5rem] uppercase tracking-[0.4em] text-xl flex items-center justify-center space-x-4 shadow-2xl hover:bg-slate-100 transition-all active:scale-95 group">
                <Play size={28} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                <span>Initialize Engine</span>
              </button>
            ) : engineStatus === 'STARTING' || engineStatus === 'OPTIMIZING' ? (
              <div className="w-full py-10 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center space-y-4">
                <Loader2 size={32} className="text-indigo-500 animate-spin" />
                <span className="text-sm font-black text-white uppercase tracking-widest">{engineStatus}...</span>
              </div>
            ) : (
              <button onClick={stopEngine} className="w-full py-10 bg-red-600 text-white font-black rounded-[2.5rem] uppercase tracking-[0.4em] text-xl flex items-center justify-center space-x-4 shadow-2xl hover:bg-red-500 transition-all active:scale-95 group">
                <Square size={28} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                <span>Terminate Link</span>
              </button>
            )}
          </div>

          <div className="bg-black/40 p-6 rounded-3xl border border-white/5 space-y-3 font-mono text-[10px] relative z-10">
            {logs.length === 0 ? (
              <p className="text-slate-600 uppercase tracking-widest">Engine Standby. Waiting for signal...</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="flex items-center space-x-3 text-indigo-400 animate-in slide-in-from-left-2 duration-300">
                  <span className="text-slate-700">[{new Date().toLocaleTimeString()}]</span>
                  <span className="font-bold">{log}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-8 rounded-[3rem] border-white/5 space-y-6">
            <h4 className="text-xs font-black text-white uppercase italic tracking-widest flex items-center space-x-2">
              <Monitor size={14} className="text-indigo-500" />
              <span>Target Proccesses</span>
            </h4>
            <div className="space-y-3">
              {['Discord.exe', 'Valorant.exe', 'Zoom.app'].map((name, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all cursor-default">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight">{name}</span>
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full transition-colors duration-500 ${engineStatus === 'ACTIVE' ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-slate-500'}`}>{engineStatus === 'ACTIVE' ? 'Link Active' : 'Detected'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">Console Overview</h1>
          <p className="text-slate-500 text-xs mt-1">Operational Environment: <span className="text-green-500 font-black">SECURE</span></p>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center space-x-4">
           <Activity className="text-indigo-500 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">Build {CURRENT_VERSION} Stable</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Identity', value: activeVoice?.name, icon: Zap, color: 'text-indigo-400' },
          { label: 'Session Time', value: '00:24:12', icon: Clock, color: 'text-green-400' },
          { label: 'Encryption Layer', value: 'SHA-512', icon: Shield, color: 'text-blue-400' }
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 rounded-[2.5rem] space-y-4 border-white/10 hover:border-indigo-500/20 transition-all cursor-default">
            <stat.icon size={24} className={stat.color} />
            <div>
              <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-white italic">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-10 rounded-[3rem] border-white/5 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Neural Processing Load</h3>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Real-time Telemetry</span>
          </div>
          <div className="h-32 flex items-end gap-1.5">
            {[...Array(35)].map((_, i) => (
              <div key={i} className="flex-1 bg-indigo-500/10 rounded-t-full relative group">
                 <div className="absolute bottom-0 inset-x-0 bg-indigo-500/40 rounded-t-full transition-all duration-300 group-hover:bg-indigo-500" style={{ height: `${Math.random() * 80 + 10}%` }}></div>
              </div>
            ))}
          </div>
        </div>
        
        {/* DOWNLOAD APP CARD */}
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[3rem] space-y-6 shadow-2xl shadow-indigo-600/20 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-md">
                <Download size={32} />
            </div>
            <div className="space-y-2">
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Desktop v{CURRENT_VERSION}</h3>
                <p className="text-indigo-100 text-xs font-bold leading-relaxed">Download the standalone software for zero-latency background voice changing.</p>
            </div>
            <a 
                href="https://github.com/freevoiceofficialstudio/desktopapp/releases/latest/download/FreeVoice-Setup.exe" 
                className="w-full py-4 bg-white text-indigo-600 font-black rounded-2xl uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all shadow-xl active:scale-95"
            >
                Download Setup (.exe)
            </a>
        </div>
      </div>
    </div>
  );
}
