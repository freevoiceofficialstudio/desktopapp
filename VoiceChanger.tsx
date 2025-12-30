
import React, { useState, useRef, useEffect } from 'react';
import { Mic2, Square, Upload, Zap, Play, Pause, Save, RotateCcw, Loader2, VolumeX, CheckCircle2, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MembershipType } from './types';

export default function VoiceChanger({ user, activeVoice }: any) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [processProgress, setProcessProgress] = useState(0);
  const [playback, setPlayback] = useState({ original: false, converted: false });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingInterval = useRef<any>(null);

  useEffect(() => {
    return () => clearInterval(recordingInterval.current);
  }, []);

  const handleRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      setAudioUrl(null);
      setConvertedUrl(null);
      setStatus('idle');
      setRecordingTime(0);
      recordingInterval.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
    } else {
      setIsRecording(false);
      clearInterval(recordingInterval.current);
      setAudioUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'); 
    }
  };

  const handleFile = (e: any) => {
    if (e.target.files?.[0]) {
      setAudioUrl(URL.createObjectURL(e.target.files[0]));
      setStatus('idle');
      setConvertedUrl(null);
    }
  };

  const startConversion = () => {
    setStatus('processing');
    setProcessProgress(0);
    const interval = setInterval(() => {
      setProcessProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setStatus('done');
            setConvertedUrl(audioUrl); 
          }, 500);
          return 100;
        }
        return p + Math.random() * 10;
      });
    }, 150);
  };

  const isLocked = activeVoice?.category !== 'Free' && user?.membership === MembershipType.FREE;

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-10 rounded-[3rem] border-white/5 space-y-8 flex flex-col items-center text-center">
          <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 shadow-2xl animate-pulse' : 'bg-white/5 border border-white/10'}`}>
            <Mic2 size={40} className={isRecording ? 'text-white' : 'text-slate-400'} />
          </div>
          <div className="space-y-4 w-full">
            <h3 className="text-xl font-bold text-white uppercase italic">{isRecording ? 'Recording...' : 'Raw Input'}</h3>
            <div className="flex gap-4 w-full">
              <button onClick={handleRecord} className={`flex-1 py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center space-x-3 transition-all active:scale-95 ${isRecording ? 'bg-red-500 text-white' : 'bg-white text-slate-900 shadow-xl'}`}>
                {isRecording ? <Square size={18} fill="currentColor" /> : <Mic2 size={18} />}
                <span>{isRecording ? 'STOP' : 'RECORD'}</span>
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                <Upload size={20} />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="audio/*" onChange={handleFile} />
            </div>
            {audioUrl && !isRecording && (
              <button onClick={() => setPlayback({ ...playback, original: !playback.original })} className="px-6 py-2 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-full border border-indigo-500/20 hover:bg-indigo-500/20 transition-all flex items-center mx-auto space-x-2">
                {playback.original ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
                <span>{playback.original ? 'Pause' : 'Preview Raw'}</span>
                {playback.original && <audio src={audioUrl} autoPlay onEnded={() => setPlayback({...playback, original: false})} className="hidden" />}
              </button>
            )}
          </div>
        </div>

        <div className="glass-card p-10 rounded-[3rem] border-white/5 flex flex-col relative overflow-hidden h-full">
          {isLocked && (
             <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex flex-col items-center justify-center p-10 text-center space-y-6">
                <Lock size={40} className="text-yellow-500" />
                <h3 className="text-xl font-bold text-white uppercase italic">Premium Access Required</h3>
                <Link to="/premium" className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs">Unlock {activeVoice?.name}</Link>
             </div>
          )}
          <h3 className="text-xl font-bold text-white uppercase italic mb-8">AI Processor</h3>
          <div className="flex-1 flex flex-col justify-center space-y-10">
            <div className="flex items-center space-x-6 bg-white/5 p-6 rounded-[2.5rem] border border-white/5">
              <div className="text-6xl">{activeVoice?.avatar}</div>
              <div>
                <p className="text-[10px] text-indigo-400 font-black uppercase italic">Target Engine</p>
                <p className="text-2xl font-black text-white italic">{activeVoice?.name}</p>
              </div>
            </div>
            {status === 'idle' && (
              <button disabled={!audioUrl} onClick={startConversion} className="w-full py-6 bg-indigo-600 text-white font-black rounded-[2rem] shadow-2xl disabled:opacity-20 uppercase tracking-[0.2em] text-lg flex items-center justify-center space-x-3 active:scale-95 transition-all">
                <Zap size={24} fill="currentColor" />
                <span>INJECT DATA</span>
              </button>
            )}
            {status === 'processing' && (
              <div className="space-y-6 text-center">
                <Loader2 size={40} className="text-indigo-500 animate-spin mx-auto" />
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${processProgress}%` }}></div>
                </div>
              </div>
            )}
            {status === 'done' && (
              <div className="space-y-6 animate-in zoom-in-95">
                <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-[2.5rem] flex items-center space-x-4">
                  <CheckCircle2 size={24} className="text-green-500" />
                  <span className="text-xs font-bold text-white uppercase">Neural Stream Synthesized</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setPlayback({...playback, converted: !playback.converted})} className="py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl uppercase text-[10px] flex items-center justify-center space-x-2">
                    {playback.converted ? <VolumeX size={16} /> : <Play size={16} fill="currentColor" />}
                    <span>{playback.converted ? 'Stop' : 'Listen'}</span>
                    {playback.converted && <audio src={convertedUrl || ''} autoPlay onEnded={() => setPlayback({...playback, converted: false})} className="hidden" />}
                  </button>
                  <a href={convertedUrl || '#'} download="freevoice_converted.mp3" className="py-5 bg-indigo-600 text-white font-black rounded-2xl uppercase text-[10px] flex items-center justify-center space-x-2 shadow-xl shadow-indigo-600/20">
                    <Save size={16} />
                    <span>Save File</span>
                  </a>
                </div>
                <button onClick={() => setStatus('idle')} className="w-full py-3 text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                  <RotateCcw size={14} />
                  <span>Start New Session</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
