
import React, { useState, useEffect } from 'react';
import { Crown, Zap, Star, CheckCircle2, ShieldCheck, Calendar, History, HelpCircle, ZapOff, ArrowUpRight } from 'lucide-react';
import { STRIPE_LINKS, CONTACT_EMAIL } from './constants';
import { MembershipType } from './types';
import { Link } from 'react-router-dom';

const calculateTime = (expiry: string | null) => {
  if (!expiry) return null;
  const total = Date.parse(expiry) - Date.parse(new Date().toString());
  if (total <= 0) return null;
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / 1000 / 60) % 60),
    seconds: Math.floor((total / 1000) % 60)
  };
};

export default function Membership({ view, user }: any) {
  const [timeLeft, setTimeLeft] = useState(calculateTime(user?.expiryDate));

  useEffect(() => {
    if (user?.expiryDate) {
      const timer = setInterval(() => setTimeLeft(calculateTime(user?.expiryDate)), 1000);
      return () => clearInterval(timer);
    }
  }, [user?.expiryDate]);

  const isFree = user?.membership === MembershipType.FREE;

  if (view === 'profile') return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center space-x-8">
          <img src={user?.photoURL} className="w-32 h-32 rounded-[2.5rem] border-4 border-white/5 bg-slate-800 shadow-2xl" alt="Profile" />
          <div>
            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">{user?.name}</h1>
            <p className="text-indigo-400 font-bold tracking-widest uppercase text-xs mt-1">{user?.email}</p>
            <div className="mt-4 flex gap-3">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isFree ? 'bg-slate-700 text-slate-300' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'}`}>
                {user?.membership} {isFree ? 'USER' : 'ELITE'}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest border border-white/5">Synced</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-10 rounded-[3rem] border-white/5 space-y-10 relative overflow-hidden flex flex-col justify-center">
          <Crown size={120} className="absolute -top-10 -right-10 text-indigo-500/10" />
          <h3 className="text-xl font-black text-white italic uppercase tracking-tighter relative z-10">Membership Analytics</h3>
          
          {!isFree && timeLeft ? (
            <div className="space-y-10 relative z-10">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { l: 'Days', v: timeLeft.days }, { l: 'Hrs', v: timeLeft.hours }, 
                  { l: 'Min', v: timeLeft.minutes }, { l: 'Sec', v: timeLeft.seconds }
                ].map((t, i) => (
                  <div key={i} className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center">
                    <p className="text-4xl font-black text-white italic tabular-nums">{t.v.toString().padStart(2, '0')}</p>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">{t.l}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Active session until: {new Date(user?.expiryDate).toLocaleDateString()}</p>
                <div className="h-3 w-full bg-white/5 rounded-full p-1 border border-white/5">
                  <div className="h-full bg-gradient-to-r from-indigo-600 to-blue-500 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center space-y-8 relative z-10">
              <ZapOff size={48} className="text-slate-600 mx-auto" />
              <div className="space-y-2">
                <p className="text-slate-400 text-lg font-bold uppercase italic">No Active Premium Session</p>
                <p className="text-slate-600 text-sm max-w-sm mx-auto">Purchase a plan to unlock live system-wide voice changing and ultra-realistic AI models.</p>
              </div>
              <Link to="/premium" className="inline-flex items-center space-x-3 px-10 py-5 bg-white text-slate-950 font-black rounded-2xl uppercase tracking-widest text-xs shadow-2xl hover:bg-slate-100 transition-all active:scale-95">
                <span>Browse Elite Plans</span>
                <ArrowUpRight size={16} />
              </Link>
            </div>
          )}
        </div>
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-[3rem] border-white/5 space-y-6">
            <h4 className="font-bold text-white uppercase italic text-sm">Session history</h4>
            {isFree ? (
               <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <span className="text-[9px] text-slate-600 font-black uppercase">No transaction records found</span>
               </div>
            ) : (
              [...Array(1)].map((_, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-xs font-bold text-white uppercase italic">Elite Activation</span>
                  <span className="text-[9px] text-green-500 font-black uppercase">Success</span>
                </div>
              ))
            )}
          </div>
          <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-[3rem] space-y-4 text-center">
            <p className="text-xs text-slate-400 font-medium">Require developer support?</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="w-full inline-block py-4 bg-indigo-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-indigo-500 transition-colors">Open Ticket</a>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8 space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">Unleash the <span className="text-indigo-500">Power</span></h1>
        <p className="text-slate-400 text-sm">Unlock real-time system-wide conversion and Ultra-Realistic AI models.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { name: 'Weekly Elite', price: '$2.00', period: 'week', link: STRIPE_LINKS.WEEKLY, icon: Zap, color: 'from-blue-600 to-indigo-600', popular: false },
          { name: 'Monthly Pro', price: '$10.00', period: 'month', link: STRIPE_LINKS.MONTHLY, icon: Crown, color: 'from-indigo-600 to-purple-600', popular: true },
          { name: 'Yearly Legend', price: '$50.00', period: 'year', link: STRIPE_LINKS.YEARLY, icon: Star, color: 'from-yellow-600 to-orange-600', popular: false }
        ].map((plan, i) => (
          <div key={i} className={`glass-card p-10 rounded-[3rem] border-white/5 flex flex-col relative group transition-all ${plan.popular ? 'ring-2 ring-indigo-500 shadow-2xl scale-105 bg-indigo-500/5' : ''}`}>
            {plan.popular && <div className="absolute top-8 right-[-35px] bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest px-10 py-1 rotate-45 z-10">Popular</div>}
            <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center text-white mb-8`}><plan.icon size={28} /></div>
            <div className="space-y-2 mb-10">
              <h3 className="text-xl font-bold text-white uppercase italic">{plan.name}</h3>
              <div className="flex items-baseline space-x-1"><span className="text-3xl font-black text-white">{plan.price}</span><span className="text-xs text-slate-500 font-bold uppercase tracking-widest">/{plan.period}</span></div>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              {['Live Engine Access', 'Ultra Voices', 'Zero Latency', 'VIP Support'].map((f, j) => (
                <li key={j} className="flex items-center space-x-3 text-sm text-slate-300"><CheckCircle2 size={16} className="text-indigo-400" /><span>{f}</span></li>
              ))}
            </ul>
            <a href={plan.link} target="_blank" className={`w-full py-5 rounded-2xl text-center font-black uppercase tracking-widest text-[10px] transition-all ${plan.popular ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'bg-white text-slate-900 hover:bg-slate-100'}`}>Activate Access</a>
          </div>
        ))}
      </div>
    </div>
  );
}
