
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Mic2, LayoutDashboard, Minus, Square, X, 
  Radio, Download, User, Crown, RotateCcw, Loader2,
  LogIn, ShieldCheck, ArrowRight, RefreshCcw, ArrowUpCircle,
  Cpu, Activity, AlertCircle
} from 'lucide-react';
import { FIREBASE_CONFIG, VOICES_URL, FALLBACK_VOICES, CURRENT_VERSION, VERSION_CHECK_URL } from './constants';
import { UserProfile, MembershipType } from './types';

// Components
import Dashboard from './Dashboard';
import VoiceChanger from './VoiceChanger';
import Library from './Library';
import Membership from './Membership';

// Firebase Initialization
const firebase = (window as any).firebase;
if (firebase && !firebase.apps.length) {
  firebase.initializeApp(FIREBASE_CONFIG);
}

const SidebarLink = ({ to, icon: Icon, label, badge }: any) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link to={to} className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
      <div className="flex items-center space-x-4">
        <Icon size={20} className={active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} />
        <span className="text-sm font-bold tracking-tight uppercase italic">{label}</span>
      </div>
      {badge && <span className="bg-indigo-500/20 text-indigo-400 text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">{badge}</span>}
    </Link>
  );
};

const AuthScreen = ({ onLogin }: any) => {
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = () => {
    setError(null);
    setSigningIn(true);
    
    if (!firebase) {
      setError("Critical: Firebase Driver Missing.");
      setSigningIn(false);
      return;
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then((result: any) => {
        const user = result.user;
        onLogin({
          name: user.displayName || 'Anonymous User',
          email: user.email || '',
          photoURL: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
          membership: MembershipType.FREE,
          expiryDate: null
        });
      })
      .catch((err: any) => {
        console.error("Auth Exception:", err);
        setError("Identity verification failed. Please try again with your Google Account.");
        setSigningIn(false);
      });
  };

  return (
    <div className="h-screen w-screen bg-[#020617] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.12),transparent)]">
      <div className="max-w-md w-full glass-card p-12 rounded-[3.5rem] border-white/5 text-center space-y-12 animate-in zoom-in-95 duration-1000">
        <div className="relative mx-auto w-24 h-24">
          <div className="absolute inset-0 bg-indigo-600/20 blur-2xl animate-pulse rounded-full"></div>
          <div className="relative w-full h-full bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-600/40 transform -rotate-6 transition-transform hover:rotate-0 duration-500">
            <Mic2 size={48} className="text-white" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">Free<span className="text-indigo-500">Voice</span></h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Secure Neural Access</p>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center space-x-3 text-red-400 text-[10px] font-bold uppercase tracking-widest animate-in shake duration-300">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          
          <button 
            onClick={handleGoogleLogin} 
            disabled={signingIn} 
            className="w-full py-5 bg-white text-slate-950 font-black rounded-2xl flex items-center justify-center space-x-4 hover:bg-slate-100 transition-all active:scale-95 group shadow-2xl overflow-hidden relative"
          >
            {signingIn ? <Loader2 className="animate-spin text-indigo-600" /> : <LogIn size={20} />}
            <span className="uppercase tracking-widest text-xs z-10">{signingIn ? 'Verifying Identity...' : 'Initialize Access'}</span>
          </button>
          
          <div className="flex items-center justify-center space-x-3 text-slate-600">
            <ShieldCheck size={12} />
            <span className="text-[9px] font-black uppercase tracking-widest">End-to-End Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const VersionSyncScreen = ({ onFinish }: any) => {
  const [status, setStatus] = useState<'checking' | 'patching' | 'optimizing'>('checking');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sequence = async () => {
      try {
        const res = await fetch(`${VERSION_CHECK_URL}?t=${Date.now()}`);
        const data = await res.json();
        
        if (data.version !== CURRENT_VERSION) {
          setStatus('patching');
          let p = 0;
          const interval = setInterval(() => {
            p += Math.random() * 8;
            if (p >= 100) {
              clearInterval(interval);
              setStatus('optimizing');
              setTimeout(onFinish, 1000);
            }
            setProgress(p);
          }, 120);
        } else {
          setTimeout(() => {
            setStatus('optimizing');
            setTimeout(onFinish, 800);
          }, 1200);
        }
      } catch (e) {
        setTimeout(onFinish, 1000);
      }
    };
    sequence();
  }, []);

  return (
    <div className="h-screen w-screen bg-[#020617] flex items-center justify-center p-6">
      <div className="max-w-md w-full glass-card p-12 rounded-[3.5rem] border-white/5 text-center space-y-10 animate-in fade-in duration-500">
        <div className="flex justify-center">
          {status === 'checking' ? (
            <Cpu size={56} className="text-indigo-500 animate-pulse" />
          ) : status === 'patching' ? (
            <RefreshCcw size={56} className="text-indigo-500 animate-spin" />
          ) : (
            <Activity size={56} className="text-green-500 animate-bounce" />
          )}
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white italic uppercase tracking-widest">
              {status === 'checking' ? 'Syncing Version...' : status === 'patching' ? 'Patching Core' : 'Engine Ready'}
            </h2>
          </div>
          
          {(status === 'patching' || status === 'checking') && (
            <div className="space-y-4">
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300" 
                  style={{ width: status === 'checking' ? '30%' : `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [appStage, setAppStage] = useState<'auth' | 'sync' | 'ready'>('auth');
  const [voices, setVoices] = useState<any[]>([]);
  const [activeVoiceId, setActiveVoiceId] = useState<string | null>('1');
  const [downloadedVoiceIds, setDownloadedVoiceIds] = useState<Set<string>>(new Set(['1']));

  useEffect(() => {
    fetch(`${VOICES_URL}?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => setVoices(data))
      .catch(() => setVoices(FALLBACK_VOICES));
  }, []);

  const activeVoice = voices.find(v => v.id === activeVoiceId) || FALLBACK_VOICES[0];

  if (appStage === 'auth') return <AuthScreen onLogin={(profile: UserProfile) => { setUser(profile); setAppStage('sync'); }} />;
  if (appStage === 'sync') return <VersionSyncScreen onFinish={() => setAppStage('ready')} />;

  return (
    <HashRouter>
      <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden select-none font-['Inter']">
        <aside className="w-72 bg-slate-900/40 border-r border-white/5 flex flex-col animate-in slide-in-from-left duration-700">
          <div className="p-8">
            <div className="flex items-center space-x-4 mb-12 group cursor-pointer">
              <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/40 transform -rotate-6 group-hover:rotate-0 transition-transform">
                <Mic2 size={24} className="text-white" />
              </div>
              <span className="text-xl font-black text-white tracking-tighter italic uppercase">Free<span className="text-indigo-500">Voice</span></span>
            </div>
            <nav className="space-y-2">
              <SidebarLink to="/" icon={LayoutDashboard} label="Console" />
              <SidebarLink to="/changer" icon={RotateCcw} label="Changer" badge="LIVE" />
              <SidebarLink to="/voices" icon={Mic2} label="Vault" badge={voices.length.toString()} />
              <SidebarLink to="/live" icon={Radio} label="Live Link" />
              <SidebarLink to="/premium" icon={Crown} label="Premium" />
              <div className="h-px bg-white/5 my-6 mx-2"></div>
              <SidebarLink to="/profile" icon={User} label="Identity" />
            </nav>
          </div>
          
          <div className="mt-auto p-6">
            <Link to="/profile" className="bg-white/5 rounded-[2rem] p-5 border border-white/5 group hover:bg-white/10 transition-all block relative overflow-hidden">
              <div className="flex items-center space-x-4 relative z-10">
                <img src={user?.photoURL} className="w-12 h-12 rounded-[1.2rem] border-2 border-indigo-500/20" alt="Avatar" />
                <div className="min-w-0">
                  <p className="text-sm font-black text-white truncate italic uppercase">{user?.name}</p>
                  <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest italic">{user?.membership}</p>
                </div>
              </div>
            </Link>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 relative">
          <div className="h-14 border-b border-white/5 flex items-center justify-between bg-slate-900/20 backdrop-blur-xl z-20 drag-region">
            <div className="px-8 flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">SECURE KERNEL {CURRENT_VERSION}</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-br from-[#020617] to-indigo-950/10">
            <Routes>
              <Route path="/" element={<Dashboard user={user} activeVoice={activeVoice} />} />
              <Route path="/changer" element={<VoiceChanger user={user} activeVoice={activeVoice} />} />
              <Route path="/voices" element={<Library user={user} voices={voices} downloadedVoiceIds={downloadedVoiceIds} setDownloadedVoiceIds={setDownloadedVoiceIds} setActiveVoiceId={setActiveVoiceId} activeVoiceId={activeVoiceId} />} />
              <Route path="/premium" element={<Membership view="plans" user={user} />} />
              <Route path="/profile" element={<Membership view="profile" user={user} />} />
              <Route path="/live" element={<Dashboard user={user} activeVoice={activeVoice} isLivePage={true} />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
}
